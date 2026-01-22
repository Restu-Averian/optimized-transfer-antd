import { useRef } from "react";
import TransferCtx from "./TransferCtx";

const TransferCtxProvider = ({ children, ...props }) => {
  const keysListDataRef = useRef([]);
  const sourceKeysRef = useRef([]);
  const targetKeysRef = useRef([]);
  const oriDatasRef = useRef(new Map());
  const selectedKeyLeftRef = useRef(new Set([]));
  const selectedKeyRightRef = useRef(new Set([]));

  return (
    <TransferCtx.Provider
      value={{
        keysListDataRef,
        sourceKeysRef,
        targetKeysRef,
        oriDatasRef,
        selectedKeyLeftRef,
        selectedKeyRightRef,
        ...props,
      }}
    >
      {children}
    </TransferCtx.Provider>
  );
};

export default TransferCtxProvider;
