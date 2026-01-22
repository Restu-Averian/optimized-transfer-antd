import { create } from "zustand";

/**
 * @typedef TObjLengthSelected
 * @property {number} left
 * @property {number} right
 *
 * @typedef {Object} TTransferStore
 * @property {TObjLengthSelected} objLengthSelected
 * @property {number} pageLeft
 * @property {number} pageRight
 * @property {(updater: number | function, direction:"left" | "right") => void} setPage
 * @property {(updater: TObjLengthSelected | function) => void} setObjLengthSelected
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<TTransferStore>>} */
export const useTransferStore = create((set) => ({
  objLengthSelected: {
    left: 0,
    right: 0,
  },
  pageLeft: 1,
  pageRight: 1,
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
  setPage(updater, direction) {
    set((state) => {
      const statePage = direction === "left" ? state.pageLeft : state.pageRight;
      const page = direction === "left" ? "pageLeft" : "pageRight";

      const newValue =
        typeof updater === "function" ? updater(statePage) : updater;

      return {
        [page]: newValue,
      };
    });
  },
}));
