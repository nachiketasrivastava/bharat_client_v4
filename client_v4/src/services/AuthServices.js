import { Client } from './Client.js'

//Login_Form
export const LoginUser = async (formdata) => {
  try {
    return await Client.post("/users/loginJWT", formdata);
  } catch (err) {
    return err;
  }
};
//Signup Form
export const RegisterUser = async (formdata) => {
  try {
    return await Client.post("/users/register", formdata);
  } catch (err) {
    return err;
  }
};
// Verify user email
export const VerfiyUser = async (formdata) => {
  try{
    return await Client.post("/users/verifyUser", formdata);
  } catch(error){
    return error;
  }
}
// froget Password email sending
export const Forgotpassword = async (formdata) => {
  try {
    return await Client.post("/users/forgotPassword", formdata)
  } catch (error) {
    return error;
  }
}
// Set New password
export const PasswordReset = async (formdata) => {
  try {
    return await Client.post('/users/resetPassword', formdata);
  } catch (error) {
    return error;
  }
}

export const GoogleSignIn = async (formdata) => {
  try {
    return await Client.post("/users/googleRegisterJWT", formdata);
  } catch (error) {
    return error;
  }
}

export const ChangeUserType = async (formdata) => {
  try {
    return await Client.post("/users/changeUserType", formdata);
  } catch (error) {
    return error;
  }
}

export const GetUserStatus = async (formdata) => {
  try {
    return await Client.post("/users/userStatus", formdata);
  } catch (error) {
    return error;
  }
}
export const enrichFileTrigger = async (formdata) => {
  try {
    return await Client.post("/users/enrichmentUpdate", formdata);
  } catch (error) {
    return error;
  }
}