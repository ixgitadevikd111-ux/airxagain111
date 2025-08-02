// src/utils/notifyUtils.js

import { database } from "../services/firebase";
import { ref, push } from "firebase/database";

/**
 * Send notification to doctor, patient, (and admin, optional) for abnormal lab report.
 * Use this after report upload/AI analyze if abnormal/critical impression found.
 * @param {Object} opts - { patientId, doctorId, reportId, impression }
 */
export async function sendAbnormalReportNotification({
  patientId,
  doctorId,
  reportId,
  impression,
}) {
  const notif = {
    type: "abnormal_report",
    title: "Abnormal Lab Report Alert",
    message: impression,
    patientId,
    doctorId,
    reportId,
    timestamp: Date.now(),
    seen: false,
  };

  // Notify the assigned doctor (by userId), not just generic "doctor"
  if (doctorId) {
    await push(ref(database, `notifications/doctor/${doctorId}`), notif);
  } else {
    // Fallback: notify all doctors (not scalable for big systems)
    await push(ref(database, "notifications/doctor"), notif);
  }

  // Notify the patient
  if (patientId) {
    await push(ref(database, `notifications/patient/${patientId}`), notif);
  } else {
    await push(ref(database, "notifications/patient"), notif);
  }

  // Optional: Notify admin
  await push(ref(database, "notifications/admin"), notif);
}

/**
 * Generic notification send (can be reused everywhere).
 * @param {string} userRole - 'doctor', 'patient', 'lab', 'pharmacy', 'admin'
 * @param {string} userId - specific userId or group path
 * @param {Object} notifData - { title, message, ... }
 */
export async function sendNotification(userRole, userId, notifData) {
  await push(ref(database, `notifications/${userRole}/${userId}`), {
    ...notifData,
    timestamp: Date.now(),
    seen: false,
  });
}
