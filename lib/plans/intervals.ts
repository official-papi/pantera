// Helper for formatting investment plan payout intervals dynamically

export interface PlanIntervalInfo {
  label: string;          // e.g. "Weekly", "Daily", "Hourly", "Every 2 Days"
  shortLabel: string;     // e.g. "/ week", "/ day", "/ hour", "/ 48h"
  badge: string;          // e.g. "Weekly", "Daily", "1h"
  cycleText: string;      // e.g. "Weekly for 8 Weeks", "Daily for 30 Days", "Every 12 Hours for 20 Periods"
  periodUnit: string;     // e.g. "wks", "days", "hrs", "cycles"
  hours: number;
}

export function getPlanIntervalInfo(hoursInput: number | string | undefined | null, periodsInput: number | string | undefined | null): PlanIntervalInfo {
  const h = Number(hoursInput) || 24;
  const p = Number(periodsInput) || 1;

  if (h === 1) {
    return {
      label: "Hourly",
      shortLabel: "/ hour",
      badge: "Hourly",
      cycleText: `Hourly for ${p} ${p === 1 ? "Hour" : "Hours"}`,
      periodUnit: "hrs",
      hours: 1,
    };
  }

  if (h < 24) {
    return {
      label: `Every ${h} Hours`,
      shortLabel: `/ ${h}h`,
      badge: `${h}h`,
      cycleText: `Every ${h} Hours for ${p} Periods`,
      periodUnit: "periods",
      hours: h,
    };
  }

  if (h === 24) {
    return {
      label: "Daily",
      shortLabel: "/ day",
      badge: "Daily",
      cycleText: `Daily for ${p} ${p === 1 ? "Day" : "Days"}`,
      periodUnit: "days",
      hours: 24,
    };
  }

  if (h === 168) {
    return {
      label: "Weekly",
      shortLabel: "/ week",
      badge: "Weekly",
      cycleText: `Weekly for ${p} ${p === 1 ? "Week" : "Weeks"}`,
      periodUnit: "wks",
      hours: 168,
    };
  }

  if (h % 168 === 0) {
    const weeks = h / 168;
    return {
      label: `Every ${weeks} Weeks`,
      shortLabel: `/ ${weeks}w`,
      badge: `${weeks}w`,
      cycleText: `Every ${weeks} Weeks for ${p} Cycles`,
      periodUnit: "cycles",
      hours: h,
    };
  }

  if (h % 24 === 0) {
    const days = h / 24;
    return {
      label: `Every ${days} Days`,
      shortLabel: `/ ${days}d`,
      badge: `${days}d`,
      cycleText: `Every ${days} Days for ${p} Cycles`,
      periodUnit: "days",
      hours: h,
    };
  }

  return {
    label: `Every ${h} Hours`,
    shortLabel: `/ ${h}h`,
    badge: `${h}h`,
    cycleText: `Every ${h} Hours for ${p} Periods`,
    periodUnit: "periods",
    hours: h,
  };
}
