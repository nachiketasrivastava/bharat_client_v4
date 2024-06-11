import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Input, Spin, Button, message } from "antd";
import { jwtDecode } from "jwt-decode";
import './ChatHistory.css'
import { initialCalledAtom, chatArrayAtom } from "../../store";
import { useNavigate, useLocation } from "react-router-dom";
import { chatHistory } from "../../services/chatServices";

const { TextArea } = Input;

const ChatHistory = ({chatList}) => {
    const [initialCalled, setInitialCalled] = useRecoilState(initialCalledAtom);
  /* 11 */ const setChatArray = useSetRecoilState(chatArrayAtom); // to set the chatArray.
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const handleButtonClick = async ( sessionId) => {
        localStorage.setItem("session_id", sessionId);
        message.loading("Getting the chat for you...")
        let response = await chatHistory({
            user_id: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.id,
            session_id: sessionId
        });
  
        if (response.data.status === "success") {
            setInitialCalled(false);
            
            const formattedChatArray = response.data.data[0].chat_array.map((entry, index) => {
                const formattedEntry = {
                    answer: entry.result,
                    sources: entry.linksMetadata,
                    chartData: entry.chart_response,
                    question: entry.question
                };
    
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
        }
        
    };

    const groupChatsByDate = () => {
        const groupedChats = {
            Today: [],
            Yesterday: [],
            'Previous 7 Days': [],
            'Previous 30 Days': [],
            'Month Wise': {}
        };

        const today = new Date();
        const todayDate = today.toISOString().slice(0, 10);

        chatList.forEach(chat => {
            const chatDate = chat.created_date.slice(0, 10);
            const timeDiff = Math.floor((new Date(todayDate) - new Date(chatDate)) / (1000 * 60 * 60 * 24));

            if (timeDiff === 0) {
                groupedChats.Today.push(chat);
            } else if (timeDiff === 1) {
                groupedChats.Yesterday.push(chat);
            } else if (timeDiff < 7) {
                groupedChats['Previous 7 Days'].push(chat);
            } else if (timeDiff < 30) {
                groupedChats['Previous 30 Days'].push(chat);
            } else {
                const monthYear = chatDate.slice(0, 7);
                if (!groupedChats['Month Wise'][monthYear]) {
                    groupedChats['Month Wise'][monthYear] = [];
                }
                groupedChats['Month Wise'][monthYear].push(chat);
            }
        });

        return groupedChats;
    };

    const handleNewChatClick = () => {
        if(pathname == "/chat"){
            setInitialCalled(true)
        } else {
            navigate("/chat")
        }
      };

    const renderChatGroups = () => {
        const groupedChats = groupChatsByDate();

        return (
            <div className="mt-[5px] pl-2">
                {Object.entries(groupedChats).map(([category, chats]) => (
                    <div key={category} style={{ marginTop: '10px' }}>
                        {chats.length > 0 && (
                            <>
                                <h3 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>{category}</h3>
                                {category === 'Month Wise' ?
                                    Object.entries(chats).map(([monthYear, monthChats]) => (
                                        <div key={monthYear} style={{ marginBottom: '8px' }}>
                                            <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>{monthYear}</h4>
                                            {monthChats.map((chat, index) => (
                                                <Button 
                                                    key={index} 
                                                    className='bg-[]' 
                                                    style={{ width: '90%', overflow: 'hidden', marginRight: '5%', border: 'none', textAlign: 'start' }}
                                                    onClick={() => handleButtonClick(chat.session_id)}
                                                >
                                                    {chat.chat_name}
                                                </Button>
                                            ))}
                                        </div>
                                    )) :
                                    chats.map((chat, index) => (
                                        <Button 
                                            key={index} 
                                            className='bg-[]' 
                                            style={{ width: '90%', overflow: 'hidden', marginRight: '5%', border: 'none', textAlign: 'start'  }}
                                            onClick={() => handleButtonClick(chat.session_id)}
                                        >
                                            {chat.chat_name}
                                        </Button>
                                    ))
                                }
                            </>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="border-r border-solid border-slate-300 overflow-auto ">
            <div className="flex mt-2 justify-center" onClick={handleNewChatClick}>
                <div
                    className="border px-2 py-1 rounded bg-[whitesmoke] text-black cursor-pointer"
                    style={{borderRadius: "30px", width: "85%", display: "flex", justifyContent: "space-around", fontWeight: "500"}}
                    // onClick={handleNewChat}
                >
                    <span className="new-chat-label">New Chat</span>

                    {navigator.platform.includes("Win") || navigator.platform.includes("Linux") ? (
                        <span style={{fontSize: "small", opacity: "0.6"}}>Ctrl+K</span>
                    ) : (
                        <span style={{fontSize: "small", opacity: "0.6"}}>&#8984;+K</span>
                    )}
                </div>
            </div>
            <div className="mt-[0.75rem] h-[400px] overflow-scroll">
                {renderChatGroups()}
            </div>
        </div>
    );
};

export default ChatHistory;
