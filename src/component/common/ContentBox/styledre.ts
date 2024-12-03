import styled from "styled-components";

export const ReloadButtonStyled = styled.div`
  .reload-button {
    background: transparent;
    border: none;
    padding: 20px;
    cursor: pointer;
    position: absolute;
    top: -20px; /* 상단으로 올리기 */
    right: 5px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: transform 0.6s ease-in-out; /* 애니메이션 효과 */
    margin-bottom: 20px; /* 하단 여백 추가 */
  }

  .reload-icon {
    font-size: 30px;
    color: black;
    display: block;
    transition: transform 0.8s ease-in-out;
  }

  .reload-button:hover .reload-icon {
    transform: rotate(360deg); /* 버튼에 마우스를 올리면 화살표 회전 */
  }
`;
