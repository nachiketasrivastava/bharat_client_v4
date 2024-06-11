import React from "react";
import { useSetRecoilState } from "recoil";
import { Input, Select, message, Upload } from "antd";

import { CloudUploadOutlined } from "@ant-design/icons";

import { activeCreateTabAtom } from "../../store/atoms/ProjectsAtoms";

import "./DataSource.css";

const sourceOptions = [
  {
    value: -1,
    label: "Select a Data Source",
  },
  {
    value: "Salesforce",
    label: "Salesforce",
  },
  {
    value: "Hubspot",
    label: "Hubspot",
  },
  {
    value: "iGraph",
    label: "iGraph",
  },
];

const DataSource = () => {
  const setActiveCreateTab = useSetRecoilState(activeCreateTabAtom);

  const handleSelectChange = (e) => {
    if (e !== -1) {
      console.log(e);
    }
  };

  const handleInputChange = (e) => {
    console.log(e.target.value);
  };

  const props = {
    name: "file",
    beforeUpload: () => false,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleCreate = () => {
    setActiveCreateTab(1);
  };

  return (
    <div className="flex flex-col justify-start h-fit gap-4 px-2 py-6 border border-4 rounded-2xl mr-4 mt-12">
      <div className="text-2xl font-bold pl-2">
        Select the Data Source/Sources
      </div>
      <div className="flex flex-col gap-1 px-4">
        <label htmlFor="projectName" className="font-semibold">
          Give your project a name
        </label>
        <Input
          id="projectName"
          name="projectName"
          type="text"
          defaultValue={"New Project"}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col gap-1 px-4">
        <label htmlFor="projectSource" className="font-semibold">
          Select a Source
        </label>
        <Select
          id="projectSource"
          name="projectSource"
          defaultValue={-1}
          onChange={handleSelectChange}
          options={sourceOptions}
        />
      </div>
      <div className="flex flex-col gap-1 px-4 uploadSource">
        <label htmlFor="projectUpload" className="font-semibold">
          or Upload a file
        </label>
        <Upload {...props}>
          <div className="flex justify-center items-center cursor-pointer border border-gray-300 rounded-md flex-1 p-1 gap-2">
            <CloudUploadOutlined />
            <div>Upload a file</div>
          </div>
        </Upload>
      </div>
      <div className="flex justify-end w-[98%] mt-5">
        <div
          className="border rounded-md text-[#E07E65] border-[#E07E65] p-2 hover:bg-[#E07E65] hover:text-white cursor-pointer hover:scale-110 duration-300 ease-in-out"
          onClick={handleCreate}
        >
          Create Project
        </div>
      </div>
    </div>
  );
};

export default DataSource;
