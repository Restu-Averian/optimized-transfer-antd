/**
 * @param {Record<string, any>} obj
 * @returns {Array}
 */
export const objKeys = (obj) => {
  if (typeof obj === "object" && typeof obj !== "undefined") {
    return Object.keys(obj || {});
  }
  return [];
};

/**
 * @param {Record<string, any>} obj
 * @param {string} key
 * @returns {boolean}
 */
export const objHasOwnProperty = (obj, key) => {
  if (objKeys(obj)?.length > 0) {
    return Object.prototype?.hasOwnProperty?.call(obj, key);
  }
  return false;
};
