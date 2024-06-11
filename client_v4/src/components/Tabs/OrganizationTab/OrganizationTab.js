import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { message } from "antd";
import constants from "../../../../src/helpers/Constants";
import { Select } from "antd";
import "./OrganizationTab.css";
import axios from "axios";
import featuredUpload from "../../../assets/images/featuredUpload.png";
import organisationLogo from "../../../assets/images/image-rectangle.svg";
import reload from "../../../assets/images/reload.png";
import globe from "../../../assets/images/globe 01.svg";
import computer from "../../../assets/images/computer.svg";
import Toaster from "../../Toaster/Toaster";
import { CloseCircleOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
// import { uploadLogo } from "../../../../../backend/controllers/setting_controller";
import { OrganizationUpdate, uploadLogo, readLogo} from "../../../../src/services/Settings";

const OrganizationTab = ({
  GetUserSetting,
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const userDetails = jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))
  const [buttonDisbaled, setButtonDisbaled] = useState(true);
  const [nameChanged, setNameChanged] = useState(false);
  const [websiteChanged, setWebsiteChanged] = useState(false);
  const [countryChanged, setCountryChanged] = useState(false);
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('United States');
  const [ShowToaster, setShowToaster] = useState(false);
  const [ShowToasterContent, setShowToasterContent] = useState({});
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageData, setImageData] = useState(null);
  // const OnlyAlphabet = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const maxSize = 2 * 1024 * 1024; // 2 MB
    const validImageTypes = ["image/png"];
    //['image/jpeg', 'image/png', 'image/gif']

    // Validate file type
    if (!validImageTypes.includes(file.type)) {

      message.error("Invalid file type. Only PNG images are allowed")
      // setShowToaster(false);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      message.error("File size exceeds 2 MB limit")
      return;
    }

    // Handle valid file
    console.log(file);
    setUploadedFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!uploadedFile) {
      message.error("No file selected for upload.")
      return;
    }
    if (!(uploadedFile instanceof Blob)) {
      console.error("uploadedFile is not a Blob or File object.");
      return;
    }
  
    try {
      // pre signed url fetch
      const response = await uploadLogo({ organizationDomain: website});
      const { uploadURL } = response.data;
  
      if (!uploadURL) {
        throw new Error("Pre-signed URL not provided in the response.");
      }
  // actual upload
      const options = {
        headers: {
          host: "icusotmerorganisationlogo.s3.amazonaws.com",
        },
      };
  
      await axios.put(uploadURL, uploadedFile, options);
  
      message.success("Your Organization logo is uploaded successfully.")
      const imageData = await handleReadImage(jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.organization_domain);
      if (imageData) {
      setImageLoaded(true)
      setImageData(imageData)
      setUploadedFile(null);
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      message.error("Failed to upload logo to S3.")
    }
  };

  const handleReadImage = async (domain) => {
    try {
      if (!domain) {
          message.error("Please provide an organization domain.")
        return;
      }
      const response = await readLogo({ organizationDomain: domain });
      const { imageData } = response.data;
  
      if (!imageData) {
        throw new Error("Image data not provided in the response.");
      }
      return imageData;
    } catch (error) {
      console.error("Error reading image:", error);
      return null; // Return null in case of error.
    }
  };
  
  const handleUpdate = () => {
    setImageLoaded(false)
  }

  const handleDelete = () => {
    // Handle delete functionality
    setUploadedFile(null);
  };

  let sortedOptions = constants.optionsCountry.sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  sortedOptions = [{ value: "", label: "Select" }, ...sortedOptions];

  const UpdateOrganization = async (data) => {
    let response = await OrganizationUpdate(data);
    if (response) {
      console.log(response.data);
      var successMsg;
      if (nameChanged) {
        successMsg = "Organization name ";
      }

      if (countryChanged) {
        successMsg = "Organization country ";
      }

      if (websiteChanged) {
        successMsg = "Organization website ";
      }

      if (nameChanged && countryChanged) {
        successMsg = "Organization name and country ";
      }

      if (nameChanged && websiteChanged) {
        successMsg = "Organization name and website ";
      }

      if (websiteChanged && countryChanged) {
        successMsg = "Organization country and website ";
      }

      if (nameChanged && countryChanged && websiteChanged) {
        successMsg = "Organization name, country and website ";
      }

      message.success(successMsg + "updated successfully");

      setButtonDisbaled(true);
      setNameChanged(false);
      setCountryChanged(false);
    }
  };

  const validate = (e) => {
    e.preventDefault();
    setButtonDisbaled(true);
    if (name == "" && country == "") {
      message.error("Organization Name should not be empty. Also, please select Organization Country")
    } else if (name == "") {
        message.error("Organization Name should not be empty")
    } else if (country == "") {
        message.error("Please select Organization Country")
    } else if (website == "") {
        message.error("Organization Website should not be empty")
    } else {
      const data = {
        OrganizationName: name,
        OrganizationCountry: country,
        OrganizationWebsite: website,
        userID: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))?.id,
      };
      console.log(data);
      UpdateOrganization(data);
    }
  };
  useEffect(() => {
    (async () => {
      const imageData = await handleReadImage(jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).organization_domain);
      if (imageData && !imageLoaded) {
        setImageLoaded(true)
        setImageData(imageData)
      }
    })();
  }, [localStorage.getItem('user')]);
  useEffect(() => {
    (async () => {
        let response = await GetUserSetting({
            userID: jwtDecode(localStorage.getItem("loginToken")?.replace(process.env.REACT_APP_TOKEN_PASSCODE, '')).id,
        });
        if(response){
            console.log(response.data.data[0]);
            const organizationName = response.data.data[0].organization_name;
            setName(organizationName.includes(" ") ? organizationName.split(" ")[0] : organizationName);
            if(response.data.data[0].organization_country){
            setCountry(response.data.data[0].organization_country);
            }
            else{
            setCountry('United States');
            }
            setWebsite(response.data.data[0].organization_domain);
        }
    })();
  }, [])

  return (
    <>
      <div className="form-row">
        <label htmlFor="field1" className="form-label flex">
          <img
            src={organisationLogo}
            alt="organisationLogo"
            style={{ paddingBottom: "5px", marginRight: "5px" }}
          />
          Organization Logo
        </label>
        {uploadedFile ? (
          <div className="preview">
            <div className="logo-column">
              <img
                src={URL.createObjectURL(uploadedFile)}
                alt="uploadedLogo"
                className="logo"
              />
            </div>
            <div className="text-column">
              <div className="text-header">{uploadedFile.name}</div>
              <div className="text">
                Upload logo max size should be less than 2MB
              </div>
              <div className="button-container">
                <button className="upload-button" onClick={handleUpload}>
                  Upload
                </button>
                <button className="delete-button" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : imageLoaded ? (
          <div className="preview">
            <div className="logo-column">
              <img
                src={`data:image/png;base64, ${imageData}`}
                id="logoImage"
                alt="uploadedLogo"
                className="logo"
              />
            </div>
            <div className="text-column">
              <div className="text-header">Your logo exists in system</div>
              <div className="text">
                Upload logo max size should be less than 2MB
              </div>
              <div className="button-container">
                <button className="upload-button" onClick={handleUpdate}>
                  Update
                </button>
              </div>
            </div>
          </div>
        ) : (          
        <div 
          {...getRootProps()}
          className={`drop-box ${isDragActive ? "drag-active" : ""}`}
        >
          <input {...getInputProps()} />
          <img src={featuredUpload} alt="featuredUpload" />
          <div>
            <button
              onClick={(event) => {
                event.preventDefault();
              }}
              style={{ color: "#609DA1", border: "none", background: "none"}}
            >
              Click To Upload A Logo or
            </button>
            <span style={{ color: "#999999" }}> drag and drop</span>
          </div>
          <div>PNG (max. 800x400px)</div>
        </div>)}
      </div>

      <div className="form-row">
        <label htmlFor="field2" className="form-label flex">
          <img
            src={reload}
            alt="organisationLogo"
            style={{ paddingBottom: "5px", marginRight: "5px" }}
          />{" "}
          Organization Name
        </label>
        <input
          type="text"
          id="field2"
          className="form-input"
          value={name}
          onChange={(e) => {
            setButtonDisbaled(false);
            setNameChanged(true);
            setName(e.target.value);
          }}
        />
      </div>
      <div className="last-row">
        <div className="last-div">
          <label htmlFor="field3" className="form-label flex">
            <img
              src={globe}
              alt="organisationLogo"
              style={{ paddingBottom: "5px", marginRight: "5px" }}
            />{" "}
            Organization Country
          </label>
          <Select
            id="field3"
            options={sortedOptions}
            className="organisation-select"
            value={country}
            defaultValue={country}
            onChange={(e) => {
              setButtonDisbaled(false);
              setCountryChanged(true);
              setCountry(e);
            }}
          />
        </div>
        <div className="last-div">
          <label htmlFor="field4" className="form-label flex">
            <img
              src={computer}
              alt="organisationLogo"
              style={{ paddingBottom: "5px", marginRight: "5px" }}
            />{" "}
            Organization Website
          </label>
          <input
            type="text"
            id="field4"
            className="form-input websiteDisabled"
            disabled
            value={website}
            onChange={(e) => {
              setButtonDisbaled(false);
              setWebsiteChanged(true);
              setWebsite(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="form-btn">
        <button onClick={validate} disabled={buttonDisbaled}>
          Update Organization Info
        </button>
      </div>
    </>
  );
};

export default OrganizationTab;
