/**
 * @returns Result of comparing two dates
 */
export const isSameDate = (date1: Date, date2?: Date) => {
  return (
    date1.getDate() === date2?.getDate() &&
    date1.getMonth() === date2?.getMonth() &&
    date1.getFullYear() === date2?.getFullYear()
  );
};

/**
 * @returns Start and end of today in UTC timezone
 */
export const getTodayUTCBoundaries = () => {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date();
  end.setUTCHours(23, 59, 59, 999);

  return { start, end };
};
