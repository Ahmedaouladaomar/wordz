import { formatDistanceToNowStrict } from "date-fns";

export function formatTimeAgo(date: Date | string | number): string {
  if (!date) return "";

  let dateObj: Date;

  if (typeof date === "string") {
    // If the backend forgot to append 'Z', force it so JavaScript treats it as UTC
    const normalizedString =
      date.endsWith("Z") || date.includes("+")
        ? date
        : `${date.replace(" ", "T")}Z`;

    dateObj = new Date(normalizedString);
  } else {
    dateObj = new Date(date);
  }

  if (isNaN(dateObj.getTime())) return "";

  return formatDistanceToNowStrict(dateObj, {
    addSuffix: false,
    roundingMethod: "floor",
  });
}
