import React from "react";
import { Col, Row, Button, Form, Modal, Pagination, message } from "antd";
import { useNavigate } from 'react-router-dom'
import {
  InfoCircleOutlined,
  AuditOutlined,
  GlobalOutlined,
  ToolOutlined,
  DollarOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WifiOutlined,
  TeamOutlined,
  ApartmentOutlined,
  IdcardOutlined,
  PlusOutlined,
  DeleteFilled,
  EditFilled,
  ExclamationCircleFilled
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownLong, faXmark, faFileLines } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import employeeIcon from "../../assets/images/employeeIcon.png";
import { DeleteICP } from "../../services/ICPservices";
import { useSetRecoilState, useRecoilState } from "recoil";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom";

import IdealCustomerTagnav from '../BuildYourICP/IdealCustomerTagnav/IdealCustomerTagnav.js';
import IdealCustomerTag from "../BuildYourICP/IdealCustomerTag/IdealCustomerTag";

import { icpNameAtom, selectedIndustryOptionAtom, selectedCountryOptionAtom, selectedRevenueRangeAtom, selectedEmployeeRangeAtom, selectedTechnologyOptionAtom, companiesAtom, notCompaniesAtom, keywordsAtom, keywordspersonasAtom, titlesAtom, departmentsAtom, editICPAtom, isIdealCustomerTagnavVisibleAtom, isIdealCustomerTagVisibleAtom, currentPageAtom, isModalOpenAtom, rowDataInModalAtom, editICPIDAtom, editICPNameAtom } from "../../store/atoms/ICPAtoms.js";
import { initialAgentPageAtom, activatedICPAtom, customLeadAgentAtom } from "../../store/atoms/AgentsAtoms.js";

import constants from "../../helpers/Constants.js";

import './SavedICP.css';

const { confirm } = Modal

