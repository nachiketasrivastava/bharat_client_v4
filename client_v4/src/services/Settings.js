import { Client } from './Client.js'

// Organization settings

export const GetUserSetting = async(formdata) => {
    try {
        return await Client.post("/settings/getUserSetting", formdata);
    } catch (error) {
        return error;
    }
}

export const OrganizationUpdate = async(formdata) => {
    try {
        return await Client.post("/settings/updateOrganizations", formdata);
    } catch (error){
        return error;
    }
}
export const uploadLogo = async(formdata) => {
    try {
        return await Client.post("/settings/uploadLogo", formdata);
    } catch (error){
        return error;
    }
}

export const readLogo = async(formdata) => {
    try {
        return await Client.post("/settings/readLogo", formdata);
    } catch (error){
        return error;
    }
}

export const UserUpdate = async(formdata) => {
    try {
        return await Client.post("/settings/updateUser", formdata);
    } catch (error) {
        return error;
    }
}


export const PlanUpdate = async(formdata) => {
    try {
        return await Client.post("/settings/updatePlan", formdata);
    } catch (error) {
        return error;
    }
}

export const InviteUser = async(formdata) => {
    try {
        return await Client.post("/settings/inviteUser", formdata);
    } catch (error){
        return error;
    }
}
