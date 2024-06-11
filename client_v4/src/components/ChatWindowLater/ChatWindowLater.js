import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  EditFilled,
  PieChartFilled,
  FilterFilled,
  CopyOutlined,
  UndoOutlined,
  LikeOutlined,
  DislikeOutlined,
  PlusCircleOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { Card, Input } from "antd";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import { talkableresponse, getGenericResponse } from "../../services/chatServices.js";
import { jwtDecode } from "jwt-decode";

import {
  chatArrayAtom,
  questionAtom,
  activeCtaAtom,
  rowsAtom,
  inputFilledAtom,
  loadingAtom,
} from "../../store";
import sourceData from "./sourceData.json";
import Chat from "../Chat/Chat.js";

import logo from "../../assets/images/logoWOname.png";
import avatar from "../../assets/images/user.png";

import "./ChatWindowLater.css";
import ChatWindowLoading from "../ChatWindowLoading/ChatWindowLoading.js";


defaults.maintainAspectRatio = false;
defaults.responsive = true;

const { TextArea } = Input;

const tableExtracted = ["Companies", "Contacts", "Industry"];

const answerData = [
  {
    label: "Total Records",
    value: "660",
  },
  {
    label: "Unique Opportunity Name",
    value: "648",
  },
  {
    label: "Total ICP",
    value: "238",
  },
  {
    label: "Total Won",
    value: "660",
  },
  {
    label: "Total MRR",
    value: "$1,693,398.99",
  },
  {
    label: "Average MRR",
    value: "$2565.76",
  },
  {
    label: "Total Closed",
    value: "660",
  },
  {
    label: "Total ARR",
    value: "$20,320,788",
  },
];

const insights = ["1. Some insight", "2. Some other insight"];

const ChatWindowLater = () => {
  const session_id = localStorage.getItem("session_id")
  let userId;
  const [question, setQuestion] = useRecoilState(questionAtom);
  const [activeCta, setActiveCta] = useRecoilState(activeCtaAtom);
  const [rows, setRows] = useRecoilState(rowsAtom);
  const [inputFilled, setInputFilled] = useRecoilState(inputFilledAtom);
  const setChatArray = useSetRecoilState(chatArrayAtom)
  const [loading, setLoading] = useRecoilState(loadingAtom)
  /*
    1. Question Component => 2 divs(image + question text)
    2. Answer Component => 2 divs(image + answer text)
    3. PreVis Component => 2 divs
            => Name of Chart/Table + Table names from where chart data is extracted
            => CTA buttons div(toggle, filter, Edit btns)
    4. AnswerData Component => 2 divs(data name + data value)
    5. Chart/Table Component
    6. Quick Actions Component
    7. Insights Component => 2 divs(actual insights)
    8. Feedback Component
    9. Follow up TextArea Component(Already created)
  */
  //  bg-[#ebebeb]

  useEffect(() => {
    setInputFilled(false);

    const token = localStorage.getItem('loginToken')
    let decodedToken
    token ? decodedToken = jwtDecode(token.replace(process.env.REACT_APP_TOKEN_PASSCODE, '')) : decodedToken = null
    userId = decodedToken.id
  }, [])

  const handleInputChange = (e) => {
    if (e.target.value.trim() === "") {
      setInputFilled(false);
    } else {
      setInputFilled(true);
    }
    const lines = e.target.value.split("\n").length;
    const newRows = Math.min(lines, 5);
    setRows(newRows || 1);
    setQuestion(e.target.value);
  };

  const handleSend = async () => {
    if (!inputFilled) {
      return
    }
    setLoading(true)
    setChatArray(prevChatArray => (
      [
        ...prevChatArray,
        {
          question
        }
      ]
    ))
    console.log(question)
    const orgParam = new URLSearchParams(window.location.search).get('org');
    console.log(orgParam, "aisud")
    let organization = jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.organization_domain;

    if (orgParam) {
      const [password, orgName] = orgParam.split(' ');
      const domainPassword = process.env.REACT_APP_DOMAIN_PASSWORD;
      if (password === domainPassword) {
        organization = orgName+".com";
      }
    }
  let payload = {
      session_id: session_id, 
      user_id: userId, 
      question: question,
      organization: organization
    };
    let response = await getGenericResponse(payload);

    if(response.data.message && response?.data?.message === 'Error fetching data from external API'){
      setChatArray(prevChatArray => {
        const lastIndex = prevChatArray.length - 1
        return [
          ...prevChatArray.slice(0, lastIndex),
          {
            ...prevChatArray[lastIndex],
            answer: "Currently we're facing some issues in getting response for you. Please try again later and if the issue persists do let us know at issue@gtmcopilot.com",
            sources: null,
            chartData: {},
          }
        ]
      })
    }
    else if (response?.data.status === 'success') {
      setChatArray(prevChatArray => {
        const lastIndex = prevChatArray.length - 1
        return [
          ...prevChatArray.slice(0, lastIndex),
          {
            ...prevChatArray[lastIndex],
            answer: response?.data?.data?.result || "Currently we're facing some issues in getting response for you. Please try again later and if the issue persists do let us know at issue@gtmcopilot.com",
            sources: response?.data?.data.linksMetadata || null,
            chartData: response?.data?.data?.chart_response,

          }
        ]
      })
      console.log(response.data.data, "responsefromserver");
    }else {
      setChatArray(prevChatArray => {
        const lastIndex = prevChatArray.length - 1
        return [
          ...prevChatArray.slice(0, lastIndex),
          {
            ...prevChatArray[lastIndex],
            answer: "Currently we're facing some issues in getting response for you. Please try again later and if the issue persists do let us know at issue@gtmcopilot.com",
          }
        ]
      })
    }    
      setLoading(false)
      setQuestion("")
      setInputFilled(false)
    // }, 3000)
  };

  const handlePressEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-full p-5 flex flex-col gap-5">
      <Chat />

      {/* Deep Dive Component Starts */}
      {loading ? <></> : (
        <div className="w-[50%] fixed bottom-[5%] left-[25%]">
          <div className="border border-[#E07E65] bg-[#E07E65] rounded-full p-1">
            <div
              className={`border border-[#E07E65] shadow-xl rounded-full px-2 p-1 flex justify-between items-center`}
            >
              <div className="flex gap-5 justify-center items-center w-[95%]">
                <PlusCircleOutlined
                  style={{ fontSize: "20px", cursor: "not-allowed" }}
                />
                <TextArea
                  autoSize={{ minRows: 1, maxRows: 5 }}
                  value={question}
                  rows={rows}
                  onChange={handleInputChange}
                  onPressEnter={handlePressEnter}
                  placeholder="Ask follow-up..."
                  className={`text-xl w-[90%] laterTextArea`}
                  autoFocus
                />
              </div>
              <div className="flex justify-center items-center gap-5 mt-0.5">
                <div
                  className={`flex justify-center items-center gap-2 border-2 rounded-2xl p-2 ${
                    inputFilled
                      ? "bg-[#E07E65] cursor-pointer"
                      : "bg-white cursor-not-allowed"
                  }`}
                  onClick={handleSend}
                >
                  <ArrowUpOutlined
                    style={{ color: inputFilled ? "white" : "black" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      )} 
      {/* Deep Dive Component Ends */}
    </div>
  );
};

export default ChatWindowLater;
