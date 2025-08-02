// src/utils/referralUtils.js
import { ref, get, update, push } from "firebase/database";
import { database } from "../services/firebase";

export const handleReferralBonus = async (newUserId) => {
  const userRef = ref(database, `users/${newUserId}`);
  const userSnap = await get(userRef);
  const userData = userSnap.val();

  if (!userData || !userData.referredBy) return;

  const referrerId = userData.referredBy;
  const referrerWalletRef = ref(database, `wallets/${referrerId}`);
  const referrerWalletSnap = await get(referrerWalletRef);
  const referrerData = referrerWalletSnap.val() || {};

  const bonusMap = {
    doctor: 150,
    pharmacy: 100,
    lab: 120,
  };

  const bonus = bonusMap[userData.role] || 0;
  if (bonus <= 0) return;

  const newBalance = (referrerData.balance || 0) + bonus;

  await update(referrerWalletRef, { balance: newBalance });

  const txnRef = ref(database, `wallets/${referrerId}/transactions`);
  await push(txnRef, {
    amount: bonus,
    type: "referral",
    date: new Date().toISOString(),
    note: `Referral bonus for ${userData.role}`,
  });
};
