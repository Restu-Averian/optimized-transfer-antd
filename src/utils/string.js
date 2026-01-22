/**
 *
 * @param {string} val
 * @returns {string}
 */
export const fmtToString = (val) => {
  if (val === null || val === undefined) {
    return "";
  }

  try {
    if (typeof val === "object" && !Array.isArray(val)) {
      return JSON.stringify(val || {});
    }
    return String(val);
  } catch {
    return "";
  }
};
