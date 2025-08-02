// src/utils/rewardReferral.js
import { getDatabase, ref, get, set, update } from "firebase/database";

export default async function rewardReferral(uid, subscriptionAmount) {
  const db = getDatabase();
  const referralSnap = await get(ref(db, `referrals/${uid}`));
  if (!referralSnap.exists()) return;

  const referralData = referralSnap.val();
  if (referralData.rewardGiven) return;

  const settingsSnap = await get(ref(db, "referralSettings"));
  const settings = settingsSnap.exists() ? settingsSnap.val() : {};

  const percentage = settings.subscriptionRewardPercentage || 10;
  const rewardAmount = (percentage / 100) * subscriptionAmount;

  const referrerMobile = referralData.referrerMobile;

  const usersSnap = await get(ref(db, "users"));
  let referrerUID = null;
  if (usersSnap.exists()) {
    const users = usersSnap.val();
    for (const [id, user] of Object.entries(users)) {
      if (user.mobile === referrerMobile) {
        referrerUID = id;
        break;
      }
    }
  }

  if (!referrerUID) return;

  const walletRef = ref(db, `wallets/${referrerUID}`);
  const walletSnap = await get(walletRef);
  const currentBalance = walletSnap.exists()
    ? walletSnap.val().balance || 0
    : 0;

  await set(walletRef, {
    balance: currentBalance + rewardAmount,
    lastUpdated: Date.now(),
  });

  await update(ref(db, `referrals/${uid}`), {
    rewardGiven: true,
    subscribed: true,
  });
}
