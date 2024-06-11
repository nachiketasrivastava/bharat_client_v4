import React, { useState } from 'react'
import { Card, Table, Switch } from 'antd'
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import enrolledData from "./enrolledData.json";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const Agents = () => {
  const [check, setCheck] = useState(true)

  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
    setCheck(checked)
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
      render: () => <Switch defaultChecked onChange={onChange} className={`${check ? '!bg-[#E07E65]' : 'bg-[#00000073]'}`}  />,
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
    <div className="flex flex-col justify-between h-[88vh]">
      <Card className="shadow-lg my-1 mr-4 h-[60%]">
          <div className='font-bold text-2xl'>Enrolled</div>
          <div className="flex justify-center items-center">
            <Bar
              style={{
                flexGrow: 0.25,
              }}
              data={{
                labels: enrolledData.map((data) => data.label),
                datasets: [
                  {
                    label: "Enrolled",
                    data: enrolledData.map((data) => data.value),
                    backgroundColor: [
                      "#E07E65",
                      "#F39F8E",
                      "#8E4E2A",
                      "#653712",
                      "#F9B8A6",
                    ],
                    borderRadius: 5,
                  },
                ],
              }}
              options={{
                scales: {
                  x: {
                    title: {
                      display: false,
                      text: "Customer Type",
                    },
                  },
                  y: {
                    title: {
                      display: false,
                      text: "Number of Records",
                    },
                  },
                },
              }}
            />
          </div>
        </Card>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          className="h-[35vh] overflow-scroll shadow-lg mr-4 p-2"
          pagination={false}
          bordered
        />
    </div>
  )
}

export default Agents