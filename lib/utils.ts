export const ParseTime = (date: Date) => {
  return date?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export function mapIdToNumber(id: string): number {
  let hash = 0;

  // Convert ID to a simple hash number
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 1000000; // Keep it within a reasonable range
  }

  // Map to 1, 2, 3, or 4
  return (hash % 4) + 1;
}

export function formatTimeRange(startTime: Date, endTime: Date): string {
  return `${ParseTime(new Date(startTime))} - ${ParseTime(new Date(endTime))}`;
}