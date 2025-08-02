// src/utils/childMilestoneAi.js

const milestones = {
  roll_over: 4, // months
  sit: 6,
  crawl: 9,
  walk: 12,
  speak: 15,
  // Add more as needed
};

export function checkChildMilestone({ milestone, ageMonths }) {
  if (!milestones[milestone]) return "Milestone not recognized.";
  if (ageMonths > milestones[milestone] + 2)
    return "Possible developmental delay — consult your doctor.";
  if (ageMonths < milestones[milestone]) return "Milestone not due yet.";
  return "Milestone achieved on time or early!";
}
