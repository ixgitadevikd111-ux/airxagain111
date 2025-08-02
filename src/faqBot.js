// src/utils/faqBot.js

const faq = [
  {
    q: "What is ANC?",
    a: "Antenatal care (ANC) is medical care for pregnant women before birth.",
  },
  {
    q: "Which vaccines are needed for babies?",
    a: "Consult your doctor for the schedule, but BCG, OPV, DPT, Hepatitis B are routine.",
  },
  // Add more FAQs as needed
];

// Return answer to question, else generic reply
export function getFAQAnswer(question) {
  const q = question.toLowerCase();
  const found = faq.find((f) => q.includes(f.q.toLowerCase()));
  return found
    ? found.a
    : "Sorry, I don't have an answer for that. Please ask your doctor.";
}
