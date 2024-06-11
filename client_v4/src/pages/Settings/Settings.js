import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook

import './Settings.css';
import Workspace from '../../components/Tabs/WorkspaceTab/Workspace';
import OrganizationTab from '../../../src/components/Tabs/OrganizationTab/OrganizationTab';
import UserTab from '../../../src/components/Tabs/UserTab/UserTab';
import InviteTab from '../../../src/components/Tabs/InviteTab/InviteTab';
import ManageTab from '../../../src/components/Tabs/ManageTab/ManageTab';
import ChromeExtension from '../../components/Tabs/ChromeExtension/ChromeExtension';
import SlackNotification from '../../components/Tabs/SlackNotification/SlackNotification';

import { GetUserSetting } from '../../services/Settings';
import { jwtDecode } from 'jwt-decode';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import secureLocalStorage  from  "react-secure-storage";

const Settings = ({ setWorkToRev, darkMode }) => {
  const location = useLocation(); // useLocation hook to get the current pathname

  const user = jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))
  const storedConnected = secureLocalStorage.getItem('SlackConnected');
  const [connected, setConnected] = useState(storedConnected ? JSON.parse(storedConnected) : false);

  const tabs = [
    {id: 1, label: 'Organization Settings'},
    {id: 2, label: 'User Settings'},
    {id: 3, label: 'Invite Members'},
    {id: 4, label: 'Manage Plan'},
    {id: 5, label: ['Chrome Extension Settings', 'Destination']},
    {id: 6, label: ['Slack Notifications', 'Connect Your Slack Workspace To Get Notified About New Leads', 'Disconnect Your Slack Workspace To Stop Notifications']}
  ];

  const [activeTab, setActiveTab] = useState(1);
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  }

  // Check if pathname includes "bio-oracle"
  const showChromeExtensionTab = !location.pathname.includes("bio-oracle");

  return (
    <div className={`settings-container ${darkMode? "dark-theme" : ""}`}>
      <div className='tab-container'>
        <div className='settings-tab-container'>
          {tabs.map((tab) => {
            if (tab.id === 5 && !showChromeExtensionTab) {
              return null;
            }
            return (
              <div
                key={tab.id}
                className={`tabs ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)} 
              >
                {tab.id === 5 || tab.id === 6 ? tab.label[0] : tab.label}
              </div>
            );
          })}
        </div>
        {/* {activeTab === 0 && <Button icon={<PlusOutlined />} className='btn-create-work flex items-center'>Create Workspace</Button>} */}
      </div>

      <div className={`settings-header ${darkMode? "dark-theme" : ""}`}>
        {activeTab !== 0 && activeTab !== 5 && activeTab !== 6 && tabs.find((tab) => tab.id === activeTab).label}
        {activeTab === 5 && tabs.find((tab) => tab.id === 5).label[1]}
        {activeTab === 6 && (!connected ? tabs.find((tab) => tab.id === 6).label[1] : tabs.find((tab) => tab.id === 6).label[2])}
        {activeTab === 4 && 
          <>
            <span className='plan-credit-text'>(Remaining Credit: </span>
            <span className='plan-credit-text'>2 Credit</span>
            <span className='plan-credit-text'>)</span>
          </>
        }
      </div>
      
      <form className='settings-form'>
        {/* {activeTab === 0 && <Workspace setWorkToRev={setWorkToRev} />} */}
        {activeTab === 1 && <OrganizationTab GetUserSetting={GetUserSetting} />}
        {activeTab === 2 && <UserTab GetUserSetting={GetUserSetting} />}
        {activeTab === 3 && <InviteTab  />}
        {activeTab === 4 && <ManageTab GetUserSetting={GetUserSetting}/>}
        {activeTab === 5 && showChromeExtensionTab && <ChromeExtension />}
        {activeTab === 6 && <SlackNotification connected={connected} setConnected={setConnected} />}
      </form>

    </div>
  )
}

export default Settings;
