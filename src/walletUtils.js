// src/utils/walletUtils.js
import { getDatabase, ref, get, set, push } from "firebase/database";

/**
 * Deducts a specified amount from user's wallet and records the transaction.
 * @param {string} userId - The UID of the user
 * @param {number} amount - Amount to deduct
 * @param {string} purpose - Purpose of deduction (e.g., "Online Consultation")
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const deductFromWallet = async (userId, amount, purpose) => {
  try {
    const db = getDatabase();
    const walletRef = ref(db, `wallets/${userId}`);
    const snapshot = await get(walletRef);

    if (!snapshot.exists()) {
      return { success: false, message: "Wallet not found." };
    }

    const wallet = snapshot.val();
    const currentBalance = wallet.balance || 0;

    if (currentBalance < amount) {
      return { success: false, message: "Insufficient balance." };
    }

    const newBalance = currentBalance - amount;

    // Update balance
    await set(walletRef, {
      ...wallet,
      balance: newBalance,
    });

    // Record transaction
    const historyRef = ref(db, `wallets/${userId}/transactions`);
    await push(historyRef, {
      type: "debit",
      amount,
      purpose,
      timestamp: Date.now(),
    });

    return { success: true, message: "Deduction successful." };
  } catch (error) {
    console.error("Error deducting from wallet:", error);
    return { success: false, message: "Something went wrong." };
  }
};
