import React, { useRef, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Skeleton, Card, Menu, message, Modal, Button, Input } from "antd";
import { motion } from 'framer-motion';
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import * as XLSX from 'xlsx'
import _ from 'lodash'
import Papa from 'papaparse'
import html2canvas from "html2canvas";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
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
  LinkOutlined,
  CodeFilled,
  CodeOutlined
} from "@ant-design/icons";
import logo from "../../assets/images/logoWOname.png";
import avatar from "../../assets/images/user.png";
import {
  chatArrayAtom,
  questionAtom,
  activeCtaAtom,
  rowsAtom,
  inputFilledAtom,
  loadingAtom,
  tableVisibleAtom,
  attachedFileAtom,
  fileInformationAtom,
  fileMetaInformationAtom,
  actualFileDataAtom,
  talkToCSVAtom
} from "../../store";
import sourceData from "./sourceData.json";

import "./Chat.css";
import { addFileSession, checkEnrichStatus, downloadCSV, sendChatEmailTrigger, sendFeedback, startEnrichment } from "../../services/chatServices";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const insights = ["1. Some insight", "2. Some other insight"];

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
const Chat = () => {
  const { SubMenu } = Menu;
  const [chatArray, setChatArray] = useRecoilState(chatArrayAtom);
  const [loading, setLoading] = useRecoilState(loadingAtom)
  const [activeCta, setActiveCta] = useRecoilState(activeCtaAtom)
  const [randomText, setRandomText] = useState("Gathering and cleaning relevant data")
  const attachedFile = useRecoilValue(attachedFileAtom)
  const [fileInformation, setFileInformation] = useRecoilState(fileInformationAtom)
  const [fileMetaInformation, setFileMetaInformation] = useRecoilState(fileMetaInformationAtom)
  const setActualFileData = useSetRecoilState(actualFileDataAtom)
  const talkToCSV = useRecoilValue(talkToCSVAtom)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [embedLink, setEmbedLink] = useState();
  const [emailMessage, setEmailMessage] = useState({});
  const [receipentEmail, setReceipentEmail] = useState("");
  const [fileEnriched, setFileEnriched] = useState(false)
  const [enrichedFileTableName, setEnrichedFileTableName] = useState("")
  let lastChatRef = useRef(null)
  let lastInsightRef = useRef(null)

  useEffect(() => {
    let timeoutId, insightTimeoutId
    if (lastChatRef.current && !lastInsightRef.current) {
        timeoutId = setTimeout(() => {
            lastChatRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
        }, 500)
    } else if (lastInsightRef.current) {
        insightTimeoutId = setTimeout(() => {
          lastInsightRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
        }, 1500) // Delay to wait for text animation to at least be visible to user
    }
console.log(chatArray, "------------------------------chatArray----------------------------")
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(insightTimeoutId)
    }
  }, [chatArray])

  useEffect(() => {
    const updateRandomText = (index) => {
      const texts = [
        "Analyzing data and visualizing outputs",
        "Creating insights and recommendations",
        "Sharing analysis results",
        "Finalizing results"
      ];
      if (index >= texts.length) return; // Stop recursion when index exceeds array length
  
      setTimeout(() => {
        setRandomText(texts[index]);
        updateRandomText(index + 1);
      }, 3000);
    };
  
    if (loading === true) {
      updateRandomText(0);
    }
    if (loading === false) {
      setRandomText("Gathering and cleaning relevant data");
    }
  }, [loading]);
  

  const isNumberedList = (text) => {
    // Check if the text starts with a number followed by a dot and a space
    const result = /^(-|\d+\.\s)/.test(text?.trim());
    // console.log(text, result1);
    return result;
  };

  const charVariants = {
    hidden: { opacity: 0 },
    reveal: { opacity: 1 },
  };

  const splitString = (inputString) => {
    const characters = []
    const regex = /[\s\S]/gu

    let match

    while((match = regex.exec(inputString)) != null) {
        characters.push(match[0])
    }

    return characters
  }

  const readExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: "array" })
        // console.log(workbook.SheetNames, "workbook.SheetNames")

        const sheetName = workbook.SheetNames[0]
        // console.log(workbook.Sheets, "workbook.Sheets")
        const sheet = workbook.Sheets[sheetName]
        const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 })
        resolve(excelData)
      }
      reader.onerror = (error) => {
        reject(error)
      }
      reader.readAsArrayBuffer(file)
    })
  }
  const addSessionOfFile = async (answer) => {
    try {
      let response = await addFileSession({
          session_id: localStorage.getItem("session_id"),
          user_id: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.id,
          question: chatArray[0]?.question,
          organization: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.organization_domain, 
          response: answer,
          table: localStorage.getItem("tableName")
      });

      if (response.data.status === "success") {
          // message.success('Email sent successfully!');
      } else {
          throw new Error('We faced some issue while sending the mail, please verify the email address');
      }
    } catch (error) {
        // message.error()
    }
  }
  const handleDataOps = async (file) => {
    // setLoading(true)
    // setChatArray(prevChatArray => [
    //   ...prevChatArray,
    //   {
    //     question: `You've uploaded ${fileName}`,
    //     suggestions: []
    //   }
    // ])
    try {
      if (file) {
        // console.log(file)

        // -------------------------- File Handling Starts -------------------------------------
        const excelData = await readExcel(file)
        // console.log(excelData)
        let validData = []
        // validData = All the data before we encounter an empty row in the uploaded file

        for (let i = 0; i < excelData?.length; i++) {
          if (excelData[i]?.length === 0) {
            break;
          } else {
            validData?.push(excelData[i])
          }
        }
        // console.log(validData)
        setActualFileData(validData)
        const columnarData = _.zip(...validData)
        // columnarData = Transformed data from validData, that is, all rows are transformed to columns & all columns are transformed to rows. Console log both these values to better understand this

        // console.log(columnarData)
        const fields = columnarData?.length
        const records = columnarData[0]?.length - 1 // First entry of each row is the header

        // const totalCells = records * fields
        // console.log("No. of Fields ", fields)
        // console.log("No. of Records ", records)
        // console.log("No. of Cells ", totalCells)
        const metaInfo = {
          "No. of Fields": fields,
          "No. of Records": records
        } // no. of fields, records to give to fileMetaInformation state
        setFileMetaInformation(metaInfo)
        // console.log(metaInfo)

        let emptyTracker = {} // "Field Name" (mapped to) No. of empty values in this field/column
        let missingColNameCount = 1 // Handling for Empty Column Header Names => "Un-Named Column 1"
        for (let i = 0; i < columnarData?.length; i++) {
          const rowData = columnarData[i]
          let emptyCount = 0;
          for (let j = 1; j < rowData?.length; j++) {
            const cellData = rowData[j]
            if (!cellData || cellData?.toString()?.cellData?.trim() === "") {
              emptyCount++
            }
          }
          let percentageEmptyValues = 100 // For cases where just the column headers are defined & there are no records
          if (records !== 0) { // Dividing by 0 results in NaN
            percentageEmptyValues = emptyCount / records * 100
          }
          let columnName = rowData[0]
          if (!columnName || columnName?.toString()?.trim() === "") { // Handle case when field name is empty
            columnName = 'Un-Named Column ' + missingColNameCount
            missingColNameCount++
          }
          emptyTracker[columnName] = parseFloat(percentageEmptyValues.toFixed(2)) // Rounding off to 2 decimal places & converting to float value instead of string value
        }
        // console.log(emptyTracker)
        setFileInformation(emptyTracker)
        // -------------------------- File Handling Ends -------------------------------------

        // setIsProcessing(true);
        // setInputFilled(true)
        // setTimeout(() => {
        //   setIsProcessing(false);
        //   setAttachedFile(file);
        // }, 2000);
      }
    } catch (e) {
      console.error(e)
    }
  }

  const generateAnswerForFileUpload = (check) => {
    const initialLine = (check === "check") ? "Here is the summary after cleaning and deduplicating:" : "I am analysing the file you have uploaded:"

    // fileMetaInformation contains no. of columns & records
    // fileInformation contains % of missing values in each column

    const fieldsInformation = `1. File has ${fileMetaInformation["No. of Fields"]} columns`
    const recordsInformation = `2. There are ${fileMetaInformation["No. of Records"]} records`
    // const entriesInformation = `3. In total, there are ${fileMetaInformation["No. of Entries"]} entries`

    // Output earlier --------------------------->
    // I am analysing the file you have uploaded:
      // 1. File has 14 columns
      // 2. There are 28 records
      // 3. "SDR" column has no missing values
      // 4. "Time" column has no missing values
      // 5. "Location" column has 78.57% missing values
      // 6. "Rep Needed" column has no missing values
      // 7. "email" column has no missing values
      // 8. "Brand" column has no missing values
      // 9. "Person to meet with Name" column has no missing values
      // 10. "Title" column has no missing values
      // 11. "Cell" column has 3.57% missing values
      // 12. "Opp yes/ no?" column has no missing values
      // 13. "In SFDC?" column has no missing values
      // 14. "Quick Notes from SDR:" column has 85.71% missing values
      // 15. "Have we connected on eTail? y/n" column has 100% missing values
      // 16. "Notes from AE" column has 100% missing values

    // Handled case to show all columns with same percentage of missing values

    const matchingEmptyFields = {}
    for (const [key, value] of Object.entries(fileInformation)) {
      if (!matchingEmptyFields[value]) {
        matchingEmptyFields[value] = []
      }
      matchingEmptyFields[value].push(key)
    }
    // console.log(matchingEmptyFields)

    let rowCount = 3 // Contains count for each new line
    const fieldInfo = Object.entries(matchingEmptyFields)?.map(([ key, value ]) => {
      const lengthOfJoinedColumns = value?.length
      const joinedColumnNames = value?.join(`", "`)
      const info = `${rowCount}. "${joinedColumnNames}" column${lengthOfJoinedColumns > 1 ? 's have' : ' has'} ${key === '0' ? 'no' : key+'%'} missing values`
      rowCount++
      return info
    })?.join("\n")

    // Output After MatchingEmptyFields --------------------------->
    // I am analysing the file you have uploaded:
      // 1. File has 14 columns
      // 2. There are 28 records
      // 3. "SDR", "Time", "Rep Needed", "email", "Brand", "Person to meet with Name", "Title", "Opp yes/ no?", "In SFDC?" columns have no missing values
      // 4. "Have we connected on eTail? y/n", "Notes from AE" columns have 100% missing values
      // 5. "Location" column has 78.57% missing values
      // 6. "Cell" column has 3.57% missing values
      // 7. "Quick Notes from SDR:" column has 85.71% missing values

    const duplicates = `${rowCount}. ${(check === "check") ? "There are no duplicates left" : "There are 12% duplicate rows in the file"}`
    rowCount += 1

    const extra = `${(check === "check") ? `${rowCount}. We found out there are 20 new contacts based on emails & 10 new contacts based on URL` : ""}`

    const answer = initialLine + "\n" + fieldsInformation + "\n" + recordsInformation + "\n" + fieldInfo + "\n" + extra
    if(fileMetaInformation["No. of Fields"] != undefined){
      addSessionOfFile(answer)
    }
    // const answer = `I am analysing the file you have uploaded:\n1. File has 5 columns\n2. company_name column represent name of companies and has no missing values\n3. email column represents emails of individual, it is a PII filed and has 20% missing values\n4. website column represents URL's with 10% missing values\n5. contact_name represents name of individuals with no missing values\n6. company_country represents country with no missing values.\n7. There are 12% duplicate rows in the file`
    return answer
  }

  const handleSetChat = async () => {
    await new Promise(resolve => setTimeout(resolve, 3000))
    setChatArray(prevChatArray => {
      const lastIndex = prevChatArray.length - 1
      return [
      ...prevChatArray.slice(0, lastIndex),
      {
        ...prevChatArray[lastIndex],
        answer: generateAnswerForFileUpload(),
        // suggestions: ["Ask questions about the file?"],
      }
    ]})

    setLoading(false)
  }

  useEffect(() => {
    console.log(fileInformation)
    if (fileInformation && chatArray[0]?.question?.includes("You've uploaded") && !chatArray[0]?.answer) {
      handleSetChat()
    }
  }, [fileInformation])

  useEffect(() => {
    console.log(attachedFile)
    if (attachedFile && attachedFile?.name?.includes(".csv")) {
      handleDataOps(attachedFile)
    }
  }, [])

  const handleAskCSV = () => {
    console.log("Here")
    setChatArray(prevChatArray => [
      ...prevChatArray,
      {
        question: `Ask questions about the file?`,
        answer: "You can ask questions about the file you have uploaded",
      }
    ])
    localStorage.setItem("talkToCSV", talkToCSV)
  }

  const handleExit = () => {
    localStorage.removeItem("talkToCSV")
    setChatArray(prevChatArray => [
      ...prevChatArray,
      {
        question: `Exit QnA`,
        answer: "You have exited the QnA session",
      }
    ])
  }

  const generateEmbedCode = (chartData) => {
    const iframeContent = `
      <iframe width="100%" height="400px" frameborder="0" scrolling="no"
        srcdoc="<html>
          <head>
            <title>Embedded Chart</title>
            <script src='https://cdn.jsdelivr.net/npm/chart.js'></script>
          </head>
          <body>
            <canvas id='embeddedChart'></canvas>
            <script>
              var ctx = document.getElementById('embeddedChart').getContext('2d');
              new Chart(ctx, {
                type: 'bar',
                data: ${JSON.stringify({
                  labels: chartData.data.map(data => data.xValue),
                  datasets: [{
                    label: chartData.metadata.rep,
                    data: chartData.data.map(data => data.yValue),
                    backgroundColor: ['#E07E65', '#F39F8E', '#8E4E2A', '#653712', '#F9B8A6'],
                    borderRadius: 5,
                  }],
                }).replace(/"/g, "&quot;")},
                options: ${JSON.stringify({
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: chartData.metadata.labelX,
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: chartData.metadata.labelY,
                      },
                    },
                  },
                }).replace(/"/g, "&quot;")}
              });
            </script>
          </body>
        </html>"
      ></iframe>
    `;
    setEmbedLink(iframeContent)
    setIsModalOpen(true)
    // 
    // message.success("The embedding link is copied to your clipboard. Please paste in your code to use it.") 
  };
  const sendChatReportMessage = (chartData, question, answer) => {
    let iframeContent;
    if(chartData!= ""){
      iframeContent = `
        <iframe width="100%" height="400px" frameborder="0" scrolling="no"
          srcdoc="<html>
            <head>
              <title>Embedded Chart</title>
              <script src='https://cdn.jsdelivr.net/npm/chart.js'></script>
            </head>
            <body>
              <canvas id='embeddedChart'></canvas>
              <script>
                var ctx = document.getElementById('embeddedChart').getContext('2d');
                new Chart(ctx, {
                  type: 'bar',
                  data: ${JSON.stringify({
                    labels: chartData.data.map(data => data.xValue),
                    datasets: [{
                      label: chartData.metadata.rep,
                      data: chartData.data.map(data => data.yValue),
                      backgroundColor: ['#E07E65', '#F39F8E', '#8E4E2A', '#653712', '#F9B8A6'],
                      borderRadius: 5,
                    }],
                  }).replace(/"/g, "&quot;")},
                  options: ${JSON.stringify({
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: chartData.metadata.labelX,
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: chartData.metadata.labelY,
                        },
                      },
                    },
                  }).replace(/"/g, "&quot;")}
                });
              </script>
            </body>
          </html>"
        ></iframe>
      `;
    } 
    else {
      iframeContent = " "
    }
    setEmailMessage({
      emailQuestion: question,
      emailAnswer: answer,
      iframe: iframeContent
    })
    setIsEmailModalOpen(true)
  };
  const handleClick = () => {
    setIsModalOpen(false);
  };  
  const handleEmailModalClick = () => {
    setIsEmailModalOpen(false);
  };
  const downloadEnrichedFile = async () => {
    try {
        const table_name = localStorage.getItem("file_table_name")
        let response = await downloadCSV({ table: table_name });
        if (response.data.status === 'success') {
          message.loading("Downloading your enriched file");
          const data = response.data.data;
          console.log(data, "Received data");
    
          // Convert data to CSV
          const csv = Papa.unparse(data);
    
          // Create a blob from the CSV data
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
    
          // Create a link and trigger the download
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${table_name}.csv`);
          document.body.appendChild(link);
          link.click();
    
          // Clean up
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
    
        } else {
          // Handle error response from server
          console.error('Error:', response.data.message);
          message.error(response.data.message);
        }
      } catch (error) {
        // Handle network or other errors
        console.error('Error:', error);
        message.error('Error downloading file. Please try again.');
      }
};



  const handleEnrichButtonClick = async () => {
    let response = await checkEnrichStatus({session_id: localStorage.getItem('session_id')})
    console.log(response)
    if(response.data.status == 'success' ){  
      console.log(response.data.data, "dkaugcfjsdgfajsdgbasx")
      if(response.data.data[0].is_enriched == 'no'){
        message.success("We've started enriching your file, it would take some time so we'll notify you on this app if you would be active or else we will send you a mail ")
        const payload= {
          session_id: localStorage.getItem('session_id'),
          message: "We've enriched a file for you, please download it from Chat History tab",
          user_id: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.id,
          schema_to_read: "fileupload",
          table_to_read: localStorage.getItem("tableName"),
          schema_to_write: "fileupload",
          table_to_write: localStorage.getItem("tableName")+'enriched'
        }
        const enrichmentAPI= await startEnrichment(payload)
              .then(response => {

              })
              .catch(error => {
                message.error("Error uploading file");
              });
      } else if(response.data.data[0].is_enriched == 'yes'){
          message.success("We've enriched your file, please click on download button to view your file.")
          setFileEnriched(true)
          localStorage.setItem("file_table_name", response.data.data[0].file_table_name)
          setEnrichedFileTableName(response.data.data[0].file_table_name)
      } else {
        message.info("Your data enrichment is still in process, rest assured we'll notify you once it's done.")
      }   
    }
  };
  const embedLinkCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(embedLink)
        .then(() => {
          message.success('Code copied to clipboard!');
        })
        .catch((err) => {
          console.error('Could not copy text: ', err);
          fallbackCopyTextToClipboard(embedLink);
        });
    } else {
      fallbackCopyTextToClipboard(embedLink);
    }
  };
  const downloadChartAsImage = (id) => {
    const chartElement = document.getElementById(id);
    console.log(chartElement, "-----sdfsf------");
    if (chartElement) {
      html2canvas(chartElement).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'chart.png';
        link.click();
        message.success("Image downlaoded successfully")
      });
    }
  };
  const shareChat = (chat) => {
    try {
      const shareableChat = {
        ...chat,
        tenant: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.organization_domain  
      };
      const chatData = encodeURIComponent(JSON.stringify(shareableChat));
      const urlWithParams = `http://v4.gtmcopilot.com/v4/chat?id=${chatData}`;
  
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(urlWithParams)
          .then(() => {
            message.success('Link to this chat has been copied to clipboard!');
          })
          .catch(err => {
            console.error('Could not copy text: ', err);
            fallbackCopyTextToClipboard(urlWithParams);
          });
      } else {
        fallbackCopyTextToClipboard(urlWithParams);
      }
    } catch (error) {
      console.error('Error while sharing chat: ', error);
    }
  };
  
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
      message.success('Copied to clipboard!');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      message.error('Failed to copy!');
    }
  
    document.body.removeChild(textArea);
  };
  const handleFeedback = async (chat, feedbackType, textmessage) => {
    const payload = {
      session_id: localStorage.getItem('session_id'),
      user_id: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.id,
      chat: chat,
      feedbackType: feedbackType == 0 ? true : false,
      message: textmessage
    }
    let response = await sendFeedback(payload)
    console.log(response)
    if(response.data.status == 'success' ){  
      console.log(response.data.data, "dkaugcfjsdgfajsdgbasx");
      message.success("The answer has been copied to your clipboard")
    }
  }
  const copyAnswer = (textToCopy) => {
    if (!navigator.clipboard) {
      console.error('Clipboard API not supported');
      return;
    }
  
    // Write the text to the clipboard
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log('Text copied to clipboard:', textToCopy);
        message.success("The answer has been copied to your clipboard")
        // You can optionally show a success message or perform other actions
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
        // Handle the error, such as showing an error message to the user
      });
  }
  const emailTrigger = async () => {
    if(receipentEmail != '' && receipentEmail != null){
      message.loading("Sending Chat...");
      
      try {
          const token = localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, '');
          const decodedToken = jwtDecode(token);
          const senderName = `${decodedToken?.name} (${decodedToken?.email})`;
  
          let response = await sendChatEmailTrigger({
              message: JSON.stringify(emailMessage),
              senderName: senderName,
              receiverEmails: receipentEmail
          });
  
          if (response.data.status === "success") {
              message.success('Email sent successfully!');
              setIsEmailModalOpen(false);
          } else {
              throw new Error('We faced some issue while sending the mail, please verify the email address');
          }
      } catch (error) {
          if (error.response) {
              // The request was made and the server responded with a status code
              if (error.response.status === 502) {
                  message.error('We faced some issue while sending the mail, please verify the email address');
              } else {
                message.error(`Error: Recipient not found!`);
              }
          } else if (error.request) {
              // The request was made but no response was received
              message.error('No response received from the server. Please try again later.');
          } else {
              // Something happened in setting up the request that triggered an Error
              message.error('We faced some issue while sending the mail, please verify the email address');
          }
      }
    }
    else{
      message.error("Please add a recipient to send email.")
    }
};

