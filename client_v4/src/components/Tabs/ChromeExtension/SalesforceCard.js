import React, { useState } from 'react'

import MatchingRules from './SFDCCardTabs/MatchingRules';
import FieldMapping from './SFDCCardTabs/FieldMapping';

import { Card } from 'antd'

const SalesforceCard = ({ setSfdcVisible, setActiveDest }) => {

  const [activeCard, setActiveCard] = useState(1);

  return (
    <div>
        <Card style={{ minWidth: '600px', height: '480px', overflowY: 'auto' }} >
            {
                activeCard === 1 && <MatchingRules setActiveCard={setActiveCard} setSfdcVisible={setSfdcVisible} setActiveDest={setActiveDest} />
            }
            {
                activeCard === 2 && <FieldMapping setActiveCard={setActiveCard} />
            }
        </Card>
    </div>
  )
}

export default SalesforceCard