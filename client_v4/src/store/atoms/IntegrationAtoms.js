import { atom } from "recoil";

const integrationStatusAtom = atom({
  key: "integrationStatus",
  default: [],
});


export {
  integrationStatusAtom
};
