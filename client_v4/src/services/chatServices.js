import { Client } from './Client.js'

//get response from chat
export const chatresponse = async (formdata) => {
  try {
    return await Client.post("/chatAPI/getChatResponse", formdata);
  } catch (err) {
    return err;
  }
};
export const talkableresponse = async (formdata) => {
  try {
    return await Client.post("/chatAPI/getTalkableResponse", formdata);
  } catch (err) {
    return err;
  }
};
//get history of chat
export const chatHistory = async (formdata) => {
  try {
    return await Client.post("/chatAPI/getChatHistory", formdata);
  } catch (err) {
    return err;
  }
};
// Talk To CSV
export const ragQuery = async (formdata) => {
  try {
    return await Client.post("/chatAPI/ragQuery", formdata);
  } catch (err) {
    return err;
  }
};
// Send Chat on Email
export const sendChatEmailTrigger = async (formdata) => {
  try {
    return await Client.post("/users/sendChatReportTrigger", formdata);
  } catch (err) {
    return err;
  }
};
export const addFileSession = async (formdata) => {
  try {
    return await Client.post("/chatAPI/addFileSession", formdata);
  } catch (err) {
    return err;
  }
};
export const csvDataInDB = async (formdata) => {
  try {
    return await Client.post("/chatAPI/uploadCSVinDB", formdata);
  } catch (err) {
    return err;
  }
};
export const sendUserMessage = async (formdata) => {
  try {
    return await Client.post("/chatAPI/sendMessageToUser", formdata);
  } catch (err) {
    return err;
  }
};
export const checkEnrichStatus = async (formdata) => {
  try {
    return await Client.post("/chatAPI/checkEnrichStatus", formdata);
  } catch (err) {
    return err;
  }
};
export const downloadCSV = async (formdata) => {
  try {
    return await Client.post("/chatAPI/downloadCSV", formdata);
  } catch (err) {
    return err;
  }
};export const startEnrichment = async (formdata) => {
  try {
    return await Client.post("/chatAPI/startEnrichment", formdata);
  } catch (err) {
    return err;
  }
};
export const getGenericResponse = async (formdata) => {
  try {
    return await Client.post("/chatAPI/getGenericResponse", formdata);
  } catch (err) {
    return err;
  }
};
export const sendFeedback = async (formdata) => {
  try {
    return await Client.post("/chatAPI/handleFeedback", formdata);
  } catch (err) {
    return err;
  }
};