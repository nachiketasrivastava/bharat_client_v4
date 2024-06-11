import { Client } from './Client.js'

// BuildYourICP
export const CreateICP = async (formdata) => {
    try {
      return await Client.post('/icp/create', formdata);
    } catch(error){
      return error;
    }
}

export const ReadICP = async (formdata) => {
  try {
    return await Client.post('/icp/allData', formdata);
  } catch(error){
    return error;
  }
}

export const DeleteICP = async (id) => {
  try{
    return await Client.post('/icp/delete/'+id)
  } catch(error){
    return error;
  }
}

export const UpdatePDFRows = async (id, formdata) => {
  try {
    return await Client.post('/icp/updatePDFRows/'+id, formdata);
  } catch (error) {
    return error;
  }
}

export const UpdateICP = async (id, formdata) => {
  try{
    return await Client.post('/icp/update/'+id, formdata);
  } catch(error){
    return error;
  }
}

export const CheckForExistingName = async (formdata) => {
  try {
    return await Client.post('/icp/checkForExistingName', formdata);
  } catch (error) {
    return error;
  }
}