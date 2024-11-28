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

// 회원가입 모달창에 쓰는 모달창state
export const signupModalState = atom<boolean>({
  key: "signupModalState",
  default: false,
});

// ID/PW찾기 모달창에 쓰는 모달창state
export const searchIdPwModalState = atom<string>({
  key: "searchIdPwModalState",
  default: "close",
});

// 비번수정 모달창에 쓰는 모달창state
export const updatePasswordModalState = atom<boolean>({
  key: "updatePasswordModalState",
  default: false,
});

// 회원탈퇴 모달창에 쓰는 모달창state
export const withdrawModalState = atom<boolean>({
  key: "withdrawModalState",
  default: false,
});

// 회원관리탭의 개인회원수정 모달창에 쓰는 모달창state
export const updateApplicantModalState = atom<boolean>({
    key: 'updateApplicantModalState',
    default: false,
})

// 회원관리탭의 기업회원수정 모달창에 쓰는 모달창state
export const updateBizModalState = atom<boolean>({
    key: 'updateBizModalState',
    default: false,
})

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

export const qnaMyListState = atom<string>({
  key: "qnaMyListState",
  default: "all",
});

export const qnaPasswordModalState = atom<boolean>({
  key: "qnaPasswordModalState",
  default: false,
});
