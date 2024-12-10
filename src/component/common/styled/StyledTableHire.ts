import styled from "styled-components";

// 테이블 스타일
export const StyledTableHire = styled.table`
  width: 80%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #ffffff; /* 테이블 배경색 */
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  th, td {
    
    padding: 0px 8px;
    text-align: left;
    vertical-align: middle;
    font-size: 14px;
    color: #333;
  }
  th {
    width: 12%;
    background-color: #f2f4f6; /* 헤더 배경색 */
    color: #444; /* 헤더 글자색 */
    font-weight: bold;
    border: 1px solid #e1e4e8;
    border-right: none; /* 오른쪽 테두리 제거 */
  }
    tr{
    height: 80px;}
  // .date div{
  //   display: flex; 
  //   gap: 16px;
  //   width:50%;
    
  // }
  td {
    background-color: #ffffff; /* 본문 배경색 */
    border: 1px solid #e1e4e8;
    border-top: none; /* 상단 테두리 제거 */
    border-left: none; /* 왼쪽 테두리 제거 */
    width: 50%;
  }

  /* 마지막 열 테두리 설정 */
  th:last-child, td:last-child {
    border-right: 1px solid #e1e4e8;
  }

  /* 마지막 행 테두리 설정 */
  tr:last-child td {
    border-bottom: 1px solid #e1e4e8;
  }

  input, select, textarea {
    width: calc(100% - 16px); /* 입력 필드 패딩 반영 */
    padding: 8px;

    height: 80%;
    border: 1px solid #ccc; /* 기본 테두리 */
    border-radius: 4px;
    font-size: 14px;
    background-color: #f9f9f9; /* 입력 필드 배경 */
    box-sizing: border-box;
    transition: all 0.2s ease;

    &:focus {
      border-color: #007bff;
      outline: none;
      background-color: #fff; /* 포커스 시 배경 */
    }
  }

  input[type="file"] {
    padding: 4px;
    border: none;
    font-size: 14px;
  }

  button {
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-top: 8px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }

    &:disabled {
      background-color: #d6d8db;
      cursor: not-allowed;
    }
  }

  label {
    font-size: 14px;
    color: #444;
     width: 100px;
  }
  input[type="checkbox"]{
    width: 20px;
  }

  .checkbox-group {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .recruit-process-wrapper {
    display: flex;
    flex-direction: row; /* 프로세스 입력과 버튼을 한 줄로 */
    align-items: center;
    gap: 8px;
  }

  .recruit-process-list {
    margin-top: 8px;
    font-size: 14px;
    color: #666;
  }

  input[type="text"], textarea {
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #ddd; /* 입력 테두리 색상 */
  }

  .calendar-wrapper {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  /* 버튼 스타일 */
  .calendar-button {
    padding: 8px 12px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #e9e9e9;
    }
  }
`;
