import { atom } from "recoil";

const activeHomeAtom = atom({
  key: "activeHome",
  default: 0,
});


export {
  activeHomeAtom,
};
