import React, { useCallback, useState } from "react";
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
} from "./styled";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";

// daum우편주소찾기API에 쓰일 window.daum을 활성화 시키기 위하여
// window하위로 daum을 명시해 넣는 코드
declare global {
    interface Window {
        daum: any;
    }
}

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
    action: string; // 서버 컨트롤러에서 action="I"인지로 정상경로(회원가입 모달창)으로부터 온 데이터인지 보는듯????
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
        action: '',
    });

    // 회원가입 완료버튼 누를시 작동
    // 1. 빈값검사 -> 2. 중복검사(아이디중복체크) -> 3. 양식검사(이메일형식/비밀번호형식 등) -> 4. 데이터전송
    const completeRegisterHandler = async () => {
        let isProblem:boolean = false;
        // 1. 빈값검사: 모든 입력창에 대하여 빈값 검사
        Object.entries(signupInput).some(([key, value]) => {
            if (!value || value.length <= 0) {
                if (key !== "detailAddress" && key !== "action") { // 빈칸이어도 되는 속성들
                    alert(`'${key}'에 빈칸을 채워주세요!`);
                    isProblem = true;
                    return true; // 이 return값(true)는 'Object.values.some'반복문을 종료시킨다는 문법일뿐
                }
            } 
        });

        // 2. 중복검사: id 입력창에 대하여 DB와의 중복 검사
        // async/await이 없어도 함수는 동작하지만, 함수의 반환값을 받으려면 함수 내부외부 둘다 async/await을 해야한다.
        if (await checkIdDuplicateHandler()) {
            isProblem = true;
        }
        
        // 3. 양식검사: pwd/emial 입력창에 대하여 지켜야할 정규식패턴 검사
        const passwordRules = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        const emailRules = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

        if (!passwordRules.test(signupInput.pwd)) {
            alert("비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다.");
            isProblem = true;
        } else if (signupInput.pwd !== signupInput.pwdOk) {
            alert("비밀번호와 비밀번호확인에 입력하신 값이 일치하지 않습니다.")
            isProblem = true;
        } else if (!emailRules.test(signupInput.email)) {
            alert("이메일 형식을 확인해주세요. 숫자나 알파벳으로 시작해야하며 중간값으로 '-_\.'를 넣으실 순 있습니다. 그리고 당연히 @와 메일 홈페이지까지도 작성하셔야 합니다.")
            isProblem = true;
        }

        // 회원가입 입력정보 문제없음! 서버로 Create요청!
        if (isProblem === false) {
            alert("회원가입이 완료되었습니다!")
            signupInput.action = "I"; // setSignupInput()을 하지 않은 이유: 1) 상태값에 반응할 컴포넌트가 없기 때문, 2) set()을 할 경우 동기화문제가 있어서 즉각반영이 안됨


            // const navigate = useNavigate();

            // useEffect(() => {
            //   window.location.search && navigate(window.location.pathname, { replace: true });
            // }, [navigate]);
            // 검색 후 리로딩하면 공지사항으로 다시 감
          
            // const handlerSearch = () => {
            //     const query: string[] = [];
            //     Object.values(signupInput).some((value) => {
            //         if (!value || value.length <= 0) {
            //             alert(value+"빈칸을 채워주세요!");
            //             isProblem = true;
            //             return true; // 이 return값(true)는 'Object.values.some'반복문을 종료시킨다는 문법일뿐 
            //         } 
            //     });
            //   // 데이터 받기
            //   !title.current.value || query.push(`searchTitle=${title.current.value}`);
            //   !startDate || query.push(`searchStDate=${startDate}`);
            //   !endDate || query.push(`searchEdDate=${endDate}`);
            //   console.log("query", query);
          
            //   //데이터 주소로 만들기
            //   const queryString = query.length > 0 ? `?${query.join(`&`)}` : "";
            //   console.log("queryString", queryString);
          
            //   //url에 만든 데이터 넣기
            //   navigate(`/react/board/notice.do${queryString}`);
            // };


            // 전송주소의 'board'와 같은 상위경로가 없는 이유는 spring컨트롤러의 @RequestMapping에 분류토록 명시된 상위경로가 없기 때문
            axios.post("/register.do", { ...signupInput })
            .then((res) => {
            });
        }

    };

    // Spring컨트롤러의 파라미터가 @RequestBody(JSON)이 아닌 UserInfoModel(URL-encoded레거시코드)라서, Spring에서 파라미터를 바꿔주든가 React에서 qs.stringify를 하면됨
    const checkIdDuplicateHandler = async () => {
        let isDuplicate = false;
        await axios.post("/check_loginId.do", qs.stringify({ loginId: signupInput.id }))
            .then((res) => {
                if (res.data === 1) { // 결과값이 1이면 중복이란 뜻 (Mapper에서 해당id의 갯수를 반환하기 때문)
                    alert("입력하신 아이디는 이미 사용중 입니다.");
                    isDuplicate = true;
                } else {
                    alert("사용가능한 아이디입니다.");
                }
            })
        if (isDuplicate) return true; // 중복이 있다는 의미로 true 반환
        else             return false;
    }

    const postcodeSearchHandler = useCallback(() => {
        const script = document.createElement("script");
        script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
    
        // script가 로드된 후에 실행되도록 함
        script.onload = () => {
            if (window.daum && window.daum.Postcode) {
                new window.daum.Postcode({
                    oncomplete: (data) => {
                        setSignupInput((prev) => ({
                            ...prev,
                            zipCode: data.zonecode,
                            address: data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress,
                        }));
                    },
                }).open();
            }
        };
    
        document.body.appendChild(script);
    
        return () => { document.body.removeChild(script); };
    }, []);

    return (
        <>
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
                                        onChange={(e) => { setSignupInput((prev) => ({ ...prev, userType: e.target.value })); }}>
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
                                        onChange={(e) => { setSignupInput((prev) => ({ ...prev, id: e.target.value })); }}>
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
                                        onChange={(e) => { setSignupInput((prev) => ({ ...prev, pwd: e.target.value })); }}>
                                    </InputField>
                                </TableDataCell>
                            </tr>
                            <tr>
                                <TableHeaderCell>비밀번호 확인 <RequiredMark>*</RequiredMark></TableHeaderCell>
                                <TableDataCell colSpan={3}>
                                    <InputField type="password" id="registerPwdOk"
                                        onChange={(e) => { setSignupInput((prev) => ({ ...prev, pwdOk: e.target.value })); }}>
                                    </InputField>
                                </TableDataCell>
                            </tr>
                            <tr>
                                <TableHeaderCell>이름 <RequiredMark>*</RequiredMark></TableHeaderCell>
                                <TableDataCell>
                                    <InputField type="text" id="registerName"
                                        onChange={(e) => { setSignupInput((prev) => ({ ...prev, name: e.target.value })); }}>
                                    </InputField>
                                </TableDataCell>
                                <TableHeaderCell>성별 <RequiredMark>*</RequiredMark></TableHeaderCell>
                                <TableDataCell>
                                    <SelectBox name="sex" id="registerSex" value={signupInput.sex}
                                        onChange={(e) => { setSignupInput((prev) => ({ ...prev, sex: e.target.value })); }}>
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
                                        onChange={(e) => { setSignupInput((prev) => ({ ...prev, birthday: e.target.value })); }}>
                                    </InputField>
                                </TableDataCell>
                            </tr>
                            <tr>
                                <TableHeaderCell>전화번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                                <TableDataCell colSpan={3}>
                                    <InputField type="text" placeholder="숫자만 입력" id="registerPhone"
                                        onChange={(e) => { setSignupInput((prev) => ({ ...prev, phone: e.target.value })); }}>
                                    </InputField>
                                </TableDataCell>
                            </tr>
                            <tr>
                                <TableHeaderCell>이메일 <RequiredMark>*</RequiredMark></TableHeaderCell>
                                <TableDataCell colSpan={3}>
                                    <InputField type="text" id="registerEmail"
                                        onChange={(e) => { setSignupInput((prev) => ({ ...prev, email: e.target.value })); }}>
                                    </InputField>
                                </TableDataCell>
                            </tr>
                            <tr>
                                <TableHeaderCell>우편번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                                <TableDataCell colSpan={2}>
                                    <InputField type="text" id="registerZipCode" value={signupInput.zipCode}
                                        onChange={(e) => { setSignupInput((prev) => ({ ...prev, zipCode: e.target.value })); }}>
                                    </InputField>
                                </TableDataCell>
                                <TableDataCell>
                                    <Button onClick={postcodeSearchHandler}>우편번호 찾기</Button>
                                </TableDataCell>
                            </tr>
                            <tr>
                                <TableHeaderCell>주소 <RequiredMark>*</RequiredMark></TableHeaderCell>
                                <TableDataCell colSpan={3}>
                                    <InputField type="text" id="registerAddress" value={signupInput.address}
                                        onChange={(e) => { setSignupInput((prev) => ({ ...prev, address: e.target.value })); }}>
                                    </InputField>
                                </TableDataCell>
                            </tr>
                            <tr>
                                <TableHeaderCell>상세주소</TableHeaderCell>
                                <TableDataCell colSpan={3}>
                                    <InputField type="text" id="registerDetailAddress"
                                        onChange={(e) => { setSignupInput((prev) => ({ ...prev, detailAddress: e.target.value })); }}>
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
        </>
    );
};
