// src/utils/ancAi.js

// Family Planning AI Advice (exported as named function)
export function getFamilyPlanningAdvice(input) {
  if (!input) {
    return "Please provide your details for family planning advice.";
  }
  if (input.method === "Condom") {
    return "Condom is effective and has no side effects. Use new condom every time.";
  }
  if (input.method === "Copper-T" || input.method === "IUD") {
    return "IUD/Copper-T is safe for long-term use. Regular checkup is needed.";
  }
  if (input.method === "Pills") {
    return "Daily pills require strict routine. Consult doctor for best result.";
  }
  if (input.method === "Permanent") {
    return "Permanent methods (Tubectomy/Vasectomy) are for those who have completed family.";
  }
  if (
    input.lastCounsel &&
    new Date(input.lastCounsel) <
      new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
  ) {
    return "Last counseling was more than a year ago. Update with your doctor.";
  }
  return "Consult your doctor for personalized family planning advice.";
}
