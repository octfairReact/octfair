import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ManageUser } from "../../../../api/api";
import { toast } from "react-toastify";
import { datafieldnameApplicationData, IApplicationData } from "../../../../models/interface/IUser";
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

// 이 파일의 컴포넌트인 모달의 Props
export interface IUpdateUserModalProps {
  refreshUserListHandler: () => void; // 리스트(표) 새로고침 핸들러: 모달에서 전송성공시, 리스트새로고침 + 모달닫기
  userId: string; // 리스트(표)의 아이템 인덱스
  setUserId: (userId: string | undefined) => void;
}

export const UpdateApplicantModal: FC<IUpdateUserModalProps> = ({refreshUserListHandler, userId, setUserId}) => {
  const [, setModal] = useRecoilState<boolean>(modalState)
  const [userData, setUserData] = useState<IApplicationData>();
  const dataFieldName:IApplicationData = datafieldnameApplicationData;

  // 페이지 로드시 로그인정보(RecoilState의 userInfo.loginId)를 기반으로 이름 등의 회원정보를 읽어온다.
  useEffect(() => {
    axios.get(ManageUser.getApplicantDetail+"?loginId=" + userId)
      .then((res) => {
        const prevData = res.data.detail;
        setUserData({
          userType: prevData.userType,
          loginId: prevData.loginId, // 아이디 칸은 읽기전용
          name: prevData.name,
          sex: prevData.sex,
          birthday: prevData.birthday,
          phone: prevData.phone,
          email: prevData.email,
          regdate: prevData.regdate,
          statusYn: prevData.statusYn,
          zipCode: prevData.zipCode,
          address: prevData.address,
          detailAddress: prevData.detailAddress,
        })
      })
      .catch((error) => {
        toast.error("서버통신 실패, 담당자에게 문의하세요!");
      });
  }, [userId]);

  // 모달창 닫기: 닫기/취소/외부클릭 등에 의해 작동
  const closeModalHandler = () => {
    setModal(false);
  };

  // Enter키를 누를시 완료버튼 효과를 작동
  const completeEnterHandler = (event) => {
    if (event.key === "Enter")
      completeUpdateHandler();
  }

  // 회원수정 완료버튼 누를시 작동
  // 1. 빈값검사 -> 2. 양식검사(날짜/이메일형식/전화번호형식 등) -> 3. 데이터전송
  const completeUpdateHandler = () => {
    let isProblem:boolean = false;
    
    // 1. 빈값검사: 모든 입력창에 대하여 빈값 검사
    // return문 내 HTML코드에서 onInvalid()방식으로 유효성검사를 할 수도 있지만 일괄로 하는 것이 유지보수가 좋다고 판단
    Object.entries(userData).some(([key, value]) => { // 입력창이 12개나 되어서 반복문처리, signupInput이 배열은 아니어서 forEach()/map()대신 Object.entries()
      if (!value || value.length <= 0) {
        if (key !== "detailAddress") { // 빈칸이어도 되는 속성들
          toast.info(`'${dataFieldName[key]}'에 빈칸을 채워주세요!`);
          document.getElementById(key)?.focus();
          isProblem = true;
          return true; // 이 return값(true)는 'Object.values.some'반복문을 종료시킨다는 문법일뿐
        }
      }
      return false;
    });
    
    // 2. 양식검사: 입력창에 대하여 지켜야할 정규식패턴 검사
    const emailRules = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const phoneRules = /^[0-9]([-]?[0-9])*$/;
    const zipCodeRules = /^[0-9]*$/;

    if (isProblem === false) {
      if (new Date(userData.regdate) < new Date(userData.birthday)) {
        toast.info("가입일이 생일 이전일 수 없습니다.");
        isProblem = true;
      } else if (new Date(userData.regdate) > new Date()) {
        toast.info("가입일이 오늘 이후일 수 없습니다.");
        isProblem = true;
      } else if (!phoneRules.test(userData.phone)) {
        toast.info("전화번호는 숫자로 시작해야하며 중간에만 '-'를 쓰실수는 있습니다.");
        isProblem = true;
      } else if (!emailRules.test(userData.email)) {
        toast.info("이메일 형식을 확인해주세요. 숫자나 알파벳으로 시작해야하며 중간값으로 '-_.'를 넣으실 순 있습니다. 그리고 당연히 @와 메일 홈페이지까지도 작성하셔야 합니다.")
        isProblem = true;
      } else if (!zipCodeRules.test(userData.zipCode)) {
        toast.info("우편번호 형식을 확인해주세요. 숫자만 가능합니다.");
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

      axios.get(ManageUser.putApplicantInfo + queryString)
        .then((res) => {
          if (res.data.result.toUpperCase() === "SUCCESS") {
            toast.success("회원수정이 완료되었습니다!");
            closeModalHandler();
            refreshUserListHandler();
          } else {
            toast.warn("회원수정 실패, 담당자에게 문의하세요!");
          }
        })
        .catch((error) => {
          toast.error("서버통신 실패, 담당자에게 문의하세요!");
        });
    }
  };

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
            setUserData((prev) => ({
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

  // 비밀번호 초기화: 1234로 초기화된다.
  const resetPasswordHandler = () => {
    axios.get(ManageUser.putApplicantPassword + "?loginId=" + userId)
      .then((res) => {
        if (res.data.result.toUpperCase() === "SUCCESS") {
          toast.success("비밀번호가 1234로 초기화 완료되었습니다!");
          closeModalHandler();
        } else {
          toast.warn("비밀번호 초기화 실패, 담당자에게 문의하세요!");
        }
      })
      .catch((error) => {
        toast.error("서버통신 실패, 담당자에게 문의하세요!");
      });
  }

  return (
    <>
      <ModalOverlay onMouseDown={closeModalHandler}>              {/* <----- 모달 외부 클릭시 모달창닫기 수행 */}
        <ModalStyled onMouseDown={(e) => e.stopPropagation()}>    {/* <----- 모달 내부 클릭엔 모달창닫기 방지 */}
          <Table onKeyDown={completeEnterHandler} tabIndex={-1}> {/* 'tabIndex={-1}' 의미: 모달의 포커싱을 없애서 부모페이지의 ESC닫기Handler 작동을 가능하게 하는 용도 */}
            <TableCaption>개인회원정보</TableCaption>
            <tbody>
              <tr>
                <TableHeaderCell>회원유형 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <SelectBox name="userType" id="userType" value={userData.userType}
                    onChange={(e) => { setUserData((prev) => ({ ...prev, userType: e.target.value })); }}>
                    <option value="" disabled>선택</option>
                    <option value="A">개인회원</option>
                    <option value="B">기업회원</option>
                  </SelectBox>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>아이디 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type="text" id="loginId" placeholder="숫자, 영문자 조합으로 6~20자리" value={userData.loginId} readOnly
                    onChange={(e) => {  setUserData((prev) => ({ ...prev, loginId: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>비밀번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <Button onClick={resetPasswordHandler}>초기화</Button>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>이름 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type="text" id="name" value={userData.name}
                    onChange={(e) => { setUserData((prev) => ({ ...prev, name: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>성별 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <SelectBox name="sex" id="sex" value={userData.sex}
                    onChange={(e) => { setUserData((prev) => ({ ...prev, sex: e.target.value })); }}>
                    <option value="" disabled>선택</option>
                    <option value="1">남자</option>
                    <option value="2">여자</option>
                  </SelectBox>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>생년월일 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type="date" id="birthday" value={userData.birthday}
                    onChange={(e) => { setUserData((prev) => ({ ...prev, birthday: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>전화번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type="tel" id="phone" placeholder="숫자만 입력" value={userData.phone}
                    onChange={(e) => { setUserData((prev) => ({ ...prev, phone: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>이메일 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type="email" id="email" placeholder="이메일@도메인 양식으로 입력" value={userData.email}
                    onChange={(e) => { setUserData((prev) => ({ ...prev, email: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>가입일자 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type="date" id="regdate" value={userData.regdate}
                    onChange={(e) => { setUserData((prev) => ({ ...prev, regdate: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>활성화 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <SelectBox name="userType" id="statusYn" value={userData.statusYn}
                    onChange={(e) => { setUserData((prev) => ({ ...prev, statusYn: e.target.value })); }}>
                    <option value="" disabled>선택</option>
                    <option value="1">활성</option>
                    <option value="2">비활성</option>
                  </SelectBox>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>우편번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={2}>
                  <InputField type="text" id="zipCode" value={userData.zipCode}
                    onChange={(e) => { setUserData((prev) => ({ ...prev, zipCode: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
                <TableDataCell>
                  <Button onClick={postcodeSearchHandler}>우편번호 찾기</Button>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>주소 <RequiredMark>*</RequiredMark></TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type="text" id="address" value={userData.address}
                    onChange={(e) => { setUserData((prev) => ({ ...prev, address: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
              <tr>
                <TableHeaderCell>상세주소</TableHeaderCell>
                <TableDataCell colSpan={3}>
                  <InputField type="text" id="detailAddress" value={userData.detailAddress}
                    onChange={(e) => { setUserData((prev) => ({ ...prev, detailAddress: e.target.value })); }}>
                  </InputField>
                </TableDataCell>
              </tr>
            </tbody>
          </Table>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <Button onClick={completeUpdateHandler}>회원수정 완료</Button>
            <Button onClick={closeModalHandler} style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}>취소</Button>
          </div>
        </ModalStyled>
      </ModalOverlay>
    </>
  );
};