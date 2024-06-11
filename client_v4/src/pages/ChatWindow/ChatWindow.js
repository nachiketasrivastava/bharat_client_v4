import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { DoubleRightOutlined, DoubleLeftOutlined } from "@ant-design/icons";
import "./ChatWindow.css";

import ChatWindowInitial from "../../components/ChatWindowInitial/ChatWindowInitial.js";
import ChatWindowLater from "../../components/ChatWindowLater/ChatWindowLater.js";
import { chatHistory } from "../../services/chatServices.js";
import { activeSuggestionAtom, initialCalledAtom, inputFilledAtom, questionAtom, selectedButtonAtom } from "../../store";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom"; 
import { message } from "antd";
import { chatArrayAtom } from "../../store";
const ChatWindow = () => {
  // const userinformation = jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))
  const [initialCalled, setInitialCalled] = useRecoilState(initialCalledAtom);
  const setQuestion = useSetRecoilState(questionAtom)
  const setSelectedButton = useSetRecoilState(selectedButtonAtom)
  const setActiveSuggestion = useSetRecoilState(activeSuggestionAtom)
  const setInputFilled = useSetRecoilState(inputFilledAtom)
  const setChatArray = useSetRecoilState(chatArrayAtom)
  const location = useLocation();
  const navigate = useNavigate();
  
  const getChatData =  () => {
    const chatData = JSON.parse(decodeURIComponent(location.search.replace('?id=', '')));
    if(chatData.tenant == jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.organization_domain){
      setChatArray([chatData])
      setInitialCalled(false)
    } else{
      setInitialCalled(true)
      message.error("You're not authorised to access this chat")
      navigate('/chat')
    }
  };
  const getChat = async () => {
    const session_id = location.search.replace('?session=', '')
    localStorage.setItem("session_id", session_id);
    message.loading("Getting the chat for you...")
    let response = await chatHistory({
        user_id: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.id,
        session_id: session_id
    });

    if (response.data.status === "success" && response.data.data.length > 0) {
        setInitialCalled(false);
        
        const formattedChatArray = response.data.data[0].chat_array.map((entry, index) => {
          const formattedEntry = {
              answer: entry.result,
              sources: entry.linksMetadata,
              chartData: entry.chart_response,
              question: entry.question
          };

          // Add is_enriched key to the first element
          if (index === 0 && response.data.data[0].is_enriched === "yes") {
              formattedEntry.is_enriched = true;
              let table_name
              if(response.data.data[0].file_table_name.includes('fileupload.')){
                table_name = response.data.data[0].file_table_name.replace('fileupload.', '')
              }
              else {
                table_name = response.data.data[0].file_table_name
              }
              localStorage.setItem("file_table_name", table_name)
              formattedEntry.file_table_name = table_name;
          }

          return formattedEntry;
      });
        
        console.log(formattedChatArray);
        setChatArray(formattedChatArray);
    } else{
      message.error("Cannot find this session!")
    }
    
};
  useEffect(() => {
    if(location.search.includes('id')){
      getChatData()
    } else if(location.search.includes('session')){
      getChat()
    } else{
      setInitialCalled(true)
    }

    setQuestion("")
    setSelectedButton(-1)
    setActiveSuggestion(-1)
    setInputFilled(false)
  }, [])

  // const toggleCollapsed = () => {
  //   setCollapsed(!collapsed);
  // };

  return (
    <div className="chat-window-container">
      {/* <div className={`chat-history-container ${collapsed ? 'w-0' : 'w-[15%]'}`}>
        <div className="chat-history-scrollable">
          <ChatHistory />
        </div>
      </div>
      <div className="chat-history-toggle">
          {collapsed ? <DoubleRightOutlined onClick={toggleCollapsed} /> : <DoubleLeftOutlined onClick={toggleCollapsed} />}
      </div> */}
      <div className={`chat-content-container w-[100%]`}>
        <div className="chat-content-scrollable">
          
          {initialCalled ? <ChatWindowInitial /> : <ChatWindowLater />}
        </div>
      </div>
    </div>
  )
};

export default ChatWindow;
