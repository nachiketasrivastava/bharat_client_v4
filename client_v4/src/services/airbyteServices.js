import { Client } from './Client.js'

export const airbyteDisconnection = async (formdata) => {
    try {
      return await Client.post('/airbyteAPI/airbytestop', formdata);
    } catch(error){
      return error;
    }
}

export const airbyteSync = async (formdata) => {
  try {
    return await Client.post('/airbyteAPI/airbyteSync', formdata);
  } catch(error){
    return error;
  }
}