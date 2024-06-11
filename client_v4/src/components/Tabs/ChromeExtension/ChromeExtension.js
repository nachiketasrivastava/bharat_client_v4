import React, { useState, useEffect } from 'react'
import './ChromeExtension.css'

import salesforceImg from '../../../assets/images/salesforceImg.png';
import brandLogo from '../../../assets/images/AI.png';
import SalesforceCard from './SalesforceCard';

import { Card, message } from 'antd';

const ChromeExtension = () => {
  const [sfdcVisible, setSfdcVisible] = useState(false);
  const [activeDest, setActiveDest] = useState(0);

  const handleCardClick = (card, index) => {
    if (index === 0) {
      message.success("GTM CoPilot Is Selected As Destination")
      setSfdcVisible(false);
      setActiveDest(1);
    } else {
      message.info("Kindly Specify Additional SFDC Settings")
      setSfdcVisible(true);
      setActiveDest(2);
    }
    localStorage.setItem("destination", card.name);
  }

  const cardsContent = [
    {
      name: "gtmCopilot",
      imageShown: brandLogo,
    },
    {
      name: "salesforce",
      imageShown: salesforceImg,
    },
  ]

  let dest = null;

  useEffect(() => {
    if (localStorage.getItem("destination")) {
      dest = localStorage.getItem("destination");
    }
    if (dest && dest === "salesforce") {
      setActiveDest(2)
    } else if (dest && dest === "gtmCopilot") {
      setActiveDest(1);
    }
  }, [])
  
  return (
    <div className='ceContainer'>
      <div className='ceOptionsContainer' >
        {
          cardsContent.map((card, index) => (
            <Card key={index} className={`ceCard ${activeDest === index + 1 ? 'cardActive' : ''}`} onClick={() => handleCardClick(card, index)} >
              <img src={card.imageShown} alt={`cardImg ${index}`} className='cardImg'/>
            </Card>
          ))
        }
      </div>
      <div className='salesForceCard'>
        {
            sfdcVisible && <SalesforceCard setSfdcVisible={setSfdcVisible} setActiveDest={setActiveDest} />
          
        }
      </div>
    </div>
  )
}

export default ChromeExtension