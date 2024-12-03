import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { FC, useEffect, useState } from "react";
import axios from "axios";
import { ManageUser } from "../../../../api/api";
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

// 회원수정 입력데이터 구조체/멤버변수
export interface UserData {
  bizIdx: number; // 사업자번호 (string 아님)
  bizName: string; // 사업자명
  bizCeoName: string; // 대표자
  bizEmpCount: string; // 사원수
  bizRevenue: string; // 매출액
  bizContact: string; // 연락처
  bizAddr: string; // 사업자 주소
  bizWebUrl: string; // 홈페이지 주소
  bizFoundDate: string; // 설립일 (날짜형 string)
  bizIntro: string; // 회사소개
}

// 이 파일의 컴포넌트인 모달의 Props
export interface IUpdateUserModalProps {
  refreshUserListHandler: () => void;
  userId: number;
  setUserId: (userId: number | undefined) => void;
}

export const UpdateBizModal: FC<IUpdateUserModalProps> = ({ refreshUserListHandler, userId, setUserId }) => {
  const [updateUserModal, setUpdateUserModal] = useRecoilState<boolean>(modalState);
  const [userData, setUserData] = useState<UserData>({
    // 기본값
    bizIdx: 0,
    bizName: "",
    bizCeoName: "",
    bizEmpCount: "",
    bizRevenue: "",
    bizContact: "",
    bizAddr: "",
    bizWebUrl: "",
    bizFoundDate: "",
    bizIntro: "",
  });

  // 페이지 로드시 로그인정보(RecoilState의 userInfo.loginId)를 기반으로 이름 등의 회원정보를 읽어온다.
  useEffect(() => {
    axios.get(ManageUser.getBizDetail + "?bizIdx=" + userId).then((res) => {
      let prevData = res.data.detail;
      setUserData({
        bizIdx: userId,
        bizName: prevData.bizName,
        bizCeoName: prevData.bizCeoName,
        bizEmpCount: prevData.bizEmpCount,
        bizRevenue: prevData.bizRevenue,
        bizContact: prevData.bizContact,
        bizAddr: prevData.bizAddr,
        bizWebUrl: prevData.bizWebUrl,
        bizFoundDate: prevData.bizFoundDate,
        bizIntro: prevData.bizIntro,
      });
    });
  }, [userId]);

  // 모달창 닫기: 닫기/취소/외부클릭 등에 의해 작동
  const closeModalHandler = () => {
    if (updateUserModal !== false) setUpdateUserModal(false);
  };

  // Enter키를 누를시 완료버튼 효과를 작동
  const completeEnterHandler = (event) => {
    if (event.key === "Enter") completeUpdateHandler();
  };

  // 회원수정 완료버튼 누를시 작동
  // 1. 빈값검사 -> 2. 양식검사(날짜 등) -> 3. 데이터전송
  const completeUpdateHandler = () => {
    let isProblem: boolean = false;

    // 1. 빈값검사: 모든 입력창에 대하여 빈값 검사
    // return문 내 HTML코드에서 onInvalid()방식으로 유효성검사를 할 수도 있지만 일괄로 하는 것이 유지보수가 좋다고 판단
    Object.entries(userData).some(([key, value]) => {
      // 입력창이 12개나 되어서 반복문처리, signupInput이 배열은 아니어서 forEach()/map()대신 Object.entries()
      if (!value || value.length <= 0) {
        if (true) {
          // 빈칸이어도 되는 속성들
          alert(`'${key}'에 빈칸을 채워주세요!`);
          isProblem = true;
          return true; // 이 return값(true)는 'Object.values.some'반복문을 종료시킨다는 문법일뿐
        }
      }
      return false;
    });
    const phoneRules = /^[0-9]([-]?[0-9])*$/;

    if (isProblem === false) {
      if (new Date(userData.bizFoundDate) > new Date()) {
        alert("설립일이 오늘 이후일 수 없습니다.");
        isProblem = true;
      } else if (!phoneRules.test(userData.bizContact)) {
        alert("전화번호는 숫자로 시작해야하며 중간에만 '-'를 쓰실수는 있습니다.");
        isProblem = true;
      }
    }

    // 3. 데이터전송: 회원수정 입력정보 문제없음! 서버로 Update요청!
    if (isProblem === false) {
      const query: string[] = [];
      Object.entries(userData).forEach(([key, value]) => {
        query.push(`${key}=${encodeURIComponent(value)}`);
      });

      // 쿼리 앞에 '?' 붙이고 쿼리key/value쌍 사이마다 '&' 붙이기
      const queryString = query.length > 0 ? `?${query.join(`&`)}` : "";

      axios.get(ManageUser.putBizInfo + queryString).then((res) => {
        if (res.data.result.toUpperCase() === "SUCCESS") {
          alert("회원수정이 완료되었습니다!");
          closeModalHandler();
          refreshUserListHandler();
        } else {
          alert("회원수정 실패, 담당자(유성찬)에게 문의하세요!");
        }
      });
    }
  };

  return (
    <>
      <ModalOverlay onMouseDown={closeModalHandler}>
        {" "}
        {/* <----- 모달 외부 클릭시 모달창닫기 수행 */}
        <ModalStyled onMouseDown={(e) => e.stopPropagation()}>
          {" "}
          {/* <----- 모달 내부 클릭엔 모달창닫기 방지 */}
          <Table onKeyDown={completeEnterHandler}>
            <TableCaption>기업회원정보</TableCaption>
            <tbody>
              <tr>
                <TableHeaderCell>
                  사업자번호 <RequiredMark>*</RequiredMark>
                </TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField
                    type="number"
                    id="updateId"
                    value={userData.bizIdx}
                    readOnly
                    onChange={(e) => {
                      setUserData((prev) => ({ ...prev, bizIdx: Number(e.target.value) }));
                    }}
                  ></InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>
                  사업자명 <RequiredMark>*</RequiredMark>
                </TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField
                    type="text"
                    id="updateId"
                    value={userData.bizName}
                    onChange={(e) => {
                      setUserData((prev) => ({ ...prev, bizName: e.target.value }));
                    }}
                  ></InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>
                  대표자 <RequiredMark>*</RequiredMark>
                </TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField
                    type="text"
                    id="updateId"
                    value={userData.bizCeoName}
                    onChange={(e) => {
                      setUserData((prev) => ({ ...prev, bizCeoName: e.target.value }));
                    }}
                  ></InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>
                  사원수 <RequiredMark>*</RequiredMark>
                </TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField
                    type="text"
                    id="updateId"
                    value={userData.bizEmpCount}
                    onChange={(e) => {
                      setUserData((prev) => ({ ...prev, bizEmpCount: e.target.value }));
                    }}
                  ></InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>
                  매출액 <RequiredMark>*</RequiredMark>
                </TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField
                    type="text"
                    id="updateId"
                    value={userData.bizRevenue}
                    onChange={(e) => {
                      setUserData((prev) => ({ ...prev, bizRevenue: e.target.value }));
                    }}
                  ></InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>
                  연락처 <RequiredMark>*</RequiredMark>
                </TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField
                    type="text"
                    id="updateId"
                    placeholder="숫자만 입력"
                    value={userData.bizContact}
                    onChange={(e) => {
                      setUserData((prev) => ({ ...prev, bizContact: e.target.value }));
                    }}
                  ></InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>
                  사업자 주소 <RequiredMark>*</RequiredMark>
                </TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField
                    type="text"
                    id="updateId"
                    value={userData.bizAddr}
                    onChange={(e) => {
                      setUserData((prev) => ({ ...prev, bizAddr: e.target.value }));
                    }}
                  ></InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>
                  홈페이지 주소 <RequiredMark>*</RequiredMark>
                </TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField
                    type="text"
                    id="updateId"
                    value={userData.bizWebUrl}
                    onChange={(e) => {
                      setUserData((prev) => ({ ...prev, bizWebUrl: e.target.value }));
                    }}
                  ></InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>
                  설립일 <RequiredMark>*</RequiredMark>
                </TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField
                    type="date"
                    id="updateBirthday"
                    value={userData.bizFoundDate}
                    onChange={(e) => {
                      setUserData((prev) => ({ ...prev, bizFoundDate: e.target.value }));
                    }}
                  ></InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>
                  회사소개 <RequiredMark>*</RequiredMark>
                </TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField
                    type="text"
                    id="updateId"
                    value={userData.bizIntro}
                    onChange={(e) => {
                      setUserData((prev) => ({ ...prev, bizIntro: e.target.value }));
                    }}
                  ></InputField>
                </TableDataCell>
              </tr>
            </tbody>
          </Table>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <Button onClick={completeUpdateHandler}>회원수정 완료</Button>
            <Button onClick={closeModalHandler} style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}>
              취소
            </Button>
          </div>
        </ModalStyled>
      </ModalOverlay>
    </>
  );
};
