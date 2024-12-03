import styled from "styled-components";

// 버튼 스타일을 개별적으로 관리하기 위해 styled-components로 스타일링합니다.
export const FaqMainStyled = styled.div`
  div {
    display: flex;
    gap: 10px;
  }
`;

interface ButtonProps {
  isActive: boolean;
}

export const StyledButton = styled.button<ButtonProps>`
  margin-top: 10px;
  font-size: 15px;
  width: 100px;
  padding: 10px;
  background-color: ${(props) => (props.isActive ? "#37AEE5" : "#7A96B0")}; /* 버튼이 활성화되면 */
  color: white; /* 글씨 색을 흰색으로 */
  border: none; /* 보더 없애기 */
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isActive ? "#37AEE5" : "#6F8BA9")}; /* hover 시 색상 변경 */
  }
`;
