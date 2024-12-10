import styled from "styled-components";

export const NoticeSearchStyled = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap; /* 아이템들이 넘치면 다음 줄로 넘어가도록 설정 */
  justify-content: flex-end;
  gap: 10px; /* 버튼과 input 요소들 사이의 간격을 설정 */
  margin-right: 5px;

  .input-box {
    display: flex;
    align-items: center; /* 아이템들을 수평 중앙 정렬 */
    gap: 5px; /* input과 버튼 간 간격 */
    flex-wrap: wrap; /* 여러 개의 input이나 버튼이 한 줄에 넘치면 다음 줄로 넘어가도록 설정 */
  }

  input {
    padding: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 3px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  button {
    background-color: #3bb2ea;
    border: none;
    color: white;
    padding: 8px 15px;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0 4px #999;
    transition: 0.3s;

    &:hover {
      background-color: #87ceeb;
    }

    &:active {
      background-color: #3e8e41;
      box-shadow: 0 2px #666;
      transform: translateY(2px);
    }
  }

  @media (max-width: 1000px) {
  }
`;
