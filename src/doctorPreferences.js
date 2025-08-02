// src/utils/doctorPreferences.js

// For demo: localStorage; replace with Firebase in real system

export function getDoctorShowContain(doctorId) {
  const pref = JSON.parse(localStorage.getItem("doctorPrefs") || "{}");
  return pref[doctorId]?.showContain ?? true; // default true
}

export function setDoctorShowContain(doctorId, value) {
  const pref = JSON.parse(localStorage.getItem("doctorPrefs") || "{}");
  pref[doctorId] = { ...(pref[doctorId] || {}), showContain: value };
  localStorage.setItem("doctorPrefs", JSON.stringify(pref));
}
