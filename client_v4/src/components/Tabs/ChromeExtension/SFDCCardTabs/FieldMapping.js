import React, { useState, useEffect } from 'react'
import MappingContainer from './MappingContainer';

import './SFDCCardTabs.css';

import { message, Radio } from 'antd';
import constants from '../../../../helpers/Constants';

const FieldMapping = ({ setActiveCard }) => {
  
  const salesforceObjOptions = ['Lead Object', 'Account & Contact Object'];

  const [fieldsShown, setFieldsShown] = useState([]);
  const [salesforceObj, setSalesforceObj] = useState(null);
  const [errors, setErrors] = useState({
    salesforceObjError: '',
  });

  const handleSalesforceObjCheckboxChange = (e) => {
    setSalesforceObj(e.target.value);
    setErrors({ ...errors, salesforceObjError: '' });
  };

  useEffect(() => {
    setFieldsShown(salesforceObj === 'Lead Object' ? constants.leadFields : constants.acFields);
  }, [salesforceObj])


  const handleBack = (event) => {
    event.preventDefault();
    setActiveCard(1);
  }

  const handleFinish = (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!salesforceObj) {
      newErrors.salesforceObjError = 'Please select an option to process Field Mapping.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
        message.success("Salesforce Destination Settings Are Complete")
    }
  }

  return (
    <div className='mrContainer'>
        <div className={`mrContent ${salesforceObj ? '' : 'space-holder'}`}>
            <div className='mrRadioHeader account'>Select Salesforce Object</div>
            <Radio.Group
                options={salesforceObjOptions}
                onChange={handleSalesforceObjCheckboxChange}
                value={salesforceObj}
            />
            {errors.salesforceObjError && <p style={{ color: 'red' }}>{errors.salesforceObjError}</p>}
        </div>

        {
            salesforceObj && <MappingContainer fieldsShown={fieldsShown} salesforceObj={salesforceObj} />
        }

        <div className={`mrBtnContainer ${salesforceObj ? 'shadowBox' : ''}`}>
            <button className='mrBtn' onClick={handleBack} >
                Back
            </button>
            <button className='mrBtn' onClick={handleFinish} >
                Finish
            </button>
        </div>
    </div>
  )
}

export default FieldMapping