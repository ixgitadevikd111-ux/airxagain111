// src/utils/submitFeedback.js
import { getDatabase, ref, push, set } from "firebase/database";

const submitFeedback = async (userType, userId, message) => {
  try {
    const db = getDatabase();
    const feedbackRef = ref(db, "feedback");
    const newFeedbackRef = push(feedbackRef);
    const timestamp = Date.now();

    await set(newFeedbackRef, {
      userType,
      userId,
      message,
      timestamp,
    });

    console.log("✅ Feedback submitted successfully");
    return true;
  } catch (error) {
    console.error("❌ Error submitting feedback:", error);
    return false;
  }
};

export default submitFeedback;
