// import { list } from "./integrationList";
import salesforce from '../../assets/images/salesforceImg.png';
import hubspot from '../../assets/images/hubspot_logo.svg';
import marketo from '../../assets/images/marketo_logo.svg';
import salesloft from '../../assets/images/salesloft-logo.png';
import outreach from '../../assets/images/outreach_logo.png';
import linkedin from '../../assets/images/linkedin_logo.svg';
import gSheet from '../../assets/images/sheets.png';
import awsLogo from '../../assets/images/aws_logo.svg';
import snowFlake from '../../assets/images/snowflake_logo.png';
import googleCalendar from '../../assets/images/google_calendar_icon.svg'
import slackLogo from '../../assets/images/slackLogo.png';
import secureLocalStorage from 'react-secure-storage';
import { jwtDecode } from 'jwt-decode';
import { GridItem } from "./GridItem";
import React from 'react';
import { useRecoilValue } from "recoil";
import { integrationStatusAtom } from "../../store/atoms/IntegrationAtoms";
export const Grid = () => {
  const connectedApps = useRecoilValue(integrationStatusAtom)
  let slackToken = secureLocalStorage.getItem("SlackToken");
if (!slackToken) {
  slackToken = "";
}
  const list = [
    {
      id: 0,
      name: "Slack",
      logo: slackLogo,
      redirect_uri: 'https://app.gtmcopilot.com/api_v3/oauth/login?tenant_id='+localStorage.getItem("tenant_id")+'&user_name='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).name?.replace("|", " ")+'&email='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).email+'&tenant_name='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).organization_domain+'&source=slack&user_id='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).id,
      status: "Connect",
      description:
        "Connect Your Slack Workspace To Get Notified About New Leads."
    },
    {
      id: 1,
      name: "Salesforce",
      logo: salesforce,
      redirect_uri: 'https://app.gtmcopilot.com/api_v3/oauth/login?tenant_id='+localStorage.getItem("tenant_id")+'&user_name='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).name?.replace("|", " ")+'&email='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).email+'&tenant_name='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).organization_domain+'&source=salesforce_v4&user_id='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).id+'&slack_token='+slackToken,
      status: "Connect",
      description:
        "Instantly save the right lead/contact data to the right Salesforce field."
    },
    {
      id: 2,
      logo: hubspot,
      name: "Hubspot",
      redirect_uri: 'https://app.gtmcopilot.com/api_v3/oauth/login?tenant_id='+localStorage.getItem("tenant_id")+'&user_name='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).name?.replace("|", " ")+'&email='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).email+'&tenant_name='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).organization_domain+'&source=hubspot_v4&user_id='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).id,
      status: "Connect",
      description:
        "Easily push targeted lists and capture the most valuable leads."
    },
    {
      id: 3,
      logo: googleCalendar,
      name: "Google Calendar",
      redirect_uri: 'https://accounts.google.com/o/oauth2/auth?client_id=493279028413-iljm3o2ifij9cal9m54gnlvjr7krg3jo.apps.googleusercontent.com&redirect_uri=https://app.gtmcopilot.com/api_v3/gCalendarRedirectPre&scope=https://www.googleapis.com/auth/calendar.readonly&response_type=code&access_type=offline',
      status: "Connect",
      description:
        "Connect your calendar to instantly sync your events."
    },
    {
      id: 4,
      logo: marketo,
      name: "Marketo",
      redirect_uri: "Sample",
      status: "Connect",
      description:
        "Connect Marketo Engage to your growing tech stack with ease, speed, and confidence."
    },
    {
      id: 5,
      logo: salesloft,
      redirect_uri: 'https://app.gtmcopilot.com/api_v3/oauth/login?tenant_id='+localStorage.getItem("tenant_id")+'&user_name='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).name?.replace("|", " ")+'&email='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).email+'&tenant_name='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).organization_domain+'&source=salesloft_v4&user_id='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).id,
      status: "Connect",
      name: "Salesloft",
      description:
        "Save leads and accurate data to the right cadence and connect with buyers faster."
    },
    {
      id: 6,
      logo: outreach,
      redirect_uri: 'https://app.gtmcopilot.com/api_v3/oauth/login?tenant_id='+localStorage.getItem("tenant_id")+'&user_name='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).name?.replace("|", " ")+'&email='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).email+'&tenant_name='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).organization_domain+'&source=outreach_v4&user_id='+jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).id,
      status: "Connect",
      name: "Outreach",
      description:
        "Ensure every lead is saved to the right sequence. From nurture to conversion."
    },
    {
      id: 7,
      logo: linkedin,
      redirect_uri: "Sample",
      status: "Connect",
      name: "Linkedin",
      description:
        "Connect with someone on LinkedIn, it's similar to adding a friend on other social media platforms, but with a professional focus."
    },
    {
      id: 8,
      logo: gSheet,
      redirect_uri: "Sample",
      status: "Connect",
      name: "Google Sheet",
      description:
        "Establishing a link or integration between a third-party application or service and a Google Sheets document."
    },
    {
      id: 9,
      logo: awsLogo,
      redirect_uri: "Sample",
      status: "Connect",
      name: "AWS S3",
      description:
        "Integration between your application or system and Amazon Simple Storage Service."
    },
    {
      id: 10,
      logo: snowFlake,
      redirect_uri: "Sample",
      status: "Connect",
      name: "Snowflake",
      description:
        "Connectors provide instant access to current data of Snowflake."
    }
  ];
  const sortedList = list.sort((a, b) => {
    const isAConnected = connectedApps.includes(a.name);
    const isBConnected = connectedApps.includes(b.name);
    return isAConnected === isBConnected ? 0 : isAConnected ? -1 : 1;
  });

  const connectedItems = sortedList.filter(item => connectedApps.includes(item.name));
  const otherItems = sortedList.filter(item => !connectedApps.includes(item.name));

  if (secureLocalStorage.getItem("SlackConnected")) {
    const slackItem = sortedList.find(item => item.name === "Slack");
    if (slackItem && connectedItems) {
      connectedItems?.push(slackItem);
    }
    // Remove Slack from otherItems
    const slackIndex = otherItems.findIndex(item => item.name === "Slack");
    if (slackIndex > -1) {
      otherItems?.splice(slackIndex, 1);
    }
  }

  return (
    <div className="flex flex-col ml-[10%] gap-[1.75rem]">
      <div className="p-2 font-[white] px-4" style={{borderRadius: "10px", fontSize: "large", width: "fit-content", fontWeight: 400}}>
        <h2>Connected Apps :- </h2>
      </div>
      <div className="grid-list connected-apps-section">
        {connectedItems.map((item) => (
          <GridItem key={item.id} {...item} />
        ))}
      </div>
      <hr />
      <div className="p-2 font-[white] px-4" style={{borderRadius: "10px", fontSize: "large", width: "fit-content", fontWeight: 400}}>
        <h2>You can also connect :- </h2>
      </div>
      <div className="grid-list other-apps-section">
        {otherItems.map((item) => (
          <GridItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};
