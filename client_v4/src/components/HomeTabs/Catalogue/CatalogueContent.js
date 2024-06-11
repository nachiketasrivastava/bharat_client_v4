import React, { useState } from 'react'
import ResizableFunnelChart from './ResizableFunnelChart.js';
import VennDiagram from './VennDiagram.js';
import { Table, Switch } from 'antd';

const CatalogueContent = () => {
  const [check, setCheck] = useState(true);

  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
    setCheck(checked);
  };

  const columns = [
    {
      title: "Name & Descriptions",
      dataIndex: "name",
      width: "30%",
      render: ({ name, description }) => (
        <div className="flex flex-col justify-center items-start">
          <div>{name}</div>
          <div>{description}</div>
        </div>
      ),
    },
    {
      title: "7 Day Enrollment",
      dataIndex: "enrollment",
    },
    {
      title: "Total Enrolled",
      dataIndex: "totalEnr",
    },
    {
      title: "Created",
      dataIndex: "created",
    },
    {
      title: "Last Updated",
      dataIndex: "updated",
    },
    {
      title: "Active",
      dataIndex: "active",
      render: () => (
        <Switch
          defaultChecked
          onChange={onChange}
          className={`${check ? "!bg-[#E07E65]" : "bg-[#00000073]"}`}
        />
      ),
    },
  ];
  const data = [
    {
      key: "1",
      name: { name: "Awesome", description: "Performs awesome functions" },
      enrollment: 500,
      totalEnr: "1,000",
      created: "02/02/2024",
      updated: "04/03/2024",
    },
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: "50vh",
          padding: "20px",
        }}
      >
        <div style={{ flex: 1, marginRight: "20px", height: "100%" }}>
          <ResizableFunnelChart />
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            height: "100%",
            justifyContent: "center",
            alignItems: "start",
            marginTop: "5%",
          }}
        >
          <VennDiagram />
        </div>
      </div>
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        pagination={false}
        columns={columns}
        dataSource={data}
        className="mt-16 pr-2"
        bordered
      />
    </>
  );
};

export default CatalogueContent;
