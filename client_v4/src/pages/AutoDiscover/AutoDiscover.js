import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import './AutoDiscover.css'
import logo from "../../assets/images/logoWOname.png";
import { jwtDecode } from "jwt-decode";
import { Button } from "antd";
import AutoDiscoverInitial from "../../components/AutoDiscoverComponents/AutoDiscoverInitial";
import DefineICP_AD from "../../components/AutoDiscoverComponents/DefineICP_AD";


const AutoDiscover = () => {
  const userinformation = jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))

  return (
    <div className="auto-discover-container">
        { false ? <AutoDiscoverInitial /> : <DefineICP_AD /> }
    </div>
  )
};

export default AutoDiscover;
