export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function futureDate(daysFromToday: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return formatDate(date);
}
