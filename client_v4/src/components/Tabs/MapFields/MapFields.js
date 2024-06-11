import React, { useEffect, useState } from 'react'

import './MapFields.css';
import { Select } from 'antd';
import constants from '../../../helpers/Constants';

const MapFields = ({ mapData, setMapData }) => {
  const [companyName, setCompanyName] = useState(mapData.companyName);
  const [website, setWebsite] = useState(mapData.website);
  const [industry, setIndustry] = useState(mapData.industry);
  const [revenue, setRevenue] = useState(mapData.revenue);
  const [employees, setEmployees] = useState(mapData.employees);

  let companyOptions = constants.mapCompanyName;
  companyOptions = [{ value: '', label: 'Account Name' }, ...companyOptions];

  const handleCompanyNameChange = (value) => {
    setCompanyName(value);
  }

  let websiteOptions = constants.mapURL;
  websiteOptions = [{ value: '', label: 'URL' }, ...websiteOptions];

  const handleWebsiteChange = (value) => {
    setWebsite(value);
  }

  let industryOptions = constants.optionsIndustry;
  industryOptions = [{ value: '', label: 'Industry' }, ...industryOptions];

  const handleIndustryChange = (value) => {
    setIndustry(value);
  }

  let revenueOptions = constants.optionsRevenueRange;
  revenueOptions = [{ value: '', label: 'Revenue' }, ...revenueOptions];

  const handleRevenueChange = (value) => {
    setRevenue(value);
  }

  let employeeOptions = constants.optionsEmployeeRange;
  employeeOptions = [{ value: '', label: 'Employee' }, ...employeeOptions];

  const handleEmployeeChange = (value) => {
    setEmployees(value);
  }

  useEffect(() => {
    const data = {
      'companyName': companyName,
      'website': website,
      'industry': industry,
      'revenue': revenue,
      'employees': employees,
    }
    // console.log(data);
    setMapData(data);
  }, [companyName, website, industry, revenue, employees]);

  return (
    <div className='map-container'>
      <div className='map-header'>Map Fields</div>
      <div className='map-subheader'>Fill Your Map Fields Information</div>
      <div className='map'>
        <div className='map-input-fields'>
          <div className='input-header'>Input Fields</div>
          <div className='map-fields map-input'>Company Name</div>
          <div className='map-fields map-input'>Website</div>
          <div className='map-fields map-input'>Industry</div>
          <div className='map-fields map-input'>Revenue</div>
          <div className='map-fields map-input'>Employees</div>
        </div>
        <div className='map-dest'>
          <div className='input-header'>Destination</div>
          <Select options={companyOptions} className='map-select map-fields' value={companyName} onChange={handleCompanyNameChange}/>
          <Select options={websiteOptions} className='map-select map-fields' onChange={handleWebsiteChange} value={website}/>
          <Select options={industryOptions} className='map-select map-fields' onChange={handleIndustryChange} value={industry}/>
          <Select options={revenueOptions} className='map-select map-fields' onChange={handleRevenueChange} value={revenue}/>
          <Select options={employeeOptions} className='map-select map-fields' onChange={handleEmployeeChange} value={employees}/>
        </div>
      </div>
    </div>
  )
}

export default MapFields