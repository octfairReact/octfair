import styled from "styled-components";

export const CompanyUpdatePageStyled = styled.div`
  /* 전체 레이아웃 */
  #companyWritePreview {
    border: 1px dashed #ccc;
    padding: 10px;
    text-align: center;
    height: 100px; /* 미리보기 영역 높이 */
    line-height: 100px; /* 세로 중앙 정렬 */
    color: #aaa;
  }

  .btnType {
    display: inline-block;
    padding: 12px 30px; /* 버튼 크기 */
    font-size: 16px; /* 글자 크기 */
    font-weight: bold; /* 글자 굵기 */
    color: white; /* 텍스트 색상 */
    background-color: #3db4ec; /* 배경색 */
    border: none; /* 테두리 제거 */
    border-radius: 5px; /* 둥근 모서리 */
    cursor: pointer; /* 마우스 커서 변경 */
    transition: all 0.3s ease; /* 호버 효과 시 부드럽게 변화 */
    margin-right: 3px; /* 오른쪽 버튼에 간격 추가 */
  }

  .btnType:hover {
    background-color: #2a8ab1; /* 호버 시 배경색 어두워짐 */
  }

  .btnType:active {
    transform: scale(0.98); /* 클릭 시 살짝 눌리는 효과 */
  }

  .btnType.gray {
    display: inline-block;
    padding: 12px 30px; /* 버튼 크기 */
    font-size: 16px; /* 글자 크기 */
    font-weight: bold; /* 글자 굵기 */
    color: white; /* 텍스트 색상 */
    background-color: #7d99b3; /* 배경색 #7D99B3 */
    border: none; /* 테두리 제거 */
    border-radius: 5px; /* 둥근 모서리 */
    cursor: pointer; /* 마우스 커서 변경 */
    transition: all 0.3s ease; /* 호버 효과 시 부드럽게 변화 */
  }

  .btnType.gray:hover {
    background-color: #6a859e; /* 호버 시 배경색 어두워짐 */
  }

  .btnType.gray:active {
    transform: scale(0.98); /* 클릭 시 살짝 눌리는 효과 */
  }
`;
