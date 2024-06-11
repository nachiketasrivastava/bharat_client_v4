import React, { useState, useEffect } from "react";
import { Modal, Select, Button, Alert } from "antd";
import { UserOutlined, BankOutlined } from "@ant-design/icons";

const HeaderMappingModal = ({ visible, onCancel, onOk, csvHeaders }) => {
  const standardHeaders = {
    first_name: "",
    last_name: "",
    job_title: "",
    account_url: "",
    account_name: "",
    account_country: null, // Change to null to allow deselection
  };

  const [dataType, setDataType] = useState("none");

  const autoMapHeaders = (csvHeaders, dataType) => {
    const headerMappings = {
      first_name: [
        /^first_name$/i, /^fname$/i, /^given\s*name$/i, /^forename$/i,
        /first\s*name/i, /fname/i, /given\s*name/i, /forename/i
      ],
      last_name: [
        /^last_name$/i, /^lname$/i, /^family\s*name$/i, /^surname$/i,
        /last\s*name/i, /lname/i, /family\s*name/i, /surname/i
      ],
      job_title: [
        /^job_title$/i, /^title$/i, /^role$/i, /^position$/i, /^occupation$/i,
        /job\s*title/i, /title/i, /role/i, /position/i, /occupation/i
      ],
      account_country: [
        /^account_country$/i, /^country$/i, /^location$/i, /^nation$/i, /^region$/i,
        /account\s*country/i, /country/i, /location/i, /nation/i, /region/i
      ],
      account_url: [
        /^account_url$/i, /^website$/i, /^url$/i, /^web\s*address$/i, /^homepage$/i,
        /account\s*url/i, /website/i, /url/i, /web\s*address/i, /homepage/i
      ],
      account_name: [
        /^account_name$/i, /^company\s*name$/i, /^organization$/i, /^org\s*name$/i, /^business\s*name$/i,
        /account\s*name/i, /company\s*name/i, /organization/i, /org\s*name/i, /business\s*name/i
      ]
    };

    const mappedHeaders = {};

    Object.keys(headerMappings).forEach(standardHeader => {
      if (dataType === "company" && ['first_name', 'last_name', 'job_title'].includes(standardHeader)) {
        return; // Skip these fields for company data type
      }
      const regexArray = headerMappings[standardHeader];
      for (const regex of regexArray) {
        const matchedHeader = csvHeaders.find(header => regex.test(header));
        if (matchedHeader) {
          mappedHeaders[standardHeader] = matchedHeader;
          break;
        }
      }
    });

    return mappedHeaders;
  };

  const [headerMapping, setHeaderMapping] = useState(standardHeaders);
  const [message, setMessage] = useState({ content: "", type: "" });

  useEffect(() => {
    if (dataType !== "none") {
      const initialMapping = autoMapHeaders(csvHeaders, dataType);
      setHeaderMapping(prev => ({
        ...standardHeaders,
        ...initialMapping
      }));
    }
  }, [csvHeaders, dataType]);

  useEffect(() => {
    if (dataType !== "none") {
      const initialMapping = autoMapHeaders(csvHeaders, dataType);
      const mappedFields = Object.values(initialMapping).filter(Boolean);
      if (mappedFields.length > 0) {
        setMessage({
          content: "We've tried to map some fields with our standard fields. Please map other fields and then continue.",
          type: "success"
        });
      } else {
        setMessage({
          content: "We tried but couldn't map any fields automatically. Please map the fields manually.",
          type: "error"
        });
      }
    }
  }, [csvHeaders, dataType]);

  const handleHeaderChange = (standardHeader, value) => {
    setHeaderMapping(prev => ({ ...prev, [standardHeader]: value }));
  };

  const handleDataTypeChange = (type) => {
    setDataType(type);
    setMessage({ content: "", type: "" });
  };

  const handleCancel = () => {
    onCancel();
    handleDataTypeChange("none");
  };

  const handleSubmit = (data) => {
    onOk(data);
    handleDataTypeChange("none");
  };

  const selectedHeaders = Object.values(headerMapping).filter(value => value);
  const requiredFieldsPeople = ['first_name', 'last_name', 'job_title', 'account_url', 'account_name'];
  const requiredFieldsCompany = ['account_url', 'account_name', 'account_country'];
  const allFieldsMappedPeople = requiredFieldsPeople.every(field => headerMapping[field]);
  const allFieldsMappedCompany = requiredFieldsCompany.every(field => headerMapping[field]);

  return (
    <Modal
      title="Map CSV Headers"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => handleSubmit(headerMapping)}
          disabled={
            dataType === "none" ||
            (dataType === "people" && !allFieldsMappedPeople) ||
            (dataType === "company" && !allFieldsMappedCompany)
          }
        >
          OK
        </Button>
      ]}
    >
      {dataType === "none" && (
        <div className="m-8 flex flex-col justify-center gap-4">
          <span className="text-[15px]">How do you want GTMC to process your CSV upload?</span>
          <div className="flex align-center gap-4">
            <UserOutlined className="text-[15px]" />
            <Button onClick={() => handleDataTypeChange("people")} className="hover:bg-gray-200">People</Button>
          </div>
          <div className="flex align-center gap-4">
            <BankOutlined className="text-[15px]"/>
            <Button onClick={() => handleDataTypeChange("company")} className="hover:bg-gray-200">Company</Button>
          </div>
        </div>
      )}
      {dataType !== "none" && (
        <>
          {message.content && (
            <Alert
              message={message.content}
              type={message.type}
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          {Object.keys(headerMapping).map(standardHeader => (
            (dataType === "people" || (dataType === "company" && (standardHeader === 'account_url' || standardHeader === 'account_name' || standardHeader === 'account_country'))) && (
              <div key={standardHeader} style={{ marginBottom: 16 }}>
                <span>{standardHeader}{standardHeader !== 'account_country' && <span className="text-[red]">*</span>} : </span>
                <Select
                  style={{ width: 200 }}
                  value={headerMapping[standardHeader]}
                  onChange={value => handleHeaderChange(standardHeader, value)}
                >
                  {standardHeader === 'account_country' && (
                    <Select.Option key="null" value={null}>None</Select.Option>
                  )}
                  {csvHeaders.map(header => (
                    <Select.Option
                      key={header}
                      value={header}
                      disabled={selectedHeaders.includes(header) && header !== headerMapping[standardHeader]}
                    >
                      {header}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )
          ))}
        </>
      )}
    </Modal>
  );
};

export default HeaderMappingModal;
