// src/utils/fetchPatientFullData.js
import { ref, get } from "firebase/database";
import { database } from "../services/firebase";

export const fetchPatientFullData = async (userId) => {
  const paths = {
    user: `users/${userId}`,
    symptoms: `symptoms/${userId}`,
    history: `medicalHistory/${userId}`,
    allergies: `drugAllergies/${userId}`,
    labReports: `labReports/${userId}`,
    aiOpinion: `secondOpinions/${userId}`,
    prescriptions: `prescriptions/${userId}`,
  };

  const data = {};

  for (const [key, path] of Object.entries(paths)) {
    try {
      const snap = await get(ref(database, path));
      data[key] = snap.exists() ? snap.val() : null;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      data[key] = null;
    }
  }

  return data;
};
