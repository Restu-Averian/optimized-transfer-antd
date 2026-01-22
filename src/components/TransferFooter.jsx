import { Pagination } from "antd";
import { memo, useContext, useMemo } from "react";
import TransferCtx from "../context/TransferCtx";
import { useTransferStore } from "../store";

const TransferFooter_ = ({ direction }) => {
  const { sourceKeysRef, targetKeysRef } = useContext(TransferCtx);

  const { setPage, pageLeft, pageRight } = useTransferStore();

  const page = useMemo(() => {
    return direction === "left" ? pageLeft : pageRight;
  }, [pageLeft, pageRight, direction]);

  return (
    <Pagination
      simple
      showSizeChanger={false}
      current={page}
      style={{ padding: "8px", display: "flex", justifyContent: "end" }}
      total={
        direction === "left"
          ? sourceKeysRef?.current?.length
          : targetKeysRef?.current?.length
      }
      onChange={(newPage) => {
        setPage(newPage, direction);
      }}
    />
  );
};

const TransferFooter = memo(TransferFooter_);
export default TransferFooter;
