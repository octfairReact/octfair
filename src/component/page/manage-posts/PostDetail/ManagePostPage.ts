/* Main container */
import styled from "styled-components";

export const PostDetailStyled = styled.div`
  #wrap_area {
    padding: 20px;
  }
  .container {
    display: flex; /* Flex container 설정 */
    justify-content: space-between; /* 자식 요소 사이 공간 배분 */
    width: 100%; /* 필요 시 부모 요소에 너비 설정 */
  }

  .container1 {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
  }

  .detail-item {
    padding: 10px;
    border-radius: 5px;
    background-color: transparent; /* 구분이 덜 티나도록 */
    box-shadow: none;
    font-size: 16px; /* 여기에서 폰트 크기 조정 */
  }
  /*기업상세보기 버튼 */
  .company-info-link {
    display: inline-block;
    padding: 5px 10px;
    background-color: white; /* 흰색 배경 */
    color: black; /* 글자색 검정 */
    text-align: center;
    text-decoration: none; /* 밑줄 제거 */
    border-radius: 5px; /* 모서리 둥글게 */
    font-size: 12px;
    cursor: pointer; /* 마우스 커서 포인터로 변경 */
    border: 1px solid black; /* 검정 테두리 */
    transition: background-color 0.3s ease, color 0.3s ease;
    /* 호버 시 부드러운 효과 */
  }
  .company-info {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  }

  .company-info-link:hover {
    background-color: black; /* 호버 시 배경 검정 */
    color: white; /* 글자색 흰색 */
  }

  .full-width {
    grid-column: span 2;
  }
  .duties {
    height: 150px;
    line-height: 1.6;
    overflow-y: auto;
  }

  .job-details,
  .company-info {
    padding: 20px;
    border-radius: 8px;
  }

  .job-details h2,
  .company-info h4 {
    font-size: 24px;
  }

  .job-details-content {
    padding: 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    font-size: 18px;
  }

  .company-info-content {
    padding: 10px;
    border-radius: 5px;
    font-size: 18px;
  }

  /* 날짜 부분 css */
  .company-info {
    margin-top: 20px; /* 위쪽 여백 조정 */
  }

  .date {
    text-align: center; /* 가운데 정렬 */
    font-size: 1.2em; /* 글자 크기 조정 */
    margin-top: 30px; /* 남은 기간과 위 요소들 사이 간격 조정 */
  }

  .remaining {
    font-weight: bold; /* 남은 기간 텍스트 강조 */
    font-size: 1.5em; /* 남은 기간 글자 크기 조정 */
    margin-bottom: 10px; /* 아래쪽 여백 조정 */
  }

  .date-details {
    display: flex; /* Flexbox를 사용하여 아이템을 나란히 정렬 */
    justify-content: space-around; /* 공간을 균등하게 배분 */
    margin-top: 10px; /* 날짜 항목과 상위 요소 간격 조정 */
  }

  .date-item {
    text-align: center; /* 각 날짜 항목 중앙 정렬 */
  }

  .date-label {
    margin-bottom: 10px; /* 레이블과 값 사이의 아래쪽 여백 */
    color: red; /* 레이블 색상 빨간색 */
  }

  .date-value {
    margin-top: 10px; /* 값과 레이블 사이의 위쪽 여백 */
    color: red; /* 값 색상 빨간색 */
  }
  .align {
    text-align: center; /* 내부 요소 가로 중앙 정렬 */
    margin-bottom: 15px;
  }

  .align img {
    border-radius: 5px;
  }
  strong {
    font-size: 20px;
  }
  .remaining {
    font-weight: bold; /* 남은 기간 텍스트 강조 */
    font-size: 1.5em; /* 남은 기간 글자 크기 조정 */
    margin-bottom: 10px; /* 아래쪽 여백 조정 */
  }

  button.btn-outline-secondary {
    background-color: transparent;
    color: #007bff;
    border: 1px solid #007bff;
  }

  button.btn-outline-secondary:hover {
    background-color: #007bff;
    color: white;
  }

  button.btn-warning {
    background-color: #ffc107;
    color: black;
    border: 1px solid #ffc107;
  }

  button.btn-warning:hover {
    background-color: #e0a800;
    color: white;
  }
  .action-buttons {
    display: flex; /* Flexbox 사용 */
    align-items: center; /* 세로 중앙 정렬 */
    justify-content: flex-end; /* 오른쪽으로 정렬 */
    gap: 10px; /* 버튼 간의 간격 조절 (원하는 만큼 조정 가능) */
    margin-top: 10px; /* 위쪽 마진 추가 (필요 시) */
  }
  .grid-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  /* Action buttons */
  .action-buttons {
    display: flex;
    gap: 10px;
  }

  .action-buttons .btn {
    margin: 5px;
    font-size: 13px;
    border-radius: 5px;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  /* Action buttons */
  .action-buttons {
    display: flex;
    gap: 10px;
    padding: 15px;
  }

  .action-buttons .btn {
    padding: 10px 40px;
    font-size: 13px;
    text-align: center;
    border-radius: 5px;
  }
`;
