import styled from "styled-components";

// 전체 모달 오버레이 스타일
export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
`;

// 모달 컨테이너 스타일
export const SignupModalStyled = styled.div`
    width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-family: Arial, sans-serif;
    position: relative;
`;

// 닫기 버튼 스타일
export const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    color: #333;

    &:hover {
        color: #ff0000;
    }
`;

// 테이블 스타일
export const SignupTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
`;

// 테이블 캡션 스타일
export const TableCaption = styled.caption`
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 10px;
`;

// 테이블 헤더 셀 스타일
export const TableHeaderCell = styled.th`
    text-align: left;
    padding: 10px;
    background-color: #f9f9f9;
    font-weight: normal;
    width: 150px;
    vertical-align: middle;
`;

// 테이블 데이터 셀 스타일
export const TableDataCell = styled.td`
    padding: 10px;
    vertical-align: middle;
`;

// 인풋 필드 스타일
export const InputField = styled.input`
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9em;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;

// 셀렉트 박스 스타일
export const SelectBox = styled.select`
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9em;
    box-sizing: border-box;
    background-color: #fff;
    
    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;

// 필수 항목 표기 스타일
export const RequiredMark = styled.span`
    color: red;
    margin-left: 5px;
`;

// 버튼 스타일
export const Button = styled.button`
    width: 100%;
    padding: 8px;
    border: 1px solid #007bff;
    background-color: #007bff;
    color: #fff;
    border-radius: 4px;
    font-size: 0.9em;
    cursor: pointer;
    box-sizing: border-box;

    &:hover {
        background-color: #0056b3;
        border-color: #0056b3;
    }
`;

// 스크롤바 스타일
export const ScrollableContainer = styled.div`
    max-height: 80vh;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: #555;
    }
`;
