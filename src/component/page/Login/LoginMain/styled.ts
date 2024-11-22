import styled from 'styled-components';

export const LoginStyled = styled.div`
    padding-top: 10px;
    .login-container {
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        width: 100%;
        text-align: center;
        background-image: radial-gradient(ellipse farthest-corner at 0 140%, #5d9dff 0%, #2178ff 70%, #3585ff 70%);
    }

    .login-image {
        background-position: center;
        width: 100%;
        border-radius: 10px 0px 0px 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
    }
    .login-box {
        background-color: white;
    }

    .buttons {
        padding: 20px;
        justify-content: center;
        align-items: center;
        display: grid;
    }

    label {
        display: flex;
        font-size: 14px;
        color: #333333;
    }

    input {
        padding: 8px;
        margin-top: 5px;
        margin-bottom: 5px;
        margin-right: 5px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    button {
        width: 100%;
        padding: 10px;
        margin: 5px 0;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
    }

    .login-text {
        padding-top: 50px;
        padding-bottom: 30px;
        color: #ffffff;
    }
    .login-button {
        background-color: #2676bf;
        color: #ffffff;
    }

    .signup-button {
        background-color: #28a745;
        color: #ffffff;
    }

    button:hover {
        opacity: 0.9;
    }
`;

// 아이디찾기를 좌측에 비밀번후를 우측에 붙여 정렬시키는 스타일
export const SearchIdPwContainer = styled.div`
    display: flex;
    justify-content: space-between; /* 좌우로 요소를 배치 */
    width: 100%; /* 선택 사항: 전체 가로 너비를 차지 */
    align-items: center; /* 세로 중앙 정렬 */
`;

// 아이디/비밀번호 찾기에 마우스 올릴 시 손모양커서로 바꾸는 스타일
export const ClickableLabel = styled.label`
    cursor: pointer; /* 손 모양 커서 */
    text-decoration: underline; /* 밑줄 */
    color: green !important; /* 선택사항: 링크처럼 보이도록 색상 변경 */
    &:hover {
        color: magenta !important; /* 선택사항: 호버 시 색상 변경 */
    }
`;