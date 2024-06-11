import React, { useEffect } from "react";
import AgentsInitial from "../../components/AgentsInitial/AgentsInitial";
import AgentsLaterPage from "../../components/AgentsLaterPage/AgentsLaterPage";
import { useRecoilState, useSetRecoilState } from "recoil";
import { initialAgentPageAtom, activatedICPAtom } from "../../store/atoms/AgentsAtoms";

const Agents = () => {
  const [initialAgentPage, setInitialAgentPage] = useRecoilState(initialAgentPageAtom);
  const setActivatedICP = useSetRecoilState(activatedICPAtom);
  useEffect(() => {
    // setInitialAgentPage(true);
    setActivatedICP("ICP Name")
  }, [])
  return initialAgentPage ? <AgentsInitial /> : <AgentsLaterPage />;
};

export default Agents;
