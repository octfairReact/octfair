import styled from 'styled-components';

// History 메인 페이지 스타일
export const HistoryMainStyled = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

// 테이블 헤더 스타일
export const StyledTh = styled.th<{ size: number }>`
  width: ${(props) => props.size}%;
  padding: 10px;
  background-color: #f4f4f4;
  text-align: left;
  font-weight: bold;
`;

// 호버 가능한 텍스트 스타일
export const StyledHoverText = styled.span`
  cursor: pointer;
  color: black;  /* 기본 글자 색상 검은색 */
  text-decoration: none;  /* 밑줄 제거 */

  /* 호버 시 빨간색으로 변경 */
  &:hover {
    color: red;  /* 호버 시 빨간색 */
  }

  &.bold {
    font-weight: bold;  /* 글자 두껍게 설정 */
  }

  display: block;  /* 블록 수준 요소로 설정하여 한 줄씩 띄우기 */
  margin-bottom: 10px;  /* 아래쪽에 간격을 주기 */
`;