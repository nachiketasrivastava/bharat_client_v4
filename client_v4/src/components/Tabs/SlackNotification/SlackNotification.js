import React, { useState, useEffect } from "react";
import { Card } from "antd";
import slackLogo from "../../../assets/images/slackLogo.png";
import secureLocalStorage  from  "react-secure-storage";

import "./SlackNotification.css";

const SlackNotification = ({ connected, setConnected }) => {
  const handleClick = () => {
    setConnected(!connected);
  };
  useEffect(() => {
    secureLocalStorage.setItem("SlackConnected", connected);
  }, [connected]);
  return (
    <Card
      className={`hover:scale-110 transition ease-in-out delay-50 cursor-pointer ml-5 ${
        connected && "scale-110 bg-[#032D3E]"
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-center items-center gap-4">
        <img src={slackLogo} alt="slack-logo" width={30} />
        <div className={`text-base ${connected && "text-white"}`}>
          {!connected ? "Connect" : "Disconnect"}
          <span> Slack</span>
        </div>
      </div>
    </Card>
  );
};

export default SlackNotification;
