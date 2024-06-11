import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import './DefineICP_AD.css'
import logo from "../../assets/images/logoWOname.png";
import { InfoCircleOutlined, AuditOutlined, GlobalOutlined, ToolOutlined, DollarOutlined, AppstoreOutlined, CheckCircleOutlined, ExclamationCircleOutlined, WifiOutlined, TeamOutlined, ApartmentOutlined, IdcardOutlined, PlusOutlined, CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { Button, Typography, Input, Select, Tooltip, Tag, Table, message } from "antd"; // Import Tag component
import constants from "../../helpers/Constants";
import employeeIcon from '../../assets/images/employeeIcon.png'

import LoaderWithText from "../LoaderWithText/LoaderWithText.js";
import SavedICP from "../SavedICP/SavedICP.js";

import { CreateICP, ReadICP, UpdateICP, CheckForExistingName } from "../../services/ICPservices.js";

import { icpNameAtom, selectedIndustryOptionAtom, selectedCountryOptionAtom, selectedRevenueRangeAtom, selectedEmployeeRangeAtom, selectedTechnologyOptionAtom, companiesAtom, notCompaniesAtom, keywordsAtom, keywordspersonasAtom, titlesAtom, departmentsAtom, editICPAtom, editICPIDAtom, editICPNameAtom } from "../../store/atoms/ICPAtoms.js";

const { Title } = Typography;
const { Option } = Select;

const createOption = (label) => ({
  label,
  value: label,
});

const DefineICP_AD = () => {
  const userinformation = jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))

  const [icpName, setIcpName] = useRecoilState(icpNameAtom)
  const [selectedIndustryOption, setSelectedIndustryOption] = useRecoilState(selectedIndustryOptionAtom);
  const [selectedCountryOption, setSelectedCountryOption] = useRecoilState(selectedCountryOptionAtom);
  const [selectedRevenueRange, setSelectedRevenueRange] = useRecoilState(selectedRevenueRangeAtom);
  const [selectedEmployeeRange, setSelectedEmployeeRange] = useRecoilState(selectedEmployeeRangeAtom);
  const [selectedTechnologyOption, setSelectedTechnologyOption] = useRecoilState(selectedTechnologyOptionAtom);
  const [companies, setCompanies] = useRecoilState(companiesAtom);
  const [notCompanies, setNotCompanies] = useRecoilState(notCompaniesAtom);
  const [keywords, setKeywords] = useRecoilState(keywordsAtom);
  const [keywordspersona, setKeywordsPersona] = useRecoilState(keywordspersonasAtom);
  const [titles, setTitles] = useRecoilState(titlesAtom);
  const [departments, setDepartments] = useRecoilState(departmentsAtom)

  const [editICP, setEditICP] = useRecoilState(editICPAtom)
  const editICPID = useRecoilValue(editICPIDAtom)
  const editICPName = useRecoilValue(editICPNameAtom)

  const [loading, setLoading] = useState(false)
  const [isMandatoryEmpty, setisMandatoryEmpty] =useState(true)
  const [oldICP, setOldICP] = useState([])
  const [actualICP, setActualICP] = useState([])
  const [nameText, setNameText] = useState("")

  const icpColumns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
        title: "Date Discovered",
        dataIndex: "date_discovered",
        key:'date_discovered',
    },
    {
      title: "List Name",
      dataIndex: "listName",
      key: "listName",
    },
    {
        title: "Rule Tags Used",
        key: "ruletags",
        dataIndex: "ruletags",
    },
    {
      title: "# Leads",
      key: "leads",
      dataIndex: "leads",
    },
    {
      title: "# Accounts",
      key: "accounts",
      dataIndex: "accounts",
    },
    {
    title: "Last Export Date",
    key: "expDate",
    dataIndex: "expDate",
    },
    {
      title: "Quick Actions",
      key: "actions",
      dataIndex: "actions",
    },
  ];
  const sortedIndustryOptions = constants.searchFilterIndustry.sort((a, b) =>
    a.label.localeCompare(b.label)
  );
  const allIndustryValues = sortedIndustryOptions.map(option => option.value);
  const selectAllOption = {
    label: "Select All Industries",
    value: "All Industries selected",
  };
  const sortedIndustryOptionsWithAll = [selectAllOption, ...sortedIndustryOptions];
  const handleIndustryChange = (value) => {
    const isSelectAllSelected = value.includes(selectAllOption.value);

    if (isSelectAllSelected) {
      // value = [selectAllOption.value];
      if (selectedIndustryOption.length > 0) {
        value = []
      } else {
        value = [...sortedIndustryOptions]
      }
    } else {
      value = value.filter((option) => option !== selectAllOption.value);
    }

    setSelectedIndustryOption(value);
  };
  const handleCountryChange = (value) => {
    setSelectedCountryOption(value);
  };
  const handleEmployeeRangeChange = (value) => {
    setSelectedEmployeeRange(value);
  };
  const handleRevenueRangeChange = (value) => {
    setSelectedRevenueRange(value);
  };
  const handleTechnologyChange = (value) => {
    setSelectedTechnologyOption(value);
  };
  let sortedCountryOptions = constants.optionsCountry.sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  const setAllEmpty = () => { // if necessary
    setIcpName("")
    setSelectedIndustryOption([])
    setSelectedCountryOption(['United States']);
    setSelectedEmployeeRange([])
    setSelectedRevenueRange([])
    setSelectedTechnologyOption([]);
    setCompanies([]);
    setNotCompanies([]);
    setKeywords([]);
    setKeywordsPersona([]);
    setTitles([]);
    setDepartments([])
  }

  const saveICPrecord = async (inputValueData) => {
    const formdata = {
      inputValueData: inputValueData,
      user_id: userinformation?.id,
      edit: editICP,
    }
    try{
      // setAllEmpty()
      let response
      if (editICP) {
        response = await UpdateICP(editICPID, formdata)
      } else {
        response = await CreateICP(formdata);
      }
      // await new Promise(resolve => setTimeout(resolve, 3000));
      if(response){
        // setShowicpLoader(false)
        if (response.data.message == "ICP created successfully") {
          message.success(`ICP ${editICP ? "updated" : "created"} successfully`)
          // refreshChat("editICP")
          // setNodes([])
        } else if (response.data.message == "Server down, please try after sometime") {
          message.error("There was an unexpected error building your ICP. Please try again");
        } else {
          message.success(response?.data?.message);
        }
        if(response.status === 200){
          // message.success("Actual ICP created successfully")
          // setIsICPCreated(true)
          // getIcpList()
          // processSqlQuery(response.data.apiData.sql_query)
        }
        console.log(response.data);
        console.log(response.data.apiData);
        // setApiData(response.data.apiData);
      }
    }
    catch(error){
      // if (showicpLoader) {
      //   setShowicpLoader(false)
      //   message.error("Failed to create ICP");
      // }
      console.error("Error saving ICP record:", error);
    }
    setLoading(false)
    setTimeout(() => {
      window.location.href = window.location.href
    }, 1500)
  }

  const handleSubmit = () => {
    if (!icpName || icpName?.trim() === "") {
      message.error("Please enter ICP Group or Tier Name")
      return;
    }
    if (nameText?.trim() !== "") {
      return;
    }

    const emptyFields = [];

    if (!selectedCountryOption || selectedCountryOption.length === 0) {
      emptyFields.push("Country");
    }
    if (!selectedIndustryOption || selectedIndustryOption.length === 0) {
      emptyFields.push("Industry");
    }
    if (!keywords || keywords.length === 0) {
      emptyFields.push("ICP Definition Keywords/Signals");
    }
    if (!keywordspersona || keywordspersona.length === 0) {
      emptyFields.push("Persona Definition Keywords/Signals");
    }

    if (emptyFields?.length > 0) {
      const warningText = emptyFields.length > 0 ? `Please enter ${emptyFields.join(", ").replace(/, ([^,]*)$/, " and $1")}` : "";
      message.error(warningText);
      return
    }

    setLoading(true)
    const inputValueData = {
      "Name": icpName,
      "Geo": selectedCountryOption?.join(", "),
      "Industry": selectedIndustryOption?.join(", "),
      "Employee Range": selectedEmployeeRange?.join(", "),
      "Revenue Range": selectedRevenueRange?.join(", "),
      "Technographics": selectedTechnologyOption?.join(", "),
      "ICPKeywords": keywords?.map(keyword => keyword?.name)?.join(", "),
      "PersonaKeywords": keywordspersona?.map(keyword => keyword?.name)?.join(", "),
      "Buyer & User Persona Keywords": keywords?.map(keyword => keyword?.name)?.join(", ") + ", " + keywordspersona?.map(keyword => keyword?.name)?.join(", "),
      titles: titles?.map(title => title?.name)?.join(", "),
      departments: departments?.map(dep => dep?.name)?.join(", "),
      companies: companies?.map(comp => comp?.name)?.join(", "),
      notCompanies: notCompanies?.map(notComp => notComp?.name)?.join(", "),
      "Signals": ""
    }
    console.log(inputValueData)
    // console.log(userinformation)
    saveICPrecord(inputValueData)
  }

  const getData = async () => {
    const data = {
      user_id: userinformation?.id
    }
    const response = await ReadICP(data)
    console.log(response?.data)
    setActualICP([ ...response?.data ])
    if (Array.isArray(response?.data) && response?.data?.length > 0) {
      setOldICP(prevICP => [
        ...prevICP,
        ...response?.data?.sort((a, b) => new Date(b?.updateddate) - new Date(a?.updateddate))?.map(item => ({
          icpName: `${item?.icp_name}`,
          country: item?.region?.split(",")?.map(val => val?.trim()),
          industry: item?.industry?.split(",")?.map(val => val?.trim()),
          empRange: item?.employee?.split(",")?.map(val => val?.trim()),
          revRange: item?.revenue?.split(",")?.map(val => val?.trim()),
          techno: item?.technographics?.split(",")?.map(val => val?.trim()),
          exComp: item?.excompany?.split(",")?.map(val => val?.trim()),
          notComp: item?.notcompany?.split(",")?.map(val => val?.trim()),
          icpKeywords: item?.keyword?.split(",")?.map(val => val?.trim()),
          deps: item?.department?.split(",")?.map(val => val?.trim()),
          titles: item?.title?.split(",")?.map(val => val?.trim()),
          personaKeywords: item?.personakeyword?.split(",")?.map(val => val?.trim()),
          createdDate: item?.createddate,
          updatedDate: item?.updateddate,
          icpID: item?.id
        }))
      ]);
    } else {
      console.log("Invalid response data format");
    }
  }
  useEffect(() => {
    setEditICP(false)
    setAllEmpty()
    getData() 
  }, [])

  useEffect(() => {
    console.log(oldICP)
  }, [oldICP])

  const timeoutIDRef = useRef(null);
  const checkName = useCallback(async (icp_name) => {
    const payload = {
      icp_name: icp_name,
      user_id: userinformation?.id
    };
    const response = await CheckForExistingName(payload);
    console.log(response);
    if (response?.status === 200) {
      setNameText(response?.data?.message)
    } else {
      setNameText("")
    }
  }, [userinformation]);

  const debounceCheckName = useCallback((icp_name) => {
    if (timeoutIDRef.current) {
      clearTimeout(timeoutIDRef.current);
    }
    timeoutIDRef.current = setTimeout(() => {
      checkName(icp_name);
    }, 500);
  }, [checkName]);

  const handleICPNameChange = async (event) => {    
    setIcpName(event.target.value)
    if (event.target.value?.trim() !== "" && event.target.value?.trim() !== editICPName) {
      debounceCheckName(event.target.value)
    } else {
      setNameText("")
    }
  }

  useEffect(() => {
    if (icpName?.trim() === "") {
      setNameText("")
    }
  }, [nameText])

  const parentRef = useRef(null);

  const focusParent = () => {
    if (parentRef.current) {
      parentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTagChange = (value, valToSet) => {
    // Create a map for case-insensitive uniqueness check
    const lowerCaseMap = new Map();

    // Filter out duplicates in a case-insensitive manner
    const uniqueValue = value?.filter((name) => {
      const lowerCaseName = name?.toLowerCase();
      if (!lowerCaseMap?.has(lowerCaseName)) {
        lowerCaseMap?.set(lowerCaseName, true);
        return true;
      }
      return false;
    });

    let finalValue
    if (valToSet === "excompanies" || valToSet === "notcompanies") {
      // Check the values of the other field
      const otherField = valToSet === "excompanies" ? notCompanies : companies;
      const otherFieldLowerCaseMap = new Map(otherField?.map(({ name }) => [name?.toLowerCase(), true]));

      // Filter out values that are in the other field
      finalValue = uniqueValue?.filter(name => !otherFieldLowerCaseMap?.has(name?.toLowerCase()));
    }

    // Update the state
    if (valToSet === "excompanies") {
      setCompanies(finalValue?.map((name, index) => ({ id: index, name })));
    } else if (valToSet === "notcompanies") {
      setNotCompanies(finalValue?.map((name, index) => ({ id: index, name })));
    } else if (valToSet === "icpKeywords") {
      setKeywords(uniqueValue?.map((name, index) => ({ id: index, name })));
    } else if (valToSet === "deps") {
      setDepartments(uniqueValue?.map((name, index) => ({ id: index, name })));
    } else if (valToSet === "titles") {
      setTitles(uniqueValue?.map((name, index) => ({ id: index, name })));
    } else if (valToSet === "personaKeywords") {
      setKeywordsPersona(uniqueValue?.map((name, index) => ({ id: index, name })));
    }

  }
  

  return (
    <>
      <div className={`w-[100%] mt-5 defineICP`} >
        <div 
          style={
            {
              border: '1px solid grey', 
              padding: "5px", 
              marginLeft: "20px", 
              marginRight: "20px", 
              transition: 'box-shadow 0.5s ease-in-out'
              // boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'
            }
          }
          className="rounded-md shadow-2xl focusable"
          ref={parentRef}
          tabIndex={-1}
        >
        <div className="flex justify-center">
          <Title level={3}>ICP and Persona Definitions</Title>
        </div>
          <div className="flex gap-2 p-2 mr-4 mt-5 justify-center"> {/*both box*/}
                <div className="flex p-1 px-2 text-[white] bg-[#7d7d7d] gap-2 items-center cursor-pointer" style={{ borderRadius: "15px" }}>
                  AI Defined
                  <Tooltip title="Let our AI analyze your historical data to discover your ICP. You can modify the settings after.">
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
                <div className="flex p-1 px-2 text-[white] bg-[#7d7d7d] gap-2 items-center cursor-pointer" style={{ borderRadius: "15px" }}>
                  Document Defined
                  <Tooltip title="Upload any document, PDF, CSV and our AI will pull out the settings. You can modify the settings after.  ">
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
                <div className="flex p-1 px-2 text-[white] bg-[#7d7d7d] gap-2 items-center cursor-pointer" style={{ borderRadius: "15px" }}>
                  Manually Defined
                  <Tooltip title="Create your own custom ICP and persona definitions.">
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
          </div>
          <div className="mt-5 mb-5 flex flex-col items-center">
                <Input className="w-[50%] text-center" placeholder="ICP Group or Tier Name" value={loading ? "" : icpName} onChange={handleICPNameChange} />
                {nameText && nameText?.trim() !== "" ? 
                  <div 
                    className='text-red-500 flex justify-center gap-2 mt-1'
                  >
                    <CloseCircleFilled />
                    <div>{nameText}</div>
                  </div> 
                  : 
                  <></>
                }
          </div>
          {loading ? <div className="h-[25rem] flex justify-center items-center"><LoaderWithText /></div> : (
            <div className="flex justify-center gap-1"> {/*header of box*/}
              <div className="p-4 w-[50%]"> {/*single box*/}
                <hr /> <hr /> <hr />
                <div> {/* Main Content */}
                  <div className="flex text-[18px] mt-2 items-center gap-2 justify-center">
                    <AuditOutlined />
                    <span>ICP Definition</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <GlobalOutlined />
                    <div className="w-[40%]">
                      Country <span className="text-red-500">*</span>
                    </div>
                    <Select
                      id="operation"
                      mode="multiple"
                      value={selectedCountryOption}
                      onChange={handleCountryChange}
                      placeholder="Select Location"
                      options={sortedCountryOptions}
                      popupClassName="custom-dropdown"
                      popupMatchSelectWidth={false}
                      className="search_select search_flex_cls"
                      dropdownRender={(menu) => <div>{menu}</div>}
                      bordered
                      // style={{ border: isMandatoryEmpty && selectedCountryOption.length === 0 ? "1px solid red" : "1px solid #E0E0E0", borderRadius: "8px", width: "100%", height: "30px" }}
                      style={{ border: "1px solid #E0E0E0", borderRadius: "8px", width: "100%" }}
                      optionLabelProp="value"
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      // maxTagCount={2} // Set the maximum number of visible options
                      // maxTagPlaceholder={`+ ${selectedCountryOption.length - 2} more`}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2 font-red">
                    <ToolOutlined />
                    <div className="w-[40%]">
                      Industry <span className="text-red-500">*</span>
                    </div>
                      <Select
                        id="industries"
                        mode="multiple"
                        value={selectedIndustryOption}
                        onChange={handleIndustryChange}
                        placeholder="Select Industry Categories"
                        // options={sortedIndustryOptionsWithAll}
                        options={sortedIndustryOptions}
                        popupClassName="custom-dropdown"
                        popupMatchSelectWidth={false}
                        optionLabelProp="value"
                        className="search_select"
                        dropdownRender={(menu) => <div>{menu}</div>}
                        bordered
                        // style={{
                        //   border: isMandatoryEmpty && selectedIndustryOption.length === 0 ? "1px solid red" : "1px solid #E0E0E0",
                        //   borderRadius: "8px",
                        //   cursor: "pointer",
                        //   width: "100%", height: "30px"
                        // }}
                        style={{
                          border: "1px solid #E0E0E0",
                          borderRadius: "8px",
                          cursor: "pointer",
                          width: "100%"
                        }}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        // maxTagCount={2} // Set the maximum number of visible options
                        // maxTagPlaceholder={`+ ${selectedIndustryOption.length - 2} more`}
                      />
                  </div>
                  <div className="flex items-center gap-2 mt-2 font-red">
                    <img src={employeeIcon} alt='employeeIcon' width={14} />
                    <div className="w-[40%]">
                    
                    Employee Range
                    </div>
                      <Select
                        id="employee"
                        mode="multiple"
                        value={selectedEmployeeRange}
                        onChange={handleEmployeeRangeChange}
                        placeholder="Select Employee Range"
                        options={constants.optionsEmployeeRange}
                        popupClassName="custom-dropdown"
                        popupMatchSelectWidth={false}
                        optionLabelProp="label"
                        className="search_select"
                        dropdownRender={(menu) => <div>{menu}</div>}
                        bordered
                        // style={{
                        //   border: isMandatoryEmpty && selectedIndustryOption.length === 0 ? "1px solid red" : "1px solid #E0E0E0",
                        //   borderRadius: "8px",
                        //   cursor: "pointer",
                        //   width: "100%", height: "30px"
                        // }}
                        style={{
                          border: "1px solid #E0E0E0",
                          borderRadius: "8px",
                          cursor: "pointer",
                          width: "100%"
                        }}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        // maxTagCount={2} // Set the maximum number of visible options
                        // maxTagPlaceholder={`+ ${selectedIndustryOption.length - 2} more`}
                      />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <DollarOutlined />
                    <div className="w-[40%]">
                    
                    {'Revenue Range'}
                    </div>
                    <Select
                      id="revenue"
                      mode="multiple"
                      value={selectedRevenueRange}
                      onChange={handleRevenueRangeChange}
                      placeholder="Select Revenue Range"
                      options={constants.optionsRevenueRange}
                      popupClassName="custom-dropdown"
                      popupMatchSelectWidth={false}
                      className="search_select search_flex_cls"
                      dropdownRender={(menu) => <div>{menu}</div>}
                      bordered
                      style={{
                        borderRadius: "8px",
                        cursor: "pointer",
                        width: "100%"
                      }}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      // maxTagCount={2} // Set the maximum number of visible options
                      // maxTagPlaceholder={`+ ${selectedRevenueRange.length - 2} more`}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <AppstoreOutlined />
                    <div className="w-[40%]">
                    
                    {'Technographic'}
                    </div>
                    <Select
                      id="technology"
                      mode="multiple"
                      value={selectedTechnologyOption}
                      onChange={handleTechnologyChange}
                      placeholder="Select Technology"
                      options={constants.optionsTechnology}
                      popupClassName="custom-dropdown"
                      popupMatchSelectWidth={false}
                      className="search_select search_flex_cls"
                      dropdownRender={(menu) => <div>{menu}</div>}
                      bordered
                      style={{
                        borderRadius: "8px",
                        cursor: "pointer",
                        width: "100%"
                      }}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      // maxTagCount={2} // Set the maximum number of visible options
                      // maxTagPlaceholder={`+ ${selectedTechnologyOption.length - 2} more`}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircleOutlined />
                    <div className="w-[40%]">
                    {'Ex. Companies'}
                    </div>
                    <Select 
                      mode="tags" // Set mode to tags
                      style={{ width: '100%' }}
                      value={companies?.map(company => company?.name)}
                      // onChange={(value) => setCompanies(value.map((name, index) => ({ id: index, name })))}
                      onChange={(value) => handleTagChange(value, "excompanies")}
                      tokenSeparators={[',']}
                      placeholder="Type and press enter to add companies like"
                      bordered={true}
                      dropdownStyle={{display: 'none'}}
                      suffixIcon={null}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <ExclamationCircleOutlined />
                    <div className="w-[40%]">
                    
                    {'Not Companies'}
                    </div>
                    <Select 
                      mode="tags" // Set mode to tags
                      style={{ width: '100%' }}
                      value={notCompanies?.map(company => company?.name)}
                      // onChange={(value) => setNotCompanies(value.map((name, index) => ({ id: index, name })))}
                      onChange={(value) => handleTagChange(value, "notcompanies")}
                      tokenSeparators={[',']}
                      placeholder="Type and press enter to add companies not like"
                      bordered={true}
                      dropdownStyle={{display: 'none'}}
                      suffixIcon={null}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <WifiOutlined />
                    <div className="w-[40%]">
                      {'Keywords/Signals'} <span className="text-red-500">*</span>
                    </div>
                    <Select 
                      mode="tags" // Set mode to tags
                      style={{ width: '100%' }}
                      value={keywords?.map(company => company?.name)}
                      // onChange={(value) => setKeywords(value.map((name, index) => ({ id: index, name })))}
                      onChange={(value) => handleTagChange(value, "icpKeywords")}
                      tokenSeparators={[',']}
                      placeholder="Type and press enter to add keywords/signals"
                      bordered={true}
                      dropdownStyle={{display: 'none'}}
                      suffixIcon={null}
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 w-[50%]"> {/*single box*/}
                <hr /> <hr /> <hr />
                <div> {/* Main Content */}
                  <div className="flex text-[18px] mt-2 items-center gap-2 justify-center">
                    <TeamOutlined />
                    <span>Persona Definition</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <ApartmentOutlined />
                    <div className="w-[40%]">
                    
                    Departments
                    </div>
                    <Select
                      id="departments"
                      // mode="multiple"
                      mode="tags"
                      style={{ width: '100%' }}
                      // value={selectedDepartmentOption}
                      // onChange={handleDepartmentChange}
                      // placeholder="Select Department"
                      placeholder="Type and press enter to add departments"
                      value={departments?.map(company => company?.name)}
                      // onChange={(value) => setDepartments(value.map((name, index) => ({ id: index, name })))}
                      onChange={(value) => handleTagChange(value, "deps")}
                      // options={sortedDepartmentOptions}
                      // popupClassName="custom-dropdown"
                      // popupMatchSelectWidth={false}
                      // className="search_select search_flex_cls"
                      // dropdownRender={(menu) => <div>{menu}</div>}
                      bordered
                      // style={{ border:"1px solid #E0E0E0", borderRadius: "8px", width: "100%", height: "30px" }}
                      // optionLabelProp="value"
                      // getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      // maxTagCount={2} // Set the maximum number of visible options
                      // maxTagPlaceholder={`+ ${selectedCountryOption.length - 2} more`}
                      dropdownStyle={{display: "none"}}
                      tokenSeparators={[',']}
                      suffixIcon={null}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                  <IdcardOutlined />
                  <div className="w-[40%]">
                    
                    {'Titles'}
                    </div>
                    <Select 
                      mode="tags" // Set mode to tags
                      style={{ width: '100%' }}
                      value={titles?.map(company => company?.name)}
                      // onChange={(value) => setTitles(value.map((name, index) => ({ id: index, name })))}
                      onChange={(value) => handleTagChange(value, "titles")}
                      tokenSeparators={[',']}
                      placeholder="Type and press enter to add titles"
                      bordered={true}
                      dropdownStyle={{display: "none"}}
                      suffixIcon={null}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <WifiOutlined />
                    <div className="w-[40%]">
                      {'Keywords/Signals'} <span className="text-red-500">*</span>
                    </div>
                    <Select 
                      mode="tags" // Set mode to tags
                      style={{ width: '100%' }}
                      value={keywordspersona?.map(company => company?.name)}
                      // onChange={(value) => setKeywordsPersona(value.map((name, index) => ({ id: index, name })))}
                      onChange={(value) => handleTagChange(value, "personaKeywords")}
                      tokenSeparators={[',']}
                      placeholder="Type and press enter to add keywords/signals"
                      bordered={true}
                      dropdownStyle={{display: "none"}}
                      suffixIcon={null}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <hr />
          {loading ? <></> : (
            <div className="flex justify-center mr-4 mt-2">
                <div 
                  className="w-[50%] flex items-center gap-2 justify-center border w-fit p-2 rounded-md bg-[#303730] text-white font-bold hover:bg-[#E07E67] hover:scale-110 duration-300 ease-in-out cursor-pointer"
                  onClick={handleSubmit}
                >
                  {`${editICP ? "Update" : "Submit"}`} your ICP / Persona Definitions
                </div>
            </div>
          )}
        </div>
        {oldICP?.length > 0 ? 
          <Title level={3} className="flex w-full justify-center items-center mt-8" >Saved ICPs</Title>
          :
          <></>
        }
        <SavedICP olderICPs={oldICP} actualICP={actualICP} onButtonClick={focusParent} />
        {/* <div className="flex justify-end mr-10 my-2">
            <div className="flex justify-center items-center gap-2 border py-0.5 px-4 rounded-full bg-[#7d7d7d] text-white hover:scale-110 duration-300 ease-in-out cursor-pointer">
              <PlusOutlined />
              <div className="text-base">Add an ICP Group or Tier</div>
            </div>
        </div> */}
        {/* <Table
              columns={icpColumns}
              // dataSource={data}
              pagination={false}
              className="ant-border-space"
            /> */}
      </div>
    </>
  )
};

export default DefineICP_AD;
