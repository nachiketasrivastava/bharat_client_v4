import { atom } from "recoil";

const initialAgentPageAtom = atom({
  key: "initialAgentPage",
  default: true,
});
const activeAgentsLaterAtom = atom({
    key: "activeAgentsLater",
    default: 0
})
const customLeadAgentAtom = atom({
  key: "customLeadAgent",
  default: false
})
const icpNamesAtom = atom({
  key: "icpNames",
  default: []
})
const activatedICPAtom = atom({
  key: "activatedICP",
  default: ""
})
const renderedLeadsAtom = atom({
  key: "renderedLeads",
  default: false
})
const leadsDataAtom = atom({
  key: "leadsData",
  default: []
})

export {
    initialAgentPageAtom,
    activeAgentsLaterAtom,
    customLeadAgentAtom,
    icpNamesAtom,
    activatedICPAtom,
    renderedLeadsAtom,
    leadsDataAtom
};