const SavedICP = ({ olderICPs, actualICP, onButtonClick }) => {
  const setInitialAgentPage = useSetRecoilState(initialAgentPageAtom);
  const setActivatedICP = useSetRecoilState(activatedICPAtom);
  const setCustomLeadAgent = useSetRecoilState(customLeadAgentAtom);

  const setIcpName = useSetRecoilState(icpNameAtom)
  const setSelectedIndustryOption = useSetRecoilState(selectedIndustryOptionAtom);
  const setSelectedCountryOption = useSetRecoilState(selectedCountryOptionAtom);
  const setSelectedRevenueRange = useSetRecoilState(selectedRevenueRangeAtom);
  const setSelectedEmployeeRange = useSetRecoilState(selectedEmployeeRangeAtom);
  const setSelectedTechnologyOption = useSetRecoilState(selectedTechnologyOptionAtom);
  const setCompanies = useSetRecoilState(companiesAtom);
  const setNotCompanies = useSetRecoilState(notCompaniesAtom);
  const setKeywords = useSetRecoilState(keywordsAtom);
  const setKeywordsPersona = useSetRecoilState(keywordspersonasAtom);
  const setTitles = useSetRecoilState(titlesAtom);
  const setDepartments = useSetRecoilState(departmentsAtom)
  const setEditICP = useSetRecoilState(editICPAtom)
  const setEditICPID = useSetRecoilState(editICPIDAtom)
  const setEditICPName = useSetRecoilState(editICPNameAtom)

  const userDetails = jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))

  const [isIdealCustomerTagnavVisible, setIsIdealCustomerTagnavVisible] = useRecoilState(isIdealCustomerTagnavVisibleAtom);
  const [isIdealCustomerTagVisible, setIsIdealCustomerTagVisible] = useRecoilState(isIdealCustomerTagVisibleAtom);
  const [currentPage, setCurrentPage] = useRecoilState(currentPageAtom);
  const [isModalOpen, setIsModalOpen] = useRecoilState(isModalOpenAtom);
  const [rowDataInModal, setRowDataInModal] = useRecoilState(rowDataInModalAtom);

  const navigate = useNavigate()

  const handleClick = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      window.location.href = window.location.href;
    }, 1000)
    // setData([]);
    // getIcpList();
  };

  const paginationChange = (page) => {
    setCurrentPage(page);
    if (page === 1) {
      setIsIdealCustomerTagnavVisible(false);
      setIsIdealCustomerTagVisible(true);
    }
    if (page === 2) {
      setIsIdealCustomerTagVisible(false);
      setIsIdealCustomerTagnavVisible(true);
    }
  };

  const handleConvertPDF = () => {
    let components;
    if(isIdealCustomerTagVisible && isModalOpen) components = [<IdealCustomerTag rowData={rowDataInModal} userDetails={userDetails}/>];
    else if(!isIdealCustomerTagVisible && isModalOpen) components = [<IdealCustomerTagnav rowData={rowDataInModal} setRowData={setRowDataInModal} userDetails={userDetails}/>];
    const download = (index) => {
      const tempElement = document.createElement("div");
      document.getElementById("iall")?.appendChild(tempElement);

      ReactDOM.render(components[index], tempElement, () => {
        html2canvas(tempElement, { scale: 10 }).then((canvas) => {
          const link = document.createElement("a");
          link.download = `ICP Certificate.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
          document.getElementById("iall").removeChild(tempElement);
          if (index + 1 < components.length) {
            download(index + 1);
          }
        });
      });
    };
    download(0);
  };
  const handleConvertPDFAll = () => {
    const components = [<IdealCustomerTag rowData={rowDataInModal} userDetails={userDetails}/>, <IdealCustomerTagnav rowData={rowDataInModal} setRowData={setRowDataInModal} userDetails={userDetails}/>];
    const download = (index) => {
      const tempElement = document.createElement("div");
      document.getElementById("idlall")?.appendChild(tempElement);

      ReactDOM.render(components[index], tempElement, () => {
        html2canvas(tempElement, { scale: 10 }).then((canvas) => {
          const link = document.createElement("a");
          link.download = `ICP Certificate-${index}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
          document.getElementById("idlall").removeChild(tempElement);
          if (index + 1 < components.length) {
            download(index + 1);
          }
        });
      });
    };
    download(0);
  };

  const showModal = (item) => {
    // if(localStorage.getItem("logoData")){
      console.log(item?.icpID)
      console.log(actualICP?.find(icp => icp?.id === item?.icpID));
      setIsModalOpen(true);
      setRowDataInModal(actualICP?.find(icp => icp?.id === item?.icpID));
    // }
    // else{
    //   message.error("Please upload your Organization Logo first in Settings Page.")
    // }
  };

  const handleSubmit = (item) => {
    console.log("ejhr");
    setIsModalOpen(true)
    showModal(item)
  };

  const handleICPDelete = async (icpID) => {
    console.log(icpID)
    let response = await DeleteICP(icpID);
    console.log(response)
    message.success("ICP Deleted Successfully")
    setTimeout(() => {
      window.location.href = window.location.href;
    }, 1500)
  }

  const handleICPEdit = (icp) => {
    console.log(icp)
    setIcpName(icp?.icpName)
    setSelectedIndustryOption(icp?.industry)
    setSelectedCountryOption(icp?.country)
    setSelectedRevenueRange(icp?.revRange?.filter(emp => emp?.trim() !== ""))
    setSelectedEmployeeRange(icp?.empRange?.filter(emp => emp?.trim() !== ""))
    setSelectedTechnologyOption(icp?.techno?.filter(emp => emp?.trim() !== ""))
    setCompanies(icp?.exComp?.filter(comp => comp?.trim() !== "")?.map((comp, id) => ({ id, name: comp?.trim() })))
    setNotCompanies(icp?.notComp?.filter(comp => comp?.trim() !== "")?.map((comp, id) => ({ id, name: comp?.trim() })))
    setKeywords(icp?.icpKeywords?.filter(comp => comp?.trim() !== "")?.map((comp, id) => ({ id, name: comp?.trim() })))
    setKeywordsPersona(icp?.personaKeywords?.filter(comp => comp?.trim() !== "")?.map((comp, id) => ({ id, name: comp?.trim() })))
    setTitles(icp?.titles?.filter(comp => comp?.trim() !== "")?.map((comp, id) => ({ id, name: comp?.trim() })))
    setDepartments(icp?.deps?.filter(comp => comp?.trim() !== "")?.map((comp, id) => ({ id, name: comp?.trim() })))
    setEditICPID(icp?.icpID)
    setEditICPName(icp?.icpName)
    setEditICP(true)
    onButtonClick()
  }

  const convertToDate = (dateStr) => {
    // Convert ISO 8601 date string to Date object
    const dateObj = new Date(dateStr);

    // Format the date in American style
    const formattedDate = dateObj.toLocaleString('en-US', {
      // weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      // hour: 'numeric',
      // minute: 'numeric',
      // second: 'numeric',
      // timeZoneName: 'short',
    });

    return formattedDate
  }

  const showDeleteConfirm = (icp) => {
    confirm({
      title: `Are you sure you want to delete '${icp?.icpName}'?`,
      icon: <ExclamationCircleFilled />,
      content: 'This is a permanent action and cannot be undone.',
      style: { top: '40%' },
      className: 'delete-confirm-modal',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('OK');
        handleICPDelete(icp?.icpID)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleActivate = (icpName) => {
    console.log(icpName)
    setInitialAgentPage(false)
    setActivatedICP(icpName)
    setCustomLeadAgent(false)
    navigate("/agents")
  }

  return (
    <div className="my-2">
      <Col className="flex items-center w-full" style={{height: '0'}}>
        <Form.Item>
          <div>
            <Modal
              title=""
              open={isModalOpen}
              onOk={handleClick}
              onCancel={handleClick}
              closable={false}
              footer={null}
              className="modal-page rounded-0 xl:max-w-8/12"
            >
              <Row className="py-4 px-3 justify-between items-end bg-[#E07E65] buildicp-responsive rounded-t-2xl max-sm:gap-4 ">
                <h1 className="text-3xl font-semibold text-white">
                  Ideal Customer
                </h1>
                <Col className="flex gap-4 items-center ">
                  <Button
                    className="text-black bg-white download-btn"
                    icon={<FontAwesomeIcon icon={faDownLong} />}
                    onClick={handleConvertPDFAll}
                  >
                    Download All
                  </Button>
                  <Button
                    className="text-black bg-white download-btn"
                    icon={<FontAwesomeIcon icon={faFileLines} />}
                    onClick={handleConvertPDF}
                  >
                    Download Page
                  </Button>
                  <Button
                    className="text-black modal-page-cancel-btn bg-white"
                    onClick={handleClick}
                    icon={<FontAwesomeIcon icon={faXmark} />}
                  ></Button>
                </Col>
              </Row>

              <div id="container">
                <div className="bg-zinc-100 pb-8  min-xl:px-40 pt-4 md:px-20 buildicp-responsive-modal">
                  <Row className="block bg-white md:ml-0 buildicp-responsive">
                    <div>
                      {isIdealCustomerTagVisible && rowDataInModal !== null && <IdealCustomerTag  rowData={rowDataInModal} userDetails={userDetails}/>}
                      {isIdealCustomerTagnavVisible && rowDataInModal !== null && (
                        <IdealCustomerTagnav rowData={rowDataInModal} setRowData={setRowDataInModal} userDetails={userDetails}/>
                      )}
                    </div>
                  </Row>
                  <div id="idlall"></div>
                  <div id="iall"></div>
                </div>
              </div>
              <Row className="justify-center items-center pb-8 xl:pb-4">
                <Pagination
                  className="pagination"
                  current={currentPage}
                  simple
                  defaultCurrent={1}
                  total={20}
                  onChange={paginationChange}
                />
              </Row>
            </Modal>
          </div>
        </Form.Item>
      </Col>
      {olderICPs?.map((icp, index) => (
        <div
          key={index}
          style={{
            border: "1px solid grey",
            padding: "5px",
            marginLeft: "20px",
            marginRight: "20px",
            marginTop: "2rem"
          }}
          className="rounded-md shadow-2xl relative"
        >
          <div className="mt-5 mb-1 flex flex-col justify-center items-center">
            <div className="self-end pr-4 flex gap-2 items-center">
              <div className="px-2 py-1 border rounded-md hover:scale-105 duration-300 ease-in-out hover:bg-[#E07E65] hover:border-[#E07E65] hover:text-white cursor-pointer" onClick={() => handleICPEdit(icp)}>
                <EditFilled />
              </div>
              <div className="px-2 py-1 border rounded-md hover:scale-105 duration-300 ease-in-out hover:bg-[#E07E65] hover:border-[#E07E65] hover:text-white cursor-pointer" onClick={() => showDeleteConfirm(icp)}>
                <DeleteFilled />
              </div>
            </div>
            <div
              className="w-[50%] text-center font-semibold text-base"
            >
              {icp?.icpName}
            </div>
            <div className="self-start text-[12px] pl-5">
              <div className="flex w-full gap-2 justify-between">
                <div>Created Date:</div> 
                <div>{convertToDate(icp?.createdDate)}</div>
              </div>
              <div className="flex w-full gap-2 justify-between">
                <div>Updated Date:</div> 
                <div>{convertToDate(icp?.updatedDate)}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-1">
            {" "}
            {/*header of box*/}
            <div className="p-4 w-[50%]">
              {" "}
              {/*single box*/}
              <hr /> <hr /> <hr />
              <div>
                {" "}
                {/* Main Content */}
                <div className="flex text-[18px] mt-2 items-center gap-2 justify-center">
                  <AuditOutlined />
                  <span>ICP Definition</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <GlobalOutlined />
                  <div className="w-[25%]">Country</div>
                  <div className={`w-full flex flex-wrap justify-start items-center gap-2 ${icp?.country?.length > 0 && "border border-gray-400 rounded-md px-2 py-1"}`}>
                    {icp?.country?.map((country, index) => (
                      <div key={index} className="bg-[#f0f0f0] rounded-md px-2">
                        {country}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 font-red">
                  <ToolOutlined />
                  <div className="w-[25%]">Industry</div>
                  <div className={`w-full flex flex-wrap justify-start items-center gap-2 ${icp?.industry?.length > 0 && "border border-gray-400 rounded-md px-2 py-1"}`}>
                    {icp?.industry?.map((country, index) => (
                      <div key={index} className="bg-[#f0f0f0] rounded-md px-2">
                        {country}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 font-red">
                  <img src={employeeIcon} alt="employeeIcon" width={14} />
                  <div className="w-[25%]">Employee Range</div>
                  <div className={`w-full flex flex-wrap justify-start items-center gap-2 ${icp?.empRange?.length > 0 && icp?.empRange?.filter(val => val?.trim() !== "")?.length > 0 && "border border-gray-400 rounded-md px-2 py-1"}`}>
                    {icp?.empRange?.map((country, index) => (
                      <div key={index} className="bg-[#f0f0f0] rounded-md px-2">
                        {constants.empMap[country]}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <DollarOutlined />
                  <div className="w-[25%]">{"Revenue Range"}</div>
                  <div className={`w-full flex flex-wrap justify-start items-center gap-2 ${icp?.revRange?.length > 0 && icp?.revRange?.filter(val => val?.trim() !== "")?.length > 0 && "border border-gray-400 rounded-md px-2 py-1"}`}>
                    {icp?.revRange?.map((country, index) => (
                      <div key={index} className="bg-[#f0f0f0] rounded-md px-2">
                        {country}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <AppstoreOutlined />
                  <div className="w-[25%]">{"Technographic"}</div>
                  <div className={`w-full flex flex-wrap justify-start items-center gap-2 ${icp?.techno?.length > 0 && icp?.techno?.filter(val => val?.trim() !== "")?.length > 0 && "border border-gray-400 rounded-md px-2 py-1"}`}>
                    {icp?.techno?.map((country, index) => (
                      <div key={index} className="bg-[#f0f0f0] rounded-md px-2">
                        {country}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircleOutlined />
                  <div className="w-[25%]">{"Ex. Companies"}</div>
                  <div className={`w-full flex flex-wrap justify-start items-center gap-2 ${icp?.exComp?.length > 0 && icp?.exComp?.filter(val => val?.trim() !== "")?.length > 0 && "border border-gray-400 rounded-md px-2 py-1"}`}>
                    {icp?.exComp?.map((country, index) => (
                      <div key={index} className="bg-[#f0f0f0] rounded-md px-2">
                        {country}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <ExclamationCircleOutlined />
                  <div className="w-[25%]">{"Not Companies"}</div>
                  <div className={`w-full flex flex-wrap justify-start items-center gap-2 ${icp?.notComp?.length > 0 && icp?.notComp?.filter(val => val?.trim() !== "")?.length > 0 && "border border-gray-400 rounded-md px-2 py-1"}`}>
                    {icp?.notComp?.map((country, index) => (
                      <div key={index} className="bg-[#f0f0f0] rounded-md px-2">
                        {country}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <WifiOutlined />
                  <div className="w-[25%]">{"Keywords/Signals"}</div>
                  <div className={`w-full flex flex-wrap justify-start items-center gap-2 ${icp?.icpKeywords?.length > 0 && icp?.icpKeywords?.filter(val => val?.trim() !== "")?.length > 0 && "border border-gray-400 rounded-md px-2 py-1"}`}>
                    {icp?.icpKeywords?.map((country, index) => (
                      <div key={index} className="bg-[#f0f0f0] rounded-md px-2">
                        {country}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 w-[50%]">
              {" "}
              {/*single box*/}
              <hr /> <hr /> <hr />
              <div>
                {" "}
                {/* Main Content */}
                <div className="flex text-[18px] mt-2 items-center gap-2 justify-center">
                  <TeamOutlined />
                  <span>Persona Definition</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <ApartmentOutlined />
                  <div className="w-[25%]">Departments</div>
                  <div className={`w-full flex flex-wrap justify-start items-center gap-2 ${icp?.deps?.length > 0 && icp?.deps?.filter(val => val?.trim() !== "")?.length > 0 && "border border-gray-400 rounded-md px-2 py-1"}`}>
                    {icp?.deps?.map((country, index) => (
                      <div key={index} className="bg-[#f0f0f0] rounded-md px-2">
                        {country}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <IdcardOutlined />
                  <div className="w-[25%]">{"Titles"}</div>
                  <div className={`w-full flex flex-wrap justify-start items-center gap-2 ${icp?.titles?.length > 0 && icp?.titles?.filter(val => val?.trim() !== "")?.length > 0 && "border border-gray-400 rounded-md px-2 py-1"}`}>
                    {icp?.titles?.map((country, index) => (
                      <div key={index} className="bg-[#f0f0f0] rounded-md px-2">
                        {country}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <WifiOutlined />
                  <div className="w-[25%]">{"Keywords/Signals"}</div>
                  <div className={`w-full flex flex-wrap justify-start items-center gap-2 ${icp?.personaKeywords?.length > 0 && icp?.personaKeywords?.filter(val => val?.trim() !== "")?.length > 0 && "border border-gray-400 rounded-md px-2 py-1"}`}>
                    {icp?.personaKeywords?.map((country, index) => (
                      country?.trim() !== "" && (
                        <div key={index} className="bg-[#f0f0f0] rounded-md px-2">
                          {country}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="flex justify-center mr-4 mt-2">
            <div
              className="w-[50%] flex items-center gap-2 justify-center border w-fit p-2 rounded-md bg-[#303730] text-white font-bold hover:bg-[#E07E67] hover:scale-110 duration-300 ease-in-out cursor-pointer"
              onClick={() => handleSubmit(icp)}
            >
              Download ICP / Persona Definitions
            </div>
          </div>
          <div className="flex right-0 bottom-1.5 absolute mr-4 mt-2">
            <div
              className="w-[50%] flex items-center gap-2 justify-center border w-fit p-2 rounded-md bg-[#303730] text-white font-bold hover:bg-[#E07E67] hover:scale-110 duration-300 ease-in-out cursor-pointer"
              onClick={() => handleActivate(icp?.icpName)}
            >
              Activate
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedICP;
