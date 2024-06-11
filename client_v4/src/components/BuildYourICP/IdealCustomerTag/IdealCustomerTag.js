import "./IdealCustomerTag.css";
import { Row, Col, Card } from "antd";
import whooz from "../../../assets/images/gtmCopilotname.png";
import constants from "../../../helpers/Constants";

const IdealCustomerTag = ({ rowData, userDetails }) => {
  console.log(rowData, "rowData");
  const createdTimestamp = new Date(rowData?.createddate);
  const updatedTimestamp = new Date(rowData?.updateddate);
    
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
    // second: '2-digit',
    // timeZoneName: 'short'
  };

  const createdDate = createdTimestamp?.toLocaleDateString('en-US', options);
  const updatedDate = updatedTimestamp?.toLocaleDateString('en-US', options);

  function getValueLabel(value, optionsArray) {
    const foundOption = optionsArray?.find(option => option?.value === value);
    return foundOption ? foundOption?.label : "Unknown";
  }
  
  function convertSignalsToLabels(signals, optionsArray) {
    const signalValues = signals?.split('|')?.map(signal => signal?.trim());
    const signalLabels = signalValues?.map(signalValue => getValueLabel(signalValue, optionsArray));
    return signalLabels?.join(', ');
  }
  
  const convertedAdvancedTechnologyLabels = convertSignalsToLabels(rowData?.signals, constants.optionsAdvancedTechnology);
  
  const convertedEmployeeLabels = convertSignalsToLabels(rowData?.employee, constants.optionsEmployeeRange);

  const geoClass = rowData?.apidata?.output?.geo_class?.slice(1, -1)?.split(', ')?.map(value => value?.replace(/['"]/g, ''))?.join(', ');
  const geoClassStr = geoClass?.charAt(0)?.toUpperCase() + geoClass?.slice(1) || 'Unknown';

  let geoData = rowData?.apidata?.output?.geo?.slice(1, -1)?.replace(/\\n/g, '\n')?.replace(/^'|'$/g, '')?.split('\n')?.map(value => value?.replace(/['"]/g, ''))?.join(', ');
  if(geoData === 'None' || geoData === 'APAC') geoData = rowData?.region?.replaceAll('|', ', ');

  return (
    <div className="idealcustomer">
      <Row className="buildicp-responsive inline bg-white md:mx-0 ">
        <Card
          className="flex justify-between items-center w-full border-none rounded-none border-t-4 border-indigo-500 card-page  p-4 3md:mx-0"
          cover={
            <img alt="whoozbying" src={whooz} style={{ width: "150px" }} />
          }
        >
          {" "}
          <div className="flex items-center">
            {/* <div style={{ marginRight: "15px" }}>
              <img
                alt="whoozbying"
                src={`data:image/png;base64, ${localStorage.getItem(
                  "logoData"
                )}`}
                style={{ width: "100px" }}
              />
            </div> */}
            <div>
              <p className="text-xs pt-1">
                Created by: {userDetails?.name?.replace("|", " ")}
              </p>
              <p className="text-xs pt-1">
                Organization Name: {userDetails?.organization_name}
              </p>
              <p className="text-xs pt-1">
                Website: www.{userDetails?.organization_domain}
              </p>
              <p className="text-xs pt-1">Created at: {createdDate}</p>
              <p className="text-xs pt-1">Updated at: {updatedDate}</p>
            </div>
          </div>
        </Card>
      </Row>
      <Row className="px-8 py-3 buildicp-responsive ">
        <Col className="w-2/4	">
          <p className="font-semibold">ICP Name</p>
        </Col>
        <Col className="w-2/4	">
          <p className="ml-1">{rowData?.icp_name}</p>
        </Col>
      </Row>

      <Row className="px-8 py-3 rounded bg-gray-50 buildicp-responsive">
        <Col className="w-2/4	">
          <span>
            {/* <p className="font-semibold">Region</p> */}
            <p className="font-semibold">Geo</p>
          </span>
        </Col>
        <Col className="flex w-2/4 gap-2">
          <span>
            {" "}
            {/* <p className="p-1 rounded  jfm-tag-data">NAM</p> */}
            <p className="p-1 rounded jfm-tag-data">{geoData || "Unknown"}</p>
          </span>
          <span></span>
        </Col>
      </Row>
      {/* <Row className="px-8 py-3 buildicp-responsive">
        <Col className="w-2/4">
          <p className="font-semibold">Geo Class</p>
        </Col>
        <Col className="flex w-2/4 gap-2">
          <p className="jfm-tag-data">{geoClassStr}</p>
        </Col>
      </Row> */}
      <Row className="px-8 py-3 rounded buildicp-responsive">
        <Col className="w-2/4">
          <p className="font-semibold">Industry</p>
        </Col>
        <Col className="flex w-2/4 gap-2">
          <p className="jfm-tag-data">
            {rowData?.apidata?.output?.industry
              ?.slice(1, -1)
              ?.split(", ")
              ?.map((value) => value?.replace(/['"]/g, ""))
              ?.join(", ") || "Unknown"}
          </p>
        </Col>
      </Row>
      <Row className="px-8 py-3 bg-gray-50 buildicp-responsive">
        <Col className="w-2/4">
          <p className="font-semibold">Sub Industry</p>
        </Col>
        <Col className="flex w-2/4 gap-2">
          <p className="jfm-tag-data">
            {rowData?.apidata?.output?.sub_industry
              ?.slice(1, -1)
              ?.split(", ")
              ?.map((value) => value?.replace(/['"]/g, ""))
              ?.join(", ") || "Unknown"}
          </p>
        </Col>
      </Row>
      <Row className="px-8 py-3 rounded buildicp-responsive">
        <Col className="w-2/4">
          <p className="font-semibold">Revenue Range</p>
        </Col>
        <Col className="flex w-2/4 gap-2">
          <p className="jfm-tag-data">
          {(rowData?.revenue && rowData?.revenue?.trim() !== "")
              ? rowData?.revenue?.replaceAll("|", ", ")
              : "Unknown"}
          </p>
        </Col>
      </Row>
      <Row className="px-8 py-3 buildicp-responsive bg-gray-50">
        <Col className="w-2/4">
          <p className="font-semibold">Employee Range</p>
        </Col>
        <Col className="flex w-2/4 gap-2">
          <p className="jfm-tag-data">
            {(rowData?.employee && rowData?.employee?.trim() !== "")
              ? rowData?.employee?.replaceAll("|", ", ")?.split(", ")?.map(emp => constants.empMap[emp])?.join(", ")
              : "Unknown"}
          </p>
          {/* <p className="jfm-tag-data">{convertedEmployeeLabels?.replaceAll('|', ', ')}</p> */}
        </Col>
      </Row>
      {/* <Row className="px-8 py-3 rounded bg-gray-50 buildicp-responsive">
        <Col className="w-2/4">
          <p className="font-semibold">Signals</p>
        </Col>
        <Col className="flex w-2/4 gap-2">
          <p className="jfm-tag-data">
            {(rowData?.signals && rowData?.signals?.trim() !== "")
              ? rowData?.signals?.replaceAll("|", ", ")
              : "Unknown"}
          </p> */}
          {/* <p className="jfm-tag-data">{convertedAdvancedTechnologyLabels?.replaceAll('|', ', ')}</p> */}
        {/* </Col>
      </Row> */}
      <Row className="px-8 py-3 buildicp-responsive">
        <Col className="w-2/4">
          <p className="font-semibold">Technograhpics</p>
        </Col>
        <Col className="flex w-2/4 gap-2 max-sm:grid justy-start">
          <p className="jfm-tag-data">
            {(rowData?.technographics && rowData?.technographics?.trim() !== "")
              ? rowData?.technographics?.replaceAll("|", ", ")
              : "Unknown"}
          </p>
        </Col>
      </Row>
      <Row className="px-8 py-3 buildicp-responsive bg-gray-50">
        <Col className="w-2/4">
          <p className="font-semibold">Ex. Companies</p>
        </Col>
        <Col className="flex w-2/4 gap-2 max-sm:grid justy-start">
          <p className="jfm-tag-data">
            {(rowData?.excompany && rowData?.excompany?.trim() !== "")
              ? rowData?.excompany?.replaceAll("|", ", ")
              : "Unknown"}
          </p>
        </Col>
      </Row>
      <Row className="px-8 py-3 buildicp-responsive">
        <Col className="w-2/4">
          <p className="font-semibold">Not Companies</p>
        </Col>
        <Col className="flex w-2/4 gap-2 max-sm:grid justy-start">
          <p className="jfm-tag-data">
            {(rowData?.notcompany && rowData?.notcompany?.trim() !== "")
              ? rowData?.notcompany?.replaceAll("|", ", ")
              : "Unknown"}
          </p>
        </Col>
      </Row>
      <Row className="px-8 py-3 buildicp-responsive bg-gray-50">
        <Col className="w-2/4">
          <p className="font-semibold">Departments</p>
        </Col>
        <Col className="flex w-2/4 gap-2 max-sm:grid justy-start">
          <p className="jfm-tag-data">
            {(rowData?.department && rowData?.department?.trim() !== "")
              ? rowData?.department?.replaceAll("|", ", ")
              : "Unknown"}
          </p>
        </Col>
      </Row>
      <Row className="px-8 pt-3 pb-10">
        <Col className="w-2/4">
          <p className="font-semibold">Common Title</p>
        </Col>
        <Col className="grid w-2/4 gap-2">
          <div className="flex gap-1">
            <p className="jfm-tag-data">
              {rowData?.function?.replaceAll("|", ", ") || "Unknown"}
            </p>
          </div>
        </Col>
      </Row>
      <Row className="px-8 py-3 rounded buildicp-responsive bg-gray-50">
        <Col className="w-2/4">
          <p className="font-semibold">Buyer & User Persona Role</p>
        </Col>
        <Col className="flex w-2/4 gap-2">
          <p className="jfm-tag-data">
            {rowData?.role?.replaceAll("|", ", ") || "Unknown"}
          </p>
        </Col>
      </Row>
    </div>
  );
};
export default IdealCustomerTag;
