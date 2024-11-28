import styled from 'styled-components';

// History 메인 페이지 스타일
export const HistoryMainStyled = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

// 호버 가능한 텍스트 스타일
export const StyledHoverText = styled.span`
  cursor: pointer;
  color: black;  /* 기본 글자 색상 검은색 */
  text-decoration: none !important;  /* 밑줄 제거 */

  /* 호버 시 빨간색으로 변경하고 밑줄 추가 */
  &:hover {
    color: red;  /* 호버 시 빨간색 */
    text-decoration: underline;  /* 밑줄 추가 */
  }

  &.bold {
    font-weight: bold;  /* 글자 두껍게 설정 */
  }

  display: block;  /* 블록 수준 요소로 설정하여 한 줄씩 띄우기 */
  margin-bottom: 10px;  /* 아래쪽에 간격을 주기 */
`;

// 지원 취소 버튼
export const CancelButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  background-color: #d9534f !important;  /* 진한 붉은색 */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  &:hover {
    background-color: #c9302c;  /* 호버 시 더 진한 붉은색 */
    transform: scale(1.05);
  }

  &:active {
    background-color: #ac2925;  /* 클릭 시 더 진한 붉은색 */
    transform: scale(1);
  }
`;

// 회색 버튼 스타일 (취소 불가)
export const DisabledButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  background-color: #ccc !important;  /* 회색 */
  color: #666;  /* 회색 글자 */
  border: none;
  border-radius: 5px;
  cursor: not-allowed !important;  /* 클릭 불가 스타일 */
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ccc;  /* 회색 상태 유지 */
  }

  &:active {
    background-color: #ccc;  /* 회색 상태 유지 */
  }
`;
