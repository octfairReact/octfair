import styled from 'styled-components';

export const MainPageStyled = styled.div`
    .chat_btn {
        cursor: pointer;
        position: fixed;
        bottom: 5%; /* 화면 하단에서 5% 위치 */
        right: 5%; /* 화면 오른쪽에서 5% 위치 */
        width: 100px; /* 이미지 크기 설정 */
        height: auto; /* 비율에 맞게 높이 자동 설정 */
        border-radius: 50%;
        transition: background-color 0.3s; /* 호버 배경색 전환 부드럽게 */

        &:hover {
            background-color: rgba(0, 0, 0, 0.3); /* 호버 시 배경 색 변경 */
        }

        &.active {
            background-color: rgba(0, 0, 0, 0.3); /* 모달이 열리면 호버 효과 유지 */
        }
    }

    // 모달창 
    .chat_modal {
        position: fixed;
        bottom: 10%; /* 아래쪽에 위치 */
        right: 10%; /* 오른쪽에 위치 */
        width: 350px; /* 원하는 크기 설정 */
        height: auto; /* 높이를 자동으로 설정 */
        max-height: 80vh; /* 최대 높이를 화면 크기의 80%로 설정 */
        display: flex;
        flex-direction: column;
        justify-content: flex-end; /* 메시지 영역 하단 정렬 */
        z-index: 1000;
        background-color: #9bbbd4; /* 모달 배경색 : 하늘색 */
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    // 채팅창 헤더
    .chat_header {
        padding: 10px;
        color: white;
        text-align: center;
        font-weight: bold;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    // 채팅 본문
    .chat_body {
        flex-grow: 1;
        overflow-y: auto;
        padding: 10px;
        background-color: #f1f1f1; /* 메시지 영역 배경 */
        max-height: calc(100% - 80px); /* 채팅 본문 영역의 최대 높이 설정 */
    }

    // 채팅 메시지
    .message {
        background-color: #FFEB3B; /* 모든 메시지를 노란색 배경으로 설정 */
        padding: 8px;
        border-radius: 10px;
        margin: 5px 0;
        max-width: 80%;
        word-wrap: break-word;
        display: block; /* block으로 변경하여 가로가 아닌 세로로 쌓이게 함 */
        width: fit-content; /* 메시지 크기에 맞게 너비 조절 */
    }

    // 채팅 입력창
    .chat_footer {
        display: flex;
        padding: 10px;
        background-color: #fff;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        border-top: 1px solid #ddd;
    }

    .chat_footer input {
        flex-grow: 1;
        padding: 8px;
        border-radius: 5px;
        border: 1px solid #ddd;
        margin-right: 10px;
        font-size: 14px; /* 글자 크기 조정 */
    }

    .chat_footer button {
        padding: 8px 16px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
    }

    .chat_footer button:hover {
        background-color: #45a049;
    }
`;
