import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import AgentWorkflow from "../AgentWorkflow/AgentWorkflow";
import { activeAgentsLaterAtom } from "../../store/atoms/AgentsAtoms";
import AgentData from "../AgentData/AgentData.js";
import AgentCSVList from "../AgentCSVList/AgentCSVList.js";
import { Tooltip } from "antd";
import './AgentsLaterPage.css'

const AgentsLaterPage = () => {
  const [activeAgentsLater, setActiveAgentsLater] =
    useRecoilState(activeAgentsLaterAtom);

  useEffect(() => {
    setActiveAgentsLater(0);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center pl-1 pr-4 pt-2">
        <div
          className={`${
            activeAgentsLater == 0
              ? "text-white bg-[#E07E65]"
              : "bg-gray-300 font-semibold"
          } flex justify-center items-center border border-r-black px-2 py-1 text-sm flex-1 rounded-l-md`}
          // onClick={() => setActiveAgentsLater(0)}
        >
          Agent Workflow
        </div>
        <Tooltip title="Please Save Leads Generation Criteria to View Leads" placement="bottom" color="#E07E65" overlayClassName="agentTooltip">
          <div
            className={`${
              activeAgentsLater == 1
                ? "text-white bg-[#E07E65]"
                : "bg-gray-300 font-semibold"
            } flex justify-center items-center border border-r-black px-2 py-1 text-sm flex-1`}
            // onClick={() => setActiveAgentsLater(1)}
          >
            CSV List
          </div>
        </Tooltip>
        <div
          className={`${
            activeAgentsLater == 2
              ? "text-white bg-[#E07E65]"
              : "bg-gray-300 font-semibold"
          } flex justify-center items-center border rounded-r-md px-2 py-1 text-sm cursor-pointer flex-1`}
          onClick={() => setActiveAgentsLater(2)}
        >
          Data
        </div>
      </div>
      <div className="h-[80vh] w-full pl-1 pr-4">
        {activeAgentsLater === 0 ? (
          <AgentWorkflow />
        ) : activeAgentsLater === 1 ? (
          <AgentCSVList />
        ) : (
          <AgentData />
        )}
      </div>
    </div>
  );
};

export default AgentsLaterPage;
