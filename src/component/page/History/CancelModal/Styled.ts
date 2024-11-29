import styled from 'styled-components';

export const CancelModalStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7); /* 어두운 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;

  > div {
    background-color: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 450px;
    text-align: center;
    max-height: 90vh;
    animation: fadeIn 0.3s ease-in-out;
  }

  h2 {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
  }

  p {
    font-size: 16px;
    color: #555;
    margin-bottom: 25px;
  }

  .highlight-title {
    color: red;  /* 제목 부분을 빨간색으로 표시 */
    font-weight: bold;
  }

  .modal-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;  /* 버튼 간격을 적당히 좁힘 */
  }

  button {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    width: 120px;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }

  /* 취소 버튼 스타일 */
  .cancel-button {
    background-color: #007bff;
    color: white;

    &:hover {
      background-color: #0056b3;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }
  }

  /* 삭제 버튼 스타일 */
  .delete-button {
    background-color: #f44336;
    color: white;

    &:hover {
      background-color: #d32f2f;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;