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