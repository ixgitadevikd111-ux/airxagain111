// src/utils/educationContent.js

const topics = {
  breastfeeding: "Breastfeeding is recommended exclusively for 6 months.",
  vaccination:
    "Vaccines protect children from dangerous diseases. Follow the schedule.",
  nutrition: "Balanced diet helps in healthy growth.",
  // Add more topics as needed
};

export function getEducationContent(topic) {
  return topics[topic] || "Content not available for this topic yet.";
}
