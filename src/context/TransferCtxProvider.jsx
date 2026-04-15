import { useRef, useState } from "react";
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
  const objSelectIdxRef = useRef({
    left: {
      start: -1,
      end: -1,
    },
    right: {
      start: -1,
      end: -1,
    },
  });

  const { pageLeft, pageRight } = useTransferStore(useShallow(selector));

  const [objSearch, setObjSearch] = useState({
    left: "",
    right: "",
  });

  const onProcessListDatas = (arrDatas = [], direction) => {
    const listDatas = [];
    const page = direction === "left" ? pageLeft : pageRight;

    const start = (page - 1) * LIMIT_PAGE;
    const end = page * LIMIT_PAGE;

    arrDatas
      ?.filter((item) => item?.title?.includes(objSearch?.[direction]))
      ?.slice(start, end)
      ?.forEach((item) => {
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
        objSearch,
        objSelectIdxRef,
        onProcessListDatas,
        setObjSearch,
        ...props,
      }}
    >
      {children}
    </TransferCtx.Provider>
  );
};

export default TransferCtxProvider;
