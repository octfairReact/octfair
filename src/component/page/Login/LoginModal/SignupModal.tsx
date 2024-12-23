import { useCallback, useState } from "react";
import axios from "axios";
import qs from "qs";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { Login } from "../../../../api/api";
import { toast } from "react-toastify";
import { ISignupInput, datafieldnameSignupInput, defaultSignupInput } from "../../../../models/interface/IUser";
import {
  ModalOverlay,
  ModalStyled,
  Table,
  TableCaption,
  TableHeaderCell,
  TableDataCell,
  InputField,
  SelectBox,
  RequiredMark,
  Button,
} from "./styled";

// daum우편주소찾기API에 쓰일 window.daum을 활성화 시키기 위하여
// window하위로 daum을 명시해 넣는 코드
declare global {
  interface Window {
    daum: any;
  }
}

export const SignupModal = () => {
  // false(닫힘), "openSignupModal"(회원가입 모달 열림), 
  // "openSearchIdModal"(아이디찾기 모달 열림), "openSearchPwModal"(비밀번호찾기 모달 열림), "openUpdatePwModal"(비밀번호변경 보달 열림)
  const [, setModal] = useRecoilState<boolean | string>(modalState);
  const [signupInput, setSignupInput] = useState<ISignupInput>(defaultSignupInput);
  const dataFieldName:ISignupInput = datafieldnameSignupInput;
  const [isIdDuplicateChecked, setIsIdDuplicateChecked] = useState<boolean>(true); // 중복체크 여부에 대한 변수

  // 회원가입 완료버튼 누를시 작동
  // 1. 빈값검사 -> 2. 중복검사(아이디중복체크) -> 3. 양식검사(이메일형식/비밀번호형식 등) -> 4. 데이터전송
  const completeRegisterHandler = () => {
    let isProblem:boolean = false;
    
    Object.entries(signupInput).some(([key, value]) => { // 입력창이 12개나 되어서 반복문처리, signupInput이 배열은 아니어서 forEach()/map()대신 Object.entries()
      
      // 1. 빈값검사: 모든 입력창에 대하여 빈값 검사
      // HTML코드에서 onInvalid()방식으로 유효성검사를 할 수도 있지만 일괄로 하는 것이 유지보수가 좋다고 판단
      if (isProblem === false && (!value || value.length <= 0)) {
        if (key !== "detailAddress" && key !== "action") { // 빈칸이어도 되는 속성들
          toast.info(`'${dataFieldName[key]}'에 빈칸을 채워주세요!`);
          document.getElementById(key)?.focus();
          isProblem = true;
          return true; // 이 return값(true)는 'Object.values.some'반복문을 종료시킨다는 문법일뿐, 즉 문제발생하여 if문 입장시 검사 조기종료한다는 뜻
        }
      }
      
      // 2. 중복검사: id 입력창에 대하여 DB와의 중복 검사
      // 3. 양식검사: 입력창에 대하여 지켜야할 정규식패턴 검사
      if (isProblem === false) {
        const passwordRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        const phoneRegex = /^[0-9]([-]?[0-9])*$/;
        const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        const zipCodeRegex = /^[0-9]*$/;

        const validationRules = {
          loginId:    { check: () => isIdDuplicateChecked === false,
                        message: "중복체크를 먼저 완료해주세요!" },
          password:   { check: () => !passwordRegex.test(signupInput.password), // .test()는 정규식패턴에 맞으면 true를 반환
                        message: "비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다." },
          passwordOk: { check: () => signupInput.password !== signupInput.passwordOk,
                        message: "비밀번호와 비밀번호확인에 입력하신 값이 일치하지 않습니다." },
          birthday:   { check: () => new Date(signupInput.birthday) > new Date(),
                        message: "생년월일은 미래의 날짜일 수 없습니다." },
          phone:      { check: () => !phoneRegex.test(signupInput.phone),
                        message: "전화번호는 숫자여야하며 중간에만 '-'를 쓰실수는 있습니다." },
          email:      { check: () => !emailRegex.test(signupInput.email),
                        message: "이메일 형식을 확인해주세요. 숫자나 알파벳으로 시작해야하며 중간값으로 '-_.'를 넣으실 순 있습니다. 그리고 당연히 @와 메일 홈페이지까지도 작성하셔야 합니다." },
          zipCode:    { check: () => !zipCodeRegex.test(signupInput.zipCode),
                        message: "우편번호 형식을 확인해주세요. 숫자만 가능합니다." },
        }
        
        // 위 중복검사/양식검사와 적발시에 대한 안내메시지와 포커싱 설정
        if (validationRules[key]?.check()) {
          toast.info(validationRules[key].message);
          document.getElementById(key)?.focus();
          isProblem = true;
        }
      }

      return false; // 이 return값(false)는 continue같은 역할로 Object.entires()반복문을 다음 key아이템으로 순회시킴
    });

    // 4. 데이터전송: 회원가입 입력정보 문제없음! 서버로 Create요청!
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
      axios.get(Login.postSignup + queryString)
        .then((res) => {
          if (res.data.result.toUpperCase() === "SUCCESS") {
            toast.success("회원가입이 완료되었습니다!");
            closeModalHandler();
          } else {
            toast.warn("회원가입 실패, 담당자에게 문의하세요!");
          }
        })
        .catch((error) => {
          toast.error("서버통신 실패, 담당자에게 문의하세요!");
        });
    }
  };

  // 아이디 중복체크: Spring컨트롤러의 파라미터가 @RequestBody(JSON)이 아닌 UserInfoModel(URL-encoded레거시코드)라서, Spring에서 파라미터를 바꿔주든가 React에서 qs.stringify를 하면됨
  const checkIdDuplicateHandler = async () => {
    if (!signupInput.loginId) { // 아이디입력란이 공백일경우
      toast.info("아이디를 입력해 주세요.")
      return true;
    }

    let isDuplicate:boolean = false;
    await axios.post(Login.getCheckId, qs.stringify({ loginId: signupInput.loginId }))
      .then((res) => {
        if (res.data === 1) { // 결과값이 1이면 중복이란 뜻 (Mapper에서 해당id의 갯수를 반환하기 때문)
          toast.warn("입력하신 아이디는 이미 사용중 입니다.");
          isDuplicate = true;
        } else {
          toast.success("사용가능한 아이디입니다.");
          setIsIdDuplicateChecked(true);
        }
      })
      .catch((error) => {
        toast.error("서버통신 실패, 담당자에게 문의하세요!");
      });
    
    if (isDuplicate) return true; // 중복이 있다는 의미로 true 반환
    else             return false;
  }

  // 우편번호검색: API 창을 띄워주고, 검색된 값을 회원가입 정보입력창에 넣어준다.
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
      } else {
        toast.error("우편번호 검색 서비스를 로드할 수 없습니다.");
      }
    };
  
    script.onerror = () => {
      toast.error("우편번호 검색 API를 로드하는 중 오류가 발생했습니다.");
    };
  
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Enter키를 누를시 완료버튼 효과를 작동
  const completeEnterHandler = (event) => {
    if (event.key === "Enter")
      completeRegisterHandler();
  }

  // 모달창 닫기: 닫기/취소/외부클릭 등에 의해 작동
  const closeModalHandler = () => {
      setModal(false);
  };

  return (
    <>
      <ModalOverlay onMouseDown={closeModalHandler}>           {/* <----- 모달 외부 클릭시 모달창닫기 수행 */}
        <ModalStyled onMouseDown={(e) => e.stopPropagation()}> {/* <----- 모달 내부 클릭엔 모달창닫기 방지 */}
          <Table onKeyDown={completeEnterHandler} tabIndex={-1}>     {/* 'tabIndex={-1}' 의미: 모달의 포커싱을 없애서 부모페이지의 ESC닫기Handler 작동을 가능하게 하는 용도 */}
            <TableCaption>회원가입</TableCaption>
            <tbody>
              <tr>
                <TableHeaderCell>회원유형 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <SelectBox name="userType" id="userType"
                    onChange={(e) => { setSignupInput((prev) => ({ ...prev, userType: e.target.value })); }}>
                    <option value="" selected disabled>선택</option>
                    <option value="A">개인회원</option>
                    <option value="B">기업회원</option>
                  </SelectBox>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>아이디 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={2}>
                  <InputField type="text" id="loginId" placeholder="숫자, 영문자 조합으로 6~20자리"
                    onChange={(e) => {  setSignupInput((prev) => ({ ...prev, loginId: e.target.value }));
                                        setIsIdDuplicateChecked(false)                               }}>
                  </InputField>
                </TableDataCell>
                <TableDataCell>
                  <Button onClick={checkIdDuplicateHandler}
                          disabled={isIdDuplicateChecked === true} // 중복체크 되었을시 불필요한 재 중복체크 방지
                          style={{backgroundColor: isIdDuplicateChecked === true ? 'gray' : '#007bff',
                                  cursor: isIdDuplicateChecked === true ? 'not-allowed' : 'pointer', }}
                  >중복확인 </Button>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>비밀번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type="password" id="password" placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                    onChange={(e) => { setSignupInput((prev) => ({ ...prev, password: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>비밀번호 확인 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type="password" id="passwordOk"
                    onChange={(e) => { setSignupInput((prev) => ({ ...prev, passwordOk: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>이름 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type="text" id="name"
                    onChange={(e) => { setSignupInput((prev) => ({ ...prev, name: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>성별 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <SelectBox name="sex" id="sex"
                    onChange={(e) => { setSignupInput((prev) => ({ ...prev, sex: e.target.value })); }}>
                    <option value="" selected disabled>선택</option>
                    <option value="1">남자</option>
                    <option value="2">여자</option>
                  </SelectBox>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>생년월일 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type="date" id="birthday"
                    onChange={(e) => { setSignupInput((prev) => ({ ...prev, birthday: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>전화번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type="tel" id="phone" placeholder="숫자만 입력"
                    onChange={(e) => { setSignupInput((prev) => ({ ...prev, phone: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>이메일 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type="email" id="email" placeholder="이메일@도메인 양식으로 입력"
                    onChange={(e) => { setSignupInput((prev) => ({ ...prev, email: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>우편번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={2}>
                  <InputField type="text" id="zipCode" placeholder="숫자만 입력" value={signupInput.zipCode}
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
                  <InputField type="text" id="address" value={signupInput.address}
                    onChange={(e) => { setSignupInput((prev) => ({ ...prev, address: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>상세주소</TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type="text" id="detailAddress"
                    onChange={(e) => { setSignupInput((prev) => ({ ...prev, detailAddress: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
            </tbody>
            <TableDataCell colSpan={4}>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <Button onClick={completeRegisterHandler}>회원가입 완료</Button>
                <Button onClick={closeModalHandler} style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}>취소</Button>
              </div>
            </TableDataCell>
          </Table>
        </ModalStyled>
      </ModalOverlay>
    </>
  );
};