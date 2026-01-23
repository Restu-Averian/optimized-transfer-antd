import { useRef } from "react";
import TransferCtx from "./TransferCtx";
import { useTransferStore } from "../store";
import { useShallow } from "zustand/shallow";
import { LIMIT_PAGE } from "../constants";

const selector = (state) => {
  return {
    pageLeft: state?.pageLeft,
    pageRight: state?.pageRight,
  };
};

const TransferCtxProvider = ({ children, ...props }) => {
  const keysListDataRef = useRef([]);
  const sourceKeysRef = useRef([]);
  const targetKeysRef = useRef([]);
  const oriDatasRef = useRef(new Map());
  const selectedKeyLeftRef = useRef(new Set([]));
  const selectedKeyRightRef = useRef(new Set([]));

  const { pageLeft, pageRight } = useTransferStore(useShallow(selector));

  const onProcessListDatas = (arrDatas = [], direction) => {
    const listDatas = [];
    const page = direction === "left" ? pageLeft : pageRight;

    const start = (page - 1) * LIMIT_PAGE;
    const end = page * LIMIT_PAGE;

    arrDatas?.slice(start, end)?.forEach((item) => {
      const dataKey = item?.key;
      const hasData = oriDatasRef?.current?.get(dataKey);

      if (hasData) {
        listDatas?.push(item);
      }
    });

    return listDatas;
  };

  return (
    <TransferCtx.Provider
      value={{
        keysListDataRef,
        sourceKeysRef,
        targetKeysRef,
        oriDatasRef,
        selectedKeyLeftRef,
        selectedKeyRightRef,
        onProcessListDatas,
        ...props,
      }}
    >
      {children}
    </TransferCtx.Provider>
  );
};

export default TransferCtxProvider;
