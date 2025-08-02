// src/utils/lmpCycleAi.js

export function getNextPeriodDate({ lastLMP, cycleAvg = 28 }) {
  if (!lastLMP) return "No LMP date provided.";
  const last = new Date(lastLMP);
  last.setDate(last.getDate() + cycleAvg);
  return last.toISOString().substring(0, 10); // yyyy-mm-dd
}

export function isCycleAbnormal({ cycleAvg }) {
  if (!cycleAvg) return "No data";
  if (cycleAvg < 21 || cycleAvg > 35)
    return "Cycle irregular/abnormal. Consult your doctor.";
  return "Cycle length normal.";
}
