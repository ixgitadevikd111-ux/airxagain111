// src/utils/treatmentInfoDB.js

export const testInfo = {
  CBC: {
    reason: "Detect infection, anemia, or inflammation.",
  },
  LFT: {
    reason: "Evaluate liver function and detect liver damage.",
  },
  KFT: {
    reason: "Assess kidney function and identify abnormalities.",
  },
  RBS: {
    reason: "Check blood sugar level to screen for diabetes.",
  },
};

export const medicineInfo = {
  Paracetamol: {
    group: "Antipyretic / Analgesic",
    use: "Reduces fever and relieves mild to moderate pain.",
    alternatives: ["Ibuprofen", "Nimesulide"],
    dosagePerKg: 15, // mg per kg per dose
  },
  Azithromycin: {
    group: "Macrolide Antibiotic",
    use: "Treats respiratory, skin, and throat infections.",
    alternatives: ["Clarithromycin", "Doxycycline"],
    dosagePerKg: 10, // mg per kg per day
  },
  Amoxicillin: {
    group: "Penicillin Antibiotic",
    use: "Used for infections of lungs, skin, ears, and urinary tract.",
    alternatives: ["Cefixime", "Doxycycline"],
    dosagePerKg: 20, // mg per kg per day
  },
};
