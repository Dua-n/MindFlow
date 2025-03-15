/**
 * Format a date for display
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDisplayDate = (date) => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Standardize date format to Month Day, Year
 * @param {string} dateStr - Date string to standardize
 * @returns {string} Standardized date string
 */
export const standardizeDate = (dateStr) => {
  if (!dateStr) return "No deadline";
  
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Check if a deadline is within 3 days
 * @param {string} deadlineStr - Deadline date string
 * @returns {boolean} True if deadline is within 3 days
 */
export const isDeadlineNear = (deadlineStr) => {
  if (!deadlineStr) return false;
  
  const deadline = new Date(deadlineStr);
  const today = new Date();
  
  // Set both dates to midnight for accurate day comparison
  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Return true if deadline is within 3 days
  return diffDays >= 0 && diffDays <= 3;
};

/**
 * Get the current date key in YYYY-MM-DD format
 * @returns {string} Current date key
 */
export const getCurrentDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}; 