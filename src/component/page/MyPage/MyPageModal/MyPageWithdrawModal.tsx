import { useRecoilState } from "recoil";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { modalState } from "../../../../stores/modalState";
import { MyPage } from "../../../../api/api";
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

export const MyPageWithdrawModal = () => {
  const [, setModal] = useRecoilState<boolean>(modalState);
  const [password, setPassword] = useState<string>();
  const navigate = useNavigate();

  // 탈퇴요청 버튼 누를 시 작동
  // 1. 빈값검사 -> 2. 양식검사(비밀번호형식) -> 3. 탈퇴의사 재확인 -> 4. 데이터전송
  const completeWithdrawHandler = () => {
    let isProblem:boolean = false;

    // 1. 빈값검사
    if (isProblem === false && (!password || password.length <= 0)) {
      toast.info("비밀번호를 입력해 주세요!");
      document.getElementById(password)?.focus();
      isProblem = true;
    }
    
    /* ***** 아래코드는 원랜 정상코드이나 개발/테스트 시 편의를 위해 임시 주석처리 해놓은 상태 ***** */
    // // 2. 양식검사: password 입력창에 대하여 지켜야할 정규식패턴 검사
    // const passwordRules = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

    // if (isProblem === false) {
    //   if (!passwordRules.test(password)) {// .test()는 정규식패턴에 맞으면 true를 반환
    //     toast.info("비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리여야 합니다.");
    //     isProblem = true;
    //   }
    // }

    // 3. 탈퇴의사 재확인 하는 confirm확인창
    const isConfirmed = window.confirm("회원탈퇴 후 복구가 불가능합니다. 정말 탈퇴하시겠습니까?");
    if (!isConfirmed) return;

    // 4. 데이터 전송: 회원탈퇴 입력정보 문제없음! 서버로 Delete요청!
    if (isProblem === false) {
      axios.get(MyPage.deleteUser + "?password=" + encodeURIComponent(password))
        .then((res) => {
          if (res.data.result.toUpperCase() === "SUCCESS") {
            toast.success("회원탈퇴가 완료되었습니다!");
            closeModalHandler();
            navigate("/");
          } else {
            toast.warn("입력하신 비밀번호가 일치하지 않습니다.");
          }
        })
        .catch((error) => {
          toast.error("서버통신 실패, 담당자에게 문의하세요!");
        });
    }
  }

  // Enter키를 누를시 완료버튼 효과를 작동
  const completeEnterHandler = (event) => {
    if (event.key === "Enter") completeWithdrawHandler();
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
            <TableHeaderCell>비밀번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
            <TableDataCell colSpan={3}>
              <InputField type="password" id="password" placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
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