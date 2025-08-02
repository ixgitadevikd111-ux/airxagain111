// src/utils/reportAi.js

// Standard lab test normal ranges (expand as needed, move to DB/config for scale)
const LAB_NORMALS = {
  Hb: { min: 11.0, max: 16.5 },
  TLC: { min: 4000, max: 11000 },
  Platelet: { min: 150000, max: 400000 },
  CRP: { max: 6 },
  GlucoseF: { min: 70, max: 110 },
  Creatinine: { min: 0.7, max: 1.2 },
  // Add more as needed
};

// Disease-specific rule engine
function getDiseaseImpression(reportData) {
  if (
    reportData.DengueIgM === "positive" ||
    (reportData.Platelet && reportData.Platelet < 100000)
  ) {
    return "Warning: Possible Dengue, consult doctor urgently.";
  }
  if (reportData.COVIDAg === "positive") {
    return "COVID Antigen positive. Isolate & consult immediately.";
  }
  // Example: Pregnancy alert
  if (reportData.BetaHCG && reportData.BetaHCG > 25) {
    return "Possible pregnancy. Confirm with ultrasound and physician review.";
  }
  // Add more rules: UTI, Malaria, Anemia, etc.
  return "";
}

// Main AI analyzer
export function analyzeLabReport(reportData) {
  let abnormal = false;
  let impression = [];
  const diseaseImpression = getDiseaseImpression(reportData);

  Object.entries(LAB_NORMALS).forEach(([k, norm]) => {
    if (
      reportData[k] !== undefined &&
      reportData[k] !== null &&
      reportData[k] !== ""
    ) {
      let val = parseFloat(reportData[k]);
      if (
        (norm.min !== undefined && val < norm.min) ||
        (norm.max !== undefined && val > norm.max)
      ) {
        abnormal = true;
        impression.push(
          `${k}: ${val} (${
            norm.min !== undefined && val < norm.min ? "Low" : ""
          }${norm.max !== undefined && val > norm.max ? "High" : ""})`
        );
      }
    }
  });

  // Always show disease-specific first
  if (diseaseImpression) impression.unshift(diseaseImpression);

  return {
    abnormal,
    impression: impression.length
      ? impression.join("; ")
      : "No abnormality detected.",
    disclaimer:
      "This impression is AI-generated. Please consult a physician for final diagnosis.",
  };
}

// Placeholder for OCR/AI/LLM parser (expand as needed)
export async function extractLabReportData(file) {
  // TODO: Integrate Tesseract.js, LLM OCR, or API (future step)
  return {
    Hb: 9.8,
    TLC: 12000,
    Platelet: 90000,
    CRP: 10,
    DengueIgM: "positive",
    COVIDAg: "negative",
    // BetaHCG: 30, // for pregnancy
  };
}
