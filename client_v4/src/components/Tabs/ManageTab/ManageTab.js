import React, { useEffect, useState } from "react";

import { PlanUpdate } from "../../../../src/services/Settings";

import "./ManageTab.css";
import diamond from "../../../assets/images/diamond.svg";
import { jwtDecode } from "jwt-decode";
import {Select, message} from "antd";
import constants from "../../../helpers/Constants";

const ManageTab = ({ GetUserSetting }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleOptionChange = (event) => {
    setSelectedOption(event);
    setButtonDisabled(false);
  };

  const handleButtonClick = async (event) => {
    event.preventDefault();

    let response = await PlanUpdate({
      plan: selectedOption,
      userID: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.id,
    });
    if (response.data.status == "success") {
      console.log(response.data);
      message.success("Plan updated successfully");
      setButtonDisabled(true);
      console.log(selectedOption);
    }
  };

  useEffect(() => {
    (async () => {
        let response = await GetUserSetting({
            userID: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.id,
        });
        if(response){
            console.log(response.data.data[0])
            setSelectedOption(response.data.data[0].plan);
        }
    })();
  }, [])

  return (
    <div className="plan-container">
      <label htmlFor="field2" className="plan-label flex">
        <img
          src={diamond}
          alt="briefcase"
          style={{ paddingBottom: "5px", marginRight: "5px" }}
        />{" "}
        Current Plan
      </label>
      <Select
        type="text"
        id="field2"
        className="plan-select"
        value={selectedOption}
        defaultValue={selectedOption}
        onChange={handleOptionChange}
        options={constants.planOptions}
      >
      </Select>
      <div className="plan-btn">
        <button onClick={handleButtonClick} disabled={buttonDisabled}>
          Request Plan Upgrade
        </button>
      </div>
    </div>
  );
};

export default ManageTab;
