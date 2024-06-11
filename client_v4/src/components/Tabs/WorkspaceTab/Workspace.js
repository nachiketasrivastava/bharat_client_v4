import React from 'react'
import './Workspace.css'
import { useNavigate } from 'react-router-dom'

const Workspace = ({ setWorkToRev }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    setWorkToRev(true);
    navigate('/explore-audience');
  }

  return (
    <>
        <div className='create-workspace-btn-container'>
            <div className='create-workspace-btn' onClick={handleClick}>Default Workspace</div>   
        </div>
    </>
    
  )
}

export default Workspace