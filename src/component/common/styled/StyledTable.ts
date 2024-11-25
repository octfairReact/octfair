import styled from 'styled-components';

export const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0px 0px 0px;
    font-size: 18px;
    text-align: left;
    table-layout: fixed;

    th,
    td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        text-align: center;
    }

    th {
        background-color: #f5f5f5;
        font-weight: bold;
        text-align: center; 
        color: #ddd;


    }

    /* 테이블 올렸을 때 */
    tbody tr:hover {
        background-color: #d3d3d3;
        opacity: 0.9;
        cursor: pointer;
    }
`;

export const StyledTh = styled.th<{ size?: number }>`
    background-color: #f4f4f4;
    padding: 12px;
    border: 1px solid #ddd;
    width: ${(props) => props.size}%;
`;

export const StyledTd = styled.td`
    width: 100%;
    //padding: 12px;
    border: 1px solid #ddd;
`;

export const StyledInput = styled.input`
  width: 100%; /* 입력 창이 td를 꽉 채움 */
  padding: 8px 12px; /* 텍스트와 테두리 사이의 여백 */
  font-size: 14px; /* 글자 크기 */
  border: 1px solid #ccc; /* 기본 테두리 */
  border-radius: 4px; /* 모서리를 부드럽게 */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* 안쪽 그림자 */
  transition: border-color 0.3s, box-shadow 0.3s; /* 효과를 부드럽게 */

  &:focus {
    border-color: #4a90e2; /* 포커스 시 파란색 테두리 */
    box-shadow: 0 0 5px rgba(74, 144, 226, 0.5); /* 포커스 시 빛나는 효과 */
    outline: none; /* 기본 포커스 스타일 제거 */
  }
`;

export const StyledTableHire = styled.table`
    td input:focus,
    td textarea:focus,
    td select:focus {
    border-color: #4a90e2; /* 포커스 시 파란 테두리 */
    box-shadow: 0 0 5px rgba(74, 144, 226, 0.5); /* 포커스 시 빛나는 효과 */
    outline: none; /* 기본 포커스 제거 */
}

/* 버튼 스타일 */
    button {
  padding: 8px 16px;
  background-color: #4a90e2; /* 파란 버튼 */
  color: #fff; /* 버튼 글자 흰색 */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #357abd; /* 호버 시 더 짙은 파란색 */
}

/* 강조를 위한 필수 항목 스타일 */
td.required::before {
  content: "*";
  color: red;
  margin-right: 4px;
}
   
`;
