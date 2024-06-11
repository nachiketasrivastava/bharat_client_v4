import React, { useEffect, useState, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Input, Spin, message } from "antd";
import { PaperClipOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { chatresponse, csvDataInDB, talkableresponse, getGenericResponse } from "../../services/chatServices.js";
import "./ChatWindowInitial.css";
import {jwtDecode} from "jwt-decode";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import {
  rowsAtom,
  questionAtom,
  inputFilledAtom,
  divFocusedAtom,
  selectedButtonAtom,
  isProcessingAtom,
  attachedFileAtom,
  loadingAtom,
  initialCalledAtom,
  activeSuggestionAtom,
  chatArrayAtom,
  talkToCSVAtom,
  isFileAttachedAtom
} from "../../store";
import { suggestedPrompts, prevQuestions } from "../../helpers/ChatWindowConstants.js";
import ChatWindowLoading from "../ChatWindowLoading/ChatWindowLoading.js";
import Papa from "papaparse";
import HeaderMappingModal from "./HeaderMappingModal";

const { TextArea } = Input;

const ChatWindowInitial = () => {
  let userId
  // States Initialization Starts ------------->
  /* 1. */ const [loading, setLoading] = useRecoilState(loadingAtom); // To determine loading state
  /* 2. */ const [rows, setRows] = useRecoilState(rowsAtom); // To give number of rows for TextArea component
  /* 3. */ const [question, setQuestion] = useRecoilState(questionAtom); // To store the question asked by user => You've Uploaded (file name) in the case of Attach File
  /* 4. */ const [activeSuggestion, setActiveSuggestion] =
    useRecoilState(activeSuggestionAtom); // To store which suggested prompt was selected & highlight that prompt with a different background color
  /* 5. */ const [inputFilled, setInputFilled] =
    useRecoilState(inputFilledAtom); // To store whether TextArea is empty or not. Diasble/Enable Send Button accordingly
  /* 6. */ const [divFocused, setDivFocused] = useRecoilState(divFocusedAtom); // To store Whether TextArea is focused or not. The component below this TextArea (The one that contains Send Button) is stacked below TextArea to give a feeling of TextArea Being bigger & that, it includes below buttons like "Attach" => When div is focused, border color of below component also changes
  /* 7. */ const [selectedButton, setSelectedButton] =
    useRecoilState(selectedButtonAtom); // To store which button is selected if there are multiple buttons below TextArea => This refers to buttons where "Attach" is one of those buttons
  /* 8. */ const [isProcessing, setIsProcessing] =
    useRecoilState(isProcessingAtom); // This is only for "Attach" button. This includes a spinning component in place of "Attach" button if true
  /* 9. */ const [attachedFile, setAttachedFile] =
    useRecoilState(attachedFileAtom); // To store file attached by user. Mostly stores name of the file only, not the actual content inside it
  /* 10 */ const setInitialCalled = useSetRecoilState(initialCalledAtom); // To toggle between "Initial" & "Later" components
  /* 11 */ const setChatArray = useSetRecoilState(chatArrayAtom); // to set the chatArray.
  /* 12 */ const setTalkToCSV = useSetRecoilState(talkToCSVAtom); // to set the session ID of Talk To CSV API.
  // States Initialization Ends ------------->
  const fileInputRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFileAttached, setIsFileAttached] = useRecoilState(isFileAttachedAtom);
  const [csvHeaders, setCsvHeaders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('loginToken');
    setAttachedFile(null);
    setTalkToCSV(null);
    localStorage.removeItem("talkToCSV");
    let decodedToken;
    token ? decodedToken = jwtDecode(token.replace(process.env.REACT_APP_TOKEN_PASSCODE, '')) : decodedToken = null;
    userId = decodedToken.id;
    setModalVisible(false)
  }, []);

  const handleInputChange = (e) => {
    setActiveSuggestion(-1);
    const value = e.target.value;
    if (!value) {
      setInputFilled(false);
    } else {
      setInputFilled(true);
    }
    const lines = value.split("\n").length;
    const newRows = Math.min(lines, 5);
    setRows(newRows || 1);
    setQuestion(value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      // If no file is selected, clear the attached file
      setIsFileAttached(false)
      setAttachedFile(null);
      return;
    }
  
    // Check if file size is less than 1MB
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > maxFileSize) {
      message.error("File size should be less than 1MB");
      return;
    }
  
    setIsProcessing(true);
    setInputFilled(true);
    console.log(attachedFile, "attachhhhhhhhhdfsdfsfdsh");

    setTimeout(() => {
      setIsFileAttached(true)
      setIsProcessing(false);
      setAttachedFile(file);
      setSelectedButton(false);
      fileInputRef.current.value = '';
    }, 1000);
  };
  

  const handleSend = async () => {
    if (inputFilled) {
      setInitialCalled(false); // If there is some text in TextArea, change component from "Initial" to "Later"
      setChatArray([
        {
          question
        }
      ]);
      setLoading(true);
      if (attachedFile && isFileAttached) {
        setChatArray([
          {
            question: "You've uploaded " + attachedFile?.name
          }
        ]);
      } else {
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
        const payload = {
          session_id: null,
          user_id: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.id,
          question: question,
          organization: organization
        };
        let response = await getGenericResponse(payload);
        if (response.data.message && (response?.data?.message === 'Error fetching data from external API' || response?.data?.message === 'External API returned unsuccessful status')) {
          setChatArray(prevChatArray => (
            [
              {
                answer: "Currently we're facing some issues in getting response for you. Please try again later and if the issue persists do let us know at issue@gtmcopilot.com",
                sources: null,
                chartData: {},
              }
            ]
          ));
        } else if (response?.data.status === 'success') {
          localStorage.setItem("session_id", response.data.session_id);
          setChatArray(prevChatArray => {
            const lastIndex = prevChatArray.length - 1;
            return [
              ...prevChatArray.slice(0, lastIndex),
              {
                ...prevChatArray[lastIndex],
                answer: response?.data?.data?.result || ["Currently we're facing some issues in getting response for you. Please try again later and if the issue persists do let us know at issue@gtmcopilot.com"],
                sources: response?.data?.data.linksMetadata || null,
                chartData: response?.data?.data?.chart_response,
              }
            ];
          });
          setQuestion("");
        } else {
          setChatArray({ result: ["Currently we're facing some issues in getting response for you. Please try again later and if the issue persists do let us know at issue@gtmcopilot.com"] });
        }
        setLoading(false);
      }
    }
  };

  const handlePressEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (prompt, index) => {
    setQuestion(prompt);
    setActiveSuggestion(index);
  };

  const handleModalOk = async (headerMapping) => {
    setModalVisible(false);
    if (isFileAttached) {
      Papa.parse(attachedFile, {
        header: true,
        complete: (results) => {
          const csvData = results.data;
  
          const newCsvData = csvData
            .filter(row => {
              // Filter out rows where all fields are null or blank spaces
              return Object.values(row).some(value => value !== null && value.trim() !== "");
            })
            .map(row => {
              const newRow = {};
  
              // Add all fields from the original row to newRow
              Object.keys(row).forEach(key => {
                newRow[key] = row[key];
              });
  
              // Update newRow with mapped fields if they are not an exact match
              Object.keys(headerMapping).forEach(standardHeader => {
                if (headerMapping[standardHeader] && headerMapping[standardHeader] !== standardHeader) {
                  newRow[standardHeader] = row[headerMapping[standardHeader]];
                  delete newRow[headerMapping[standardHeader]];
                }
              });
  
              return newRow;
            });
  
          const sessionId = uuidv4();
          localStorage.setItem("session_id", sessionId);
          const payload = {
            session_id: sessionId,
            user_id: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).id,
            data: newCsvData,
            filename: attachedFile?.name.split(".")[0]
          };
  
          csvDataInDB(payload)
            .then(dataResponse => {
              console.log(dataResponse.data);
              localStorage.setItem("tableName", dataResponse.data.tableName)
              handleSend();
            })
            .catch(error => {
              message.error("Error sharing CSV data");
              setAttachedFile(null)
            });
          setIsFileAttached(false);
        }
      });
    }
  };
  
  
  
  

  const handleModalCancel = () => {
    setModalVisible(false);
    setAttachedFile({})
    setIsFileAttached(false)
    console.log(attachedFile, "attachhhhhhhhhh");

  };

  useEffect(() => {
    if (attachedFile?.name != null && isFileAttached) {
      // handleSend();
      Papa.parse(attachedFile, {
        header: true,
        complete: async (results) => {
          const csvData = results.data;
          setCsvHeaders(Object.keys(csvData[0]));
          setModalVisible(true);
        }
      });
    }
  }, [attachedFile]);

  useEffect(() => {
    if (question.trim()) {
      setInputFilled(true);
    }
  }, [question]);

  return (
    <div className="flex justify-center mt-[100px]">
        <HeaderMappingModal
          visible={modalVisible}
          onCancel={handleModalCancel}
          onOk={handleModalOk}
          csvHeaders={csvHeaders}
          maskClosable={false}
        />
      <div className="w-[650px] flex flex-col justify-center items-center h-full">
        <div className="w-[90%] text-[200%] justify-center text-center items-center mb-2 font-bold">
          Hi this is ADA, your personal GTM CoPilot. How can I help you today?
        </div>
        <TextArea
          autoSize={{ minRows: 1, maxRows: 5 }}
          rows={rows}
          value={question}
          onChange={handleInputChange}
          onPressEnter={handlePressEnter}
          onFocus={() => setDivFocused(true)}
          onBlur={() => setDivFocused(false)}
          placeholder="Ask anything..."
          className={"chatWindowTextArea text-xl py-4"}
          autoFocus
        />
        <div
          className={`w-full flex justify-between items-center p-4 pb-3 chatWindowTextBottom ${
            divFocused && "chatWindowDivFocused"
          }`}
        >
          <div className="flex justify-center items-center gap-3">
            <div
              className={`flex justify-center items-center gap-1 p-2 chatWindowButtonComponent ${
                selectedButton === "Attach" ? "chatWindowButtonSelected" : ""
              }`}
              onClick={() => setSelectedButton("Attach")}
            >
              <label
                htmlFor="file-input"
                className="cursor-pointer flex items-center"
              >
                {isProcessing ? (
                  <div className="flex gap-2 items-center">
                    <Spin />
                    <div className="ml-1 text-[1rem]">Processing...</div>
                  </div>
                ) : (
                  <>
                    <PaperClipOutlined style={{ fontSize: "18px" }} />
                    <div className="text-[1rem]">Attach</div>
                  </>
                )}
              </label>
              <input
                id="file-input"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept=".csv"
              />
            </div>
            <span className="text-[red] pt-1 text-[10px]">File size should be {'<'} 1MB</span>
          </div>
          <div className="flex justify-center items-center gap-5">
            <div
              className={`flex justify-center items-center gap-2 border-2 rounded-2xl p-2 ${
                inputFilled
                  ? "bg-[#E07E65] cursor-pointer"
                  : "cursor-not-allowed"
              }`}
              onClick={handleSend}
            >
              <ArrowRightOutlined
                style={{ color: inputFilled ? "white" : "black" }}
              />
            </div>
          </div>
        </div>

        <div className="chatSuggestions flex-wrap">
          {prevQuestions?.map((prompt, index) => (
            <div
              key={index}
              className={`suggestion ${
                activeSuggestion === index && "activeSuggestion"
              }`}
              onClick={() => handleSuggestionClick(prompt, index)}
            >
              {prompt}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ChatWindowInitial;
