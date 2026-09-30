export const formatDateTime = (timestamp: string): string => {
  const now = new Date();
  let date = now;
  if (timestamp) {
    date = new Date(timestamp);
    // Optional: Validate if date is invalid (e.g., from malformed timestamp)
    if (isNaN(date.getTime())) {
      date = now;  // Fallback to now if invalid
    }
  }

  const months = date.getMonth();  // 0-11
  const days = date.getDate();     // 1-31
  const YYYY = date.getFullYear();

  // Array of full month names (English; adjust if you need Ukrainian/other locale)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthName = monthNames[months];

  return `${monthName} ${days}, ${YYYY}`;
};
