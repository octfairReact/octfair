import { atom } from "recoil";

export const qnaMyListState = atom<string>({
  key: "qnaMyListState",
  default: "all",
});

export const qnaPasswordModalState = atom<boolean>({
  key: "qnaPasswordModalState",
  default: false,
});
