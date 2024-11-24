import React, { useCallback, useState } from "react";
import {
    ModalOverlay,
    ModalStyled,
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
    loginId: string;
    password: string;
    passwordOk: string;
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
        loginId: '',
        password: '',
        passwordOk: '',
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
    const [isIdDuplicateChecked, setIsIdDuplicateChecked] = useState<boolean>(false); // 중복체크 여부에 대한 변수

    // Enter키를 누를시 완료버튼 효과를 작동
    const completeEnterHandler = (event) => {
        if (event.key === "Enter")
            completeRegisterHandler();
    }

    // 회원가입 완료버튼 누를시 작동
    // 1. 빈값검사 -> 2. 중복검사(아이디중복체크) -> 3. 양식검사(이메일형식/비밀번호형식 등) -> 4. 데이터전송
    const completeRegisterHandler = () => {
        let isProblem:boolean = false;
        
        // 1. 빈값검사: 모든 입력창에 대하여 빈값 검사
        // return문 내 HTML코드에서 onInvalid()방식으로 유효성검사를 할 수도 있지만 일괄로 하는 것이 유지보수가 좋다고 판단
        Object.entries(signupInput).some(([key, value]) => { // 입력창이 12개나 되어서 반복문처리, signupInput이 배열은 아니어서 forEach()/map()대신 Object.entries()
            if (!value || value.length <= 0) {
                if (key !== "detailAddress" && key !== "action") { // 빈칸이어도 되는 속성들
                    alert(`'${key}'에 빈칸을 채워주세요!`);
                    isProblem = true;
                    return true; // 이 return값(true)는 'Object.values.some'반복문을 종료시킨다는 문법일뿐
                }
            }
            return false;
        });

        // 2. 중복검사: id 입력창에 대하여 DB와의 중복 검사
        if (isProblem === false && isIdDuplicateChecked === false) {
            alert("중복체크를 먼저 완료해주세요!");
            isProblem = true;
        }
        
        // 3. 양식검사: pwd/email 입력창에 대하여 지켜야할 정규식패턴 검사
        const passwordRules = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        const emailRules = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        const phoneRules = /^[0-9]([-]?[0-9])*$/;

        if (isProblem === false) {
            if (!passwordRules.test(signupInput.password)) {// .test()는 정규식패턴에 맞으면 true를 반환
                alert("비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다.");
                isProblem = true;
            } else if (signupInput.password !== signupInput.passwordOk) {
                alert("비밀번호와 비밀번호확인에 입력하신 값이 일치하지 않습니다.")
                isProblem = true;
            } else if (new Date(signupInput.birthday) > new Date()) {
                alert("생년월일은 미래의 날짜일 수 없습니다.");
                isProblem = true;
            } else if (!phoneRules.test(signupInput.phone)) {
                alert("전화번호는 숫자로 시작해야하며 중간에만 '-'를 쓰실수는 있습니다.");
                isProblem = true;
            } else if (!emailRules.test(signupInput.email)) {
                alert("이메일 형식을 확인해주세요. 숫자나 알파벳으로 시작해야하며 중간값으로 '-_.'를 넣으실 순 있습니다. 그리고 당연히 @와 메일 홈페이지까지도 작성하셔야 합니다.")
                isProblem = true;
            }
        }

        // 회원가입 입력정보 문제없음! 서버로 Create요청!
        if (isProblem === false) {
            signupInput.action = "I"; // setSignupInput()을 하지 않은 이유: 1) 상태값에 반응할 컴포넌트가 없기 때문, 2) set()을 할 경우 동기/비동기 문제가 있어서 즉각반영이 안됨

            const query: string[] = [];
            Object.entries(signupInput).forEach(([key, value]) => {
                query.push(`${key}=${encodeURIComponent(value)}`);
            });
            // 쿼리 앞에 '?' 붙이고 쿼리key/value쌍 사이마다 '&' 붙이기
            const queryString = query.length > 0 ? `?${query.join(`&`)}` : "";

            // 전송주소의 'board'와 같은 상위경로가 없는 이유는 Spring컨트롤러의 @RequestMapping에 분류토록 명시된 상위경로가 없기 때문
            // axios.post()가 아니라 axios.get()인 이유는 Spring컨트롤러가 @RequestBody가 아니라 @RequestParam이기 때문
            // navigate()가 아니라 axios인 이유는 navigate식 URL쿼리전송은 React페이지 내의 전송일때고, 서버로의 URL쿼리 전송은 axios
            axios.get(`/register.do${queryString}`)
            .then((res) => {
                if (res.data.result.toUpperCase() === "SUCCESS") {
                    alert("회원가입이 완료되었습니다!");
                    onClose();
                } else {
                    alert("회원가입 실패, 담당자(유성찬)에게 문의하세요!");
                }
            })
        }
    };

    // Spring컨트롤러의 파라미터가 @RequestBody(JSON)이 아닌 UserInfoModel(URL-encoded레거시코드)라서, Spring에서 파라미터를 바꿔주든가 React에서 qs.stringify를 하면됨
    const checkIdDuplicateHandler = async () => {
        if (!signupInput.loginId) { // 아이디입력란이 공백일경우
            alert("아이디를 입력해 주세요.")
            return true;
        }

        let isDuplicate = false;
        await axios.post("/check_loginId.do", qs.stringify({ loginId: signupInput.loginId }))
            .then((res) => {
                if (res.data === 1) { // 결과값이 1이면 중복이란 뜻 (Mapper에서 해당id의 갯수를 반환하기 때문)
                    alert("입력하신 아이디는 이미 사용중 입니다.");
                    isDuplicate = true;
                } else {
                    alert("사용가능한 아이디입니다.");
                    setIsIdDuplicateChecked(true);
                }
            })
        
        if (isDuplicate) return true; // 중복이 있다는 의미로 true 반환
        else             return false;
    }

    // 우편번호검색API 창을 띄워주고, 검색된 값을 회원가입 정보입력창에 넣어준다.
    const postcodeSearchHandler = useCallback(() => { // useCallback은 해당함수의 반복호출마다 랜더링되지 않고 최초때부터 재사용 되게 랜더링한다는 뜻
        const script = document.createElement("script");
        script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        
        // onload는 스크립트나 이미지 등 외부 자원의 로드가 완료되었을 때 실행되는 이벤트 핸들러
        // 즉 위 코드3줄(<script>태그 생성 코드)를 기다렸다 작동한다는 뜻
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
            <ModalOverlay onClick={onClose}>                       {/* <----- 모달 외부 클릭시 모달창닫기 수행 */}
                <ModalStyled onClick={(e) => e.stopPropagation()}> {/* <----- 모달 내부 클릭엔 모달창닫기 방지 */}
                    <SignupTable onKeyDown={completeEnterHandler}>
                        <TableCaption>회원가입</TableCaption>
                        <tbody>
                            <tr>
                                <TableHeaderCell>회원유형 <RequiredMark>*</RequiredMark></TableHeaderCell>
                                <TableDataCell>
                                    <SelectBox name="userType" id="registerUserType" value={signupInput.userType}
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
                                    <InputField type="text" id="registerId" placeholder="숫자, 영문자 조합으로 6~20자리"
                                        onChange={(e) => {  setSignupInput((prev) => ({ ...prev, loginId: e.target.value }));
                                                            setIsIdDuplicateChecked(false)                                    }}>
                                    </InputField>
                                </TableDataCell>
                                <TableDataCell>
                                    <Button onClick={checkIdDuplicateHandler}>중복확인 </Button>
                                </TableDataCell>
                            </tr>
                            <tr>
                                <TableHeaderCell>비밀번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                                <TableDataCell colSpan={3}>
                                    <InputField type="password" id="registerPwd" placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                                        onChange={(e) => { setSignupInput((prev) => ({ ...prev, password: e.target.value })); }}>
                                    </InputField>
                                </TableDataCell>
                            </tr>
                            <tr>
                                <TableHeaderCell>비밀번호 확인 <RequiredMark>*</RequiredMark></TableHeaderCell>
                                <TableDataCell colSpan={3}>
                                    <InputField type="password" id="registerPwdOk"
                                        onChange={(e) => { setSignupInput((prev) => ({ ...prev, passwordOk: e.target.value })); }}>
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
                                    <InputField type="tel" id="registerPhone" placeholder="숫자만 입력"
                                        onChange={(e) => { setSignupInput((prev) => ({ ...prev, phone: e.target.value })); }}>
                                    </InputField>
                                </TableDataCell>
                            </tr>
                            <tr>
                                <TableHeaderCell>이메일 <RequiredMark>*</RequiredMark></TableHeaderCell>
                                <TableDataCell colSpan={3}>
                                    <InputField type="email" id="registerEmail" placeholder="이메일@도메인 양식으로 입력"
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
                </ModalStyled>
            </ModalOverlay>
        </>
    );
};
