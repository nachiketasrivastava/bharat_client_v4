import React, { useState } from 'react'
import { Card, Table, Switch } from 'antd'
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv, faFilePdf } from '@fortawesome/free-solid-svg-icons';

import chatData from "./chatData.json";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const Chats = () => {  
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Chat Name",
      dataIndex: "chatName",
    },
    {
      title: "Reports Created",
      dataIndex: "reports",
    },
    {
      title: "CSVs Uploaded",
      dataIndex: "csv",
      // render: () => <FontAwesomeIcon icon={faFileCsv} className='text-2xl cursor-pointer hover:scale-110 duration-300' />,
    },
    {
      title: "Docs Uploaded",
      dataIndex: "docs",
      // render: () => <FontAwesomeIcon icon={faFilePdf} className='text-2xl cursor-pointer hover:scale-110 duration-300' />,
    },
  ];
  const data = [
    {
      key: "1",
      date: "05/27/2024",
      chatName: "Sales Analysis",
      reports: 5,
      csv: 2,
      docs: 1
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
          <div className='font-bold text-2xl'>Your Chat Metrics</div>
          <div className="flex justify-center items-center">
            <Bar
              style={{
                flexGrow: 0.25,
              }}
              data={{
                labels: chatData.map((data) => data.label),
                datasets: [
                  {
                    label: "Questions",
                    data: chatData.map((data) => data.question),
                    backgroundColor: [ "#E07E65" ],
                    borderRadius: 5,
                  },
                  {
                    label: "Reports Created",
                    data: chatData.map((data) => data.report),
                    backgroundColor: [ "#5A9BD4" ],
                    borderRadius: 5,
                  },
                  {
                    label: "CSVs Uploaded",
                    data: chatData.map((data) => data.csv),
                    backgroundColor: [ "#4B9DA1" ],
                    borderRadius: 5,
                  },
                  {
                    label: "Docs Uploaded",
                    data: chatData.map((data) => data.docs),
                    backgroundColor: [ "#7A7A7A" ],
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

export default Chats