import React from 'react'
import Agent from '../Agent/Agent'
import { useSetRecoilState } from 'recoil'
import { initialAgentPageAtom, activeAgentsLaterAtom } from '../../store/atoms/AgentsAtoms.js'

const AgentWorkflow = () => {
  const setInitialAgentPage = useSetRecoilState(initialAgentPageAtom);
  const setActiveAgentsLater = useSetRecoilState(activeAgentsLaterAtom);

  return (
    <div className='w-full flex flex-col gap-4'>
        <div className='bg-gray-100 flex justify-between items-center pl-10 pr-24 py-4 rounded-lg'>
            <div className='flex flex-col gap-4'>
                <div className='text-lg font-semibold'>
                    Discover New Leads
                </div>  
                <div className='text-base'>
                    Automatically discover New Leads when they meet a certain criteria 
                </div>
            </div>
            <div className='flex justify-center items-center gap-4'>
                <div 
                    className='flex justify-center items-center py-1 px-4 rounded-md cursor-pointer hover:scale-105 hover:bg-[#E07E65] duration-300 ease-in-out bg-gray-700 text-white text-base'
                    onClick={() => setInitialAgentPage(true)}
                >
                    Cancel
                </div>
                <div 
                    className='flex justify-center items-center py-1 px-4 rounded-md cursor-pointer hover:scale-105 hover:bg-[#E07E65] duration-300 ease-in-out bg-gray-700 text-white text-base'
                    onClick={() => setActiveAgentsLater(1)}
                >
                    Save
                </div>
            </div>
        </div>
        <div>
            <Agent />
        </div>
    </div>
  )
}

export default AgentWorkflow