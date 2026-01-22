import { memo, useContext, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { Transfer as AntdTransfer, Pagination } from "antd";
import { generateIdxSelected } from "../helpers";
import TransferTable from "./TransferTable";
import { LIMIT_PAGE } from "../constants";
import { useTransferStore } from "../store";
import TransferCtx from "../context/TransferCtx";
import { objHasOwnProperty } from "../utils/object";
import { fmtToString } from "../utils/string";

const selector = (state) => {
  return {
    objLengthSelected: state.objLengthSelected,
    setObjLengthSelected: state?.setObjLengthSelected,
  };
};

const TransferContent_ = () => {
  const {
    keysListDataRef,
    sourceKeysRef,
    targetKeysRef,
    oriDatasRef,
    selectedKeyLeftRef,
    selectedKeyRightRef,
    selectLabel,
    selectValue,
    isSpreadAllRecordItem = false,
    value,
    datasource = [],
  } = useContext(TransferCtx);

  const [pageLeft, setPageLeft] = useState(1);
  const [pageRight, setPageRight] = useState(1);

  const { objLengthSelected, setObjLengthSelected } = useTransferStore(
    useShallow(selector),
  );

  const triggerDatasource = useMemo(() => {
    const leftKeys = Array.from(selectedKeyLeftRef.current);
    const rightKeys = Array.from(selectedKeyRightRef.current);
    const allSelectedKeys = [...leftKeys, ...rightKeys];

    return allSelectedKeys?.map((key) => {
      const originalItem = oriDatasRef.current.get(key);

      if (!originalItem) return { key, title: `Item ${key}`, disabled: false };

      return {
        ...originalItem,
        key: key,
        disabled: false,
      };
    });
  }, [objLengthSelected]);

  const valueKey = useMemo(() => {
    if (selectValue) {
      return selectValue;
    }

    return keysListDataRef?.current?.[0] || "";
  }, [selectValue, keysListDataRef?.current, objLengthSelected]);

  const labelKey = useMemo(() => {
    return selectLabel || keysListDataRef?.current?.[1] || "";
  }, [selectLabel, keysListDataRef?.current, objLengthSelected]);

  const onSetDatas = (arrDatas = []) => {
    const keysData = Object.keys(arrDatas?.[0] || {});

    const defaultLabelKey = keysData?.[1];
    const defaultValueKey = keysData?.[0];

    const dataValueKey = valueKey || defaultValueKey;
    const dataLabelKey = labelKey || defaultLabelKey;

    const dataResult = generateIdxSelected(
      arrDatas?.map((item, i) => ({
        ...(isSpreadAllRecordItem && {
          ...item,
        }),
        [dataValueKey]: item?.[dataValueKey]?.toString(),
        [dataLabelKey]: item?.[dataLabelKey],
        key: i,
        ...(objHasOwnProperty(item, "disabled") && {
          disabled: item?.disabled,
        }),
      })),
    );

    for (let i = 0; i < dataResult?.length; i++) {
      oriDatasRef.current?.set(i, dataResult?.[i]);
    }

    const arrValue = typeof value === "string" ? value?.split(",") : value;

    const fmtArrValue = arrValue?.map((item) => fmtToString(item));

    const targetDatas = dataResult?.filter((item) =>
      fmtArrValue?.includes(item?.[dataValueKey]),
    );
    const initFilterData = dataResult?.filter(
      (item) => !fmtArrValue?.includes(item?.[dataValueKey]),
    );

    sourceKeysRef.current = initFilterData;
    targetKeysRef.current = targetDatas;
  };

  const onChange = (destDirection) => {
    if (destDirection === "right") {
      const selected = sourceKeysRef?.current?.filter((item) =>
        selectedKeyLeftRef?.current?.has(item?.key),
      );

      const newTargetKeys = [
        ...(selected || []),
        ...(targetKeysRef?.current || []),
      ];

      const newSourceDatas = sourceKeysRef?.current?.filter(
        (item) => !selectedKeyLeftRef?.current?.has(item?.key),
      );

      targetKeysRef.current = newTargetKeys;
      sourceKeysRef.current = newSourceDatas;
      selectedKeyLeftRef.current?.clear();

      setObjLengthSelected((prev) => ({
        ...prev,
        left: 0,
      }));
    }
  };

  useEffect(() => {
    onSetDatas(datasource);
  }, []);

  return (
    <>
      <AntdTransfer
        styles={{
          section: {
            minWidth: 300,
            width: 300,
            maxWidth: 300,
            height: 480,
          },
        }}
        selectedKeys={[
          ...Array.from(selectedKeyLeftRef.current),
          ...Array.from(selectedKeyRightRef.current),
        ]}
        dataSource={triggerDatasource.length > 0 ? triggerDatasource : []}
        targetKeys={[]}
        footer={(_, info) => {
          const direction = info?.direction;
          const page = direction === "left" ? pageLeft : pageRight;

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
                if (direction === "left") {
                  setPageLeft(newPage);
                } else {
                  setPageRight(newPage);
                }
              }}
            />
          );
        }}
        onChange={(_, destDirection) => {
          onChange(destDirection);
        }}
      >
        {({ direction }) => {
          const selectedKeyRef =
            direction === "left" ? selectedKeyLeftRef : selectedKeyRightRef;

          const page = direction === "left" ? pageLeft : pageRight;

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

          const dataSourceTable =
            direction === "left"
              ? sourceData
              : targetKeysRef.current?.slice(0, 10);

          return (
            <TransferTable
              direction={direction}
              datasourceTable={dataSourceTable}
              selectedKeyRef={selectedKeyRef}
            />
          );
        }}
      </AntdTransfer>
    </>
  );
};
const TransferContent = memo(TransferContent_);
export default TransferContent;
