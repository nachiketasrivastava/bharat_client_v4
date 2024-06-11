import { Client } from './Client.js'

export const getSlackToken = async (formdata) => {
    try {
      return await Client.post('/slackIntegration/getSlackToken', formdata);
    } catch(error){
      return error;
    }
}

export const deleteSlackIntegration = async (formdata) => {
  try {
    return await Client.post('/slackIntegration/deleteSlackIntegration', formdata);
  } catch(error){
    return error;
  }
}