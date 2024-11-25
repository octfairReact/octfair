import styled from "styled-components";

export const CompanyDetailStyled = styled.div`
  /* 전체 레이아웃 */
  .divComGrpCodList {
    width: 100%;
    display: flex; /* 플렉스 박스를 사용하여 중앙 정렬 */
    justify-content: center; /* 수평 중앙 정렬 */
    align-items: center; /* 수직 중앙 정렬 */
    flex-direction: column; /* 이미지가 세로로 쌓이게 하기 위한 설정 */
  }

  /* 로고 이미지 */
  .divComGrpCodList img {
    max-height: 200px;
    max-width: 300px;
    margin: 10px 0; /* 상하 여백 설정 */
  }
`;
