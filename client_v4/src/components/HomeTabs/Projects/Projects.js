import React from 'react'
import { Card, Table } from 'antd'
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';

import timeData from "./timeData.json";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const Projects = () => {
  
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
      title: "Documents",
      dataIndex: "documents",
      render: () => <FontAwesomeIcon icon={faFileCsv} className='text-2xl cursor-pointer hover:scale-110 duration-300' />,
    },
    {
      title: "Reports",
      dataIndex: "reports",
    },
    {
      title: "Created",
      dataIndex: "created",
    },
    {
      title: "Last Updated",
      dataIndex: "updated",
    },
  ];
  const data = [
    {
      key: "1",
      name: { name: "Awesome", description: "Performs awesome functions" },
      reports: "Sales Analysis",
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
          <div className='font-bold text-2xl'>Time Spent on Projects</div>
          <div className="flex justify-center items-center">
            <Bar
              style={{
                flexGrow: 0.25,
              }}
              data={{
                labels: timeData.map((data) => data.label),
                datasets: [
                  {
                    label: "Hours",
                    data: timeData.map((data) => data.value),
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

export default Projects