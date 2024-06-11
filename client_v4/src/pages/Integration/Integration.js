import { Grid } from "../../components/IntegrationComponents/Grid";
import {Header} from "../../components/IntegrationComponents/Header"
import "./Integration.css";
import React, { useRef, useEffect, useState } from "react";
import { Button, message } from "antd";
import { integrationStatus } from "../../services/integrationServices";
import { useLocation } from "react-router-dom";
import { addCalendarEvents } from "../../services/GoogleAPI";
import { getSlackToken } from "../../services/slackIntegrationService";
import { jwtDecode } from "jwt-decode";
import secureLocalStorage  from  "react-secure-storage";

const Integration = () => {
  const hasEffectRun = useRef(false);
  const userDetails = localStorage.getItem('user');
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const codeParam = queryParams.get("GCcode");
  const prevcodeParamRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (codeParam !== null && codeParam !== prevcodeParamRef.current) {
          prevcodeParamRef.current = codeParam;
          const accessToken = await obtainAccessToken(codeParam);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [codeParam, prevcodeParamRef]);
  const obtainAccessToken = async (decodedCode) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_secret: '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',
          redirect_uri: "https://app.gtmcopilot.com/api_v3/gCalendarRedirectPre",
          code: decodedCode,
          client_id: '493279028413-iljm3o2ifij9cal9m54gnlvjr7krg3jo.apps.googleusercontent.com',
        }),
      });     
  
      const data = await response.json();
      const accessToken = data.access_token;
      
      await getCalendarEvent(accessToken);
    } catch (error) {
      console.error('Error obtaining access token:', error);
      throw error;
    }
  };
  const getCalendarEvent = async (accessToken) => {
    try {
      const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const calendarData = await calendarResponse.json();
      console.log('Calendar Data:', calendarData);
      if (calendarData.items) {
        console.log('Formatted Calendar Data:', calendarData);
        postCalendarData(calendarData)
      } else {
        message.error('No events found in the calendar.');
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
  };
  const postCalendarData = async (calendarData) => {
    const data = {
      user_id: jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).id,
      calendarDataItems: calendarData.items
    };
    let response = await addCalendarEvents(data);
    if (response.status == 200) {
       message.success("Calendar Data Synced")
      }
      // console.log(connectedApps, "ConnectedApps");
  };
  const handleCardClick = () => {
      window.location.href = 'https://accounts.google.com/o/oauth2/auth?client_id=493279028413-iljm3o2ifij9cal9m54gnlvjr7krg3jo.apps.googleusercontent.com&redirect_uri=https://app.gtmcopilot.com/api_v3/gCalendarRedirectPre&scope=https://www.googleapis.com/auth/calendar.readonly&response_type=code&access_type=offline'
  };
  const getQueryParamFromHash = () => {
    const code = window.location?.href?.split("=");
    return code
  };

  const sfSuccess = getQueryParamFromHash();
  const getSlackAccess = async () => {
    const data = {
      userid: jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).id,
    };
    let response = await getSlackToken(data);
    // console.log(response);
    if (response.status == 200) {
      // settenant_id(response.data?.data.tenantid);
      secureLocalStorage.setItem('SlackToken', response?.data?.data?.refresh_token)
      // console.log(response, "responseeeeeeee", tenant_id)
    }
  };
  useEffect(() => {
    if (!hasEffectRun.current) {
      hasEffectRun.current = true;
      if (sfSuccess[0].includes('sfsuccess') && sfSuccess[1] === 'true') {
        message.success(
          <div>
            <p>Thanks for submitting! Your data is processing and can take up to 24 hours to process, but feel free to check in a few hours to see what progress we have made.</p>
            <p>We'll email you when your data has finished processing with a link to your dashboard.</p>
          </div>,
          15
        );
      } else if (sfSuccess[0].includes('sfsuccess') && sfSuccess[1] === 'false') {
        message.error("Cannot connect at this moment.");
      } else if (sfSuccess[0].includes('slackConnect') && sfSuccess[1]?.includes('true')) {
        message.success("Slack Connected Successfully");
        // setTimeout(() => {
        //   window.location.href = window.location.href.split("?")[0];
        // }, 3000)
      }
    }
    getSlackAccess();
  }, []);
  return (
    <>
    <div className="int-container">
      <Header />
      <div className="integration-container">
        <div className="container-center">
          <Grid />
        </div>
      </div>
    </div>
    </>
  );
}

export default Integration;
