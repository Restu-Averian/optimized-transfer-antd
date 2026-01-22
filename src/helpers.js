export const generateIdxSelected = (arr = []) => {
  return arr?.map((data, idx) => ({
    ...data,
    idxSelected: idx,
  }));
};

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

export const onOnceSelect = ({
  key,
  idxSelected,
  selectedKeyRef,
  direction,
  objSelectIdxRef,
}) => {
  if (selectedKeyRef?.current?.has(key)) {
    selectedKeyRef?.current.delete(key);

    // objSelectIdxRef.current[direction].start = -1;
  } else {
    selectedKeyRef?.current.add(key);

    // objSelectIdxRef.current[direction].start = idxSelected;
  }
};
