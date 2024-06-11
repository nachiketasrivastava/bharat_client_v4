/* eslint-disable no-undef */
import { useEffect, useState, useRef } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { Select, Avatar, Typography, Tooltip } from "antd";
import { LogoutOutlined, LineChartOutlined, RobotOutlined, CaretDownOutlined, PlayCircleOutlined, CodeSandboxOutlined, BookOutlined, ApiOutlined,CompassOutlined, QuestionCircleFilled, BlockOutlined, SettingOutlined, PoweroffOutlined, MessageOutlined, DashboardOutlined, TeamOutlined, CheckCircleOutlined, HomeOutlined } from "@ant-design/icons";
import { useLocation, Link, useNavigate } from "react-router-dom";
// import logoWOname from "../../assets/images/logoWOname.png";
// import gtmcopilotLogo from "../../assets/images/v2Logo.png";
import avatar8 from './../../../assets/images/user.png';
import { chatHistory } from "../../../services/chatServices";
import {jwtDecode} from 'jwt-decode';
import "./Sidenav.css"
import ChatHistory from "../../ChatHistory/ChatHistory";
import { integrationStatusAtom } from "../../../store/atoms/IntegrationAtoms";
import { initialPageAtom } from "../../../store/atoms/ProjectsAtoms";
import { initialAgentPageAtom } from "../../../store/atoms/AgentsAtoms";

const { Option } = Select;

