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
