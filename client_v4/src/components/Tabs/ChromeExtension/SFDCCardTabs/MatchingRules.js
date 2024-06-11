import React, { useState } from 'react'

import './SFDCCardTabs.css';

import { Radio, Checkbox } from 'antd';

const MatchingRules = ({ setActiveCard, setSfdcVisible, setActiveDest }) => {

  const matchAccountsOptions = ['Domain', 'Account Name & Country', 'Account Name & Billing Address'];
  const matchContactsOptions = ['Email', 'Persona Name & Company Name & Title'];
  const [selectedMatchAccounts, setSelectedMatchAccounts] = useState(null);
  const [selectedMatchContacts, setSelectedMatchContacts] = useState(null);
  const [overwriteChecked, setOverwriteChecked] = useState(false);
  const [errors, setErrors] = useState({
    matchAccounts: '',
    matchContacts: '',
  });
  const [matchFieldSelections, setMatchFieldSelections] = useState({});

  const handleMatchAccountsCheckboxChange = (e) => {
    setSelectedMatchAccounts(e.target.value);
    setErrors({ ...errors, matchAccounts: '' });
  };

  const handleMatchContactsCheckboxChange = (e) => {
    setSelectedMatchContacts(e.target.value);
    setErrors({ ...errors, matchContacts: '' });
  };

  const handleOverwriteCheckboxChange = (e) => {
    setOverwriteChecked(e.target.checked);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setSfdcVisible(false);
    setActiveDest(0);
  }

  const handleNext = (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!selectedMatchAccounts) {
      newErrors.matchAccounts = 'Please select an option to Match Accounts.';
    }

    if (!selectedMatchContacts) {
      newErrors.matchContacts = 'Please select an option to Match Contacts.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
        const selections = {
            accounts: selectedMatchAccounts,
            contacts: selectedMatchContacts,
            overwrite: overwriteChecked,
        }
        setMatchFieldSelections(selections);
        console.log(matchFieldSelections);
        setActiveCard(2);
    }
  }

  return (
    <div className='mrContainer'>
        <div className='mrContent'>
            <div className='mrRadioHeader account'>Match Accounts Using</div>
            <Radio.Group
                options={matchAccountsOptions}
                onChange={handleMatchAccountsCheckboxChange}
                value={selectedMatchAccounts}
            />
            {errors.matchAccounts && <p style={{ color: 'red' }}>{errors.matchAccounts}</p>}

            <div className='mrRadioHeader contact'>Match Contacts Using</div>
            <Radio.Group
                options={matchContactsOptions}
                onChange={handleMatchContactsCheckboxChange}
                value={selectedMatchContacts}
            />
            {errors.matchContacts && <p style={{ color: 'red' }}>{errors.matchContacts}</p>}

            <div></div>
            <Checkbox
                checked={overwriteChecked}
                onChange={handleOverwriteCheckboxChange}
                className='mrCheckbox'
            >
                Overwrite Salesforce Fields With GTM CoPilot Fields
            </Checkbox>
        </div>

        <div className='mrBtnContainer'>
            <button className='mrBtn' onClick={handleCancel} >
                Cancel
            </button>
            <button className='mrBtn' onClick={handleNext} >
                Next
            </button>
        </div>
    </div>
  )
}

export default MatchingRules