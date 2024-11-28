import { useEffect } from 'react';

/**
 * ESC 키를 눌렀을 때 실행될 동작을 처리하는 커스텀 훅
 * @param onClose 모달 닫기 함수
 * @param isActive 모달 활성 상태
 */
export const useEscapeClose = (onClose: () => void, isActive: boolean) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isActive) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose, isActive]);
};
