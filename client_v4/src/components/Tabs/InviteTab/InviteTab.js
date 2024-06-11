import React, { useState } from 'react';

import add from '../../../assets/images/user-add.svg';
import { message } from 'antd';

import './InviteTab.css';
import { InviteUser } from '../../../../src/services/Settings';
import { jwtDecode } from 'jwt-decode';
import CreatableSelect from 'react-select/creatable';

const InviteTab = ({ }) => {
  const [ EmailList, setEmailList ] = useState([]);
  const [ inputValue, setInputValue ] = useState('');

  const components = {
    DropdownIndicator: null,
  };

  const createOption = (label) => ({
    label,
    value: label
  });

  const handleKeyDown = (event) => {
    if (!inputValue)return;
    switch (event.key) {
    case 'Enter':
    case 'Tab':
    case ',':
        event.preventDefault();
        if(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm.test(inputValue) && emailDomainValidation(inputValue) && duplicateEmail(inputValue)){
            setEmailList((prev) => [...prev, createOption(inputValue)]);
            setInputValue('');
        }
    }
  };

  const emailDomainValidation = (email) => {
    if(email.split('@')[1].includes(jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.organization_domain) == false){
      message.error("Invite user in the same domain only");
    }
    return email.split('@')[1].includes(jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.organization_domain);
  };

  const duplicateEmail = (email) => {
    if(EmailList != null && EmailList != undefined && EmailList.length > 0){
        let isEmailPresent = true;
        EmailList.map( (mail) => {
            if(mail.value == email){
                isEmailPresent = false;
                setInputValue('');
            }
        })
        return isEmailPresent;
    } else {
        return true;
    }
  };

  const validate = (e) => {
    e.preventDefault();
    let mailList = EmailList.map(mail => mail.value).toString();
    UserInvite(mailList);
  }

  const UserInvite = async (mailList) => {
    // console.log(mailList);
    let response = await InviteUser({
        mailList: mailList,
        usermail: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.id,
        userName: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.name.replace('|', ' '),
        workspace: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.organization_domain,
        inviteURL: window.location.origin,
    })
    if(response?.data?.status == 'success'){
        console.log(response.data);
        message.success(response.data.data);
    } else {
        message.error(response.data.data);
    }
    setEmailList('');
    setInputValue('');
  }

  return (
    <div className='invite-container'>
      <label htmlFor="emailInput" className='invite-label flex'><img src={add} alt='add' style={{paddingBottom: '5px', marginRight: '5px'}}/>Invite Members</label>
      <div style={{marginTop: '15px' }}>
        <CreatableSelect
          className="creatableSelect"
          components={components}
          inputValue={inputValue}
          validate
          isClearable
          isMulti
          menuIsOpen={false}
          onChange={(newValue) => { setEmailList(newValue) }}
          onInputChange={(newValue) => {
              setInputValue(newValue)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Add emails separated by commas"
          value={EmailList}
        />
      </div>
      <div className='invite-btn'>
        <button type="button" onClick={validate} disabled={EmailList.length === 0}>
          Invite
        </button>
      </div>
    </div>
  );
};

export default InviteTab;