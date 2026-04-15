import { createContext } from "react";

/**
 * @typedef TObjSelectIdx
 * @property {Record<'start' | 'end', number>} left
 * @property {Record<'start' | 'end', number>} right
 */

/**
 * @typedef TTransferCtx
 * @property {import("react").RefObject<Record<string,any>[]>} keysListDataRef
 * @property {import("react").RefObject<Record<string,any>[]>} sourceKeysRef
 * @property {import("react").RefObject<Record<string,any>[]>} targetKeysRef
 * @property {import("react").RefObject<Map<number, Record<string, any>>>} oriDatasRef
 * @property {import("react").RefObject<Set<number>>} selectedKeyLeftRef
 * @property {import("react").RefObject<Set<number>>} selectedKeyRightRef
 * @property {import("react").RefObject<TObjSelectIdx>} objSelectIdxRef
 * @property {(arrDatas: Record<string, any>[], direction:"left" | "right")=>Record<string, any>[]} onProcessListDatas
 */

/** @type {import("react").Context<TTransferCtx> } */
const TransferCtx = createContext({});
export default TransferCtx;
