import { useShallow } from "zustand/shallow";
import { Dropdown, Flex } from "antd";
import { memo, useContext, useMemo } from "react";
import { useTransferStore } from "../store";
import Icons from "./Icons";
import TransferCtx from "../context/TransferCtx";

const selector = (state) => {
  return {
    objLengthSelected: state?.objLengthSelected,
    setObjLengthSelected: state?.setObjLengthSelected,
    pageLeft: state?.pageLeft,
    pageRight: state?.pageRight,
  };
};

const TransferMenuDropdown_ = ({ direction }) => {
  const { objLengthSelected, setObjLengthSelected, pageLeft, pageRight } =
    useTransferStore(useShallow(selector));

  const {
    sourceKeysRef,
    targetKeysRef,
    selectedKeyLeftRef,
    selectedKeyRightRef,
    onProcessListDatas,
  } = useContext(TransferCtx);

  const { arrDatas, selectedKeyRef } = useMemo(() => {
    if (direction === "left") {
      return {
        arrDatas: sourceKeysRef.current,
        selectedKeyRef: selectedKeyLeftRef,
      };
    }
    return {
      arrDatas: targetKeysRef?.current,
      selectedKeyRef: selectedKeyRightRef,
    };
  }, [objLengthSelected, direction, pageLeft, pageRight]);

  const { isSelectedAll, isSelectedPage } = useMemo(() => {
    const pageData = onProcessListDatas(arrDatas, direction);

    return {
      isSelectedAll: arrDatas?.length === selectedKeyRef?.current?.size,
      isSelectedPage: pageData?.every((data) =>
        selectedKeyRef?.current?.has(data?.key),
      ),
    };
  }, [arrDatas, direction, selectedKeyRef?.current?.size, pageLeft, pageRight]);

  const onSelectByDropdown = (datas) => {
    for (let i = 0; i < datas?.length; i++) {
      selectedKeyRef.current?.add(datas?.[i]?.key);
    }

    setObjLengthSelected((prev) => ({
      ...prev,
      [direction]: datas?.length,
    }));
  };

  const onUnSelectByDropdown = (datas, type) => {
    if (type === "all") {
      selectedKeyRef?.current?.clear();

      setObjLengthSelected((prev) => ({
        ...prev,
        [direction]: 0,
      }));
    } else {
      for (let i = 0; i < datas?.length; i++) {
        const item = datas?.[i];

        selectedKeyRef?.current?.delete(item?.idxSelected);

        setObjLengthSelected((prev) => ({
          ...prev,
          [direction]: selectedKeyRef?.current?.size,
        }));
      }
    }
  };

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "select-all",
            label: isSelectedAll ? "Unselect All" : "Select All",
          },
          {
            key: "select-current-page",
            label: isSelectedPage
              ? "Unselect Current Page"
              : "Select Current Page",
          },
        ],
        onClick: ({ key }) => {
          if (key === "select-all") {
            if (isSelectedAll) {
              onUnSelectByDropdown(arrDatas, "all");
            } else {
              onSelectByDropdown(arrDatas);
            }
          } else {
            const pageData = onProcessListDatas(arrDatas, direction);

            if (isSelectedPage) {
              onUnSelectByDropdown(pageData, "page");
            } else {
              onSelectByDropdown(pageData);
            }
          }
        },
      }}
      trigger={["click"]}
    >
      <Flex align="center" gap={8}>
        <Icons type="dropdown" />

        <span style={{ cursor: "pointer" }}>
          {objLengthSelected?.[direction]}/{arrDatas?.length} items
        </span>
      </Flex>
    </Dropdown>
  );
};

const TransferMenuDropdown = memo(TransferMenuDropdown_);
export default TransferMenuDropdown;
