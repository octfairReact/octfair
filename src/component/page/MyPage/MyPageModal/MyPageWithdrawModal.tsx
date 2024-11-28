import { useRecoilState } from "recoil";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { withdrawModalState } from "../../../../stores/modalState";
import {
    ModalOverlay,
    ModalStyled,
    Table,
    TableCaption,
    TableHeaderCell,
    TableDataCell,
    InputField,
    RequiredMark,
    Button,
} from "./styled";

export const MyPageWithdrawModal = () => {
    const [withdrawModal, setWithdrawModal] = useRecoilState<boolean>(withdrawModalState);
    const [password, setPassword] = useState<string>();
    const navigate = useNavigate();

    // 모달창 닫기: 닫기/취소/외부클릭 등에 의해 작동
    const closeModalHandler = () => {
        if (withdrawModal !== false)
            setWithdrawModal(false);
    };

    // Enter키를 누를시 완료버튼 효과를 작동
    const completeEnterHandler = (event) => {
        if (event.key === "Enter") completeWithdrawHandler();
    };

    // 탈퇴요청 버튼 누를 시 작동
    // 1. 빈값검사 -> 2. 양식검사(비밀번호형식) -> 3. 데이터전송
    const completeWithdrawHandler = () => {
        let isProblem:boolean = false;

        // 1. 빈값검사
        if ( !password || password.length <= 0) {
            alert("비밀번호를 입력해 주세요!");
            isProblem = true;
        }
        
        // // 2. 양식검사: password 입력창에 대하여 지켜야할 정규식패턴 검사
        // const passwordRules = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

        // if (isProblem === false) {
        //     if (!passwordRules.test(password)) {// .test()는 정규식패턴에 맞으면 true를 반환
        //         alert("비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리여야 합니다.");
        //         isProblem = true;
        //     }
        // }

        // 3. 데이터 전송: 회원탈퇴 입력정보 문제없음! 서버로 Delete요청!
        if (isProblem === false) {
            axios.get("/mypage/deleteUser.do" + "?password=" + encodeURIComponent(password))
            .then((res) => {
                if (res.data.result.toUpperCase() === "SUCCESS") {
                    alert("회원탈퇴가 완료되었습니다!");
                    closeModalHandler();
                    navigate("/");
                } else {
                    alert("회원탈퇴 실패, 담당자(유성찬)에게 문의하세요!");
                }
            })
        }
    }

    return (
        <>
            <ModalOverlay onMouseDown={closeModalHandler}>             {/* <----- 모달 외부 클릭시 모달창닫기 수행 */}
                <ModalStyled onMouseDown={(e) => e.stopPropagation()}> {/* <----- 모달 내부 클릭엔 모달창닫기 방지 */}
                    <Table onKeyDown={completeEnterHandler}>
                    <TableCaption>회원탈퇴 본인확인을 위해 비밀번호를 입력해주세요</TableCaption>
                    <tr>
                        <TableHeaderCell>비밀번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                        <TableDataCell colSpan={3}>
                            <InputField type="password" id="pwd" placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                                onChange={(e) => { setPassword(e.target.value); }}>
                            </InputField>
                        </TableDataCell>
                    </tr>
                    </Table>
                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                        <Button onClick={completeWithdrawHandler}>탈퇴 요청</Button>
                        <Button onClick={closeModalHandler} style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}>취소</Button>
                    </div>
                </ModalStyled>
            </ModalOverlay>
        </>
    );
};