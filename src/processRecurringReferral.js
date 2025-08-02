// src/utils/processRecurringReferral.js
import { getDatabase, ref, get, update } from "firebase/database";

const processRecurringReferral = async (userId) => {
  const db = getDatabase();

  try {
    // 1. Check referral info
    const referralSnap = await get(ref(db, `referrals/${userId}`));
    if (!referralSnap.exists()) return;

    const { referrerMobile, role } = referralSnap.val();

    // 2. Find referrer UID
    const usersSnap = await get(ref(db, "users"));
    const users = usersSnap.val();
    let referrerUid = null;

    for (const [uid, user] of Object.entries(users || {})) {
      if (user.mobile === referrerMobile && user.role === role) {
        referrerUid = uid;
        break;
      }
    }

    if (!referrerUid) return;

    // 3. Get recurring reward % from settings
    const settingsSnap = await get(
      ref(db, "referralSettings/recurringRewardPercentage")
    );
    const recurringPercent = settingsSnap.exists() ? settingsSnap.val() : 5;

    // 4. Simulate reward amount (e.g., ₹100 paid by referred user)
    const amountPaid = 100;
    const rewardAmount = Math.floor((amountPaid * recurringPercent) / 100);

    if (rewardAmount <= 0) return;

    // 5. Update referrer wallet
    const walletRef = ref(db, `wallets/${referrerUid}`);
    const walletSnap = await get(walletRef);
    const currentBalance = walletSnap.exists()
      ? walletSnap.val().balance || 0
      : 0;

    await update(walletRef, {
      balance: currentBalance + rewardAmount,
      lastUpdated: Date.now(),
    });

    console.log("Recurring referral reward credited:", rewardAmount);
  } catch (err) {
    console.error("Recurring reward error:", err);
  }
};

export default processRecurringReferral;
