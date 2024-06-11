import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Main from "./components/layout/Main";
import SignUp from "./pages/Auth/Signup/SignUp"
import LogIn from "./pages/Auth/Login/Login";
import { GetUserStatus } from "./services/AuthServices";
import { jwtDecode } from "jwt-decode";
import { message } from "antd";
import ChatWindow from "./pages/ChatWindow/ChatWindow.js"
import AutoDiscover from "./pages/AutoDiscover/AutoDiscover.js";
import Projects from "./pages/Projects/Projects.js";
import Agents from "./pages/Agents/Agents.js";
import Integration from "./pages/Integration/Integration.js";
import { integrationStatus } from "./services/integrationServices.js";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import { integrationStatusAtom } from "./store/atoms/IntegrationAtoms.js";
import Settings from "./pages/Settings/Settings.js"
import { io } from "socket.io-client"
import Home from "./pages/Home/Home.js";
import { getTenant } from "./services/generateListService";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("loginToken"));
  const [redirectPath, setRedirectPath] = useState(null);
  const [connectedApps, setConnectedApps] = useRecoilState(integrationStatusAtom);
  const [socket, setSocket] = useState(null);
  const getUserStatus = async () => {
    if(isLoggedIn){
      let Login = await GetUserStatus({
        userid: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.id
      });

      if (Login.data.status === "failed") {
        localStorage.clear()
        message.error("It seems like there is some issue. Please re-login.")
        setTimeout(() => {
          navigate("/login");
        });
      }
    }
  };
  useEffect(() => {
    if (!isLoggedIn && (location.pathname != "/login" && location.pathname != "/sign-up" && !location.pathname.includes("verify-user") && !location.pathname.includes("reset-password"))) {
      setRedirectPath(location.pathname);
    }
    else if(isLoggedIn && location.pathname != "/login" && location.pathname != "/sign-up" && !location.pathname.includes("verify-user") && !location.pathname.includes("reset-password")){
      getUserStatus()
      getIntegrationStatus()
    }
    console.log(redirectPath, "redirectPath");
  }, [isLoggedIn, location.pathname]);
  const handleLogin = () => {
    navigate(redirectPath || "/chat");
  };
  //Socket code below 
  useEffect(() => {
    if(isLoggedIn){
      const userId = jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.id
      const newSocket = io(process.env.REACT_APP_BACKEND_URL); 
      newSocket.emit('joinRoom', userId);
      setSocket(newSocket);
      if(!localStorage.getItem('tenantid')){
        getTenantID()
      }
    }
  }, []);
  const getTenantID = async () => {
    const data = {
      tenant_name: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.organization_domain,
    };
    let response = await getTenant(data);
    if (response.status === 200) {
      localStorage.setItem("tenantid", response.data?.data.tenantid);
    }
  };
  useEffect(() => {
    if (socket) {
      // Listen for the 'message' event
      socket.on("message", (msg) => {
        // Handle the message (e.g., display a popup)
        message.success(msg);
      });
    
      // Clean up the event listener when the component unmounts
      return () => {
        socket.off("message");
      };
    }
  }, [socket]);
  const getIntegrationStatus = async () => {
    const data = {
      userid: jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).id,
    };
    let response = await integrationStatus(data);
    if (response.status == 200) {
       const connectedAppsWithoutSlack = response?.data?.data?.filter((app) => app !== 'Slack');
       setConnectedApps(connectedAppsWithoutSlack)
      }
      console.log(connectedApps, "ConnectedApps");
  };
  
  return (
      <div className={`App` } style={{ height: "100vh"  }}>
        <Routes>
          <Route path="/sign-up" element={<SignUp setIsLoggedIn={setIsLoggedIn} onLogin={handleLogin}/>} />
          <Route path="/login" element={<LogIn setIsLoggedIn={setIsLoggedIn} onLogin={handleLogin}/>} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-user/:verification_token/:user_id" name="verifyUser Page" element={<VerifyPassword />} />
          <Route path='/reset-password/:reset_code/:user_id' name='ResetPassword Page' element={<ResetPassword />} /> */}
          <Route path="/" element={isLoggedIn ? <Main setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />}>
            <Route path="/" element={<Navigate to={'/chat'} />} />
            <Route path="/chat" element={<ChatWindow />} />
            <Route path="/discover" element={<AutoDiscover />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/integration" element={<Integration />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </div>
  );
}
export default App;
