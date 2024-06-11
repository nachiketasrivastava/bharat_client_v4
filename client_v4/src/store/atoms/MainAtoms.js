import { atom } from "recoil";

const tenantLogoAtom = atom({
  key: "tenantLogo",
  default: [null],
});
const socketIOAtom = atom({
  key: "socketIO",
  default: [null],
});


export {
  tenantLogoAtom,
  socketIOAtom
};
