import React from "react";
import Carousel from "./Carousel";
import { Table } from "antd";
import { useSetRecoilState } from "recoil";
import { initialAgentPageAtom, customLeadAgentAtom } from "../../store/atoms/AgentsAtoms";

import "./AgentsInitial.css";
import { Switch } from "antd";

const onChange = (checked) => {
  console.log(`switch to ${checked}`);
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
    title: "Status",
    dataIndex: "status",
    render: () => <Switch defaultChecked onChange={onChange} />,
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

const handleActivate = () => {
  window.location.href = "https://ada.gtmcopilot.com/build-agent";
};

const AgentsInitial = () => {
  const setInitialAgentPage = useSetRecoilState(initialAgentPageAtom);
  const setCustomLeadAgent = useSetRecoilState(customLeadAgentAtom);

  const handleActivate = (custom) => {
    setInitialAgentPage(false);
    if (custom) {
      setCustomLeadAgent(true);
    } else {
      setCustomLeadAgent(false);
    }
  }

  return (
    <div className="py-4 px-2 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-4">
          <div className="text-lg font-bold">Agents</div>
          <div>Create an AI Agent to automate tasks across your tech stack</div>
        </div>
        <div
          className="p-2 text-white bg-black rounded-md flex justify-center items-center cursor-pointer hover:scale-110 duration-300 ease-in-out hover:bg-[#E07E65] mr-8"
          onClick={handleActivate}
        >
          Activate New Agent
        </div>
      </div>

      <div className="flex gap-4 justify-between items-center border border-black rounded-lg p-2">
        <div className="border w-[50%] p-2 border-gray-600 text-justify">
          We are building out our Super Agent Framework so you can automate almost any tasks with just a few prompts. For now, please feel free to try our Lead Agent, which automates the discovery of relevant leads that fit your ICP
        </div>
        <div className="flex flex-col gap-4 justify-center items-end mr-6">
          <div 
            className="p-2 text-white bg-black rounded-md flex justify-center items-center cursor-pointer hover:scale-110 duration-300 ease-in-out hover:bg-[#E07E65]"
            onClick={() => handleActivate(false)}  
          >
            Activate Lead Discovery Agent
          </div>
          <div 
            className="p-2 text-white bg-black rounded-md flex justify-center items-center cursor-pointer hover:scale-110 duration-300 ease-in-out hover:bg-[#E07E65]"
            onClick={() => handleActivate(true)}  
          >
            Activate Custom Lead Agent
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center gap-20 mt-4">
        <div className="w-[75%] gradient-bg">
          <Carousel />
        </div>
        <div
          className="p-2 text-white bg-black rounded-md flex justify-center items-center mr-10"
        >
          Agent Library
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
        className="mt-4 pr-2"
        bordered
      />
    </div>
  );
};

export default AgentsInitial;
