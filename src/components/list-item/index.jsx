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
    oriDatasRef,
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
    const sourceData = [];

    const start = (page - 1) * LIMIT_PAGE;
    const end = page * LIMIT_PAGE;

    sourceKeysRef.current?.slice(start, end)?.forEach((item) => {
      const dataKey = item?.key;
      const hasData = oriDatasRef?.current?.get(dataKey);

      if (hasData) {
        sourceData?.push(item);
      }
    });

    return direction === "left"
      ? sourceData
      : targetKeysRef.current?.slice(0, 10);
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
