import styled, { keyframes } from 'styled-components';

// 모달 등장 애니메이션
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-30px); /* 화면 위에서 내려오는 효과 */
  }
  100% {
    opacity: 1;
    transform: translateY(0); /* 원래 위치로 돌아오기 */
  }
`;

export const HistoryModalStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6); /* 어두운 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  /* 모달 등장 애니메이션 */
  animation: ${fadeIn} 0.5s ease-out; /* 애니메이션 추가 */

  > div {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 80%;
    max-width: 900px;
    text-align: center;
    overflow-y: auto; /* 스크롤이 가능하도록 설정 */
    max-height: 90vh; /* 최대 높이를 화면의 90%로 제한 */
  }

  h2 {
    font-size: 1.8em;
    color: #333;
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    margin-bottom: 20px;
    border-collapse: collapse;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  th, td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
    font-size: 1em;
  }

  th {
    background-color: #007BFF; /* 파란색 배경 */
    color: white;
    font-weight: bold;
  }

  td {
    background-color: #f4f4f4; /* 더 밝은 회색으로 수정 */
    color: #555;
  }

  tr:nth-child(even) td {
    background-color: #e9ecef; /* 더 밝은 색으로 수정 */
  }

  /* 자격증 및 외국어 정보 테이블에서 td만 가운데 정렬 */
  .cert-table td {
    text-align: center; /* td만 가운데 정렬 */
  }

  hr {
    margin: 20px 0;
    border-top: 2px solid #ddd;
  }

  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 15px;
  }

  button {
    padding: 12px 24px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }

  /* 닫기 버튼 스타일 */
  .close-button {
    background-color: #007BFF;
    color: white;

    &:hover {
      background-color: #0056b3;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }

  /* 인쇄 버튼 스타일 */
  .print-button {
    background-color: #6c757d; /* 회색 배경 */
    color: white;

    &:hover {
      background-color: #5a6268;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .no-align {
    text-align: left;
  }

  // 포트폴리오 css
  .proLink {
      text-decoration: none;
  }
  .proLink:hover {
        text-decoration: underline; /* 언더라인 추가 */
  }

  // 첨부파일 다운로드 css
  .download-link {
    color: blue; /* 링크 색상 */
    cursor: pointer; /* 마우스 커서가 손가락 모양으로 바뀜 */
  }
  .download-link:hover {
      text-decoration: underline; /* 언더라인 추가 */
  }
`;