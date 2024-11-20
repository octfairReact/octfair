import styled from "styled-components";

export const ResumeStyled = styled.div`
  margin-bottom: 10px;
  float: inline-end;
  input {
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;

    position: relative;
    top: -40px;
    left: -80px;

    width: calc(100% * 3);
  }

  .jIkZcX {
    width: 150px !important;
    margin: -6px 7px !important;
    font-weight: bold !important;
  }

  @media (max-width: 1000px) {
  }
`;

export const InputBtnGroup = styled.div`
  .jIkZcX {
    display: flex;
    justify-content: flex-end;
    text-align: center;
    width: 100px !important;
    font-weight: bold !important;
  }
`;

export const ResumeDetailBody = styled.div`
  margin: 20px 20px 60px;
`;

export const ResumeDetailBodyBasicInfo = styled.div`
  margin: 20px;
`;

export const ResumeDetailBodyHeader = styled.div`
  margin-top: 15px;
  padding: 5px;
  font-size: 20px;
  border-bottom: 0.5px solid black;
`;

export const ResumeDetailBodyGuide = styled.div`
  margin: 10px 0px;
  padding: 5px;
  background-color: #eaf2fe;
  border-radius: 5px;
  color: gray;
`;

export const ResumeInput = styled.input`
  font-size: 13px;
  width: 100%;
  border: none;
  padding: 5px;
`;

export const ResumeTextarea = styled.textarea`
  font-size: 13px;
  width: 100%;
  padding: 10px 0px;
  overflow: hidden;
  resize: none;
  min-height: 100px;
`;

export const ResumeButton = styled.button`
  width: 100%;
  padding: 10px 0;
  display: block;
  font-size: 18px;
  font-weight: 600;
  text-align: left;
  border: none;
  border-radius: 0;
  color: #36f;
  background-color: transparent;
  border-bottom: 1px solid #f1f1f1;

  &:hover {
    background-color: #45a049;
  }

  &:active {
    color: red;
  }
`;

export const ResumeTable = styled.table`
  margin-top: 10px;

  td {
    background-color: #f9f9f9;
  }
`;

export const BtnGroup = styled.div`
  border-top: 3px solid black;
  margin: 20px 0 50px 0;
  padding-top: 15px;
  text-align: center;
`;

export const AttachContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 5px 0;
`;

export const AttachFileName = styled.span`
  margin-left: 20px;
  font-size: 16px;
  color: blue;
  text-decoration: underline;
`;

export const AttachDeleteButton = styled.button`
  width: 20px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;

  svg {
    width: 100%;
    height: 100%;
  }
`;
