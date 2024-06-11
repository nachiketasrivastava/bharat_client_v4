import { Client } from './Client.js'

export const getLeads = async (formdata) => {
  const { tenant, page, limit, filters } = formdata;
  try {
    return await Client.post(`/freemium/getLeads?tenant=${tenant}&page=${page}&limit=${limit}`, formdata);
  } catch(error){
    return error;
  }
}

export const getFileStatus = async (formdata) => {
  try {
    return await Client.post('/freemium/getFileStatus', formdata);
  } catch(error){
    return error;
  }
}

