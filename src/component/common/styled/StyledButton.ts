import styled from "styled-components";

export const StyledButton = styled.button`
  background-color: #007bff; /* Primary blue color */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3; /* Darker blue on hover */
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    background-color: #004080; /* Even darker blue on active */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(0);
  }
`;