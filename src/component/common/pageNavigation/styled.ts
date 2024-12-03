import styled from "styled-components";

export const PageNavigateStyled = styled.div`
  text-align: center;
  margin: 0 auto;
  position: relative;
  //background-color: #f0f4f8;
  padding: 10px;
  border-radius: 8px;

  ul {
    list-style: none;
    padding: 0;
    display: inline-flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
  }

  li {
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #fff;
    border: 1px solid #ccc;
    transition: background-color 0.3s, transform 0.2s;

    a {
      color: #007bff; /* 기본 텍스트 색상 */
      text-decoration: none;
      font-weight: bold;
    }

    &:hover {
      background-color: #007bff;
      color: white;
      cursor: pointer;
      transform: scale(1.05);
    }

    &.active {
      background-color: #007bff;
      color: white; /* active 상태에서 텍스트 색상 변경 */
      border: 1px solid #0056b3;

      a {
        color: white; /* active 상태에서 링크 색상 변경 */
      }
    }

    &.disabled {
      background-color: #f1f1f1;
      color: #ccc;
      cursor: not-allowed;
    }
  }

  .page-nav-btn {
    padding: 10px 15px;
    border-radius: 5px;
    background-color: #e1e6ea;
    border: 1px solid #bbb;
    cursor: pointer;
    font-weight: bold;

    &:hover {
      background-color: #0056b3;
      color: white;
    }

    &.disabled {
      background-color: #f1f1f1;
      color: #ccc;
      cursor: not-allowed;
    }
  }
`;
