import { memo, useContext, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import TransferCtx from "../../context/TransferCtx";
import { useTransferStore } from "../../store";
import { LIMIT_PAGE } from "../../constants";
import TransferListItemContent from "./TransferListItemContent";

const selector = (state) => {
  return {
    pageLeft: state?.pageLeft,
    pageRight: state?.pageRight,
    objLengthSelected: state?.objLengthSelected,
  };
};

const TransferListItem_ = ({ direction }) => {
  const {
    selectedKeyLeftRef,
    selectedKeyRightRef,
    sourceKeysRef,
    onProcessListDatas,
    targetKeysRef,
    datasource,
  } = useContext(TransferCtx);

  const { pageLeft, pageRight, objLengthSelected } = useTransferStore(
    useShallow(selector),
  );

  const { selectedKeyRef, page } = useMemo(() => {
    if (direction === "left") {
      return {
        selectedKeyRef: selectedKeyLeftRef,
        page: pageLeft,
      };
    }
    return {
      selectedKeyRef: selectedKeyRightRef,
      page: pageRight,
    };
  }, [objLengthSelected, pageLeft, pageRight]);

  const dataSourceTable = useMemo(() => {
    const sourceData = onProcessListDatas(sourceKeysRef.current, direction);
    const targetData = onProcessListDatas(targetKeysRef.current, direction);

    return direction === "left" ? sourceData : targetData;
  }, [page, datasource, objLengthSelected]);

  return (
    <TransferListItemContent
      direction={direction}
      datasourceTable={dataSourceTable}
      selectedKeyRef={selectedKeyRef}
    />
  );
};

const TransferListItem = memo(TransferListItem_);
export default TransferListItem;
