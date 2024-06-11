import React from 'react'
import { Table } from 'antd'

const Dashboard = () => {
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
      title: "Number of Reports",
      dataIndex: "reports",
    },
    {
      title: "Created",
      dataIndex: "created",
    },
    {
      title: "Last Updated",
      dataIndex: "updated",
    }
  ];
  const data = [
    {
      key: "1",
      name: { name: "Awesome", description: "Performs awesome functions" },
      reports: 10,
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
    <div>
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
    </div>
  )
}

export default Dashboard