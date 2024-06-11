import { Client } from './Client.js'

// BuildYourICP
export const integrationStatus = async (formdata) => {
    try {
      return await Client.post('/integration/integrationStatus', formdata);
    } catch(error){
      return error;
    }
}