import { Row, Col, Modal, message } from "antd";
import { useState, useEffect } from "react";
import { SyncOutlined } from "@ant-design/icons";
import "./GridItem.css"
import { jwtDecode } from "jwt-decode";
import { getTenant } from "../../services/generateListService";
import { airbyteDisconnection, airbyteSync } from "../../services/airbyteServices"
import secureLocalStorage from "react-secure-storage";
import { deleteSlackIntegration } from "../../services/slackIntegrationService";
import { useLocation } from 'react-router-dom'
import { useRecoilValue } from "recoil";
import { integrationStatusAtom } from "../../store/atoms/IntegrationAtoms";
export const GridItem = ({ id, logo, name, description, redirect_uri, status }) => {
  const connectedApps = useRecoilValue(integrationStatusAtom)
  const location = useLocation();
  let { pathname } = location;
  pathname = pathname?.replaceAll("/integration", "")
  const [isModalOpen, setIsModalOpen] = useState(null);
  const userDetails = localStorage.getItem('user');
  const storedConnected = secureLocalStorage.getItem('SlackConnected');
  const [connected, setConnected] = useState(storedConnected ? JSON.parse(storedConnected) : false);
  const handleSlackDisconnect = async () => {
    const data = {
      userid: jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).id
    }
    let response = await deleteSlackIntegration(data);
    if (response.status == 200) {
      message.success("Slack disconnected successfully")
      setTimeout(() => {
        const reloadURL = window.location.href.split('?')
        window.location.href = reloadURL[0]
        window.location.reload()
      }, 500);
    }
  }
  const showModal = () => {
    if(name == "Salesforce" || name == "Hubspot" || name == "Salesloft" || name == "Outreach" || name=="Google Calendar"){
      if(!connectedApps.includes(name)){
        const uri = redirect_uri+'&path='+pathname
        window.location.href = uri
      } 
      else {
        disconnectAirbyte()
      }
    }
    else if (name === 'Slack') {
      if (connected) {
        // Disconnect Logic
        handleSlackDisconnect();
      } else {
        // Connect Logic
        const uri = redirect_uri+'&path='+pathname
        window.location.href = uri;
      }
      setConnected(!connected);
    }
    else{
      message.info("Please contact info@gtmcopilot.com")
    }

  };
  const disconnectAirbyte = async () => {
    const data = {
        user_id: jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).id,
        user_name: jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).name?.replace("|", " "),
        integration_name: name
    };
    let response = await airbyteDisconnection(data);
    // console.log(response);
    if (response.status == 200) {
      message.success(name+" disconnected successfully")
      setTimeout(() => {
        const reloadURL = window.location.href.split('?')
        window.location.href = reloadURL[0]
        window.location.reload()
      }, 500);
    }
  };
  const getTenantID = async () => {
    const data = {
      tenant_name: jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).organization_domain,
    };
    let response = await getTenant(data);
    // console.log(response);
    if (response.status == 200) {
      // settenant_id(response.data?.data.tenantid);
      localStorage.setItem('tenant_id', response.data?.data.tenantid)
      // console.log(response, "responseeeeeeee", tenant_id)
    }
  };
  const syncAirbyte = async () => {
    let slackToken = secureLocalStorage.getItem("SlackToken");
    if (!slackToken) {
      slackToken = "";
    }
    const data = {
        userid: jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).id,
        username: jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).name?.replace("|", " "),
        tenantname: jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).organization_name,
        tenantid: localStorage.getItem('tenant_id'),
        emailid: jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).email,
        source_name: name,
        slackToken: slackToken
    };
    let response = await airbyteSync(data);
    // console.log(response);
    if (response.status == 200) {
      message.success(name+" synced successfully")
    }
  };
  useEffect(() => {
    getTenantID();
  }, []);
  useEffect(() => {
    secureLocalStorage.setItem("SlackConnected", connected);
  }, [connected])

  return (
    <div className="grid-card">
        <div className="card-top">
          <img src={logo} alt="logo" className="integration-logo" />
          <h4>{name}</h4>
        </div>
        {((name === 'Slack' && !connected) || name !== 'Slack') ? <p>{description}</p> : <p>{'Disconnect Your Slack Workspace To Stop Getting Notified About New Leads'}</p>}
        {!connectedApps.includes(name) &&
          <button className="mt-4" onClick={showModal}>{name === 'Slack' && connected ? 'Disconnect' : status}</button>
        }
        <div className="connectedApps mt-2">
          {connectedApps.includes(name) && 
            <>
            <button className="sync-button" onClick={syncAirbyte}><SyncOutlined style={{fontSize: "1.1rem"}} /></button>
            <button onClick={showModal}>{'Disconnect'}</button>
            </>
          }
        </div>
    </div>
  );
};
