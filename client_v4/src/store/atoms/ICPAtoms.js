import { atom } from "recoil";

const icpNameAtom = atom({
  key: "icpName",
  default: "",
});
const selectedIndustryOptionAtom = atom({
  key: "selectedIndustryOption",
  default: [],
});
const selectedCountryOptionAtom = atom({
  key: "selectedCountryOption",
  default: ["United States"],
});
const selectedRevenueRangeAtom = atom({
  key: "selectedRevenueRange",
  default: [],
});
const selectedEmployeeRangeAtom = atom({
  key: "selectedEmployeeRange",
  default: [],
});
const selectedTechnologyOptionAtom = atom({
  key: "selectedTechnologyOption",
  default: [],
});
const companiesAtom = atom({
  key: "companies",
  default: [],
});
const notCompaniesAtom = atom({
  key: "notCompanies",
  default: [],
});
const keywordsAtom = atom({
  key: "keywords",
  default: [],
});
const keywordspersonasAtom = atom({
  key: "keywordspersonas",
  default: [],
});
const titlesAtom = atom({
  key: "titles",
  default: [],
});
const departmentsAtom = atom({
  key: "departments",
  default: [],
});
const editICPAtom = atom({
  key: "editICP",
  default: false,
});
const isIdealCustomerTagnavVisibleAtom = atom({
  key: "isIdealCustomerTagnavVisible",
  default: false,
});
const isIdealCustomerTagVisibleAtom = atom({
  key: "isIdealCustomerTagVisible",
  default: true,
});
const currentPageAtom = atom({
  key: "currentPage",
  default: 1,
});
const isModalOpenAtom = atom({
  key: "isModalOpen",
  default: false,
});
const rowDataInModalAtom = atom({
  key: "rowDataInModal",
  default: null,
});
const editICPIDAtom = atom({
  key: "editICPID",
  default: null,
});
const editICPNameAtom = atom({
  key: "editICPName",
  default: "",
});

export {
  icpNameAtom,
  selectedIndustryOptionAtom,
  selectedCountryOptionAtom,
  selectedRevenueRangeAtom,
  selectedEmployeeRangeAtom,
  selectedTechnologyOptionAtom,
  companiesAtom,
  notCompaniesAtom,
  keywordsAtom,
  keywordspersonasAtom,
  titlesAtom,
  departmentsAtom,
  editICPAtom,
  isIdealCustomerTagnavVisibleAtom,
  isIdealCustomerTagVisibleAtom,
  currentPageAtom,
  isModalOpenAtom,
  rowDataInModalAtom,
  editICPIDAtom,
  editICPNameAtom
};
