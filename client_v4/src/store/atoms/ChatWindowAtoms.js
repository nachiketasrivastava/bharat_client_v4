import { atom } from "recoil";

const rowsAtom = atom({
  key: "rows",
  default: 1,
});
const questionAtom = atom({
  key: "question",
  default: "",
});
const chatArrayAtom = atom({
  key: "chatArray",
  default: [],
});
const inputFilledAtom = atom({
  key: "inputFilled",
  default: false,
});
const divFocusedAtom = atom({
  key: "divFocused",
  default: false,
});
const selectedButtonAtom = atom({
  key: "selectedButton",
  default: "",
});
const isProcessingAtom = atom({
  key: "isProcessing",
  default: false,
});
const attachedFileAtom = atom({
  key: "attachedFile",
  default: "",
});
const loadingAtom = atom({
  key: "loading",
  default: false,
});
const initialCalledAtom = atom({
  key: "initialCalled",
  default: true,
});
const isFileAttachedAtom = atom({
  key: "isFileAttachedAtom",
  default: false,
});
const activeSuggestionAtom = atom({
  key: "activeSuggestion",
  default: "",
});
const activeCtaAtom = atom({
  key: "activeCta",
  default: -1,
});
const fileInformationAtom = atom({
  key: "fileInformation",
  default: {}
})
const fileMetaInformationAtom = atom({
  key: "fileMetaInformation",
  default: {}
})
const actualFileDataAtom = atom({
  key: "actualFileData",
  default: {}
})
const talkToCSVAtom = atom({
  key: "talkToCSV",
  default: ""
})

export {
  rowsAtom,
  questionAtom,
  chatArrayAtom,
  inputFilledAtom,
  divFocusedAtom,
  selectedButtonAtom,
  isProcessingAtom,
  attachedFileAtom,
  loadingAtom,
  initialCalledAtom,
  activeSuggestionAtom,
  activeCtaAtom,
  fileInformationAtom,
  fileMetaInformationAtom,
  actualFileDataAtom,
  talkToCSVAtom,
  isFileAttachedAtom
};
