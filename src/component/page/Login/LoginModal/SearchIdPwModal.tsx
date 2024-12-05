import { useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { Login } from "../../../../api/api";
import { toast } from "react-toastify";
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

// 입력데이터 구조체/멤버변수
export interface Inputs {
  inputA: string; // 아이디찾기의 경우 이름, 비밀번호찾기의 경우 아이디, 비밀번호변경의 경우 비밀번호가 입력됨
  inputB: string; // 아이디찾기의 경우 이메일, 비밀번호찾기의 경우도 이메일, 비밀번호변경의 경우 비밀번호재입력이 입력됨
}

export const SearchIdPwModal = () => {
  // false(닫힘), "openSignupModal"(회원가입 모달 열림), 
  // "openSearchIdModal"(아이디찾기 모달 열림), "openSearchPwModal"(비밀번호찾기 모달 열림), "openUpdatePwModal"(비밀번호변경 보달 열림)
  const [modal, setModal] = useRecoilState<boolean | string>(modalState);
  const [inputs, setInputs] = useState<Inputs>({ inputA: '', inputB: '', }); // 기본값
  const [saveId, setSaveId] = useState<string>(); // '비밀번호찾기'->'비밀번호재설정' 으로 넘어갈시에 '비밀번호재설정'에서 아이디를 입력받지않기에 '비밀번호찾기'에서 입력했던 아이디를 기억해놓는 것

  // 모달창 닫기: 닫기/취소/외부클릭 등에 의해 작동
  const closeModalHandler = () => {
      setModal(false);
  };

  // Enter키를 누를시 완료버튼 효과를 작동
  const completeEnterHandler = (event) => {
    if (event.key === "Enter")
      completeHandler ();
  }

  // 완료버튼 누를시 작동
  // 1. 빈값검사 -> 2. 양식검사(이메일형식/비밀번호형식 등) -> 3. 데이터전송
  const completeHandler = () => {
    let isProblem:boolean = false;

    Object.entries(inputs).some(([key, value]) => { // 입력창이 12개나 되어서 반복문처리, signupInput이 배열은 아니어서 forEach()/map()대신 Object.entries()
      
      // 1. 빈값검사
      // HTML코드에서 onInvalid()방식으로 유효성검사를 할 수도 있지만 일괄로 하는 것이 유지보수가 좋다고 판단
      if (isProblem === false && (!value || value.length <= 0)) {
        if (key !== "detailAddress" && key !== "action") { // 빈칸이어도 되는 속성들
          toast.info("빈칸을 채워주세요!");
          document.getElementById(key)?.focus();
          isProblem = true;
          return true; // 이 return값(true)는 'Object.values.some'반복문을 종료시킨다는 문법일뿐, 즉 문제발생하여 if문 입장시 검사 조기종료한다는 뜻
        }
      }

      // 2. 양식검사: 이메일형식에 맞지 않아도 서버랑 매칭하는 걸로 대체가능하긴 하나 가능한 서버에 요청시키지 않는게 프론트의 역할
      if (isProblem === false) {
        const validationRules = {
          "openSearchIdModal": {
            // inputA: { check: () => {},
            //           message: "" },
            inputB: { check: () => !/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(inputs.inputB),
                      message: "이메일 형식을 확인해주세요. 숫자나 알파벳으로 시작해야하며 중간값으로 '-_.'를 넣으실 순 있습니다. 그리고 당연히 @와 메일 홈페이지까지도 작성하셔야 합니다." },
          },
          "openSearchPwModal": {
            // inputA: { check: () => {},
            //           message: "" },
            inputB: { check: () => !/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(inputs.inputB),
                      message: "이메일 형식을 확인해주세요. 숫자나 알파벳으로 시작해야하며 중간값으로 '-_.'를 넣으실 순 있습니다. 그리고 당연히 @와 메일 홈페이지까지도 작성하셔야 합니다." },
          },
          "openUpdatePwModal": {
            inputA: { check: () => !/^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/.test(inputs.inputA),
                      message: "비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다." },
            inputB: { check: () => inputs.inputA !== inputs.inputB,
                      message: "비밀번호와 비밀번호확인에 입력하신 값이 일치하지 않습니다." },
          },
        }
        
        // 위 중복검사/양식검사와 적발시에 대한 안내메시지와 포커싱 설정
        if (validationRules[String(modal)][key]?.check()) {
          toast.info(validationRules[String(modal)][key].message);
          document.getElementById(key)?.focus();
          isProblem = true;
        }
      }

      return false; // 이 return값(false)는 continue같은 역할로 Object.entires()반복문을 다음 key아이템으로 순회시킴
    });

    // 3. 데이터전송: 입력정보 문제없음! 서버로 매칭요청!
    if (isProblem === false) {
      const query: string[] = [];
      
      if (modal === "openSearchIdModal") {
        query.push(`name=${inputs.inputA}`);
        query.push(`email=${inputs.inputB}`);
      } else if (modal === "openSearchPwModal") {
        query.push(`id=${inputs.inputA}`);
        query.push(`email=${inputs.inputB}`);
      } else if (modal === "openUpdatePwModal") {
        query.push(`id=${saveId}`);
        query.push(`pw=${encodeURIComponent(inputs.inputB)}`);
      }

      // 쿼리 앞에 '?' 붙이고 쿼리key/value쌍 사이마다 '&' 붙이기
      const queryString = query.length > 0 ? `?${query.join(`&`)}` : "";
      
      let serverApiAddress:string = "";
      if      (modal === "openSearchIdModal") serverApiAddress = Login.getSearchId;
      else if (modal === "openSearchPwModal") serverApiAddress = Login.getSearchPw;
      else if (modal === "openUpdatePwModal") serverApiAddress = Login.putResetPw;
      
      // 전송주소의 'board'와 같은 상위경로가 없는 이유는 Spring컨트롤러의 @RequestMapping에 분류토록 명시된 상위경로가 없기 때문
      // axios.post()가 아니라 axios.get()인 이유는 Spring컨트롤러가 @RequestBody가 아니라 @RequestParam이기 때문
      // navigate()가 아니라 axios인 이유는 navigate식 URL쿼리전송은 React페이지 내의 전송일때고, 서버로의 URL쿼리 전송은 axios
      axios.post(serverApiAddress + queryString)
        .then((res) => {
          if (res.data.result.toUpperCase() === "SUCCESS") {
            if (modal === "openSearchIdModal") {
              toast.success("찾으시는 아이디는 " + res.data.id + "입니다.");
              closeModalHandler();
            } else if (modal === "openSearchPwModal") {
              toast.success("확인되었습니다. 비밀번호를 변경해 주세요!");
              setModal("openUpdatePwModal");
              setSaveId(inputs.inputA);
              setInputs({ inputA: '', inputB: '' });
            } else if (modal === "openUpdatePwModal") {
              toast.success("비밀번호 변경이 완료되었습니다!");
              closeModalHandler();
            }
          } else if (res.data.result.toUpperCase() === "FALSE"){
            toast.warn("일치하는 정보가 존재하지 않습니다.");
          }
        })
        .catch((error) => {
          toast.error("서버통신 실패, 담당자에게 문의하세요!");
        });
    }
  }

  let title       = modal === "openSearchIdModal" ? "아이디 찾기" : (modal === "openSearchPwModal" ? "비밀번호 찾기" : "비밀번호 변경");
  let input1_name = modal === "openSearchIdModal" ? "이름" : (modal === "openSearchPwModal" ? "아이디" : "변경할 비밀번호");
  let input2_name = modal === "openSearchIdModal" ? "이메일" : (modal === "openSearchPwModal" ? "이메일" : "비밀번호 재입력");
  let input1_type = modal === "openSearchIdModal" ? "text" : (modal === "openSearchPwModal" ? "text" : "password");
  let input2_type = modal === "openSearchIdModal" ? "email" : (modal === "openSearchPwModal" ? "email" : "password");
  let button_name = modal === "openSearchIdModal" ? "찾기" : (modal === "openSearchPwModal" ? "찾기" : "변경");

  return (
    <>
      <ModalOverlay onMouseDown={closeModalHandler}>            {/* <----- 모달 외부 클릭시 모달창닫기 수행 */}
        <ModalStyled onMouseDown={(e) => e.stopPropagation()} //{/* <----- 모달 내부 클릭엔 모달창닫기 방지 */}
                style={{ backgroundColor: modal==="openUpdatePwModal" && 'cornsilk' }}> {/* <----- 비밀번호찾기->비밀번호변경으로 모달 변경시 배경색을 변경 */}
          <Table onKeyDown={completeEnterHandler} tabIndex={-1}>
            <TableCaption>{title}</TableCaption>
            <tbody>
              <tr>
                <TableHeaderCell>{input1_name} <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={2}>
                  <InputField type={input1_type} id="id" placeholder={`가입하신 ${input1_name}을 입력해주세요`} value={inputs.inputA}
                    onChange={(e) => { setInputs((prev) => ({ ...prev, inputA: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>{input2_name} <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type={input2_type} id="pwd" placeholder={`가입하신 ${input2_name}을 입력해주세요`} value={inputs.inputB}
                    onChange={(e) => { setInputs((prev) => ({ ...prev, inputB: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
            </tbody>
          </Table>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <Button onClick={completeHandler}>{button_name}</Button>
            <Button onClick={closeModalHandler} style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}>취소</Button>
          </div>
        </ModalStyled>
      </ModalOverlay>
    </>
  );
};