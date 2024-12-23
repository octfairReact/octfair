import styled from "styled-components";

export const StyledTablePost = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 50px 0px 0px 0px;
  font-size: 18px;
  text-align: left;
  table-layout: fixed;

  th,
  td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    text-align: center;
  }

  th {
    background-color: #dce1e6;
    color: #333333;
  }
  th {
    background-color: #dce1e6;
    color: #333333;
  }

  /* 테이블 올렸을 때 */
  tbody tr:hover {
    background-color: #d3d3d3;
    opacity: 0.9;
    cursor: pointer;
  }

  button {
    background-color: #3bb2ea;
    border: none;
    color: white;
    padding: 10px 22px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 8px;
    box-shadow: 0 4px #999;
    transition: 0.3s;

    &:hover {
      background-color: #87ceeb;
    }

    &:active {
      background-color: #3e8e41;
      box-shadow: 0 2px #666;
      transform: translateY(2px);
    }
  }
`;

export const StyledTh = styled.th<{ size?: number }>`
  background-color: #7d99b3;
  padding: 12px;
  border: 1px solid #ddd;
  width: ${(props) => props.size}%;
`;

export const StyledTd = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
`;
