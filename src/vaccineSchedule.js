// src/utils/vaccineSchedule.js

const vaccineSchedule = [
  { name: "BCG", at: 0 },
  { name: "OPV", at: 0 },
  { name: "DPT", at: 6 },
  { name: "Hepatitis B", at: 6 },
  // Add more
];

// Returns next due vaccine for a given age (months)
export function getNextDueVaccine(vaccinesGiven = [], ageMonths = 0) {
  for (const v of vaccineSchedule) {
    if (!vaccinesGiven.includes(v.name) && ageMonths >= v.at) {
      return v.name;
    }
  }
  return "All vaccines up to date.";
}
