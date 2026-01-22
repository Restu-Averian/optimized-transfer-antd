import { memo } from "react";
import TransferCtxProvider from "../context/TransferCtxProvider";
import TransferContent from "./TransferContent";

const Transfer_ = ({ ...props }) => {
  return (
    <TransferCtxProvider {...props}>
      <TransferContent />
    </TransferCtxProvider>
  );
};

const Transfer = memo(Transfer_);
export default Transfer;
