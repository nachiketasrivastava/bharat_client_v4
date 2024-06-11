import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// import "./Header.css";
import { message, Col, Typography, Dropdown, Avatar, Menu, Divider, Switch, Button } from "antd";
import {
  RobotOutlined,
  ApiOutlined,
  CompassOutlined,
  SettingOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useRecoilState } from "recoil";
import avatar8 from './../../../assets/images/no_profile.png';
import logoWOname from './../../../assets/images/logoWOname.png'
import {jwtDecode} from "jwt-decode";
import { useHistory, useNavigate } from "react-router-dom";
import gtmLogo from './../../../assets/images/gtmCopilotname.png';
import { readLogo } from "../../../services/Settings";
import { tenantLogoAtom } from "../../../store/atoms/MainAtoms";

function Header() {
  const { Title } = Typography;
  const [pageTitle, setPageTitle] = useState("");
  const [pageIcon, setPageIcon] = useState(null);
  const { pathname } = useLocation();
  const [tenantLogo, setTenenatLogo] = useRecoilState(tenantLogoAtom);
  const [workspace, setWorkspace] = useState('');


  // const history = useHistory();
  const navigate = useNavigate();
  const getLogo = async () => {
    try {
      const domain = jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).organization_domain
      if (!domain) {
          message.error("Please provide an organization domain.")
        return;
      }
      const response = await readLogo({ organizationDomain: domain });
      if(response.data.imageData){
        localStorage.setItem('logoData', response.data.imageData)
        setTenenatLogo(response.data.imageData)
        console.log(tenantLogo, "tenantLogo")
      }
      
      if (!response.data.imageData) {
        throw new Error("Image data not provided in the response.");
      }
      return response.data;
    } catch (error) {
      console.error("Error reading image:", error);
      return null; // Return null in case of error.
    }
  };
  useEffect(() => {
      getLogo()
  }, [])
  useEffect(() => {
    let title = "";
    let icon = null;

    if (pathname === "/chat") {
      title = "Co-Pilot";
      icon = <MessageOutlined style={{fontSize: "16px"}}/>;
    } else if (pathname === "/discover") {
      title = "ICP";
      icon = <CompassOutlined style={{fontSize: "16px"}}/>;
    } else if (pathname === "/agents") {
      title = "Agent Builder";
      icon = <RobotOutlined style={{fontSize: "16px"}}/>;
    } else if (pathname === "/settings") {
      title = "Settings";
      icon = <SettingOutlined />;
    } else if (pathname === "/integration") {
      title = "Integrations";
      icon = <ApiOutlined style={{fontSize: "16px"}}/>;
    }

    setPageTitle(title);
    setPageIcon(icon);
  }, [pathname]);
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
  return (
    <>
      <div className="h-full flex">
        <div className="flex gap-2 justify-start items-center w-[225px] h-full">
        {/* { tenantLogo != null && <img
                alt="tenant_logo"
                src={`data:image/png;base64, ${tenantLogo}`}
                className= "h-[100%] w-[15%]"
              /> } */}
          <div className="brand flex justify-center p-[1.25rem] item-center flex cursor-pointer" style={{fontSize: "14px", fontWeight: 600}}>
              {workspace + "-workspace"}
          </div>
        </div>
        <div className="flex w-[85%] gap-2 items-center h-full" style={{ justifyContent: "space-between" }}>
          <div className="flex ml-4 justify-center gap-1">
            {pageIcon}
            <h4 className="text-[16px] font-[600]">{pageTitle}</h4>
          </div>
          <img src={gtmLogo} alt="logo" className="h-[100%]" />
        </div>
      </div>
    </>
  );
}

export default Header;
