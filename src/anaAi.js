// src/utils/ancAi.js

// Dummy AI suggestion logic for Family Planning
export function getFamilyPlanningAdvice(input) {
  if (!input) {
    return "Please provide your details for family planning advice.";
  }
  if (input.age < 21) {
    return "Family planning advice is generally given after age 21. Consult a doctor.";
  }
  if (input.children && input.children >= 2) {
    return "For two or more children, permanent family planning methods can be considered. Consult a specialist.";
  }
  return "Consult your doctor for personalized family planning advice.";
}

// More future AI advice functions:
export function getANCRiskAdvice({ age, parity, bp, sugar, dangerSigns }) {
  let risk = [];
  if (age && (age < 20 || age > 35)) risk.push("Age high risk");
  if (parity && parity > 3) risk.push("Multiple pregnancy history");
  if (bp && bp > 140) risk.push("High BP");
  if (sugar && sugar > 140) risk.push("Check for gestational diabetes");
  if (dangerSigns && dangerSigns.length) risk.push("Danger signs present!");
  if (risk.length === 0) return "No immediate ANC risk detected.";
  return "ANC Risk: " + risk.join("; ");
}
