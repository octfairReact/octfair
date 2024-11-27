//최상단에 있는 저장공간
import { atom } from 'recoil';

// 수업때 Notice에서 쓰던 modalState
export const modalState = atom<boolean>({
    key: 'modalState',
    default: false,
})

// 회원가입 모달창에 쓰는 모달창state
export const signupModalState = atom<boolean>({
    key: 'signupModalState',
    default: false,
})

// ID/PW찾기 모달창에 쓰는 모달창state
export const searchIdPwModalState = atom<string>({
    key: 'searchIdPwModalState',
    default: "close",
})

// 비번수정 모달창에 쓰는 모달창state
export const updatePasswordModalState = atom<boolean>({
    key: 'updatePasswordModalState',
    default: false,
})

// 회원탈퇴 모달창에 쓰는 모달창state
export const withdrawModalState = atom<boolean>({
    key: 'withdrawModalState',
    default: false,
})

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