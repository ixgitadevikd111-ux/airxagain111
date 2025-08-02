// src/utils/telemedicineUtils.js

import { database } from "../services/firebase";
import { ref, get, set, update } from "firebase/database";

// Fetch doctor list (You can filter by specialty/status in future)
export async function fetchDoctorList() {
  const snap = await get(ref(database, "doctors"));
  if (!snap.exists()) return [];
  return Object.entries(snap.val()).map(([uid, d]) => ({
    uid,
    name: d.name,
    specialty: d.specialty || "General",
    consultFee: d.consultFee || 200,
  }));
}

// Get consult fee for doctor (fallback to admin default fee)
export async function getConsultFee(doctorId) {
  // Get doctor consult fee
  const docSnap = await get(ref(database, `doctors/${doctorId}/consultFee`));
  if (docSnap.exists()) return docSnap.val();
  // Get admin default fee
  const adminSnap = await get(
    ref(database, "adminSettings/telemedicine/defaultFee")
  );
  if (adminSnap.exists()) return adminSnap.val();
  return 200; // fallback
}

// Get admin settings
export async function getTelemedicineAdminSettings() {
  const snap = await get(ref(database, "adminSettings/telemedicine"));
  if (!snap.exists())
    return {
      minFee: 50,
      maxFee: 1000,
      platformCommission: 20,
      referralCommission: 10,
      defaultFee: 200,
    };
  return snap.val();
}

// Core billing function: deduct wallet, create transaction, adjust commission
export async function processTeleBilling({ doctorId, bookedBy, patientId }) {
  const admin = await getTelemedicineAdminSettings();
  const docFee = await getConsultFee(doctorId);
  const amount = Math.max(admin.minFee, Math.min(docFee, admin.maxFee));
  const platformShare = Math.round((admin.platformCommission / 100) * amount);
  const referralShare =
    bookedBy !== patientId
      ? Math.round((admin.referralCommission / 100) * amount)
      : 0;
  const netDoctor = amount - platformShare - referralShare;

  // Wallet deduction (bookedBy wallet)
  const walletRef = ref(database, `wallets/${bookedBy}/balance`);
  const walletSnap = await get(walletRef);
  const walletBal = walletSnap.exists() ? walletSnap.val() : 0;
  if (walletBal < amount)
    return { success: false, error: "Insufficient wallet" };
  await set(walletRef, walletBal - amount);

  // Credit doctor wallet
  const docWalletRef = ref(database, `wallets/${doctorId}/balance`);
  const docWalletSnap = await get(docWalletRef);
  const docWalletBal = docWalletSnap.exists() ? docWalletSnap.val() : 0;
  await set(docWalletRef, docWalletBal + netDoctor);

  // Credit referral/agent wallet (if agent)
  if (referralShare > 0) {
    const agentWalletRef = ref(database, `wallets/${bookedBy}/balance`);
    const agentWalletSnap = await get(agentWalletRef);
    const agentWalletBal = agentWalletSnap.exists() ? agentWalletSnap.val() : 0;
    await set(agentWalletRef, agentWalletBal + referralShare);
  }

  // Credit platform (can be admin or system wallet node)
  const platWalletRef = ref(database, "wallets/platform/balance");
  const platWalletSnap = await get(platWalletRef);
  const platWalletBal = platWalletSnap.exists() ? platWalletSnap.val() : 0;
  await set(platWalletRef, platWalletBal + platformShare);

  // Transaction history (save as needed)
  const txnId = Date.now() + "_" + bookedBy;
  await set(ref(database, `transactions/${txnId}`), {
    doctorId,
    bookedBy,
    patientId,
    amount,
    platformShare,
    referralShare,
    netDoctor,
    timestamp: Date.now(),
  });

  return {
    success: true,
    amount,
    credits: {
      doctor: netDoctor,
      agent: referralShare,
      platform: platformShare,
    },
  };
}
