import { Checkbox, Empty, Table, Typography } from "antd";
import { HEIGHT_TABLE_TRANSFER, OBJ_CLASS_TRANSFER } from "../../constants";
import { useTransferStore } from "../../store";
import { onOnceSelect } from "../../helpers";

const selector = (state) => state?.setObjLengthSelected;

const TransferListItemContent = ({
  datasourceTable,
  selectedKeyRef,
  direction,
}) => {
  const setObjLengthSelected = useTransferStore(selector);

  return (
    <Table
      dataSource={datasourceTable}
      showHeader={false}
      tableLayout="auto"
      size="small"
      rowKey={(record) => `${record?.key}-${record?.idxSelected}`}
      rowClassName={(record) => {
        const classNames = [name, `transfer-${direction}`];

        if (selectedKeyRef?.current?.has(record?.key)) {
          classNames?.push(OBJ_CLASS_TRANSFER.ROW_SELECTED);
        }

        if (record?.disabled) {
          classNames?.push(OBJ_CLASS_TRANSFER.ROW_DISABLED);
        }
        return classNames?.length > 0 ? classNames?.join(" ") : "";
      }}
      columns={[
        {
          key: "selected",
          dataIndex: "selected",
          render(_, record) {
            return (
              <Checkbox checked={selectedKeyRef?.current?.has(record?.key)} />
            );
          },
          width: 5,
        },
        {
          key: "label",
          dataIndex: "LABEL",
          render(_, record) {
            return <Typography.Text>{record?.title}</Typography.Text>;
          },
        },
      ]}
      onRow={({ key, idxSelected }) => {
        return {
          onClick() {
            onOnceSelect({
              key,
              idxSelected,
              selectedKeyRef,
              direction,
            });

            setObjLengthSelected((prev) => ({
              ...prev,
              [direction]: selectedKeyRef?.current?.size,
            }));
          },
        };
      }}
      pagination={false}
      locale={{
        emptyText: (
          <div
            style={{
              height: HEIGHT_TABLE_TRANSFER - 158,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" />
          </div>
        ),
      }}
    />
  );
};
export default TransferListItemContent;
