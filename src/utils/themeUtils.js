/**
 * Get color based on priority
 * @param {string} priority - Priority level (high, medium, low)
 * @returns {string} Color hex code
 */
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return '#EF4444'; // Red
    case 'medium':
      return '#F59E0B'; // Amber
    case 'low':
      return '#10B981'; // Green
    default:
      return '#6B7280'; // Gray
  }
};

/**
 * Light theme colors
 */
export const lightTheme = {
  background: "#F9F7F3",
  cardBg: "#FFFFFF",
  cardHighlight: "#F3F4F6",
  text: "#1F2937",
  primary: "#D4A373",
  accent: "#4B5563",
  buttonBg: "#D4A373",
  buttonText: "#FFFFFF",
  dangerBg: "rgba(239, 68, 68, 0.1)",
  dangerText: "rgb(239, 68, 68)",
  modalBg: "#FFFFFF",
  inputBg: "#F3F4F6",
};

/**
 * Dark theme colors
 */
export const darkTheme = {
  background: "#1F2937",
  cardBg: "#374151",
  cardHighlight: "#4B5563",
  text: "#F9FAFB",
  primary: "#D4A373",
  accent: "#E5E7EB",
  buttonBg: "#D4A373",
  buttonText: "#1F2937",
  dangerBg: "rgba(239, 68, 68, 0.2)",
  dangerText: "rgb(248, 113, 113)",
  modalBg: "#374151",
  inputBg: "#4B5563",
}; 