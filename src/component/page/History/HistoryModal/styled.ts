import styled from 'styled-components';

export const HistoryModalStyled = styled.div`
    position: fixed;               /* 화면에 고정 */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* 어두운 반투명 배경 */
    display: flex;
    justify-content: center;       /* 수평 중앙 */
    align-items: center;           /* 수직 중앙 */
    z-index: 1000;                 /* 모달이 다른 요소들 위에 나오게 */
    
    /* 모달 박스 스타일 */
    > div {
        background-color: white;   /* 모달 배경 */
        padding: 20px;
        border-radius: 8px;        /* 둥근 모서리 */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
        width: 720px;              /* 모달 너비 */
        text-align: center;        /* 텍스트 중앙 정렬 */
    }

    button {
        margin-top: 10px;
        padding: 8px 16px;
        background-color: #007BFF;  /* 파란색 배경 */
        color: white;               /* 흰색 텍스트 */
        border: none;
        border-radius: 4px;         /* 둥근 버튼 */
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: #0056b3;  /* 호버 시 배경 색 변경 */
        }
    }
`;
