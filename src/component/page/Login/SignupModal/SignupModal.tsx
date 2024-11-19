import React from "react";
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

interface SignupModalProps {
    onClose: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ onClose }) => {
    return (
        <ModalOverlay>
            <SignupModalStyled>
                <CloseButton onClick={ onClose }>&times;</CloseButton>
                <SignupTable>
                    <TableCaption>회원가입</TableCaption>
                    <tbody>
                        <tr>
                            <TableHeaderCell>회원유형 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell>
                                <SelectBox name="userType" id="registerUserType">
                                    <option value="" disabled>선택</option>
                                    <option value="A">개인회원</option>
                                    <option value="B">기업회원</option>
                                </SelectBox>
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>아이디 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={2}>
                                <InputField
                                    type="text"
                                    placeholder="숫자, 영문자 조합으로 6~20자리"
                                    id="registerId"
                                />
                            </TableDataCell>
                            <TableDataCell>
                                <Button>중복확인</Button>
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>비밀번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={3}>
                                <InputField
                                    type="password"
                                    placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                                    id="registerPwd"
                                />
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>비밀번호 확인 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={3}>
                                <InputField
                                    type="password"
                                    id="registerPwdOk"
                                />
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>이름 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell>
                                <InputField type="text" id="registerName" />
                            </TableDataCell>
                            <TableHeaderCell>성별 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell>
                                <SelectBox name="sex" id="registerSex">
                                    <option value="" disabled>선택</option>
                                    <option value="1">남자</option>
                                    <option value="2">여자</option>
                                </SelectBox>
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>생년월일 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={3}>
                                <InputField type="date" id="registerBirthday" />
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>전화번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={3}>
                                <InputField
                                    type="text"
                                    placeholder="숫자만 입력"
                                    id="registerPhone"
                                />
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>이메일 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={3}>
                                <InputField type="text" id="registerEmail" />
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>우편번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={2}>
                                <InputField type="text" id="registerZipCode" />
                            </TableDataCell>
                            <TableDataCell>
                                <Button>우편번호 찾기</Button>
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>주소 <RequiredMark>*</RequiredMark></TableHeaderCell>
                            <TableDataCell colSpan={3}>
                                <InputField type="text" id="registerAddress" />
                            </TableDataCell>
                        </tr>
                        <tr>
                            <TableHeaderCell>상세주소</TableHeaderCell>
                            <TableDataCell colSpan={3}>
                                <InputField type="text" id="registerDetailAddress" />
                            </TableDataCell>
                        </tr>
                    </tbody>
                </SignupTable>
            </SignupModalStyled>
        </ModalOverlay>
    );
};
