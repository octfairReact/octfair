import styled from 'styled-components';

export const BodyStyled = styled.div`
    .MainContent{
     flex: 1; /* 메인 콘텐츠가 남는 공간을 차지 */
  margin-bottom: 80px; /* 페이지네이션과의 간격 추가 */
    }
  footer {
  margin-top: 20px; /* 푸터가 페이지네이션과 겹치지 않도록 여백 추가 */
}
`;

export const ApplicantPageNavigateStyled = styled.div`
   text-align: center;
  margin: 20px auto; /* 페이지네이션을 중앙으로 정렬 */
  padding: 10px 0;
 background-color: #f8f9fa; /* 페이지네이션 배경 색상 */
   overflow: visible; /* 오버플로우 방지 */
   height: auto;
   margin-bottom: 20px; /* 페이지네이션 하단에 여백 추가 */
  ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    display: flex; /* 버튼들을 가로로 나열 */
    justify-content: center; /* 중앙 정렬 */
    align-items: center;
    gap: 8px; /* 버튼 간 간격 */
  }

  li {
    display: inline-block;
    margin: 0;

    a {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 36px; /* 버튼 크기 */
      height: 30px;
      font-size: 16px; /* 텍스트 크기 */
      font-weight: bold;
      text-align: center;
      text-decoration: none;
      color: #495057; /* 기본 텍스트 색상 */
      background-color: #ffffff; /* 버튼 배경색 */
      border: 1px solid #dee2e6; /* 테두리 색상 */
      border-radius: 8px; /* 버튼 둥근 모서리 */
      transition: all 0.3s ease; /* 부드러운 애니메이션 효과 */
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 살짝 부각된 느낌 */
    }

    a:hover {
      background-color: #007bff; /* 호버 시 배경색 */
      color: #ffffff; /* 호버 시 텍스트 색상 */
      transform: translateY(-2px); /* 살짝 올라가는 애니메이션 */
      box-shadow: 0 4px 8px rgba(0, 123, 255, 0.4); /* 호버 시 그림자 강조 */
    }

    &.active a {
      background-color: #007bff; /* 현재 페이지 배경색 */
      color: #ffffff; /* 현재 페이지 텍스트 색상 */
      border: none; /* 현재 페이지 테두리 제거 */
    }

    &.disabled a {
      background-color: #e9ecef; /* 비활성화 버튼 배경색 */
      color: #adb5bd; /* 비활성화 버튼 텍스트 색상 */
      cursor: not-allowed; /* 비활성화 마우스 커서 */
    } 
    
    footer{
    position: relative;
  margin-top: 20px; /* 푸터와 페이지네이션 간격 추가 */
    }
  }
`;