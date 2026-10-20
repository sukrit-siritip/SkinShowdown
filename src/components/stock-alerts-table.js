"use client";

import { Table } from "antd";

const STATUS_STYLES = {
  "SOLD OUT": { text: "text-danger", border: "border-danger-dim" },
  LOW: { text: "text-gold", border: "border-gold-dim" },
  HEALTHY: { text: "text-tan", border: "border-line" },
};

const header = (label) => <span className="text-[10px] tracking-[0.14em] font-normal">{label}</span>;

const columns = [
  {
    title: header("SKIN"),
    dataIndex: "name",
    width: "46%",
    render: (name) => <span className="text-sm">{name}</span>,
  },
  {
    title: header("CODES LEFT"),
    dataIndex: "codesLeft",
    sorter: (a, b) => a.codesLeft - b.codesLeft,
    render: (left, row) => (
      <span className={`text-[13px] ${STATUS_STYLES[row.status].text}`}>{left}</span>
    ),
  },
  {
    title: header("SOLD 7D"),
    dataIndex: "sold7d",
    sorter: (a, b) => a.sold7d - b.sold7d,
    sortDirections: ["descend", "ascend"],
    render: (sold) => <span className="text-[13px]">{sold}</span>,
  },
  {
    title: header("STATUS"),
    dataIndex: "status",
    align: "right",
    render: (status) => {
      const style = STATUS_STYLES[status];
      return (
        <span className={`inline-block text-[10px] px-2 py-0.75 border ${style.text} ${style.border}`}>
          {status}
        </span>
      );
    },
  },
];

export default function StockAlertsTable({ rows }) {
  return (
    <Table
      className="-mx-2.5"
      size="small"
      rowKey="id"
      columns={columns}
      dataSource={rows}
      pagination={false}
      showSorterTooltip={false}
      scroll={{ x: 480, y: 360 }}
      locale={{ emptyText: "No purchasable skins yet." }}
    />
  );
}
