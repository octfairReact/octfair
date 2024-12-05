import { useEffect } from 'react';

// ESC 키를 눌렀을 때 실행될 동작을 처리하는 커스텀 훅
export const useEscapeClose = (onClose: () => void) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
};
