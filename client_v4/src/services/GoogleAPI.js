import { Client } from './Client.js'

export const EstablishConnection = async (formdata) => {
    try {
      return await Client.post('/googleAPI/establishConnection', formdata);
    } catch(error){
      return error;
    }
}

export const WriteInSheet = async (formdata) => {
    try {
      return await Client.post('/googleAPI/writeInSheet', formdata);
    } catch(error){
      return error;
    }
}

export const addCalendarEvents = async (formdata) => {
  try {
    return await Client.post('/googleAPI/addCalendarEvents', formdata);
  } catch(error){
    return error;
  }
}
