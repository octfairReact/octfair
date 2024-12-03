import styled from "styled-components";

// 전체 모달 오버레이 스타일
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

// 모달 컨테이너 스타일
export const ModalStyled = styled.div`
  width: 90vw;  /* 기본적으로 화면 크기의 90%로 설정 */
  max-width: 600px;  /* 최대 너비는 600px */
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-family: Arial, sans-serif;
  position: relative;

  @media (max-width: 768px) {
    width: 95vw; /* 화면이 작은 경우 너비를 조금 더 줄임 */
  }

  @media (max-width: 480px) {
    width: 100vw; /* 아주 작은 화면에서는 너비를 화면 전체로 확장 */
    padding: 10px; /* 패딩을 줄여서 공간 활용 */
  }
`;

// 테이블 스타일
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  /* 테이블 올렸을 때 */
  tbody td :hover {
    background-color: #d3d3d3;
    opacity: 0.9;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    font-size: 0.9em;
  }
`;

// 테이블 캡션 스타일
export const TableCaption = styled.caption`
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

// 테이블 헤더 셀 스타일
export const TableHeaderCell = styled.th`
  text-align: left;
  padding: 10px;
  background-color: #f9f9f9;
  font-weight: normal;
  width: 150px;
  vertical-align: middle;

  @media (max-width: 768px) {
    width: 120px;
    font-size: 0.9em;
  }

  @media (max-width: 480px) {
    width: 100px;
  }
`;

// 테이블 데이터 셀 스타일
export const TableDataCell = styled.td`
  padding: 10px;
  vertical-align: middle;

  @media (max-width: 768px) {
    font-size: 0.9em;
  }
`;

// 인풋 필드 스타일
export const InputField = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9em;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  @media (max-width: 768px) {
    font-size: 0.85em;
  }
`;

// 셀렉트 박스 스타일
export const SelectBox = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9em;
  box-sizing: border-box;

  @media (max-width: 768px) {
    font-size: 0.85em;
  }
`;

// 버튼 스타일
export const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  border: none;
  color: white;
  font-size: 1em;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    font-size: 0.9em;
  }
`;

// 필수 입력 마크 스타일
export const RequiredMark = styled.span`
  color: red;
  font-weight: bold;
  margin-left: 5px;
`;