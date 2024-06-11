import { atom } from "recoil";

const initialPageAtom = atom({
  key: "initialPage",
  default: true,
});
const activeCreateTabAtom = atom({
  key: "activeCreateTab",
  default: 0,
});
const selectedRowKeysAtom = atom({
  key: "selectedRowKeys",
  default: [],
});
const chartVisibleAtom = atom({
  key: "chartVisible",
  default: false,
});

export {
  initialPageAtom,
  activeCreateTabAtom,
  selectedRowKeysAtom,
  chartVisibleAtom,
};
