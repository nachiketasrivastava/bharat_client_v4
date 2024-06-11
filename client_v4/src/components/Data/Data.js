import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Input, Table, Card } from "antd";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  UndoOutlined,
  ReloadOutlined,
  PieChartFilled,
  FilterFilled,
  ProfileFilled,
  ContactsFilled,
} from "@ant-design/icons";
import sourceData from "./sourceData.json";

import overlapIcon from "../../assets/images/overlapIcon.png";

import {
  chartVisibleAtom,
  selectedRowKeysAtom,
} from "../../store/atoms/ProjectsAtoms";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const { Search } = Input;

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];
const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}

const Data = () => {
  const [selectedRowKeys, setSelectedRowKeys] =
    useRecoilState(selectedRowKeysAtom);
  const [chartVisible, setChartVisible] = useRecoilState(chartVisibleAtom);

  useEffect(() => {
    setSelectedRowKeys([]);
    setChartVisible(false);
  }, []);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  return (
    <div className="flex flex-col justify-between h-[88vh]">
      <div className="flex justify-between items-center bg-gray-300 p-2 mr-4 rounded-md mt-1">
        <Search
          placeholder="Search"
          onSearch={onSearch}
          allowClear
          style={{
            width: 200,
          }}
        />
        <div className="flex items-center gap-4">
          <UndoOutlined
            rotate="90"
            className="text-lg text-black border border-black bg-white px-2 py-1 rounded-md cursor-pointer hover:text-white hover:bg-[#E07E65] duration-300 ease-in-out hover:scale-110 hover:border-[#E07E65]"
          />
          <ReloadOutlined className="text-lg text-black bg-white border border-black px-2 py-1 rounded-md cursor-pointer hover:text-white hover:bg-[#E07E65] duration-300 ease-in-out hover:scale-110 hover:border-[#E07E65]" />
          <PieChartFilled
            className={`${
              chartVisible
                ? "bg-[#E07E65] text-white border-[#E07E65] text-white"
                : "bg-white border-black text-black"
            } text-lg border px-2 py-1 rounded-md cursor-pointer hover:text-white hover:bg-[#E07E65] duration-300 ease-in-out hover:scale-110 hover:border-[#E07E65]`}
            onClick={() => setChartVisible(!chartVisible)}
          />
          <div className="flex justify-center items-center px-2 border rounded-md border-black text-black bg-white cursor-pointer hover:text-white hover:bg-[#E07E65] duration-300 ease-in-out hover:scale-110 text-base hover:border-[#E07E65]">
            Quick Actions
          </div>
        </div>
      </div>
      {chartVisible ? (
        <Card className="shadow-lg my-1 mr-4 h-[60%]">
          <div className="flex justify-center items-center">
            <Bar
              style={{
                flexGrow: 0.25,
              }}
              data={{
                labels: sourceData.map((data) => data.label),
                datasets: [
                  {
                    label: "Count",
                    data: sourceData.map((data) => data.value),
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
                      display: true,
                      text: "Customer Type",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Number of Records",
                    },
                  },
                },
              }}
            />
          </div>
        </Card>
      ) : (
        <></>
      )}
      <div>
        <div className="flex w-full justify-between items-center pr-6">
          <div>{`${selectedRowKeys?.length}/${data.length} Rows Selected`}</div>
          <div className="flex items-center gap-4 text-[14px]">
            <div className="flex justify-center items-center gap-1 cursor-pointer hover:scale-110 duration-300 ease-in-out">
              <FilterFilled />
              <div>Filter</div>
            </div>
            <div className="flex justify-center items-center gap-1 cursor-pointer hover:scale-110 duration-300 ease-in-out">
              <ProfileFilled />
              <div>Find Company Lookalikes</div>
            </div>
            <div className="flex justify-center items-center gap-1 cursor-pointer hover:scale-110 duration-300 ease-in-out">
              <ContactsFilled />
              <div>Find People</div>
            </div>
            <div className="flex justify-center items-center gap-1 cursor-pointer hover:scale-110 duration-300 ease-in-out">
              <img src={overlapIcon} alt="overlap" width={20} />
              <div>View Overlap</div>
            </div>
          </div>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          className={`${
            !chartVisible ? "h-[75vh]" : "h-[35vh]"
          } overflow-scroll shadow-lg mr-4 p-2`}
          pagination={false}
          bordered
        />
      </div>
    </div>
  );
};

export default Data;
