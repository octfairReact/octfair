import { useEffect } from 'react';

// ESC 키를 눌러 모달을 닫을 수 있는 커스텀 훅
export const useEscapeClose = (onClose: () => void) => {    // onClose 함수(모달 닫기)를 파라미터로 받음
    useEffect(() => {   // 컴포넌트 랜더링될 때마다 실행
        const handleKeyDown = (event: KeyboardEvent) => {   // 키보드 이벤트를 처리
            if (event.key === 'Escape') {   // ESC키인지 확인
                onClose();  // onClose 함수(모달 닫기)를 실행
            }
        };
        window.addEventListener('keydown', handleKeyDown);  // keydown 이벤트를 window 에 등록하여 키 입력을 감지
        return () => {  // 컴포넌트 언마운트 또는 onClose가 변경될 때 cleanup
            window.removeEventListener("keydown", handleKeyDown);   // 등록된 이벤트 리스너를 제거
          };
    },[onClose]);   // onClose 변경될 때마다 useEffect 재실행
  };
