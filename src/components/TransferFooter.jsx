import { memo } from "react";

const TransferFooter_ = ({ page, setPage, direction }) => {
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
        setPage(newPage);
        if (direction === "left") {
          setPageLeft(newPage);
        } else {
          setPageRight(newPage);
        }
      }}
    />
  );
};

const TransferFooter = memo(TransferFooter_);
export default TransferFooter;
