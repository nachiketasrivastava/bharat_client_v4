import React, { useEffect, useState } from "react";

import "./UserTab.css";
import briefcase from "../../../assets/images/briefcase.svg";
import mail from "../../../assets/images/mail.svg";
import lock from "../../../assets/images/lock.svg";

import { UserUpdate } from "../../../../src/services/Settings";
import { jwtDecode } from "jwt-decode";
import { Tooltip, Input, message, Switch } from "antd";

const UserTab = ({ GetUserSetting }) => {
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [Firstname, setFirstname] = useState('');
  const [Lastname, setLastname] = useState('');
  const [Role, setRole] = useState('');
  const [Password, setPassword] = useState("Non SSO Password");
  const [Email, setEmail] = useState('');
  const [FirstnameChange, setFirstnameChange] = useState(false);
  const [LastnameChange, setLastnameChange] = useState(false);
  const [RoleChange, setRoleChange] = useState(false);
  const [EmailChange, setEmailChange] = useState(false);
  const [PasswordChange, setPasswordChange] = useState(false);
  const [googleID, setGoogleID] = useState('');
  const OnlyAlphabet = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;

  const updateUser = async (data) => {
    console.table(data);

    let response = await UserUpdate(data);
    if (response) {
      console.log(response.data);
      var successMsg;
      if (FirstnameChange) {
        successMsg = "First Name ";
      }

      if (LastnameChange) {
        successMsg = "Last Name ";
      }

      if (RoleChange) {
        successMsg = "Role ";
      }

      if (EmailChange) {
        successMsg = "Email ";
      }

      if (FirstnameChange && LastnameChange) {
        successMsg = "First Name and Last Name ";
      }

      if (FirstnameChange && EmailChange) {
        successMsg = "First Name and Email ";
      }

      if (LastnameChange && EmailChange) {
        successMsg = "Last Name and Email ";
      }

      if (FirstnameChange && LastnameChange && RoleChange) {
        successMsg = "First Name, Last Name and Role ";
      }

      if (FirstnameChange && LastnameChange && EmailChange) {
        successMsg = "First Name, Last Name and Email ";
      }

      if (RoleChange && LastnameChange && EmailChange) {
        successMsg = "Last Name, Role and Email ";
      }

      if (FirstnameChange && LastnameChange && Role && EmailChange) {
        successMsg = "First Name, Last Name, Role and Email ";
      }

      message.success(successMsg + "updated successfully");

      setButtonDisabled(true);
      setFirstnameChange(false);
      setLastnameChange(false);
      setRoleChange(false);
      setEmailChange(false);
    }
  };

  const validate = (e) => {
    e.preventDefault();
    setButtonDisabled(true);

    if (Firstname == "" && Lastname == "" && Role == "") {
      message.error("First Name, Last Name and Role should not be empty");
    } else if (
      !OnlyAlphabet.test(Firstname) &&
      !OnlyAlphabet.test(Lastname) &&
      !OnlyAlphabet.test(Role)
    ) {
        message.error("First Name, Last Name and Role should only contain alphabets")
    } else if (Firstname == "" && Lastname == "") {
        message.error("First Name and Last Name should not be empty")
    } else if (!OnlyAlphabet.test(Firstname) && !OnlyAlphabet.test(Lastname)) {
        message.error("First Name and Last Name should only contain alphabets")
    } else if (Lastname == "" && Role == "") {
        message.error("Last Name and Role should not be empty")
    } else if (!OnlyAlphabet.test(Lastname) && !OnlyAlphabet.test(Role)) {
        message.error("Last Name and Role should only contain alphabets")
    } else if (Firstname == "" && Role == "") {
        message.error("First Name and Role should not be empty")
    } else if (!OnlyAlphabet.test(Firstname) && !OnlyAlphabet.test(Role)) {
        message.error("First Name and Role should only contain alphabets")
    } else if (Firstname == "") {
        message.error("First Name should not be empty")
    } else if (!OnlyAlphabet.test(Firstname)) {
        message.error("First Name should only contain alphabets")
    } else if (Lastname == "") {
        message.error("Last Name should not be empty")
    } else if (!OnlyAlphabet.test(Lastname)) {
        message.error("Last Name should only contain alphabets")
    } else if (Role == "") {
        message.error("Role should not be empty")
    } else if (!OnlyAlphabet.test(Role)) {
        message.error("Role should only contain alphabets")
    } else if (Email == "") {
        message.error("Email should not be empty")
    } else {
      const data = {
        name: Firstname + "|" + Lastname,
        role: Role,
        email: Email,
        userID: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.id,
      };
      updateUser(data);
    }
  };

  useEffect(() => {
    (async () => {
        let response = await GetUserSetting({
            userID: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.id,
        });
        if(response){
            if(response.data.data[0].name.includes('|')){
                setFirstname(response.data.data[0].name.split('|')[0]);
                setLastname(response.data.data[0].name.split('|')[1]);
            } else {
                setFirstname(response.data.data[0].name);
            }

            setRole(response.data.data[0].role);
            setEmail(response.data.data[0].email);
            setGoogleID(response.data.data[0].google_id);
        }
    })();
  }, [])

  const handlePasswordChange = (event) => {
    event.preventDefault();
    message.success("Password updated successfully")
  };

  // const inputField = (
  //   <Input
  //     type="password"
  //     id="password"
  //     className={`user-input ${google_id ? 'disabled' : ''}`}
  //     disabled={google_id}
  //     value={google_id ? 'SSO Password' : Password}
  //     onChange={(e) => {
  //       setPassword(e.target.value);
  //       setPasswordChange(true);
  //     }}
  //   />
  // );

  return (
    <>
      <div className="user-row">
        <div className="user-name">
          <label htmlFor="first-name" className="user-label">
            First Name
          </label>
          <input
            type="text"
            id="first-name"
            value={Firstname}
            className="user-input"
            onChange={(e) => {
              setButtonDisabled(false);
              setFirstname(e.target.value);
              setFirstnameChange(true);
            }}
          />
        </div>
        <div className="user-name">
          <label htmlFor="last-name" className="user-label">
            Last Name
          </label>
          <input
            type="text"
            id="last-name"
            value={Lastname}
            className="user-input"
            onChange={(e) => {
              setButtonDisabled(false);
              setLastname(e.target.value);
              setLastnameChange(true);
            }}
          />
        </div>
      </div>
      <div className="user-column">
        <label htmlFor="field2" className="user-label flex">
          <img
            src={briefcase}
            alt="briefcase"
            style={{ paddingBottom: "5px", marginRight: "5px" }}
          />{" "}
          Role
        </label>
        <input
          type="text"
          id="field2"
          value={Role}
          className="user-input"
          onChange={(e) => {
            setButtonDisabled(false);
            setRole(e.target.value);
            setRoleChange(true);
          }}
        />
      </div>
      <div className="user-column">
        <label htmlFor="field3" className="user-label flex">
          <img
            src={mail}
            alt="mail"
            style={{ paddingBottom: "5px", marginRight: "5px" }}
          />{" "}
          Email
        </label>
        <input
          type="email"
          id="field3"
          className="user-input"
          disabled
          value={Email}
          onChange={(e) => {
            setButtonDisabled(false);
            setEmail(e.target.value);
            setEmailChange(true);
          }}
        />
      </div>
      <div className="password-container">
        <div className="password">
          <label htmlFor="password" className="user-label flex">
            <img
              src={lock}
              alt="password"
              style={{ paddingBottom: "5px", marginRight: "5px" }}
            />{" "}
            Password
          </label>
          <Tooltip
            title={googleID ? "You have logged in using Google SSO" : ""}
            placement="top"
          >
            <div className={googleID ? "disabled-input" : ""}>
              <input
                type="password"
                id="password"
                className="user-input"
                disabled={googleID ? true : false}
                value={googleID ? "SSO Password" : Password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordChange(true);
                }}
              />
            </div>
          </Tooltip>
          {/* <input 
            type='password' 
            id='password' 
            className={`user-input ${google_id ? 'disabled' : ''}`} 
            disabled={google_id}
            value={google_id ? 'SSO Password' : Password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordChange(true);
            }}  
          /> */}
        </div>
        <div
          className={`btn ${PasswordChange ? "" : "disabled"}`}
          disabled={buttonDisabled}
          onClick={handlePasswordChange}
        >
          Change Password
        </div>
      </div>
      <div className="user-btn">
        <button onClick={validate} disabled={buttonDisabled}>
          Update User Info
        </button>
      </div>
    </>
  );
};

export default UserTab;
