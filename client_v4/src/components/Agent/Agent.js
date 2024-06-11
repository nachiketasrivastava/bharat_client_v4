import React, { useState, useEffect, useRef } from "react";
import { TeamOutlined, FunnelPlotFilled, MenuOutlined, PlusOutlined, FileTextOutlined, InboxOutlined } from "@ant-design/icons";
import { Input, Select, Slider, InputNumber, message, Upload, Tooltip } from "antd";
import sendCSV from '../../assets/images/send.png';
import { useRecoilValue, useRecoilState } from 'recoil'
import { activatedICPAtom, customLeadAgentAtom, icpNamesAtom } from "../../store/atoms/AgentsAtoms";
import { jwtDecode } from "jwt-decode";
import { ReadICP } from "../../services/ICPservices.js";

import "./Agent.css";

const { Dragger } = Upload;
const { Option } = Select;

const Agent = () => {

  const activatedICP = useRecoilValue(activatedICPAtom)

  const startRef = useRef(null);
  const focusStart = () => {
    if (startRef?.current) {
      startRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const customLeadAgent = useRecoilValue(customLeadAgentAtom)
  const [customListName, setCustomListName] = useState("Custom ICP")
  const props = {
    name: 'file',
    multiple: true,
    beforeUpload: (file) => {
      // if (isFileUploaded) {
      //   message.error("Only one file upload is allowed.");
      //   return false; // Prevent default upload behavior
      // }

      // const isCSV = file.type === "text/csv" || file.name.endsWith(".csv");
      // if (isCSV) {
        console.log(file);
        // const zipCode = file; // Assuming account_address_zip_code is a property in the file object
        // handleFileUploadCSV(zipCode);
        // isFileUploaded = true;
        // message.success(`${file.name} file uploaded successfully.`);
      // } else {
      //   message.error("Please upload a CSV file.");
      // }
      return false; // Prevent default upload behavior
    },
  };

  // ----------------- ICP Definition Starts -----------------
  const [listName, setListName] = useState("GTM Copilot ICP");
  const [filters, setFilters] = useState([
    { id: 1, selectedColumn: `${activatedICP && activatedICP?.trim() !== "" ? activatedICP : "ICP Name"}`, selectedOperator: "EQUALS", selectedValue: "TRUE" }
  ]);
  const [filterDiffs, setFilterDiffs] = useState([]);

  const addFilter = () => {
    setFilters([
      ...filters,
      { id: filters.length + 1, selectedColumn: "ICP Name", selectedOperator: "EQUALS", selectedValue: "TRUE" }
    ]);
    setFilterDiffs([...filterDiffs, "OR"]);
  };

  const updateFilter = (id, key, value) => {
    setFilters(filters.map(filter =>
      filter.id === id ? { ...filter, [key]: value } : filter
    ));
  };

  const updateFilterDiff = (index, value) => {
    setFilterDiffs(filterDiffs.map((diff, i) => i === index ? value : diff));
  };
  // ----------------- ICP Definition Ends -----------------

  // ----------------- GTM CoPilot Triggers Starts -----------------
  const [triggerName, setTriggerName] = useState("GTM Copilot Triggers");
  // When Select from R1 to R12 
  // const [triggers, setTriggers] = useState([
  //   { id: 1, selectedTrigger: "Trigger", selectedOperator: "EQUALS", selectedValue: "TRUE" }
  // ]);

  const [triggers, setTriggers] = useState([
    { id: 1, selectedTrigger: "R11 - New ICP contact in existing ICP Account", selectedOperator: "EQUALS", selectedValue: "TRUE" },
    { id: 2, selectedTrigger: "R12 - New ICP contact in new ICP Account", selectedOperator: "EQUALS", selectedValue: "TRUE" }
  ])
  const [triggerDiffs, setTriggerDiffs] = useState([]);

  const addTrigger = () => {
    setTriggers([
      ...triggers,
      { id: triggers.length + 1, selectedTrigger: "Trigger", selectedOperator: "EQUALS", selectedValue: "TRUE" }
    ]);
    setTriggerDiffs([...triggerDiffs, "OR"]);
  };

  const updateTrigger = (id, key, value) => {
    setTriggers(triggers.map(trigger =>
      trigger.id === id ? { ...trigger, [key]: value } : trigger
    ));
  };

  const updateTriggerDiff = (index, value) => {
    setTriggerDiffs(triggerDiffs.map((diff, i) => i === index ? value : diff));
  };
  // ----------------- GTM CoPilot Triggers Ends -----------------

  // ----------------- Frequency & Spend Limit Starts -----------------
  const [blocks, setBlocks] = useState([
    {
      id: 1,
      name: "Frequency 1",
      checkEvery: "Day",
      spendCondition: "Less Than Or Equal To",
      spendAmount: 100,
      filterFreqAndSpendDiff: "AND"
    }
  ]);
  const [blockDiffs, setBlockDiffs] = useState([]);

  const addBlock = () => {
    setBlocks([
      ...blocks,
      {
        id: blocks.length + 1,
        name: `Frequency ${blocks.length + 1}`,
        checkEvery: "Day",
        spendCondition: "Less Than Or Equal To",
        spendAmount: 100,
        filterFreqAndSpendDiff: "AND"
      }
    ]);
    setBlockDiffs([...blockDiffs, "OR"]);
  };

  const updateBlock = (id, key, value) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, [key]: value } : block
    ));
  };

  const updateBlockDiff = (index, value) => {
    setBlockDiffs(blockDiffs.map((diff, i) => i === index ? value : diff));
  };
  // ----------------- Frequency & Spend Limit Ends -----------------

  const [leadListName, setLeadListName] = useState("");
  const [selectedListFormat, setSelectedListFormat] = useState("Timestamp");

  const [selectedFormatCSV, setSelectedFormatCSV] = useState("Salesforce");

  const [sendListName, setSendListName] = useState("");
  const [selectedCSVVia, setSelectedCSVVia] = useState("Channel");  

  const [icpNames, setIcpNames] = useRecoilState(icpNamesAtom);
  const userinformation = jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))
  const getData = async () => {
    const data = {
      user_id: userinformation?.id,
    };
    const response = await ReadICP(data);
    // console.log(response?.data);
    const icpnames = response?.data?.map((icp) => ({label: icp?.icp_name, value: icp?.icp_name}));
    console.log(icpnames)
    setIcpNames(icpnames);
  };
  useEffect(() => {
    getData();
    focusStart();
  }, []);

  return (
    <div className="py-2 px-6 flex flex-col items-center mb-10">
      <div className="flex justify-center items-center gap-4 text-base font-bold bg-gray-100 p-2 rounded-md w-full" ref={startRef}>
        <TeamOutlined />
        <div>When a lead from the oGraph</div>
      </div>

      <div className="dashedLine" />
      {!customLeadAgent ? (
        <div className="flex flex-col w-full">
          <div className="flex justify-center items-center gap-4 text-base font-bold bg-gray-100 p-2 rounded-md w-full">
            <FunnelPlotFilled />
            <div>ICP Definition</div>
          </div>
          <div className="p-2 border border-[1px] flex flex-col gap-4">
            <Input
              placeholder="Name Your list"
              value={listName}
              className="w-fit text-center font-semibold text-base mb-2"
              onChange={(e) => setListName(e.target.value)}
            />

            {filters.map((filter, index) => (
              <div key={filter.id} className="flex flex-col gap-2">
                <div className="flex justify-around items-center gap-2 pl-10 text-base">
                  <div className="flex justify-center items-center border py-[0.2rem] px-8 rounded-md border-gray-400">
                    GTM CoPilot
                  </div>
                  <div className="flex justify-center items-center border py-[0.2rem] px-8 rounded-md border-gray-400">
                    ICP Definition
                  </div>
                  <Select
                    id={`column-${filter.id}`}
                    value={filter.selectedColumn}
                    placeholder="Select Column"
                    onChange={(value) => updateFilter(filter.id, 'selectedColumn', value)}
                    options={icpNames}
                    // options={[
                    //   { label: "ICP Name", value: "ICP Name" },
                    //   { label: "ICP Location", value: "ICP Location" },
                    // ]}
                    className="flex justify-center items-center text-base w-[15%] text-center"
                  />
                  <Select
                    id={`operator-${filter.id}`}
                    value={filter.selectedOperator}
                    placeholder="Select Operator"
                    onChange={(value) => updateFilter(filter.id, 'selectedOperator', value)}
                    options={[
                      { label: "EQUALS", value: "EQUALS" },
                      { label: "NOT EQUALS", value: "NOT EQUALS" },
                    ]}
                    className="flex justify-center items-center text-base w-[15%] text-center"
                  />
                  <Select
                    id={`value-${filter.id}`}
                    value={filter.selectedValue}
                    placeholder="Select Value"
                    onChange={(value) => updateFilter(filter.id, 'selectedValue', value)}
                    options={[
                      { label: "TRUE", value: "TRUE" },
                      { label: "FALSE", value: "FALSE" },
                    ]}
                    className="flex justify-center items-center text-base w-[15%] text-center"
                  />
                </div>
                {index < filterDiffs.length && (
                  <Select
                    id={`filterDiff-${index}`}
                    value={filterDiffs[index]}
                    placeholder="Select Filter Diff"
                    onChange={(value) => updateFilterDiff(index, value)}
                    options={[
                      { label: "OR", value: "OR" },
                      { label: "AND", value: "AND" },
                      { label: "NOT", value: "NOT" },
                    ]}
                    className="flex justify-center items-center text-base w-[8%] text-center mt-2"
                  />
                )}
              </div>
            ))}

            <div className="flex justify-center items-center ml-3 mt-2">
              <div
                className="flex justify-center items-center py-1 px-4 rounded-md cursor-pointer hover:scale-105 hover:bg-[#E07E65] duration-300 ease-in-out bg-gray-700 text-white text-base"
                onClick={addFilter}
              >
                Add a Filter Condition
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <div className="flex justify-center items-center gap-4 text-base font-bold bg-gray-100 p-2 rounded-md w-full">
            <FunnelPlotFilled />
            <div>Custom ICP Definition</div>
          </div>
          <div className="p-2 border border-[1px] flex flex-col gap-4">
            <Input
              placeholder="Name Your list"
              value={customListName}
              className="w-fit text-center font-semibold text-base mb-2"
              onChange={(e) => setCustomListName(e.target.value)}
            />
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Tell us exactly what you are looking for</p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload.
              </p>
              <p className="ant-upload-hint">
                Reference Information in these files to help us find the leads you want to find.
              </p>
            </Dragger>
          </div>
        </div>
      )}

      <div className="dashedLine" />
      <div className="flex flex-col w-full">
        <div className="flex justify-center items-center gap-4 text-base font-bold bg-gray-100 p-2 rounded-md w-full">
          <FunnelPlotFilled />
          <div>GTM CoPilot Triggers</div>
        </div>
        <div className="p-2 border border-[1px] flex flex-col gap-4">
          <Input
            placeholder="Name Your Triggers"
            value={triggerName}
            className="w-fit text-center font-semibold text-base mb-2"
            onChange={(e) => setTriggerName(e.target.value)}
          />

          {triggers.map((trigger, index) => (
            <div key={trigger.id} className="flex flex-col gap-2">
              <div className="flex justify-around items-center pl-2 text-base">
                <div className="flex justify-center items-center border py-[0.2rem] px-2 rounded-md border-gray-400">
                  GTM CoPilot
                </div>
                <div className="flex justify-center items-center border py-[0.2rem] px-2 rounded-md border-gray-400">
                  GTM CoPilot Triggers
                </div>
                <div className="flex justify-center items-center text-base w-[36%] text-center border border-gray-400 rounded-md py-[0.2rem]">
                  {trigger.selectedTrigger}
                </div>
                {/* <Select
                  id={`trigger-${trigger.id}`}
                  value={trigger.selectedTrigger}
                  placeholder="Select Column"
                  onChange={(value) => updateTrigger(trigger.id, 'selectedTrigger', value)}
                  className="flex justify-center items-center text-base w-[36%] text-center"
                >
                  {[
                    { value: "R1", label: "R1 - ICP contact moved to another existing ICP account" },
                    { value: "R2", label: "R2 - ICP contact moved to net new ICP account" },
                    { value: "R3", label: "R3 - ICP contact moved to existing non ICP account", },
                    { value: "R4", label: "R4 - ICP contact moved to new non ICP account" },
                    { value: "R5", label: "R5 - Non ICP contact moved to existing non ICP account" },
                    { value: "R6", label: "R6 - Non ICP contact moved to new non ICP account" },
                    { value: "R7", label: "R7 - Non ICP contact moved to existing ICP account" },
                    { value: "R8", label: "R8 - Non ICP contact moved to new ICP account" },
                    { value: "R9", label: "R9 - Non ICP contact title change" },
                    { value: "R10", label: "R10 - ICP contact title change" },
                    { value: "R11", label: "R11 - New ICP Contact in existing ICP account" },
                    { value: "R12", label: "R12 - New ICP contact in new ICP account" },
                  ].map(option => (
                    <Option 
                      title={null} 
                      value={option?.value} 
                      label={option?.label}
                      className="fullWidth"
                    >
                      {/* <Tooltip title={option?.description} placement="left" color="#E07E65"> */}
                        {/* {option?.label}
                      {/* </Tooltip> */}
                    {/* </Option>
                  ))}
                </Select> */}
                <Select
                  id={`operator-${trigger.id}`}
                  value={trigger.selectedOperator}
                  placeholder="Select Operator"
                  onChange={(value) => updateTrigger(trigger.id, 'selectedOperator', value)}
                  options={[
                    { label: "EQUALS", value: "EQUALS" },
                    { label: "NOT EQUALS", value: "NOT EQUALS" },
                  ]}
                  className="flex justify-center items-center text-base w-[15%] text-center"
                />
                <Select
                  id={`value-${trigger.id}`}
                  value={trigger.selectedValue}
                  placeholder="Select Value"
                  onChange={(value) => updateTrigger(trigger.id, 'selectedValue', value)}
                  options={[
                    { label: "TRUE", value: "TRUE" },
                    { label: "FALSE", value: "FALSE" },
                  ]}
                  className="flex justify-center items-center text-base w-[15%] text-center"
                />
              </div>
              {/* Select Case */}
              {/* {index < triggerDiffs.length && ( */}
              {index === 0 && (
                <Select
                  id={`triggerDiff-${index}`}
                  // value={triggerDiffs[index]} // Select Case
                  value={"OR"}
                  placeholder="Select Filter Diff"
                  onChange={(value) => updateTriggerDiff(index, value)}
                  options={[
                    { label: "OR", value: "OR" },
                    { label: "AND", value: "AND" },
                    { label: "NOT", value: "NOT" },
                  ]}
                  className="flex justify-center items-center text-base w-[8%] text-center mt-2"
                />
              )}
            </div>
          ))}

          {/* Select Case */}
          {/* <div className="flex justify-center items-center ml-3 mt-2">
            <div
              className="flex justify-center items-center py-1 px-4 rounded-md cursor-pointer hover:scale-105 hover:bg-[#E07E65] duration-300 ease-in-out bg-gray-700 text-white text-base"
              onClick={addTrigger}
            >
              Add a Filter Condition
            </div>
          </div> */}
        </div>
      </div>

      <div className="dashedLine" />
      <div className="flex flex-col w-full">
        <div className="flex justify-center items-center gap-4 text-base font-bold bg-gray-100 p-2 rounded-md w-full">
          <FunnelPlotFilled />
          <div>Frequency & Spend Limit</div>
        </div>
        <div className="p-2 border border-[1px] flex flex-col gap-4">
          {blocks.map((block, index) => (
            <div key={block.id} className="w-full">
              <div className="flex flex-col gap-4 border border-[#E07E65] border-dashed p-2">
                <Input
                  placeholder="Name Your Frequency & Spend Limit"
                  value={block.name}
                  className="w-fit text-center font-semibold text-base mb-2"
                  onChange={(e) => updateBlock(block.id, 'name', e.target.value)}
                />
                <div className="flex justify-start items-center gap-16 pl-16 text-base">
                  <div className="flex justify-center items-center border py-[0.2rem] px-8 rounded-md border-gray-400">
                    Check Every
                  </div>
                  <Select
                    id={`checkEvery-${block.id}`}
                    value={block.checkEvery}
                    placeholder="Select Check Every Duration"
                    onChange={(value) => updateBlock(block.id, 'checkEvery', value)}
                    options={[
                      { label: "Day", value: "Day" },
                      { label: "Week", value: "Week" },
                      { label: "Month", value: "Month" },
                      { label: "Quarter", value: "Quarter" },
                      { label: "Year", value: "Year" },
                    ]}
                    className="flex justify-center items-center text-base w-[15%] text-center"
                  />
                </div>
                <Select
                  id={`filterFreqAndSpendDiff-${block.id}`}
                  value={block.filterFreqAndSpendDiff}
                  placeholder="Select Filter Frequency & Spend Diff"
                  onChange={(value) => updateBlock(block.id, 'filterFreqAndSpendDiff', value)}
                  options={[
                    { label: "OR", value: "OR" },
                    { label: "AND", value: "AND" },
                    { label: "NOT", value: "NOT" },
                  ]}
                  className="flex justify-center items-center text-base w-[8%] text-center"
                />
                <div className="flex justify-start items-center gap-20 pl-20 text-base">
                  <div className="flex justify-center items-center border py-[0.2rem] px-8 rounded-md border-gray-400">
                    Spend
                  </div>
                  <Select
                    id={`spend-${block.id}`}
                    value={block.spendCondition}
                    placeholder="Select Spend Condition"
                    onChange={(value) => updateBlock(block.id, 'spendCondition', value)}
                    options={[
                      { label: "Equals", value: "Equals" },
                      { label: "Not Equals", value: "Not Equals" },
                      { label: "Less Than Or Equal To", value: "Less Than Or Equal To" },
                      { label: "Greater Than Or Equal To", value: "Greater Than Or Equal To" },
                    ]}
                    className="flex justify-center items-center text-base w-[20%] text-center"
                  />
                  <div className="flex justify-center items-center gap-4 w-[50%]">
                    <Slider
                      min={50}
                      max={200}
                      onChange={(value) => updateBlock(block.id, 'spendAmount', value)}
                      className="w-full"
                      value={typeof block.spendAmount === 'number' ? block.spendAmount : 0}
                    />
                    <InputNumber
                      min={50}
                      max={200}
                      value={block.spendAmount}
                      onChange={(value) => updateBlock(block.id, 'spendAmount', value)}
                    />
                  </div>
                </div>
              </div>
              {index < blockDiffs.length && (
                <div className="flex justify-center items-center">
                  <Select
                    id={`blockDiff-${index}`}
                    value={blockDiffs[index]}
                    placeholder="Select Filter Block Diff"
                    onChange={(value) => updateBlockDiff(index, value)}
                    options={[
                      { label: "OR", value: "OR" },
                      { label: "AND", value: "AND" },
                      { label: "NOT", value: "NOT" },
                    ]}
                    className="flex justify-center items-center text-base w-[8%] text-center self-center mt-4"
                  />
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-center items-center ml-3 mt-2">
            <div
              className="flex justify-center items-center py-1 px-4 rounded-md cursor-pointer hover:scale-105 hover:bg-[#E07E65] duration-300 ease-in-out bg-gray-700 text-white text-base"
              onClick={addBlock}
            >
              Add a Filter Block
            </div>
          </div>
        </div>
      </div>

      <div className="dashedLine" />
      <div className="flex flex-col w-full">
        <div className="flex justify-center items-center gap-4 text-base font-bold bg-gray-100 p-2 rounded-md w-full">
          <MenuOutlined />
          <div>Create a Lead List Named</div>
        </div>
        <div className="p-4 border border-[1px] flex gap-4 items-center justify-center">
          <Input
            placeholder="Name Your List"
            value={leadListName}
            className="w-fit text-center font-semibold text-base"
            onChange={(e) => setLeadListName(e.target.value)}
          />
          <PlusOutlined />
          <Select
            id="listFormat"
            value={selectedListFormat}
            placeholder="Select List Format"
            onChange={(value) => setSelectedListFormat(value)}
            options={[
              {
                label: "Timestamp",
                value: "Timestamp",
              },
              {
                label: "Sequential Number",
                value: "Sequential Number",
              },
            ]}
            className="flex justify-center items-center text-base w-[20%] text-center"
          />
        </div>
      </div>

      <div className="dashedLine" />
      <div className="flex flex-col w-full">
        <div className="flex justify-center items-center gap-4 text-base font-bold bg-gray-100 p-2 rounded-md w-full">
          <FileTextOutlined />
          <div>Format CSV For</div>
        </div>
        <div className="p-4 border border-[1px] flex gap-4 items-center justify-center">
          <Select
            id="formatCSV"
            value={selectedFormatCSV}
            placeholder="Select Format of CSV"
            onChange={(value) => setSelectedFormatCSV(value)}
            options={[
              {
                label: "Salesforce",
                value: "Salesforce",
              },
              {
                label: "Hubspot",
                value: "Hubspot",
              },
            ]}
            className="flex justify-center items-center text-base w-[20%] text-center"
          />
        </div>
      </div>

      <div className="dashedLine" />
      <div className="flex flex-col w-full">
        <div className="flex justify-center items-center gap-4 text-base font-bold bg-gray-100 p-2 rounded-md w-full">
          <img 
            src={sendCSV}
            alt="sendCSV"
            className="w-6"
          />
          <div>Send to</div>
        </div>
        <div className="p-4 border border-[1px] flex gap-4 items-center justify-center">
          <Input
            placeholder="Email"
            value={sendListName}
            className="w-fit text-center font-semibold text-base"
            onChange={(e) => setSendListName(e.target.value)}
          />
          <div>
            Via
          </div>
          <Select
            id="csvVia"
            value={selectedCSVVia}
            placeholder="Select CSV Via"
            onChange={(value) => setSelectedCSVVia(value)}
            options={[
              {
                label: "Channel",
                value: "Channel",
              },
              {
                label: "Message",
                value: "Message",
              },
            ]}
            className="flex justify-center items-center text-base w-[20%] text-center"
          />
        </div>
      </div>

    </div>
  );
};

export default Agent;
