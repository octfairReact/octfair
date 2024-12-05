//최상단에 있는 저장공간
import { atom } from "recoil";

// 수업때 Notice에서 쓰던 modalState
export const modalState = atom<boolean>({
  key: "modalState",
  default: false,
});

export const ApplyModalState = atom<boolean>({
  key: "ApplyModalState",
  default: false,
});

export const scrapState = atom<boolean>({
  key: "scrapState",
  default: false,
});

export const noticeState = atom<boolean>({
  key: "noticeState",
  default: false,
});

export const scrapIndexGrop = atom<number[]>({
  key: "scrapIndexGrop",
  default: [],
});

export const postIndexGrop = atom<number[]>({
  key: "postIndexGrop",
  default: [],
});

export const qnaMyListState = atom<string>({
  key: "qnaMyListState",
  default: "all",
});

export const qnaPasswordModalState = atom<boolean>({
  key: "qnaPasswordModalState",
  default: false,
});
