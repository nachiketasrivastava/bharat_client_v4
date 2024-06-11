import React, { useState, useEffect } from "react";
import { Table, Avatar, Typography, message, Card, Select, Spin, Button, Input, Modal } from "antd";
import { getLeads, getFileStatus } from "../../services/freemiumServices.js";
import { useRecoilState } from "recoil";
import { renderedLeadsAtom, leadsDataAtom } from "../../store/atoms/AgentsAtoms.js";
import {jwtDecode} from "jwt-decode";
import { useLocation } from "react-router-dom";
import "./AgentData.css";
import { DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title } = Typography;

const filterColumns = [
  { label: 'Job Title', value: 'job_title' },
  { label: 'Company Name', value: 'account_name' },
  { label: 'Rule Tag', value: 'isicp' }
];

const operators = [
  { label: 'Equals', value: '=' },
  { label: 'Not Equals', value: '!=' },
  { label: 'Contains', value: 'LIKE' },
  { label: 'Does Not Contain', value: 'NOT LIKE' }
];

const AgentData = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const userinformation = jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, ''));
  const [renderedLeads, setRenderedLeads] = useRecoilState(renderedLeadsAtom);
  const { pathname } = useLocation();
  const [data, setData] = useRecoilState(leadsDataAtom);
  const [isChecked, setIsChecked] = useState(false);
  const [isTenantFetched, setIsTenantFetched] = useState(false);
  const [tenant_id, setTenantId] = useState("");
  const [filterOptions, setFilterOptions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [fileStatus, setFileStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [filterGroups, setFilterGroups] = useState([[]]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSwitchChange = () => {
    setIsChecked(!isChecked);
  };

  const switchStyle = {
    backgroundColor: isChecked ? "#609da1" : "#ccc",
  };

  const paginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    getLeadsList(page, pageSize);
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      width: 140,
      className: "name-column",
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      sortDirections: ['ascend', 'descend'],
      // filters: [...new Set(allLeads.map(lead => lead.first_name))].map(value => ({ text: value, value })),
      // onFilter: (value, record) => record.first_name.includes(value),
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      width: 140,
      className: "name-column",
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
      sortDirections: ['ascend', 'descend'],
      // filters: [...new Set(allLeads.map(lead => lead.last_name))].map(value => ({ text: value, value })),
      // onFilter: (value, record) => record.last_name.includes(value),
    },
    {
      title: "Contact Email",
      key: "contact_email",
      dataIndex: "contact_email",
      sorter: (a, b) => a.contact_email.localeCompare(b.contact_email),
      sortDirections: ['ascend', 'descend'],
      // filters: [...new Set(allLeads.map(lead => lead.contact_email))].map(value => ({ text: value, value })),
      // onFilter: (value, record) => record.contact_email.includes(value),
    },
    {
      title: "Job Title",
      dataIndex: "job_title",
      key: "job_title",
      sorter: (a, b) => a.job_title.localeCompare(b.job_title),
      sortDirections: ['ascend', 'descend'],
      // filters: [...new Set(allLeads.map(lead => lead.job_title))].map(value => ({ text: value, value })),
      // onFilter: (value, record) => record.job_title.includes(value),
    },
    {
      title: "Company Name",
      dataIndex: "company_name",
      key: "company_name",
      sorter: (a, b) => a.company_name.localeCompare(b.company_name),
      sortDirections: ['ascend', 'descend'],
      // filters: [...new Set(allLeads.map(lead => lead.company_name))].map(value => ({ text: value, value })),
      // onFilter: (value, record) => record.company_name.includes(value),
    },
    {
      title: "Rule Tag",
      key: "icp_rule",
      dataIndex: "icp_rule",
      sorter: (a, b) => a.icp_rule.localeCompare(b.icp_rule),
      sortDirections: ['ascend', 'descend'],
      // filters: [...new Set(allLeads.map(lead => lead.icp_rule))].map(value => ({ text: value, value })),
      // onFilter: (value, record) => record.icp_rule.includes(value),
    },
  ];

  const getLeadsList = async (page = currentPage, limit = pageSize) => {
    setLoading(true);
    const data = {
      tenant: localStorage.getItem('tenantid'),
      page,
      limit,
      filters: filterGroups
    };
    console.log("Request data:", data);
    let response = await getLeads(data);

    if (response.status === 200) {
      const filteredResponseData = response?.data?.leads?.filter(
        ({ ic_accountid }) => ic_accountid !== null && ic_accountid?.trim() !== ""
      );
      setAllLeads(filteredResponseData);
      setFilteredData(filteredResponseData);
      setTotalLeadsCount(response.data.totalLeads);
      const newFilterOptions = [];
      const uniqueJobTitles = new Set();
      const newRows = filteredResponseData.map((item) => {
        if (item.job_title) {
          uniqueJobTitles.add(item.job_title);
        }
        return {
          key: item.uniqueId,
          first_name: item.first_name,
          last_name: item.last_name,
          contact_email: item.contact_email,
          job_title: item.job_title,
          company_name: item.account_name,
          icp_rule: item.isicp,
        };
      });

      setData(newRows);
      setLoading(false);
      const uniqueFilterOptions = Array.from(uniqueJobTitles).map((jobTitle) => ({
        value: jobTitle,
        label: jobTitle,
      }));
      setFilterOptions(uniqueFilterOptions);
    }
  };

  const getStatus = async (source) => {
    const data = {
      userid: userinformation.id,
    };
    let response = await getFileStatus(data);
    if (response.status === 200) {
      if (response.data?.message === "pending") {
        if (source === "click") {
          message.info("UPDATE: We're still processing your data. We will notify you once it's done.");
        }
        setFileStatus(true);
      } else if (response.data?.message === "completed" && source === "click") {
        message.success("UPDATE: Your data is processed and this is the updated Audit Report");
        setFileStatus(false);
        window.location.reload();
      }
    }
  };

  const handleFilterChange = (groupIndex, filterIndex, key, value) => {
    const newFilterGroups = [...filterGroups];
    newFilterGroups[groupIndex][filterIndex][key] = value;
    setFilterGroups(newFilterGroups);
  };

  const addFilter = (groupIndex) => {
    const newFilterGroups = [...filterGroups];
    newFilterGroups[groupIndex].push({ column: '', operator: '', value: '' });
    setFilterGroups(newFilterGroups);
  };

  const removeFilter = (groupIndex, filterIndex) => {
    const newFilterGroups = [...filterGroups];
    newFilterGroups[groupIndex].splice(filterIndex, 1);
    setFilterGroups(newFilterGroups);
  };

  const addFilterGroup = () => {
    setFilterGroups([...filterGroups, []]);
  };

  const removeFilterGroup = (groupIndex) => {
    const newFilterGroups = [...filterGroups];
    newFilterGroups.splice(groupIndex, 1);
    setFilterGroups(newFilterGroups);
  };

  const createFilters = () => {
    const isValid = filterGroups.every(group =>
      group.every(filter =>
        filter.column && filter.operator && filter.value
      )
    );

    if (!isValid) {
      message.error("Please fill out all fields for each filter.");
      return;
    }

    console.log("Filters being sent to the backend:", filterGroups);
    setCurrentPage(1)
    getLeadsList();
    setIsModalVisible(false); 
  };

  useEffect(() => {
    if (userinformation.id) {
      getLeadsList();
      getStatus("load");
    }
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const isOkButtonDisabled = filterGroups.some(group =>
    group.some(filter =>
      !filter.column || !filter.operator || !filter.value
    )
  );

  return (
    <>
      <div>
        {fileStatus && (
          <>
            <div style={{ color: "red", fontSize: "14px", marginLeft: "20px" }}>
              Note:- We're still processing some of your data. We'll notify you once it's done.
            </div>
            <div
              style={{ color: "red", fontSize: "14px", marginLeft: "20px", position: "absolute" }}
            >
              Please{" "}
              <a style={{ color: "blue" }} onClick={() => getStatus("click")}>
                click here
              </a>{" "}
              to refresh the status
            </div>
          </>
        )}
        <Button onClick={showModal} type="primary" style={{ marginTop: '16px' }}>
          Filter
        </Button>
        <Modal
          title="Create Filters"
          visible={isModalVisible}
          onOk={createFilters}
          onCancel={handleCancel}
          okButtonProps={{ disabled: isOkButtonDisabled }}
          width={800} // Set a suitable width for the modal
        >
          {filterGroups.map((group, groupIndex) => (
            <Card key={groupIndex} className="filter-group-card">
              <div className="filter-group">
                {group.map((filter, filterIndex) => (
                  <div key={filterIndex} className="filter-item mb-2">
                    <Select
                      placeholder="Select Column"
                      value={filter.column}
                      onChange={(value) => handleFilterChange(groupIndex, filterIndex, 'column', value)}
                      style={{ width: '150px', marginRight: '8px' }}
                    >
                      {filterColumns.map((col) => (
                        <Option key={col.value} value={col.value}>{col.label}</Option>
                      ))}
                    </Select>
                    <Select
                      placeholder="Select Operator"
                      value={filter.operator}
                      onChange={(value) => handleFilterChange(groupIndex, filterIndex, 'operator', value)}
                      style={{ width: '150px', marginRight: '8px' }}
                    >
                      {operators.map((op) => (
                        <Option key={op.value} value={op.value}>{op.label}</Option>
                      ))}
                    </Select>
                    <Input
                      placeholder="Value"
                      value={filter.value}
                      onChange={(e) => handleFilterChange(groupIndex, filterIndex, 'value', e.target.value)}
                      style={{ width: '150px', marginRight: '8px' }}
                    />
                    <Button
                      onClick={() => removeFilter(groupIndex, filterIndex)}
                      type="danger"
                      style={{ marginRight: '8px' }}
                    >
                      <DeleteOutlined />
                    </Button>
                  </div>
                ))}
                <Button onClick={() => addFilter(groupIndex)}>Add Filter</Button>
              </div>
            </Card>
          ))}
        </Modal>
      </div>
      <div>
        {loading && <Spin className="center-spinner" size="large" />}
        {!loading && (
          <Card className="leadsTableCard mt-6">
            <div className="table-responsive">
              <h5
                style={{
                  borderRadius: "8px",
                  top: 100,
                  right: 20,
                  paddingBottom: "1px",
                  fontWeight: 600,
                }}
              >
                {filterGroups.length > 0 ? `With all ${filterGroups.length} filters applied, we've total ${totalLeadsCount} leads for you` : `We've total ${totalLeadsCount} leads for you`}
              </h5>
              <Table
                columns={columns}
                dataSource={data}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalLeadsCount,
                  onChange: paginationChange,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100'],
                }}
                className="ant-border-space newLeadsTable"
                scroll={{ y: 400 }}
              />
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default AgentData;
