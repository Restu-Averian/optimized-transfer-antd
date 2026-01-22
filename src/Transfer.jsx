import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Transfer as AntdTransfer, Pagination } from "antd";
import { fmtToString, generateIdxSelected, objHasOwnProperty } from "./helpers";
import TransferTable from "./components/TransferTable";
import { LIMIT_PAGE } from "./constants";
import { useTransferStore } from "./store";
import { useShallow } from "zustand/shallow";

const selector = (state) => {
  return {
    objLengthSelected: state.objLengthSelected,
    setObjLengthSelected: state?.setObjLengthSelected,
  };
};

const Transfer_ = ({
  selectLabel,
  selectValue,
  isSpreadAllRecordItem = false,
  value,
  datasource = [],
}) => {
  const keysListDataRef = useRef([]);
  const sourceKeysRef = useRef([]);
  const targetKeysRef = useRef([]);
  const oriDatasRef = useRef(new Map());
  const selectedKeyLeftRef = useRef(new Set([]));
  const selectedKeyRightRef = useRef(new Set([]));
  const [pageLeft, setPageLeft] = useState(1);
  const [pageRight, setPageRight] = useState(1);

  const { objLengthSelected, setObjLengthSelected } = useTransferStore(
    useShallow(selector),
  );

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
          ...Array.from(selectedKeyLeftRef.current).slice(0, 1),
          ...Array.from(selectedKeyRightRef.current).slice(0, 1),
        ].map((item) => fmtToString(item))}
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
        dataSource={datasource}
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
const Transfer = memo(Transfer_);
export default Transfer;
