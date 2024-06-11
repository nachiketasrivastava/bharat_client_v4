import { Client } from './Client.js'

// BuildYourICP
export const getTenant = async (formdata) => {
    try {
      return await Client.post('/generateList/getTenant', formdata);
    } catch(error){
      return error;
    }
}
export const createList = async (formdata) => {
    try {
      return await Client.post('/generateList/createListRecord', formdata);
    } catch(error){
      return error;
    }
}
export const getAllList = async (formdata) => {
    try {
      return await Client.post('/generateList/getAllListData', formdata);
    } catch(error){
      return error;
    }
}
export const updateListData = async (id, formdata) => {
    try {
      return await Client.post('/generateList/updateListRecord/'+id, formdata);
    } catch(error){
      return error;
    }
}
export const deleteListData = async (id, formdata) => {
    try {
      return await Client.post('/generateList/deleteListRecord/'+id, formdata);
    } catch(error){
      return error;
    }
}
