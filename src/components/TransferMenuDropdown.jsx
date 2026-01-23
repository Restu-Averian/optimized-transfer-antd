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
  };
};

const TransferMenuDropdown_ = ({ direction }) => {
  const { objLengthSelected, setObjLengthSelected } = useTransferStore(
    useShallow(selector),
  );

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
  }, [objLengthSelected, direction]);

  return (
    <Dropdown
      menu={{
        items: [
          { key: "select-all", label: "Select All" },
          { key: "select-current-page", label: "Select Current Page" },
        ],
        onClick: ({ key }) => {
          if (key === "select-all") {
            for (let i = 0; i < arrDatas?.length; i++) {
              selectedKeyRef.current?.add(arrDatas?.[i]?.key);
            }

            setObjLengthSelected((prev) => ({
              ...prev,
              [direction]: arrDatas?.length,
            }));
          } else {
            const pageData = onProcessListDatas(arrDatas, direction);

            for (let i = 0; i < pageData?.length; i++) {
              selectedKeyRef.current?.add(pageData?.[i]?.key);
            }

            setObjLengthSelected((prev) => ({
              ...prev,
              [direction]: pageData?.length,
            }));
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
