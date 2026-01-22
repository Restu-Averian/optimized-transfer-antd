import { create } from "zustand";

/**
 * @typedef TObjLengthSelected
 * @property {number} left
 * @property {number} right
 *
 * @typedef {Object} TTransferStore
 * @property {TObjLengthSelected} objLengthSelected
 * @property {(updater: TObjLengthSelected | function) => void} setObjLengthSelected
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<TTransferStore>>} */
export const useTransferStore = create((set) => ({
  objLengthSelected: {
    left: 0,
    right: 0,
  },
  setObjLengthSelected(updater) {
    set((state) => {
      const newValue =
        typeof updater === "function"
          ? updater(state?.objLengthSelected)
          : updater;

      return {
        objLengthSelected: newValue,
      };
    });
  },
}));