const [isFeedbackVisible, setFeedbackVisible] = useState(false);
const [feedback, setFeedback] = useState("");

const handleFeedbackCancel = () => {
  handleFeedback(localStorage.getItem("dislikeChat"), 1, "")
  setFeedbackVisible(false);
  setFeedback("");
};


const handleFeedbackChange = (e) => {
  setFeedback(e.target.value);
};
const handleDislike = (chat) => {
  localStorage.setItem("dislikeChat", JSON.stringify(chat))
  setFeedbackVisible(true)
}
const handleOk = (chat) => {
  handleFeedback(localStorage.getItem("dislikeChat"), 1, feedback)
  setFeedback("");
  setFeedbackVisible(false)
};
  return (
    <>
    <Modal
      title="Feedback"
      visible={isFeedbackVisible}
      onCancel={handleFeedbackCancel}
      footer={[
        <Button key="back" onClick={handleFeedbackCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk} disabled = {feedback?.trim() == null || feedback?.trim() == ""}>
          OK
        </Button>
      ]}
    >
      <div className="m-8 flex flex-col justify-center gap-4">
        <span className="text-[15px]">Uh-oh! Seems like you're not satisfied with our response. Please describe what went wrong so we could improve it:</span>
        <Input.TextArea
          value={feedback}
          onChange={handleFeedbackChange}
          rows={4}
        />
      </div>
    </Modal>
    <div>
            <Modal
              title=""
              open={isModalOpen}
              onOk={handleClick}
              onCancel={handleClick}
              closable={true}
              footer={null}
              className="modal-page rounded-0 xl:max-w-10/12"
            >
              <div className="flex justify-center items-center">
              
                <Card title="Embed in your code" className="w-[80%] flex flex-col justify-center gap-4 text-[600]" style={{ fontWeight: "600" }}>
                  <div>
                    Copy the Iframe of this graph by using the button below and paste it in your HTML to get the same graph! {'\n\n'}
                    <span style={{ color: 'red' }}>eg code: &lt;iframe&gt;.....&lt;/iframe&gt;</span>{'\n'}
                  </div>
                  <div className="flex justify-center mt-4">
                    <CodeOutlined onClick={embedLinkCopy} className="text-3xl cursor-pointer transition-transform duration-200 hover:scale-110" />
                  </div>
                </Card>
              </div>
            </Modal>
    </div>
    <div>
            <Modal
              title=""
              open={isEmailModalOpen}
              onOk={handleEmailModalClick}
              onCancel={handleEmailModalClick}
              closable={true}
              footer={null}
              className="modal-page rounded-0 xl:max-w-10/12"
            >
              <div className="flex justify-center items-center">
              
                <Card title="Send the received answer on mail..." className="w-[80%] flex flex-col justify-center gap-4 text-[600]" style={{ fontWeight: "600" }}>
                  <div>
                  <Input className="w-[100%] text-center" placeholder="Enter recipient's email id..." value={receipentEmail} onChange={(event) => setReceipentEmail(event.target.value)} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required/>
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button onClick={emailTrigger}>Send Mail</Button>
                  </div>
                </Card>
              </div>
            </Modal>
    </div>

    {chatArray.map((chat, index) => (
        <React.Fragment key={index}>

            {/* Question Component Starts */}
            <div className="flex justify-start items-center gap-11" ref={(index !== 0 && index === chatArray.length - 1) ? lastChatRef : null}>
              <img
                src={
                  localStorage.getItem("profile_url")
                    ? localStorage.getItem("profile_url").toString()
                    : avatar
                }
                alt="user-logo"
                width={30}
                className="rounded-full self-start mt-1"
              />
              <div className="text-[14px] bg-[#E07E65] w-[90%] p-4 rounded-md relative text-white">
                <div className="triangle-left tl-question absolute left-[-20px] top-2" />
                {chat.question || "Show me high level insights on my customer accounts"}
              </div>
            </div>
            {/* Question Component Ends */}
      
            {/* Answer Component Starts */}
            <div className="flex gap-10">
              <div className="flex justify-center items-start">
                <img
                  src={logo}
                  alt="brand-logo"
                  width={35}
                  className="mt-1 self-start"
                />
              </div>
              <div 
                className="text-[14px] bg-gray-200 w-[90%] p-4 rounded-md relative"
              >
                <div className="triangle-left tl-answer absolute left-[-20px] top-2" />
                {(loading && index === chatArray.length - 1)  && 
                <div className="p-2" style={{fontWeight: "500"}}>
                {randomText}</div>}
                <Skeleton loading={index === chatArray.length - 1 && loading} active />
                <>
                {chat.answer?.split("\n")?.map((ansString, idx) => (
                <motion.div 
                    initial="hidden"
                    animate="reveal"
                    transition={{ staggerChildren: 0.02 }}
                    key={idx}
                >
                  <div
                    // initial="hidden"
                    // animate="reveal"
                    // transition={{ staggerChildren: idx * 0.01 }} 
                    className={`${isNumberedList(ansString) && 'px-4'}`}
                    // onAnimationComplete={handleAnimationComplete}
                  >
                    {ansString.split(/(sourceLink\d+)/).map((segment, indx) => {
                      if (segment.match(/^sourceLink\d+$/)) {
                        const number = segment.match(/\d+/)[0];
                        return (
                          <span key={indx} style={{verticalAlign: 'super'}}>
                            <sub style={{
                            // display: 'inline-block',
                            // width: '14px',
                            // borderRadius: '50%',
                            // backgroundColor: 'grey',
                            // color: 'white',
                            // height: '14px',
                            // textAlign: 'center',
                            // lineHeight: '14px',
                            fontSize: '12px',
                            fontStyle: 'italic' 
                          }}>{number}</sub>
                          </span>
                        );
                      } else if (segment.includes("Sources:")) {
                        const parts = segment.split("Sources:");
                        return (
                          <span key={indx}>
                            <span>{parts[0]}</span>
                            <strong>Sources:</strong>
                            <span>{parts[1]}</span>
                          </span>
                        );
                      } else {
                        return (
                          splitString(segment).map((ch, idx) => (
                            <motion.span
                              key={`${ch}_${idx}`}
                              transition={{ duration: 0.1 }}
                              variants={charVariants}
                            >
                              {ch}
                            </motion.span>
                          ))
                          // <motion.span
                          //   key={indx}
                          //   transition={{ duration: 0.5 }}
                          //   variants={charVariants}
                          // >
                          //   {segment}
                          // </motion.span>
                        );
                      }
                    })}
                  </div>
                  </motion.div>
                ))}
                  <div className="flex flex-wrap mt-2 gap-3" style={{ maxWidth: "100%" }}>
                    {chat.sources && chat.sources.map((metadata, index) => (
                          <div 
                          key={`source-${index}`} 
                          className="flex flex-col justify-center items-center border rounded-lg w-[300px] h-[120px] gap-2 cursor-pointer border-[#609DA1] bg-gray-100 hover:scale-105 delay-150 duration-300 ease-in-out" 
                          onClick={() => window.open(`${metadata?.url}`, "_blank", "noreferrer")}
                        > 
                          <sub style={{display: 'inline-block',
                            marginTop: '4px',
                            width: '14px',
                            borderRadius: '50%',
                            backgroundColor: 'grey',
                            color: 'white',
                            height: '14px',
                            textAlign: 'center',
                            lineHeight: '14px',
                            fontSize: '9px' }}>
                            {metadata.number}
                          </sub>
                          <div className="flex gap-2 justify-start items-center w-[90%] text-[15px]">
                            <div className="flex justify-center items-center border border-[#609DA1] rounded-full p-1 bg-white" style={{ width: '30px', height: '30px' }}>
                              {metadata?.imageUrl?.includes("http") ? (
                                <img alt="img" src={metadata?.imageUrl} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                              ) : (
                                <LinkOutlined style={{ color: 'black', fontSize: "20px" }} />
                              )}
                            </div>
                            {metadata?.title?.length > 25 ? metadata?.title?.substring(0, 25) + "..." : metadata?.title}
                          </div>
                          <div className="flex justify-start items-center gap-2 w-full pl-[0.75rem]">

                            <div className="text-[12px]">
                              {metadata?.description?.length > 90 ? metadata?.description?.substring(0, 90) + "..." : metadata?.description}
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </>
              </div>
            </div>
            {/* Answer Component Ends */}
      
            {(!loading || index !== chatArray.length - 1) && (
              <>
                {/* PreVis Component Starts */}



                {/* <div className="w-full flex justify-between items-center pr-20 pl-24">
                  <div className="flex items-center gap-10">
                    <div className="flex justify-center items-center gap-2">
                      <input
                        type="text"
                        name={`chart-name-${index}`}
                        id={`chart-name-${index}`}
                        defaultValue={"Customer Accounts"}
                        className="text-[14px] text-center"
                      />
                      <label
                        htmlFor={`chart-name-${index}`}
                        className="flex justify-center items-center"
                      >
                        <EditFilled className="flex justify-center items-center text-base cursor-pointer" />
                      </label>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                      {tableExtracted.map((tableName, index) => (
                        <div
                          key={index}
                          className="px-2 p-0.5 bg-[#E07E65] text-white rounded-md text-[14px]"
                        >
                          {tableName}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <PieChartFilled
                      className={`${
                        activeCta === 1
                          ? "bg-[#E07E65] text-white"
                          : "bg-gray-200 text-black"
                      } rounded-md p-2.5 cursor-pointer text-[12px] flex justify-center items-center`}
                      onClick={() => setActiveCta(1)}
                    />
                    <FilterFilled
                      className={`${
                        activeCta === 2
                          ? "bg-[#E07E65] text-white"
                          : "bg-gray-200 text-black"
                      } rounded-md p-2.5 cursor-pointer text-[12px] flex justify-center items-center`}
                      onClick={() => setActiveCta(2)}
                    />
                    <div
                      className={`${
                        activeCta === 3
                          ? "bg-[#E07E65] text-white"
                          : "bg-gray-200 text-black"
                      } rounded-md px-4 p-1.5 cursor-pointer text-[14px] flex justify-center items-center`}
                      onClick={() => setActiveCta(3)}
                    >
                      Edit
                    </div>
                  </div>
                </div> */}



                {/* PreVis Component Ends */}
          
                {/* AnswerData Component Starts */}


                {/* <div className="flex justify-between items-center flex-wrap pr-20 pl-24">
                  {answerData.map((data, index) => (
                    <div key={index} className="flex flex-col justify-center items-start">
                      <div className="text-[12px]">{data.label}</div>
                      <div className="text-[14px] text-[#E07E65]">{data.value}</div>
                    </div>
                  ))}
                </div> */}


                {/* AnswerData Component Ends */}
          
                {/* Chart Component Starts */}
                
                {typeof chat.chartData === 'object' && chat.chartData !== null && Object.keys(chat.chartData).length > 0 && 
                
                  <div className="w-full flex justify-center items-center">
                    <Card className="w-[85%]">
                      <div id={chat.chartData.metadata.labelX+chat.chartData.metadata.labelY+chat.chartData.metadata.rep}>
                      <Bar
                        className="h-[20rem]"
                        data={{
                          labels: chat.chartData.data.map((data) => data.xValue),
                          datasets: [
                            {
                              label: chat.chartData.metadata.rep,
                              data: chat.chartData.data.map((data) => data.yValue),
                              backgroundColor: [
                                "#E07E65",
                                "#F39F8E",
                                "#8E4E2A",
                                "#653712",
                                "#F9B8A6",
                              ],
                              borderRadius: 5,
                            },
                          ],
                        }}
                        options={{
                          scales: {
                            x: {
                              title: {
                                display: true,
                                text: chat.chartData.metadata.labelX,
                              },
                            },
                            y: {
                              title: {
                                display: true,
                                text: chat.chartData.metadata.labelY,
                              },
                            },
                          },
                        }}
                      />
                      </div>
                    </Card>
                  </div>
                }

                {/* Chart Component Ends */}
                {/* QuickActions Component Starts */}
                {(!chat?.question?.includes("Ask questions about the file?") && !chat?.question?.includes("Exit QnA")) ? (
                  <div className="flex justify-end items-center w-full gap-2 pr-20">
                    {chatArray[0].question?.includes("You've uploaded") && (!fileEnriched && !chatArray[0].is_enriched) && <Button onClick={handleEnrichButtonClick}>Enrich File/Check Status</Button>}
                    {chatArray[0].question?.includes("You've uploaded") && (fileEnriched || chatArray[0].is_enriched) && <Button onClick={downloadEnrichedFile}>Downlaod Enriched File</Button>}
                    <div className="flex justify-center items-center border cursor-pointer bg-gray-200 hover:text-white text-[14px] rounded-md">
                    <Menu mode="inline" >
                      <SubMenu key="sub1" title="Quick Actions">
                      {(typeof chat.chartData === 'object' && chat.chartData !== null && Object.keys(chat.chartData).length > 0) && <Menu.Item selectable={false} key="embed_g" onClick={() => generateEmbedCode(chat.chartData)}>Embed Insight</Menu.Item>}
                      {(typeof chat.chartData === 'object' && chat.chartData !== null && Object.keys(chat.chartData).length > 0) && <Menu.Item selectable={false} disabled={!(typeof chat.chartData === 'object' && chat.chartData !== null && Object.keys(chat.chartData).length > 0)} key="export_g" onClick={() => downloadChartAsImage(chat.chartData.metadata.labelX+chat.chartData.metadata.labelY+chat.chartData.metadata.rep)}>Export .png</Menu.Item>}
                        <Menu.Item selectable={false} key="share_chat" onClick={() => shareChat(chat)}>Share chat</Menu.Item>
                        {/* <Menu.Item selectable={false} key="dashboard">Save to Dashboard</Menu.Item>
                        <Menu.Item selectable={false} key="analytics">Save to Analytics & Segment</Menu.Item> */}
                        <Menu.Item selectable={false} key="email" onClick={() => sendChatReportMessage((typeof chat.chartData === 'object' && chat.chartData !== null && Object.keys(chat.chartData).length > 0) ? chat.chartData : "", chat.question, chat.answer)}>Send report to email</Menu.Item>
                        {/* Add more submenu items as needed */}
                      </SubMenu>
                      
                    </Menu>
                    </div>
                  </div>
                ) : <></>} 
                {/* QuickActions Component Ends */}
          
                {/* Insights Component Starts */}
                {chat?.suggestions && chat?.suggestions?.length > 0 ? (
                  <div 
                    className="flex justify-start items-center flex-wrap gap-4 bg-gray-200 text-base w-[90%] rounded-md p-4 ml-[74px]"
                  >
                    {chat?.suggestions?.map((insight, index) => (
                      <div 
                        key={index} 
                        className="flex justify-center items-center text-[14px] text-[#E07E65] bg-white border border-[#E07E65] rounded-md p-2 cursor-pointer hover:scale-105 duration-300 ease-in-out hover:bg-[#E07E65] hover:text-white"
                        onClick={insight?.includes("Ask questions about the file?") ? handleAskCSV : 
                          insight?.includes("Exit QnA") ? handleExit : null
                        }
                      >
                        {insight}
                      </div>
                    ))}
                  </div>
                ) : <></>}
                {/* Insights Component Ends */}
          
                {/* Feedback Component Starts */}
                <div className={`flex justify-end items-center gap-4 pr-20 ${index === chatArray.length - 1 && 'pb-32'}`} ref={index === chatArray.length - 1 ? lastInsightRef : null}>
                  <CopyOutlined className="text-base cursor-pointer hover:scale-125 duration-300" onClick={() => copyAnswer(chat.answer)}/>
                  {/* <UndoOutlined
                    rotate={100}
                    className="text-base cursor-pointer hover:scale-125 duration-300"
                  /> */}
                  <LikeOutlined className="text-base cursor-pointer hover:scale-125 duration-300" onClick={() => handleFeedback(JSON.stringify(chat), 0, " ")}/>
                  <DislikeOutlined className="text-base cursor-pointer hover:scale-125 duration-300" onClick={() => handleDislike(chat)}/>
                </div>
                {/* Feedback Component Ends */}

              </>
            )}

            {/* Placeholder text for margin bottom Starts */}
            {loading && index === chatArray.length - 1 && (
              <div className="mt-40 text-white">
                Placeholder Text
              </div>
            )}
            {/* Placeholder text for margin bottom Ends */}
        </React.Fragment>
    ))}
    </>
  );
};

export default Chat;
