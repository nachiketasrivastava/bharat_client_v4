import { gapi } from "gapi-script";
import { useEffect, useState } from "react";
import "./GoogleAuth.css";
// import { commonMail } from "../../helpers/helpers";
import Toaster from "../Toaster/Toaster";
import { useNavigate } from "react-router-dom";
import { GoogleSignIn } from "../../services/AuthServices";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

const GoogleAuth = ({ setIsLoggedIn, onLogin }) => {
  const commonMail = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'protonmail.com'];
  const { pathname } = useLocation();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const nextUrl = queryParams.get("next");
  const tenantUrl = queryParams.get("tenant");
  const navigate = useNavigate();

  const [ShowToaster, setShowToaster] = useState(false);
  const [ShowToasterContent, setShowToasterContent] = useState({});
  const clientId =
    "537751350681-p1rne9o82e52a7532eto3cti00vlkman.apps.googleusercontent.com";

  const onSuccess = async (response) => {
    // console.log(response);
    try {
      const decoded = jwtDecode(response.credential);
      const { email, given_name, family_name, sub, hd, picture, jti } = decoded;
      if (commonMail.includes(email?.split("@")[1])) {
        setShowToaster(true);
        setShowToasterContent({
          type: "error",
          content: "User with Business Email are allowed to sign-up / login ",
        });
      } else {
        localStorage.setItem("username", given_name + " " + family_name);
        localStorage.setItem("profile_url", picture);
        localStorage.setItem("token", jti);
        localStorage.setItem("id", jti);
        localStorage.setItem("email", email);

        let check = await GoogleSignIn({
          email: email,
          username: given_name + " " + family_name,
          googleID: sub,
          organization_name: hd?.replace(".", " "),
          organization_domain: hd,
          name: given_name + "|" + family_name,
        });

        if (check.data?.status === "success") {
          const loginToken = check.data.token;
          localStorage.setItem("loginToken", loginToken);
          setIsLoggedIn(true);
          console.log(
            "User data stored in local storage:",
            localStorage.getItem("loginToken")
          );
          // console.log(userData?.usertype);
          onLogin()
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onFailure = (err) => {
    console.log("failed", err);
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  });

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {ShowToaster && <Toaster props={ShowToasterContent} />}
      <div className="flex justify-center pb-3">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onFailure}
          text={`${pathname === "/login" ? "signin_with" : "signup_with"}`}
          size="medium"
          width={200}
          logo_alignment="left"
          shape="pill"
          theme="filled_black"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
