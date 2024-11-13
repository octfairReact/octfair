//최상단에 있는 저장공간
import { atom } from 'recoil';

export const modalState = atom<boolean>({
    key: 'modalState',
    default: false,
})