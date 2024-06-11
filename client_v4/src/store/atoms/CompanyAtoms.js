import { atom } from "recoil";

const activeCompanyAtom = atom({
  key: "activeCompany",
  default: 0,
});

const flashAtom = atom({
    key: "flash",
    default: false,
  });


export {
    activeCompanyAtom,
    flashAtom
};
