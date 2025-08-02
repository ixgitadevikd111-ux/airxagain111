// src/utils/checkRecurringReferralRewards.js
import { getDatabase, ref, get, set, update } from "firebase/database";

const checkRecurringReferralRewards = async () => {
  const db = getDatabase();

  try {
    // Step 1: Fetch referral settings
    const settingsSnap = await get(ref(db, "referralSettings"));
    const settings = settingsSnap.val();
    const recurringRate = settings?.recurringReward || 5;

    // Step 2: Fetch all referrals
    const referralsSnap = await get(ref(db, "referrals"));
    const referrals = referralsSnap.val();

    if (!referrals) return;

    const updates = {};

    for (const [referredUid, referralData] of Object.entries(referrals)) {
      const {
        referrerMobile,
        rewardGiven,
        recurringHistory = [],
      } = referralData;

      if (!rewardGiven) continue; // skip if first reward not given yet

      // Step 3: Check user subscription or service usage
      const userSnap = await get(ref(db, `users/${referredUid}`));
      const userData = userSnap.val();

      if (!userData || !userData.subscribed) continue;

      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

      if (recurringHistory.includes(currentMonth)) continue;

      // Step 4: Fetch referrer user by mobile
      const usersSnap = await get(ref(db, "users"));
      const users = usersSnap.val();

      let referrerUid = null;
      for (const [uid, info] of Object.entries(users)) {
        if (info.mobile === referrerMobile) {
          referrerUid = uid;
          break;
        }
      }

      if (!referrerUid) continue;

      // Step 5: Credit reward to wallet
      const walletRef = ref(db, `wallets/${referrerUid}`);
      const walletSnap = await get(walletRef);
      const currentBalance = walletSnap.val()?.balance || 0;

      const newBalance = currentBalance + recurringRate;

      updates[`wallets/${referrerUid}/balance`] = newBalance;
      updates[`referrals/${referredUid}/recurringHistory`] = [
        ...recurringHistory,
        currentMonth,
      ];
    }

    await update(ref(db), updates);
    console.log("Recurring rewards processed");
  } catch (error) {
    console.error("Error checking recurring rewards:", error);
  }
};

export default checkRecurringReferralRewards;
