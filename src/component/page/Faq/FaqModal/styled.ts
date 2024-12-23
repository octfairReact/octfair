import styled from "styled-components";

export const FaqModalStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  z-index: 1000;

  .faq {
    background-color: #3e4463;
    padding: 5px; /* 패딩을 추가하여 내용과 배경이 붙지 않도록 함 */
    color: white; /* 텍스트 색상도 흰색으로 설정 */
    text-align: left;
  }

  .modal-container {
    position: relative;
    width: 600px;
    background: #f3f3f3; /* 배경색 */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    font-family: "Arial", sans-serif;
  }

  .modal-content {
    position: relative;
    width: 100%;
  }

  .modal-overlay {
    position: absolute;
    top: 10px;
    right: 10px; /* 오른쪽 상단으로 이동 */
    color: white;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    background: transparent;
    border: none;
  }

  h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
    color: white; /* 제목 색상 */
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th {
    text-align: center; /* 수평 중앙 정렬 */
    vertical-align: middle; /* 수직 중앙 정렬 */
    padding: 10px;
    font-size: 14px;
    color: #333;
    width: 120px;
    background: #bbc2cd; /* 배경색 */
  }

  td {
    padding: 10px;
  }

  input[type="text"],
  textarea {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
  }

  textarea {
    resize: none;
    height: 100px;
  }

  .required {
    color: red;
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }

  button {
    background-color: #3bb2ea;
    border: none;
    color: white;
    padding: 10px 22px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 8px;
    box-shadow: 0 4px #999;
    transition: 0.3s;

    &:hover {
      background-color: #d6effc;
    }

    &:active {
      background-color: #3e8e41;
      box-shadow: 0 2px #666;
      transform: translateY(2px);
    }
  }

  .btn.gray {
    background-color: #6c757d;

    &:hover {
      background-color: #5a6268;
    }

    &:active {
      background-color: #545b62;
    }
  }
`;
