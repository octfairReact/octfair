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
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { useState } from "react";
import axios from "axios";

// 닫기버튼/액션도 부모(LoginMain)에서 생성된 SignupModal의 상태(0/1)를 참조/조절함
interface updatePasswordModalProps {
    onClose: () => void;
}

// 패스워드 3세트
export interface PasswordInputs {
    prevPassword: string;
    newPassword: string;
    checkPassword: string;
}

export const MyPageUpdatePasswordModal: React.FC<updatePasswordModalProps> = ({ onClose }) => {
    const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
    const [password, setPassword] = useState<PasswordInputs>({
        prevPassword: '',
        newPassword: '',
        checkPassword: '',
    });

    // Enter키를 누를시 완료버튼 효과를 작동
    const completeEnterHandler = (event) => {
        if (event.key === "Enter")
            completeWithdrawHandler();
    }

    // 탈퇴요청 버튼 누를 시 작동
    const completeWithdrawHandler = () => {
        let isProblem:boolean = false;

        // 1. 빈값검사
        Object.entries(password).some(([key, value]) => { // 입력창이 많아서 반복문처리, signupInput이 배열은 아니어서 forEach()/map()대신 Object.entries()
            if (!value || value.length <= 0) {
                if (key !== "detailAddress" && key !== "action") { // 빈칸이어도 되는 속성들
                    alert(`'${key}'에 빈칸을 채워주세요!`);
                    isProblem = true;
                    return true; // 이 return값(true)는 'Object.values.some'반복문을 종료시킨다는 문법일뿐
                }
            }
            return false;
        });
        
        // 2. 양식검사: password 입력창에 대하여 지켜야할 정규식패턴 검사
        const passwordRules = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

        if (isProblem === false) {
            if (!passwordRules.test(password.newPassword)) {// .test()는 정규식패턴에 맞으면 true를 반환
                alert("비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리여야 합니다.");
                isProblem = true;
            } else if (password.newPassword !== password.checkPassword) {
                alert("비밀번호와 비밀번호확인에 입력하신 값이 일치하지 않습니다.")
                isProblem = true;
            }
        }

        // 비번수정 입력정보 문제없음! 서버로 Update요청!
        if (isProblem === false) {
            axios.get("/mypage/updatePw.do" + "?password=" + encodeURIComponent(password.newPassword))
            .then((res) => {
                if (res.data.result.toUpperCase() === "SUCCESS") {
                    alert("비밀번호 변경이 완료되었습니다!");
                    onClose();
                } else {
                    alert("기존 비밀번호가 입력하신 정보와 일치하지 않습니다.");
                }
            })
        }
    }

    return (
        <>
            <ModalOverlay onClick={onClose}>                       {/* <----- 모달 외부 클릭시 모달창닫기 수행 */}
                <ModalStyled onClick={(e) => e.stopPropagation()}> {/* <----- 모달 내부 클릭엔 모달창닫기 방지 */}
                    <Table onKeyDown={completeEnterHandler}>
                    <TableCaption>회원탈퇴 본인확인을 위해 비밀번호를 입력해주세요</TableCaption>
                    <tr>
                        <TableHeaderCell>기존 비밀번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                        <TableDataCell colSpan={3}>
                            <InputField type="password" id="prevPassword" placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                                onChange={(e) => { setPassword((prev) => ({ ...prev, prevPassword: e.target.value })); }}>
                            </InputField>
                        </TableDataCell>
                    </tr>
                    <tr>
                        <TableHeaderCell>변경할 비밀번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                        <TableDataCell colSpan={3}>
                            <InputField type="password" id="newPassword" placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                                onChange={(e) => { setPassword((prev) => ({ ...prev, newPassword: e.target.value })); }}>
                            </InputField>
                        </TableDataCell>
                    </tr>
                    <tr>
                        <TableHeaderCell>비밀번호 확인<RequiredMark>*</RequiredMark></TableHeaderCell>
                        <TableDataCell colSpan={3}>
                            <InputField type="password" id="checkPassword" placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                                onChange={(e) => { setPassword((prev) => ({ ...prev, checkPassword: e.target.value })); }}>
                            </InputField>
                        </TableDataCell>
                    </tr>
                    </Table>
                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                        <Button onClick={completeWithdrawHandler}>수정</Button>
                        <Button onClick={onClose} style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}>취소</Button>
                    </div>
                </ModalStyled>
            </ModalOverlay>
        </>
    );
}