import { useRecoilState } from "recoil";
import { useState } from "react";
import axios from "axios";
import { modalState } from "../../../../stores/modalState";
import { MyPage } from "../../../../api/api";
import { toast } from "react-toastify";
import { IPasswordInput, defaultPasswordInput, datafieldnamePasswordInput } from "../../../../models/interface/IUser";
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

export const MyPageUpdatePasswordModal = () => {
  const [, setModal] = useRecoilState<boolean>(modalState);
  const [password, setPassword] = useState<IPasswordInput>(defaultPasswordInput);
  const dataFieldName:IPasswordInput = datafieldnamePasswordInput;

  // 탈퇴요청 버튼 누를 시 작동
  // 1. 빈값검사 -> 2. 양식검사(비밀번호형식) -> 3. 데이터전송
  const completeWithdrawHandler = () => {
    let isProblem:boolean = false;

    Object.entries(password).some(([key, value]) => { // 입력창이 많아서 반복문처리, signupInput이 배열은 아니어서 forEach()/map()대신 Object.entries()
      
      // 1. 빈값검사
      // HTML코드에서 onInvalid()방식으로 유효성검사를 할 수도 있지만 일괄로 하는 것이 유지보수가 좋다고 판단
      if (isProblem === false && (!value || value.length <= 0)) {
        if (true) { // 빈칸이어도 되는 속성들
          toast.info(`'${dataFieldName[key]}'에 빈칸을 채워주세요!`);
          document.getElementById(key)?.focus();
          isProblem = true;
          return true; // 이 return값(true)는 'Object.values.some'반복문을 종료시킨다는 문법일뿐, 즉 문제발생하여 if문 입장시 검사 조기종료한다는 뜻
        }
      }
    
      // 2. 양식검사: password 입력창에 대하여 지켜야할 정규식패턴 검사
      if (isProblem === false) {
        const passwordRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

        const validationRules = {
          newPasswd:        { check: () => !passwordRegex.test(password.newPasswd),// .test()는 정규식패턴에 맞으면 true를 반환
                              message: "비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리여야 합니다." },
          newPasswdConfirm: { check: () => password.newPasswd !== password.newPasswdConfirm,
                              message: "비밀번호와 비밀번호확인에 입력하신 값이 일치하지 않습니다." },
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

    // 3. 데이터전송: 비번수정 입력정보 문제없음! 서버로 Update요청!
    if (isProblem === false) {
      const query: string[] = [];
      
      Object.entries(password).forEach(([key, value]) => {
        query.push(`${key}=${encodeURIComponent(value)}`);
      });
      
      // 쿼리 앞에 '?' 붙이고 쿼리key/value쌍 사이마다 '&' 붙이기
      const queryString = query.length > 0 ? `?${query.join(`&`)}` : "";

      axios.get(MyPage.putUserPw + queryString)
        .then((res) => {
          if (res.data.result.toUpperCase() === "SUCCESS") {
            toast.success("비밀번호 변경이 완료되었습니다!");
            closeModalHandler();
          } else {
            toast.warn("기존 비밀번호가 입력하신 정보와 일치하지 않습니다.");
          }
        })
        .catch((error) => {
          toast.error("서버통신 실패, 담당자에게 문의하세요!");
        });
    }
  }

  // Enter키를 누를시 완료버튼 효과를 작동
  const completeEnterHandler = (event) => {
    if (event.key === "Enter") 
      completeWithdrawHandler();
  };
  
  // 모달창 닫기: 닫기/취소/외부클릭 등에 의해 작동
  const closeModalHandler = () => {
    setModal(false);
  };

  return (
    <>
      <ModalOverlay onMouseDown={closeModalHandler}>           {/* <----- 모달 외부 클릭시 모달창닫기 수행 */}
        <ModalStyled onMouseDown={(e) => e.stopPropagation()}> {/* <----- 모달 내부 클릭엔 모달창닫기 방지 */}
          <Table onKeyDown={completeEnterHandler} tabIndex={-1}>     {/* 'tabIndex={-1}' 의미: 모달의 포커싱을 없애서 부모페이지의 ESC닫기Handler 작동을 가능하게 하는 용도 */}
          <TableCaption>회원탈퇴 본인확인을 위해 비밀번호를 입력해주세요</TableCaption>
          <tr>
            <TableHeaderCell>기존 비밀번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
            <TableDataCell colSpan={3}>
              <InputField type="password" id="passwd" placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                onChange={(e) => { setPassword((prev) => ({ ...prev, passwd: e.target.value })); }}>
              </InputField>
            </TableDataCell>
          </tr>
          <tr>
            <TableHeaderCell>변경할 비밀번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
            <TableDataCell colSpan={3}>
              <InputField type="password" id="newPasswd" placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                onChange={(e) => { setPassword((prev) => ({ ...prev, newPasswd: e.target.value })); }}>
              </InputField>
            </TableDataCell>
          </tr>
          <tr>
            <TableHeaderCell>비밀번호 확인<RequiredMark>*</RequiredMark></TableHeaderCell>
            <TableDataCell colSpan={3}>
              <InputField type="password" id="newPasswdConfirm" placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                onChange={(e) => { setPassword((prev) => ({ ...prev, newPasswdConfirm: e.target.value })); }}>
              </InputField>
            </TableDataCell>
          </tr>
          </Table>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <Button onClick={completeWithdrawHandler}>수정</Button>
            <Button onClick={closeModalHandler} style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}>취소</Button>
          </div>
        </ModalStyled>
      </ModalOverlay>
    </>
  );
};