import React, { useState, useEffect } from 'react'
import { Select } from 'antd'

import './SFDCCardTabs.css';
import constants from '../../../../helpers/Constants';

const MappingContainer = ({ fieldsShown, salesforceObj }) => {

  const fieldsArray = [...fieldsShown];
  const inputTenantFields = constants.colValues.sort((a, b) => a.label.localeCompare(b.label))

  const fieldsLabel = fieldsArray.map((field) => field.label);
  const inputLabel = inputTenantFields.map((input) => input.label);

  const matchedValues = inputLabel.reduce((result, input) => {
    const matchedValueB = fieldsLabel.find((field) =>
        field.toLowerCase().includes(input.toLowerCase())
    );

    if (matchedValueB) {
        result.push({ input, field: matchedValueB });
    }

    return result;
  }, []);

  console.log(matchedValues)

  return (
    <div className='mappingContainer'>
        <div className='mFlex mappingHeaderContainer'>
            <div className='mappingRowsHeader'>Input Field</div>
            <div className='mappingRowsHeader extra-width'>Field Mapping</div>
        </div>
        {inputTenantFields.map((field) => {
            return (
                <div key={field.label} className='mFlex mappingFieldsContainer'>
                    <div className='mappingFieldName'>
                        {field.label}
                    </div>
                    <Select
                        options={fieldsShown}
                        className='mappingSelect extra-width'
                        placeholder={`Select ${salesforceObj === 'Account & Contact Object' ? 'Acc. & Cont. Object' : salesforceObj} Field`}
                    />
                </div>
            )
        })}
    </div>
  )
}

export default MappingContainer