export function getDay(day: string) {
  const dateObject = new Date(day);
  return dateObject.toLocaleDateString("en-US", { weekday: "long" });
}
