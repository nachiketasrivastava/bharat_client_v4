import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';
import { Icon } from "@iconify/react";
import './IdealCustomerTagnav.css';
import { message } from 'antd';
import { UpdatePDFRows, CheckForExistingName } from '../../../services/ICPservices';
import {Select} from 'antd';
import constants from '../../../helpers/Constants';
import { jwtDecode } from 'jwt-decode';

const EditableRow = ({ setRowData, rowData, rowId, label, initialValue, grayedOut, inputValue }) => {
  const [editing, setEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(initialValue);
  const inputRef = useRef(null);

  const userinformation = jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const checkName = async (icp_name) => {
    const payload = {
      icp_name: icp_name,
      user_id: userinformation?.id
    };
    const response = await CheckForExistingName(payload);
    console.log(response);
    if (response?.status === 200) {
      message.error(response?.data?.message)
      return true
    } else {
      return false
    }
  }

  const handleEditClick = () => {
    setEditing(true);
    setEditedValue(initialValue);
  };
  const initVal = initialValue;
  const handleSaveClick = async (label) => {
    console.log(rowId);
    let data = {};

    if(initVal !== editedValue) {
      if (label === 'Name') {
        setRowData((prevData) => {
          let updatedPersona;
          let personaToSave = editedValue;
          if(editedValue.includes(',')) {
            updatedPersona = editedValue.split(',')[0];
          } else {
            updatedPersona = editedValue;
          }
          const updatedFirstName = updatedPersona.split(' ')[0];
          let updatedLastName = updatedPersona.split(' ')[1];
          if(updatedLastName === undefined) updatedLastName = '';
          console.log(updatedLastName);
      
          const updateText = (text, oldText, newText) => {
            return text.replace(new RegExp(oldText, 'g'), newText);
          };
          
          let updatedStory = updateText(prevData.story, prevData.persona.split(' ')[0], updatedFirstName);
          console.log(updatedStory)
  
          let updatedChallenges = updateText(prevData.challenges, prevData.persona.split(' ')[0], updatedFirstName);
          console.log(updatedChallenges)
  
          let updatedNeeds = updateText(prevData.needs, prevData.persona.split(' ')[0], updatedFirstName);
          console.log(updatedNeeds)
    
          let personaWithoutAdditionalInfo;
          if (prevData.persona.includes(',')) {
            personaWithoutAdditionalInfo = prevData.persona.split(',')[0];
            console.log(personaWithoutAdditionalInfo)
          } else {
            personaWithoutAdditionalInfo = prevData.persona;
            console.log(personaWithoutAdditionalInfo)
          }
          if(personaWithoutAdditionalInfo.split(' ')[1] !== undefined) {
            updatedStory = updateText(updatedStory, personaWithoutAdditionalInfo.split(' ')[1], updatedLastName);
            updatedChallenges = updateText(updatedChallenges, personaWithoutAdditionalInfo.split(' ')[1], updatedLastName);
            updatedNeeds = updateText(updatedNeeds, personaWithoutAdditionalInfo.split(' ')[1], updatedLastName);
          } else { //Only for story
            updatedStory = updatedStory.replace(updatedFirstName, updatedFirstName + ' ' + updatedLastName)
          }
          console.log(updatedStory)
          console.log(updatedChallenges)
          console.log(updatedNeeds)
  
          data = {
            label: label,
            ptypeChallenges: updatedChallenges,
            ptypeNeeds: updatedNeeds,
            ptypeStory: updatedStory,
            newValue: editedValue,
          }
      
          return {
            ...prevData,
            persona: personaToSave,
            challenges: updatedChallenges,
            story: updatedStory,
            needs: updatedNeeds,
          };
        });
      } else {
        if (label === 'ICP Name') {
          if(await checkName(editedValue)) {
            inputRef?.current?.focus()
            return
          }
          setRowData((prevData) => ({
            ...prevData,
            icp_name: editedValue
          }))
        }
        else if (label === 'Persona Type') setRowData((prevData) => ({
          ...prevData,
          ptype: editedValue
        }))
        else if (label === 'Story') setRowData((prevData) => ({
          ...prevData,
          story: editedValue
        }))
        else if (label === 'Challenges') setRowData((prevData) => ({
          ...prevData,
          challenges: editedValue
        }))
        else if (label === 'Needs') setRowData((prevData) => ({
          ...prevData,
          needs: editedValue
        }))
        console.log(rowData)
        data = {
          label: label,
          newValue: editedValue,
        }
      }
      let response = await UpdatePDFRows(rowId, data);
      console.log(response);
      message.success(label + ' updated successfully');
    }
    setEditing(false);
    console.log(data);
  };

  const handleCancelClick = () => {
    setEditing(false);
    setEditedValue(initialValue);
  };

  const handleChange = (event) => {
    setEditedValue(event.target.value);
  };

  const handlePersonaChange = (event) => {
    setEditedValue(event);
  }

  return (
    <div className={`px-8 divide-x buildicp-responsive max-md:px-4 ${grayedOut ? 'bg-gray-50' : ''}`} style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="w-3/12 py-3">
            <p className="font-semibold">{label}</p>
          </div>
          <div className={`w-9/12 px-4 py-3 ${inputValue ? 'text-center' : 'text-justify'}`} style={{borderLeftWidth: 'calc(1px * calc(1 - var(--tw-divide-x-reverse)))'}}>
            {editing && inputValue && label !== 'Persona Type' && (
              <input 
                type="text"
                value={editedValue}
                onChange={handleChange}
                style={{width: '50%', textAlign: 'center'}}
                ref={inputRef}
              />
            )}
            {editing && inputValue && label === 'Persona Type' && (
              <Select
                options={constants.ptypeOptions}
                style={{width: 'fit-content', textAlign: 'center'}}
                onChange={handlePersonaChange}
                defaultValue={editedValue}
              >
              </Select>
            )}
            {editing && !inputValue && (
              <textarea 
                type="text"
                value={editedValue}
                onChange={handleChange}
                rows={4}
                style={{width: '85%', paddingLeft: '5px'}}
                ref={inputRef}
              />
            )}
            {!editing && (
                <p>{initialValue}</p>
            )}
          </div>
        </div>
        <div className={`${grayedOut ? 'gray-btn' : ''} edit-col`}>
          {editing ? (
            <>
              <Button onClick={() => handleSaveClick(label)} style={{marginRight: '10px'}} className='edit-pdf'>
                <Icon icon="akar-icons:save" className="icons-edit" />
              </Button>
              <Button onClick={handleCancelClick} className='edit-pdf'>
                <Icon icon="akar-icons:cross" className="icons-edit" />
              </Button>
            </>
          ) : (
            <Button onClick={handleEditClick} className='edit-pdf'>
              <Icon icon="akar-icons:edit" className="icons-edit" />
            </Button>
          )}
        </div>
      </div>
  );
}

export default EditableRow;
