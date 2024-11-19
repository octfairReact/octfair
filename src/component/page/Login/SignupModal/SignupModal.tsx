import React, { useState } from "react";
import {
    ModalOverlay,
    SignupModalStyled,
    SignupTable,
    TableCaption,
    TableHeaderCell,
    TableDataCell,
    InputField,
    SelectBox,
    RequiredMark,
    Button,
    CloseButton,
} from "./styled";
import { forEachChild } from "typescript";
import axios from "axios";
import qs from "qs";

// 닫기버튼/액션도 부모(LoginMain)에서 생성된 SignupModal의 상태(0/1)를 참조/조절함
interface SignupModalProps {
    onClose: () => void;
}

// 회원가입 입력데이터 구조체/멤버변수
export interface SignupInput {
    userType: string; // 선택박스로 'A'/'B' 중 하나가 입력 됨
    id: string;
    pwd: string;
    pwdOk: string;
    name: string;
    sex: string;  // 선택박스로 '1'/'2' 중 하나가 입력 됨
    birthday: string;
    phone: string;
    email: string;
    zipCode: string; // 직접입력 또는 우편번호찾기 API로 입력 됨
    address: string;
    detailAddress: string;
}

export const SignupModal: React.FC<SignupModalProps> = ({ onClose }) => {
    const [signupInput, setSignupInput] = useState<SignupInput>({
        // 기본값
        userType: '',
        id: '',
        pwd: '',
        pwdOk: '',
        name: '',
        sex: '',
        birthday: '',
        phone: '',
        email: '',
        zipCode: '',
        address: '',
        detailAddress: '',
    });

    const checkIdDuplicateHandler = () => {
        axios.post(
            "/check_loginId.do", 
            qs.stringify({ loginId: signupInput.id }), // Spring컨트롤러가 받는 파라미터가 @RequestParma이 아닌 UserInfoModel이라서 데이터를 URL-encoded 형식으로 변환
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
            .then((res) => {
                if (res.data === 1) { // 결과값이 1이면 중복이란 뜻 (Mapper에서 해당id의 갯수를 반환하기 때문)
                    console.log(res);
                    alert("입력하신 아이디는 이미 사용중 입니다.");
                }
        });
    }

    // 회원가입 완료버튼 누를시 작동
    // 1. 빈값검사 -> 2. 중복검사(아이디중복체크) -> 3. 양식검사(이메일형식/비밀번호형식 등) -> 4. 데이터전송
    const completeRegisterHandler = () => {
        // 1. 빈값검사: 모든 입력창에 대하여 빈값 검사
        Object.values(signupInput).some((value) => {
            if (!value || value.length <= 0) {
                alert(value+"빈칸을 채워주세요!");
                return true; // 이 return값(true)는 'Object.values.some'반복문을 종료시킨다는 문법일뿐 
            } 
        });

        // 2. 중복검사: id 입력창에 대하여 DB와의 중복 검사
        // 전송주소의 'board'와 같은 상위경로가 없는 이유는 spring컨트롤러에 @RequestMapping이 없기 때문
        checkIdDuplicateHandler();
        
        // 3. 양식검사: pwd/emial 입력창에 대하여 지켜야할 정규식패턴 검사
        const passwordRules = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        const emailRules = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

        if (!passwordRules.test(signupInput.pwd)) {
            alert("비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다.");
        } else if (signupInput.pwd !== signupInput.pwdOk) {
            alert("비밀번호와 비밀번호확인에 입력하신 값이 일치하지 않습니다.")
        } else if (!emailRules.test(signupInput.email)) {
            alert("이메일 형식을 확인해주세요. 숫자나 알파벳으로 시작해야하며 중간값으로 '-_\.'를 넣으실 순 있습니다. 그리고 당연히 @와 메일 홈페이지까지도 작성하셔야 합니다.")
        }

    };

    return (
        <ModalOverlay>
            <SignupModalStyled>
                <SignupTable>
                    <TableCaption>회원가입</TableCaption>
                    <tbody>
                        <tr>
                            <TableHeaderCell>회원유형 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell>
                                <SelectBox name="userType" id="registerUserType" value={signupInput.userType}
                                    // 아래코드(onInvalid)방식으로 유효성검사(Null/Pattern검사)를 할 수 있지만 입력폼이 많으므로 HTML이 아닌 JS에서 묶어서 하는게 유지보수가 좋다고 판단
                                    // required
                                    // onInvalid={(e) => {
                                    //     e.preventDefault();
                                    //     const target = e.target as HTMLSelectElement;
                                    //     if (target.value.length < 6) {
                                    //         target.setCustomValidity("비밀번호는 6자 이상이어야 합니다.");
                                    //     } else {
                                    //         target.setCustomValidity("이 입력란을 채워주세요.");
                                    //     }
                                    // }}
                                    onChange={(e) => {
                                        setSignupInput((prev: SignupInput) => {
                                            return { ...prev, userType: e.target.value };
                                        });
                                    }}>
                                    <option value="" disabled>선택</option>
                                    <option value="A">개인회원</option>
                                    <option value="B">기업회원</option>
                                </SelectBox>
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>아이디 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={2}>
                                <InputField type="text" placeholder="숫자, 영문자 조합으로 6~20자리" id="registerId"
                                    onChange={(e) => {
                                        setSignupInput((prev: SignupInput) => {
                                            return { ...prev, id: e.target.value };
                                        });
                                    }}>
                                </InputField>
                            </TableDataCell>
                            <TableDataCell>
                                <Button onClick={checkIdDuplicateHandler}>중복확인 </Button>
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>비밀번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={3}>
                                <InputField type="password" placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리" id="registerPwd"
                                    onChange={(e) => {
                                        setSignupInput((prev: SignupInput) => {
                                            return { ...prev, pwd: e.target.value };
                                        });
                                    }}>
                                </InputField>
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>비밀번호 확인 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={3}>
                                <InputField type="password" id="registerPwdOk"
                                    onChange={(e) => {
                                        setSignupInput((prev: SignupInput) => {
                                            return { ...prev, pwdOk: e.target.value };
                                        });
                                    }}>
                                </InputField>
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>이름 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell>
                                <InputField type="text" id="registerName"
                                    onChange={(e) => {
                                        setSignupInput((prev: SignupInput) => {
                                            return { ...prev, name: e.target.value };
                                        });
                                    }}>
                                </InputField>
                            </TableDataCell>
                            <TableHeaderCell>성별 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell>
                                <SelectBox name="sex" id="registerSex" value={signupInput.sex}
                                    onChange={(e) => {
                                        setSignupInput((prev: SignupInput) => {
                                            return { ...prev, sex: e.target.value };
                                        });
                                    }}>
                                    <option value="" disabled>선택</option>
                                    <option value="1">남자</option>
                                    <option value="2">여자</option>
                                </SelectBox>
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>생년월일 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={3}>
                                <InputField type="date" id="registerBirthday"
                                    onChange={(e) => {
                                        setSignupInput((prev: SignupInput) => {
                                            return { ...prev, birthday: e.target.value };
                                        });
                                    }}>
                                </InputField>
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>전화번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={3}>
                                <InputField type="text" placeholder="숫자만 입력" id="registerPhone"
                                    onChange={(e) => {
                                        setSignupInput((prev: SignupInput) => {
                                            return { ...prev, phone: e.target.value };
                                        });
                                    }}>
                                </InputField>
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>이메일 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={3}>
                                <InputField type="text" id="registerEmail"
                                    onChange={(e) => {
                                        setSignupInput((prev: SignupInput) => {
                                            return { ...prev, email: e.target.value };
                                        });
                                    }}>
                                </InputField>
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>우편번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={2}>
                                <InputField type="text" id="registerZipCode"
                                    onChange={(e) => {
                                        setSignupInput((prev: SignupInput) => {
                                            return { ...prev, zipCode: e.target.value };
                                        });
                                    }}>
                                </InputField>
                            </TableDataCell>
                            <TableDataCell>
                                <Button>우편번호 찾기</Button>
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>주소 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={3}>
                                <InputField type="text" id="registerAddress"
                                    onChange={(e) => {
                                        setSignupInput((prev: SignupInput) => {
                                            return { ...prev, address: e.target.value };
                                        });
                                    }}>
                                </InputField>
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>상세주소</TableHeaderCell>
                            <TableDataCell colSpan={3}>
                                <InputField type="text" id="registerDetailAddress"
                                    onChange={(e) => {
                                        setSignupInput((prev: SignupInput) => {
                                            return { ...prev, detailAddress: e.target.value };
                                        });
                                    }}>
                                </InputField>
                            </TableDataCell>
                        </tr>
                    </tbody>
                </SignupTable>
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <Button onClick={completeRegisterHandler}>회원가입 완료</Button>
                    <Button onClick={onClose} style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}>취소</Button>
                </div>
            </SignupModalStyled>
        </ModalOverlay>
    );
};
