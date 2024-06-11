import "./IdealCustomerTagnav.css";
import { Row, Col, Card } from "antd";
import whooz from "../../../assets/images/gtmCopilotname.png";
import EditableRow from './EditableRow';

const IdealCustomerTagnav = ({ rowData, setRowData, userDetails }) => {
  console.log(rowData);
  console.log(userDetails)
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

  const createdDate = createdTimestamp.toLocaleDateString('en-US', options);
  const updatedDate = updatedTimestamp.toLocaleDateString('en-US', options);
  return (
    <div className="idealcustomernav">
      <Row className="buildicp-responsive inline bg-white md:mx-0 ">
        <Card
          className="flex justify-between items-center w-full border-none rounded-none border-t-4 border-indigo-500 card-page  p-4 3md:mx-0"
          cover={
            <img alt="whoozbying" src={whooz} style={{ width: "150px" }} />
          }
        >
          {" "}
          <div className="flex items-center">
            {/* <div>
              <img alt="whoozbying" src={`data:image/png;base64, ${localStorage.getItem("logoData")}`} style={{ width: "100px" }} />
            </div> */}
            <div>
              <p className="text-xs pt-1">Created by: {userDetails?.name?.replace('|', ' ')}</p>
              <p className="text-xs pt-1">Organization Name: {userDetails?.organization_name}</p>
              <p className="text-xs pt-1">Website: www.{userDetails?.organization_domain}</p>
              <p className="text-xs pt-1">Created at: {createdDate}</p>
              <p className="text-xs pt-1">Updated at: {updatedDate}</p>
            </div>
          </div>
        </Card>
      </Row>
      
      <EditableRow 
        setRowData={setRowData} 
        rowData={rowData} 
        rowId={rowData?.id} 
        label="ICP Name" 
        initialValue={rowData?.icp_name} 
        grayedOut={false} 
        inputValue={true} 
      />
      <EditableRow 
        setRowData={setRowData} 
        rowData={rowData} 
        rowId={rowData?.id} 
        label="Persona Type" 
        initialValue={rowData?.ptype || 'Unknown'} 
        grayedOut={true} 
        inputValue={true} 
      />
      <EditableRow 
        setRowData={setRowData} 
        rowData={rowData} 
        rowId={rowData?.id} 
        label="Name" 
        initialValue={rowData?.persona || 'Unknown'} 
        grayedOut={false} 
        inputValue={true} 
      />
      <EditableRow 
        setRowData={setRowData} 
        rowData={rowData} 
        rowId={rowData?.id} 
        label="Story"
        initialValue={rowData?.story || 'Unknown'} 
        grayedOut={true} 
        inputValue={false} 
      />
      <EditableRow 
        setRowData={setRowData} 
        rowData={rowData} 
        rowId={rowData?.id} 
        label="Challenges" 
        initialValue={rowData?.challenges || 'Unknown'} 
        grayedOut={false} 
        inputValue={false} 
      />
      <EditableRow 
        setRowData={setRowData} 
        rowData={rowData} 
        rowId={rowData?.id} 
        label="Needs" 
        initialValue={rowData?.needs || 'Unknown'} 
        grayedOut={true} 
        inputValue={false} 
      />

    </div>
  );
};
export default IdealCustomerTagnav;
