import styled from "styled-components";

export const ContentBoxPostStyled = styled.div`
  background-color: #e0e0e0;
  padding: 10px 100% 10px 0px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  display: block;
  width: 100%;
`;

export const ContentNamePost = styled.div`
  width: max-content;
  font-size: 30px;
  margin-left: 10px;
  font-weight: bold;
  position: relative;
  z-index: 0px;
  display: flex; /* Flex container 설정 */
  justify-content: space-between; /* 자식 요소 사이 공간 배분 */
  width: 750px;

  /* Action buttons */
  .action-buttons {
    display: flex;
    gap: 10px;
  }

  .action-buttons .btn {
    padding: 5px 15px;
    font-size: 13px;
    border-radius: 5px;
  }

  .btn-outline-primary {
    background-color: transparent;
    color: #007bff;
    border: 1px solid #007bff;
  }

  .btn-outline-primary:hover {
    background-color: #007bff;
    color: white;
  }

  .btn-outline-danger {
    background-color: transparent;
    color: #dc3545;
    border: 1px solid #dc3545;
  }

  .btn-outline-danger:hover {
    background-color: #dc3545;
    color: white;
  }
  .job-details {
    font-size: 200px;
  }
`;