function Sidenav({  darkMode, isPremium, setInitialCalled, setIsLoggedIn }) {
  const connectedApps = useRecoilValue(integrationStatusAtom);
  const numberofConnectedApps = connectedApps.length
  const [selectedWorkspace, setSelectedWorkspace] = useState('BU');
  const [ name, setName ] = useState('');
  const [workspace, setWorkspace] = useState('');
  const user = {id: "abvsdfdsdvdx"};
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const page = pathname?.replace("/", "");
  console.log("page " + page);
  const { Title } = Typography
  const [chatDropdownOpened, setchatDropdownOpened] = useState(false);
  const [builderDropdownOpened, setBuilderDropdownOpened] = useState(false);
  const [chatList, setChatList] = useState([]);
  const chatDropdownRef = useRef(null);
  const builderDropdownRef = useRef(null);
  const chatHistoryRef = useRef(null);
  const builderHistoryRef = useRef(null);

  const setInitialPage = useSetRecoilState(initialPageAtom)
  const setInitialAgentPage = useSetRecoilState(initialAgentPageAtom)

  const getChatHistory = async () => {
      let response = await chatHistory({
          user_id: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.id,
          session_id: null
      });

      if (response.data.status === "success") {
          // Sort the chatList based on created_date
          const sortedChatList = response.data.data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
          setChatList(sortedChatList);
      }
  };

  useEffect(() => {
      getChatHistory();
  }, []);
  
  const handleWorkspaceChange = value => {
    setSelectedWorkspace(value);
    if(value == 'CU'){
        window.location.href = "https://ada.gtmcopilot.com/demo";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
        console.log("chatDropdownRef", chatDropdownRef.current);
        console.log("builderDropdownRef", builderDropdownRef.current);
        console.log("chatHistoryRef", chatHistoryRef.current);
        console.log("builderHistoryRef", builderHistoryRef.current);
      
        if (
          chatDropdownRef.current &&
          !chatDropdownRef.current.contains(event.target) &&
          chatHistoryRef.current &&
          !chatHistoryRef.current.contains(event.target)
        ) {
          setchatDropdownOpened(false);
        }

        if (
            builderDropdownRef.current &&
            !builderDropdownRef.current.contains(event.target) &&
            builderHistoryRef.current &&
            !builderHistoryRef.current.contains(event.target)
          ) {
            setBuilderDropdownOpened(false);
          }
      };
      

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const token = localStorage.getItem('loginToken')
    let decodedToken
    token ? decodedToken = jwtDecode(token.replace(process.env.REACT_APP_TOKEN_PASSCODE, '')) : decodedToken = null
    if(decodedToken.organization_domain.includes('.')){
      setWorkspace(decodedToken.organization_domain.split('.')[0])
    }
    else{
      setWorkspace(decodedToken.organization_domain)
    }
  }, [])
  useEffect(() => {
    const token = localStorage.getItem('loginToken')
    let decodedToken
    token ? decodedToken = jwtDecode(token.replace(process.env.REACT_APP_TOKEN_PASSCODE, '')) : decodedToken = null
    if(decodedToken.name.includes('|')){
      setName(decodedToken.name.split('|')[0])
    }
    else{
      setName(decodedToken.name)
    }
  }, [])

  const handleChatDropdownClick = () => {
    setchatDropdownOpened(!chatDropdownOpened)
  };
  const handleBuilderDropdownClick = () => {
    setBuilderDropdownOpened(!builderDropdownOpened)
  };
  const logOutClick = () => {
    localStorage.clear()
    navigate('/login')
  };

  return (
    <>      
        <div className="flex flex-col  justify-between h-full border-r border-solid border-slate-300 pr-2">
            <div>
                {/* <div className="brand flex justify-center h-[2.75rem] p-[0.5rem] item-center flex cursor-pointer" style={{fontSize: "16px"}}>
                    {workspace + "-workspace"}
                </div>
                <hr /> */}
                {/* <div className="brand flex justify-center h-[1.75rem] p-[0.25rem] item-center flex cursor-pointer" style={{fontSize: "14px", fontWeight: 600}}>
                    {workspace + "-workspace"}
                </div>
                <hr /> */}
                <div className="px-2 flex flex-col jsutify-center mt-[25%] mb-1 w-full">
                    <div className="flex justify-center">
                        <Avatar style={{height: "25px", width: "25px"}} 
                        src={localStorage.getItem('profile_url') ? localStorage.getItem('profile_url').toString() : avatar8}
                        ></Avatar>          
                    </div>
                    <div className="flex justify-center">
                    <Title level={5} style={{ marginBottom: "0", color: "gray", fontSize: "14px" }}>
                        {name}
                    </Title>
                    </div>
                </div>
                {/* The below code is side menu and side chat which is commented out until next release */}
                {/* <div className="flex mb-3 justify-center gap-1" >
                    <div
                        className="border px-2 py-1 rounded bg-[whitesmoke] text-black cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out"
                        style={{borderRadius: "30px", width: "45%", display: "flex", justifyContent: "space-around", fontWeight: "500", fontSize: "12px"}}
                        // onClick={handleNewChat}
                    >
                    <span className="new-chat-label">Side Menu</span>
                    </div>
                    <div
                        className="border px-2 py-1 rounded bg-[whitesmoke] text-black cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out"
                        style={{borderRadius: "30px", width: "45%", display: "flex", justifyContent: "space-around", fontWeight: "500", fontSize: "12px"}}
                        // onClick={handleNewChat}
                    >
                    <span className="new-chat-label">Side Chat</span>
                    </div>
                </div> */}
                <div className="flex justify-start">
                    <div
                        className="px-4 py-2 text-grey cursor-pointer w-full hover:bg-gray-200 transition duration-300 ease-in-out mb-2"
                        style={{borderRadius: "5px", display: "flex",alignItems: "center", gap: 8 , fontWeight: "600"}}
                        // onClick={handleNewChat}
                    >
                    <TeamOutlined className="pt-0.5" style={{fontSize: "15px"}} /> 
                    <Select
                        defaultValue="GTMC Demo"
                        value={selectedWorkspace}
                        onChange={handleWorkspaceChange}
                        style={{ width: 200, fontWeight: 500, border: '0px', borderBottom: '1px solid #d9d9d9', borderRadius: 0, textAlign: "center" }}
                        dropdownStyle={{ border: 'none', borderBottom: '1px solid #d9d9d9', borderRadius: 0 }}
                        >
                        <Option value="CU">CU</Option>
                        <Option value="BU">BU</Option>
                        {/* <Option value="GTMC Demo">GTMC Demo</Option>
                        <Option value="GTMC Admin">GTMC Admin</Option>
                        <Option value="GTMC Poweruser">GTMC Poweruser</Option> */}
                    </Select>
                    </div>
                </div>
                    <div className={`flex justify-start mx-[10px]`}>
                      <div
                          className={`${pathname.includes('home') ? "selectedMenu" : "hover:bg-gray-200"} px-4 py-2 text-grey cursor-pointer w-full  transition duration-300 ease-in-out`}
                          style={{borderRadius: "5px", display: "flex",alignItems: "center", gap: 4 , fontWeight: "600"}} onClick={() => navigate('/home')}
                      >
                      <HomeOutlined className="" style={{fontSize: "14px"}} />  
                      <span className="new-chat-label" style={{fontSize: "14px"}}>Home</span>
                      </div>
                  </div>
                <div className={`flex justify-start mx-[10px]`} ref={chatDropdownRef}>
                      <div
                          className={`${pathname.includes('chat') ? "selectedMenu" : "hover:bg-gray-200"} px-4 py-2 text-grey cursor-pointer w-full  transition duration-300 ease-in-out`}
                          style={{borderRadius: "5px", display: "flex",alignItems: "center", gap: 4 , fontWeight: "600"}} onClick={() => navigate('/chat')}
                      >
                      <div className="w-[90%] flex gap-1">  
                        <MessageOutlined className="pt-0.5" style={{fontSize: "15px"}}/>
                        <span className="new-chat-label" style={{fontSize: "14px"}}>CoPilot</span>
                      </div>  
                      <div className="w-[10%]">
                      <CaretDownOutlined className="pt-0.5" style={{fontSize: "12px"}} onClick={handleChatDropdownClick}/>
                      </div>
                      </div>
                  </div>
                  {chatDropdownOpened && (
                        <div
                        className="absolute left-0 z-10 bg-white shadow-md"
                        style={{ width: "80%",
                            marginTop: "1%",
                            border: "1px black solid",
                            marginLeft: "30%" }}
                            ref={chatHistoryRef}
                        >
                        <ChatHistory chatList={chatList} />
                        </div>
                    )}
                  {/* <div className={`flex justify-start mx-[10px]`}>
                      <div
                          className={`${pathname.includes('discover') ? "selectedMenu" : "hover:bg-gray-200"} px-4 py-2 text-grey cursor-pointer w-full  transition duration-300 ease-in-out`}
                          style={{borderRadius: "5px", display: "flex",alignItems: "center", gap: 4 , fontWeight: "600"}} onClick={() => navigate('/discover')}
                      // onClick={handleNewChat}
                      >
                      <CompassOutlined className="pt-0.5" style={{fontSize: "15px"}} />  
                      <span className="new-chat-label" style={{fontSize: "14px"}}>ICP</span>
                      </div>
                  </div> */}
                  <div className={`flex justify-start mx-[10px]`} ref={builderDropdownRef}>
                      <div
                          className={`${(pathname.includes('projects') || pathname.includes("agents")) ? "selectedMenu" : "hover:bg-gray-200"} px-4 py-2 text-grey cursor-pointer w-full  transition duration-300 ease-in-out`}
                          style={{borderRadius: "5px", display: "flex",alignItems: "center", gap: 4 , fontWeight: "600"}} 
                          onClick={() => { navigate('/agents'); setInitialAgentPage(true) }}
                      >
                      <div className="w-[90%] flex gap-1">  
                        <RobotOutlined className="pt-0.5" style={{fontSize: "15px"}}/>
                        <span className="new-chat-label" style={{fontSize: "14px"}}>Agents</span>
                      </div>  
                      {/* <div className="w-[10%]">
                      <CaretDownOutlined className="pt-0.5" style={{fontSize: "12px"}} onClick={handleBuilderDropdownClick}/>
                      </div> */}
                      </div>
                  </div>
                  {builderDropdownOpened && (
                        <div
                        className="absolute left-0 z-10 bg-white shadow-md p-2 flex flex-col gap-4 text-center"
                        style={{ width: "80%",
                            marginTop: "1%",
                            border: "1px black solid",
                            marginLeft: "30%" }}
                            ref={builderHistoryRef}
                        >
                        <div className={`${pathname.includes("projects") ? 'bg-[#E07E65]' : 'hover:bg-gray-200'} font-semibold rounded-md p-2 cursor-pointer`} onClick={() => navigate("/projects")}>Projects</div>
                        <div className={`${pathname.includes("agents") ? 'bg-[#E07E65]' : 'hover:bg-gray-200'} font-semibold rounded-md p-2 cursor-pointer`} onClick={() => navigate("/agents")}>Agents</div>
                        </div>
                    )}
                    <div className={`flex justify-start mx-[10px]`}>
                      <div
                          className={`${pathname.includes('abcd') ? "selectedMenu" : "hover:bg-gray-200"} px-4 py-2 text-grey cursor-disable w-full  transition duration-300 ease-in-out`}
                          style={{borderRadius: "5px", display: "flex",alignItems: "center", gap: 4 , fontWeight: "600"}} 
                      // onClick={handleNewChat}
                      >
                      <PlayCircleOutlined className="pt-0.5" style={{fontSize: "15px"}} />  
                      <span className="new-chat-label" style={{fontSize: "14px"}}>Live</span>
                      </div>
                  </div>
                  <div className={`flex justify-start mx-[10px]`}>
                      <div
                          className={`${pathname.includes('abcd') ? "selectedMenu" : "hover:bg-gray-200"} px-4 py-2 text-grey cursor-disable w-full  transition duration-300 ease-in-out`}
                          style={{borderRadius: "5px", display: "flex",alignItems: "center", gap: 4 , fontWeight: "600"}} 
                      // onClick={handleNewChat}
                      >
                      <BookOutlined className="pt-0.5" style={{fontSize: "15px"}} />  
                      <span className="new-chat-label" style={{fontSize: "14px"}}>Catalog</span>
                      </div>
                  </div>
                  <div className={`flex justify-start mx-[10px]`} >
                      <div
                          className={`${pathname.includes('abcd') ? "selectedMenu" : "hover:bg-gray-200"} px-4 py-2 text-grey cursor-disable w-full  transition duration-300 ease-in-out`}
                          style={{borderRadius: "5px", display: "flex",alignItems: "center", gap: 4 , fontWeight: "600"}}
                      >
                      <div className="w-[90%] flex gap-1">  
                        <CodeSandboxOutlined className="pt-0.5" style={{fontSize: "15px"}}/>
                        <span className="new-chat-label" style={{fontSize: "14px"}}>Projects</span>
                      </div>  
                      <div className="w-[10%]">
                      <CaretDownOutlined className="pt-0.5" style={{fontSize: "12px"}}/>
                      </div>
                      </div>
                  </div>
                  <div className={`flex justify-start mx-[10px]`} >
                      <div
                          className={`${pathname.includes('abcd') ? "selectedMenu" : "hover:bg-gray-200"} px-4 py-2 text-grey cursor-disable w-full  transition duration-300 ease-in-out`}
                          style={{borderRadius: "5px", display: "flex",alignItems: "center", gap: 4 , fontWeight: "600"}} >
                      <div className="w-[90%] flex gap-1">  
                        <LineChartOutlined className="pt-0.5" style={{fontSize: "15px"}}/>
                        <span className="new-chat-label" style={{fontSize: "14px"}}>Analytics</span>
                      </div>  
                      <div className="w-[10%]">
                      <CaretDownOutlined className="pt-0.5" style={{fontSize: "12px"}}/>
                      </div>
                      </div>
                  </div>
                  {/* <div className={`flex justify-start mx-[10px]`}>
                      <div
                          className={`${pathname.includes('assessment') ? "selectedMenu" : "hover:bg-gray-200"} px-4 py-2 text-grey cursor-pointer w-full  transition duration-300 ease-in-out`}
                          style={{borderRadius: "5px", display: "flex",alignItems: "center", gap: 4 , fontWeight: "600"}}
                      // onClick={handleNewChat}
                      >
                      <DashboardOutlined className="pt-0.5" style={{fontSize: "15px"}} />  
                      <span className="new-chat-label" style={{fontSize: "14px"}}>Analytics</span>
                      </div>
                  </div>
                  <div className={`flex justify-start mx-[10px]`}>
                      <div
                          className={`${pathname.includes('assessment') ? "selectedMenu" : "hover:bg-gray-200"} px-4 py-2 text-grey cursor-pointer w-full  transition duration-300 ease-in-out`}
                          style={{borderRadius: "5px", display: "flex",alignItems: "center", gap: 4 , fontWeight: "600"}}
                      // onClick={handleNewChat}
                      >
                      <BlockOutlined className="pt-0.5" style={{fontSize: "15px"}} />  
                      <span className="new-chat-label" style={{fontSize: "14px"}}>Segments</span>
                      </div>
                  </div>
                  <div className={`flex justify-start mx-[10px]`}>
                      <div
                          className={`${pathname.includes('assessment') ? "selectedMenu" : "hover:bg-gray-200"} px-4 py-2 text-grey cursor-pointer w-full  transition duration-300 ease-in-out`}
                          style={{borderRadius: "5px", display: "flex",alignItems: "center", gap: 4 , fontWeight: "600"}}
                      // onClick={handleNewChat}
                      >
                      <TeamOutlined  className="pt-0.5" style={{fontSize: "15px"}} />  
                      <span className="new-chat-label" style={{fontSize: "14px"}}>Alerts</span>
                      </div>
                  </div>
                  <div className={`flex justify-start mx-[10px]`}>
                      <div
                          className={`${pathname.includes('assessment') ? "selectedMenu" : "hover:bg-gray-200"} px-4 py-2 text-grey cursor-pointer w-full  transition duration-300 ease-in-out`}
                          style={{borderRadius: "5px", display: "flex",alignItems: "center", gap: 4 , fontWeight: "600"}}
                      // onClick={handleNewChat}
                      >
                      <BlockOutlined className="pt-0.5" style={{fontSize: "15px"}} />  
                      <span className="new-chat-label" style={{fontSize: "14px"}}>Live</span>
                      </div>
                  </div> */}
            </div>
            <div className="text-center">
                <>
                <hr />
                <div className={`flex justify-start mx-[10px]`}>
                      <div
                          className={`${pathname.includes('assessment') ? "selectedMenu" : "hover:bg-gray-200"} px-4 py-2 text-grey cursor-pointer w-full  transition duration-300 ease-in-out`}
                          style={{borderRadius: "5px", display: "flex",alignItems: "center", gap: 4 , fontWeight: "600"}}
                      // onClick={handleNewChat}
                      >
                      <ApiOutlined className="pt-0.5" style={{fontSize: "15px"}} />  
                      <span className="new-chat-label" style={{fontSize: "12px"}}>Connect your Map</span>
                      </div>
                </div>
                <hr />
                <div className={`flex justify-start mx-[10px]`}>
                      <div
                          className={`${pathname.includes('assessment') ? "selectedMenu" : "hover:bg-gray-200"} px-4 py-2 text-grey cursor-pointer w-full  transition duration-300 ease-in-out`}
                          style={{borderRadius: "5px", display: "flex",alignItems: "center", gap: 4 , fontWeight: "600"}}
                      // onClick={handleNewChat}
                      >
                      {/* <BlockOutlined className="pt-0.5" style={{fontSize: "15px"}} />   */}
                      <span className="new-chat-label" style={{fontSize: "12px"}}>Your free trial is in progress</span>
                      </div>
                </div>
                <hr />
                <div onClick={() => navigate('/integration')} className={`flex justify-start mx-[10px]`}>
                    <div
                        className={`${pathname.includes('assessment') ? "selectedMenu" : "hover:bg-gray-200"} px-4 py-2 text-grey cursor-pointer w-full  transition duration-300 ease-in-out`}
                        style={{borderRadius: "5px", display: "flex", alignItems: "center", gap: 4 , fontWeight: "600"}}
                        // onClick={handleNewChat}
                    >
                        <div className="green-circle"></div>
                        <span className="new-chat-label" style={{fontSize: "12px"}}>Integrations</span>
                        <Tooltip title={connectedApps.join(', ')}>
                            <span className="new-chat-label" style={{fontSize: "11px", color: "grey"}}>{numberofConnectedApps} Connected</span>
                        </Tooltip>
                    </div>
                </div>

                <hr />
                <div className="flex h-[2rem] gap-2" style={{alignItems: "center", justifyContent:"space-around"}}>
                    <Tooltip title="Settings">
                        <SettingOutlined onClick={() => navigate('/settings')} className="pt-0.5 cursor-pointer " style={{fontSize: "20px"}} /> 
                    </Tooltip>
                    <Tooltip title="Help">
                        <QuestionCircleFilled className="pt-0.5 cursor-pointer" style={{fontSize: "20px"}}/> 
                    </Tooltip>
                    <Tooltip title="Log Out">
                        <PoweroffOutlined onClick={logOutClick} className="pt-0.5 cursor-pointer" style={{fontSize: "20px"}}/>
                    </Tooltip>
                </div>
                </>
            </div>
        </div>
    </>
  );
}

export default Sidenav;
