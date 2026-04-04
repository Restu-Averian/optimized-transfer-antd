import { memo, useContext, useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";
import { Transfer as AntdTransfer } from "antd";
import { generateIdxSelected, getNewPageAfterOnChange } from "../helpers";
import { useTransferStore } from "../store";
import TransferCtx from "../context/TransferCtx";
import { objHasOwnProperty } from "../utils/object";
import { fmtToString } from "../utils/string";
import TransferFooter from "./TransferFooter";
import TransferListItem from "./list-item";
import TransferMenuDropdown from "./TransferMenuDropdown";

const selector = (state) => {
  return {
    objLengthSelected: state.objLengthSelected,
    pageLeft: state?.pageLeft,
    pageRight: state?.pageRight,
    setPage: state?.setPage,
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
    setObjSearch,
  } = useContext(TransferCtx);

  const {
    objLengthSelected,
    setObjLengthSelected,
    pageLeft,
    pageRight,
    setPage,
  } = useTransferStore(useShallow(selector));

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

    setObjLengthSelected((prev) => ({
      ...prev,
      left: 0,
      right: 0,
    }));
  };

  const onChange = (destDirection) => {
    if (destDirection === "right") {
      const selected = sourceKeysRef?.current?.filter((item) =>
        selectedKeyLeftRef?.current?.has(item?.key),
      );
      const newSourceDatas = sourceKeysRef?.current?.filter(
        (item) => !selectedKeyLeftRef?.current?.has(item?.key),
      );

      const newTargetKeys = [
        ...(selected || []),
        ...(targetKeysRef?.current || []),
      ];

      const newPage = getNewPageAfterOnChange({
        arrDatasLength: newSourceDatas?.length,
        currPage: pageLeft,
      });

      targetKeysRef.current = newTargetKeys;
      sourceKeysRef.current = newSourceDatas;

      selectedKeyLeftRef.current?.clear();

      setObjLengthSelected((prev) => ({
        ...prev,
        left: 0,
      }));
      setPage(newPage, "left");
    } else {
      const selected = targetKeysRef?.current?.filter((item) =>
        selectedKeyRightRef?.current?.has(item?.key),
      );
      const newTargetKeys = targetKeysRef?.current?.filter(
        (item) => !selectedKeyRightRef?.current?.has(item?.key),
      );

      const newSourceData = [
        ...(selected || []),
        ...(sourceKeysRef?.current || []),
      ];

      const newPage = getNewPageAfterOnChange({
        arrDatasLength: newTargetKeys?.length,
        currPage: pageRight,
      });

      targetKeysRef.current = newTargetKeys;
      sourceKeysRef.current = newSourceData;

      selectedKeyRightRef?.current?.clear();

      setObjLengthSelected((prev) => ({
        ...prev,
        right: 0,
      }));
      setPage(newPage, "right");
    }
  };

  useEffect(() => {
    onSetDatas(datasource);
  }, []);

  return (
    <AntdTransfer
      styles={{
        section: {
          minWidth: 300,
          width: 300,
          maxWidth: 300,
          height: 530,
        },
      }}
      showSearch
      showSelectAll={false}
      onSearch={(direction, value) => {
        setObjSearch((prev) => {
          return {
            ...prev,
            [direction]: value,
          };
        });
      }}
      onChange={(_, destDirection) => {
        onChange(destDirection);
      }}
      selectedKeys={[
        ...Array.from(selectedKeyLeftRef.current),
        ...Array.from(selectedKeyRightRef.current),
      ]}
      targetKeys={[...Array.from(selectedKeyRightRef.current)]}
      dataSource={
        triggerDatasource.length > 0 ? triggerDatasource?.slice(0, 10) : []
      }
      selectAllLabels={[
        <TransferMenuDropdown direction="left" />,
        <TransferMenuDropdown direction="right" />,
      ]}
      footer={(_, info) => {
        const direction = info?.direction;

        return <TransferFooter direction={direction} />;
      }}
    >
      {({ direction }) => {
        return <TransferListItem direction={direction} />;
      }}
    </AntdTransfer>
  );
};
const TransferContent = memo(TransferContent_);
export default TransferContent;
