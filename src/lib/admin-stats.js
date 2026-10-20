export const LOW_STOCK_THRESHOLD = 5;

export const SALES_RANGES = {
  "3M": { title: "LAST 3 MONTHS", unit: "week", buckets: 13 },
  "6M": { title: "LAST 6 MONTHS", unit: "week", buckets: 26 },
  "1Y": { title: "LAST 12 MONTHS", unit: "month", buckets: 12 },
  "3Y": { title: "LAST 3 YEARS", unit: "month", buckets: 36 },
  MAX: { title: "ALL TIME", unit: "month", buckets: null },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function bucketLabel(isoDate, unit) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return unit === "week"
    ? `${day} ${MONTHS[month - 1]}`
    : `${MONTHS[month - 1]} '${String(year).slice(2)}`;
}

export function stockStatus(codesLeft) {
  if (codesLeft === 0) return "SOLD OUT";
  if (codesLeft < LOW_STOCK_THRESHOLD) return "LOW";
  return "HEALTHY";
}
