import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { updatePasswordModalState } from "../../../../stores/modalState";
import { MyPageUpdatePasswordModal } from "../MyPageModal/MyPageUpdatePasswordModal";
import { useNavigate } from "react-router-dom";
import { MyPage } from "../../../../api/api";
import { toast } from "react-toastify";
import {
  Table,
  TableCaption,
  TableHeaderCell,
  TableDataCell,
  InputField,
  SelectBox,
  RequiredMark,
  Button,
} from "./styled";

declare global {
  interface Window {
    daum: any;
  }
}

// 회원수정 입력데이터 구조체/멤버변수
export interface UpdateInput {
  loginId: string;
  name: string;
  sex: string;  // 선택박스로 '1'/'2' 중 하나가 입력 됨
  birthday: string;
  phone: string;
  email: string;
  zipCode: string; // 직접입력 또는 우편번호찾기 API로 입력 됨
  address: string;
  detailAddress: string;
}

export const MyPageUpdateMain = () => {
  const [updatePasswordModal, setUpdatePasswordModal] = useRecoilState<boolean>(updatePasswordModalState);
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [userType, setUserType] = useState<string>();
  const [bizIdx, setBizIdx] = useState<number>();
  const [updateInput, setUpdateInput] = useState<UpdateInput>({
    // 기본값
    loginId: userInfo.loginId, // 아이디 칸은 읽기전용
    name: '',
    sex: '',
    birthday: '',
    phone: '',
    email: '',
    zipCode: '',
    address: '',
    detailAddress: '',
  });
  const dataFieldName = {
    loginId: '로그인아이디',
    name: '이름',
    sex: '성별',
    birthday: '생년월일',
    phone: '전화번호',
    email: '이메일',
    zipCode: '우편번호',
    address: '주소',
    detailAddress: '상세주소',
  }
  const navigate = useNavigate();

  // 페이지 로드시 로그인정보(RecoilState의 userInfo.loginId)를 기반으로 이름 등의 회원정보를 읽어온다.
  useEffect(() => {
    axios.get(MyPage.getUserInfo + "?loginId=" + userInfo.loginId)
      .then((res) => {
        let prevData = res.data.detail;
        setUserType(prevData.userType);
        setBizIdx(res.data.chkRegBiz.bizIdx);
        setUpdateInput({
          loginId: userInfo.loginId, // 아이디 칸은 읽기전용
          name: prevData.name,
          sex: prevData.sex,
          birthday: prevData.birthday,
          phone: prevData.phone,
          email: prevData.email,
          zipCode: prevData.zipCode,
          address: prevData.address,
          detailAddress: prevData.detailAddress,
        })
      })
      .catch((error) => {
        toast.error("서버통신 실패, 담당자에게 문의하세요!");
      });
  }, [userInfo.loginId]);

  // Enter=완료, ESC=닫기 작동
  const pressEnterEscHandler = (event) => {
    if (event.key === "Enter" 
      && updatePasswordModal === false)
      completeUpdateHandler();
    else if (event.key === "Escape")
      setUpdatePasswordModal(false);
  }

  // 회원수정 완료버튼 누를시 작동
  // 1. 빈값검사 -> 2. 양식검사(날짜/이메일형식/전화번호형식) -> 3. 데이터전송
  const completeUpdateHandler = async () => {
    let isProblem:boolean = false;
    
    // 1. 빈값검사: 모든 입력창에 대하여 빈값 검사
    // return문 내 HTML코드에서 onInvalid()방식으로 유효성검사를 할 수도 있지만 일괄로 하는 것이 유지보수가 좋다고 판단
    Object.entries(updateInput).some(([key, value]) => { // 입력값이 많아서 반복문처리, signupInput이 배열은 아니어서 forEach()/map()대신 Object.entries()
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
      if (new Date(updateInput.birthday) > new Date()) {
        toast.info("생년월일은 미래의 날짜일 수 없습니다.");
        isProblem = true;
      } else if (!phoneRules.test(updateInput.phone)) {
        toast.info("전화번호는 숫자로 시작해야하며 중간에만 '-'를 쓰실수는 있습니다.");
        isProblem = true;
      } else if (!emailRules.test(updateInput.email)) {
        toast.info("이메일 형식을 확인해주세요. 숫자나 알파벳으로 시작해야하며 중간값으로 '-_.'를 넣으실 순 있습니다. 그리고 당연히 @와 메일 홈페이지까지도 작성하셔야 합니다.")
        isProblem = true;
      } else if (!zipCodeRules.test(updateInput.zipCode)) {
        toast.info("우편번호 형식을 확인해주세요. 숫자만 가능합니다.");
        isProblem = true;
      }
    }

    // 3. 데이터전송: 회원수정 입력정보 문제없음! 서버로 Update요청!
    if (isProblem === false) {
      const query: string[] = [];
      
      Object.entries(updateInput).forEach(([key, value]) => {
        query.push(`${key}=${encodeURIComponent(value)}`);
      });

      // 쿼리 앞에 '?' 붙이고 쿼리key/value쌍 사이마다 '&' 붙이기
      const queryString = query.length > 0 ? `?${query.join(`&`)}` : "";

      axios.get(MyPage.putUserInfo + queryString)
        .then((res) => {
          if (res.data.result.toUpperCase() === "SUCCESS") {
            toast.success("회원수정이 완료되었습니다!");
          } else {
            toast.warn("회원수정 실패, 담당자에게 문의하세요!");
          }
        })
        .catch((error) => {
          toast.error("서버통신 실패, 담당자에게 문의하세요!");
        });
    }

  };

  // 우편번호검색API 창을 띄워주고, 검색된 값을 회원수정 정보입력창에 넣어준다.
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
            setUpdateInput((prev) => ({
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

  // 비밀번호 수정 버튼 누를시 비밀번호수정 관련 모달 팝업
  const updatePasswordHandler = () => {
    if (updatePasswordModal === false)
      setUpdatePasswordModal(true);
  }

  // 기업 등록 버튼 누를시 기업등록 페이지로 이동
  const createBizHandler = () => {
    navigate("/react/company/companyWritePage.do");
  };

  // 기업 수정 버튼 누를시 기업수정 페이지로 이동
  const updateBizHandler = () => {
    navigate("/react/company/companyUpdatePage.do");
  };

  return (
    <>
      <Table onKeyDown={pressEnterEscHandler}>
        <TableCaption>회원가입</TableCaption>
        <tbody>
          <tr>
            <TableHeaderCell>아이디 <RequiredMark>*</RequiredMark></TableHeaderCell>
            <TableDataCell colSpan={3}>
              <InputField type="text" id="loginId" placeholder="숫자, 영문자 조합으로 6~20자리" value={userInfo.loginId} readOnly // 아이디 칸은 읽기전용
                onChange={(e) => { setUpdateInput((prev) => ({ ...prev, loginId: e.target.value })); }}>
              </InputField>
            </TableDataCell>
          </tr>
          <tr>
            <TableHeaderCell>비밀번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
            <TableDataCell colSpan={3}>
              <Button onClick={updatePasswordHandler}>수정</Button>
            </TableDataCell>
          </tr>
          <tr>
            <TableHeaderCell>이름 <RequiredMark>*</RequiredMark></TableHeaderCell>
            <TableDataCell colSpan={3}>
              <InputField type="text" id="name" value={updateInput.name}
                onChange={(e) => { setUpdateInput((prev) => ({ ...prev, name: e.target.value })); }}>
              </InputField>
            </TableDataCell>
          </tr>
          <tr>
            <TableHeaderCell>성별 <RequiredMark>*</RequiredMark></TableHeaderCell>
            <TableDataCell colSpan={3}>
              <SelectBox name="sex" id="sex" value={updateInput.sex}
                onChange={(e) => { setUpdateInput((prev) => ({ ...prev, sex: e.target.value })); }}>
                <option value="" disabled>선택</option>
                <option value="1">남자</option>
                <option value="2">여자</option>
              </SelectBox>
            </TableDataCell>
          </tr>
          <tr>
            <TableHeaderCell>생년월일 <RequiredMark>*</RequiredMark></TableHeaderCell>
            <TableDataCell colSpan={3}>
              <InputField type="date" id="birthday" value={updateInput.birthday}
                onChange={(e) => { setUpdateInput((prev) => ({ ...prev, birthday: e.target.value })); }}>
              </InputField>
            </TableDataCell>
          </tr>
          <tr>
            <TableHeaderCell>전화번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
            <TableDataCell colSpan={3}>
              <InputField type="tel" id="phone" placeholder="숫자만 입력" value={updateInput.phone}
                onChange={(e) => { setUpdateInput((prev) => ({ ...prev, phone: e.target.value })); }}>
              </InputField>
            </TableDataCell>
          </tr>
          <tr>
            <TableHeaderCell>이메일 <RequiredMark>*</RequiredMark></TableHeaderCell>
            <TableDataCell colSpan={3}>
              <InputField type="email" id="email" placeholder="이메일@도메인 양식으로 입력" value={updateInput.email}
                onChange={(e) => { setUpdateInput((prev) => ({ ...prev, email: e.target.value })); }}>
              </InputField>
            </TableDataCell>
          </tr>
          { userType === 'B' && ( // userType: A면 개인회원, B면 기업회원, 즉 기업회원만 보이도록
            <tr>                  {/* bizIdx: 0이면 등록 1이상이면 수정 */}
              <TableHeaderCell>기업정보 <RequiredMark>*</RequiredMark></TableHeaderCell>
              <TableDataCell colSpan={3}>
                { bizIdx === 0 && ( <Button onClick={createBizHandler}>등록</Button> )}
                { bizIdx  >  0 && ( <Button onClick={updateBizHandler}>수정</Button> )}
              </TableDataCell>
            </tr>
          )}
          <tr>
            <TableHeaderCell>우편번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
            <TableDataCell colSpan={2}>
              <InputField type="text" id="zipCode" value={updateInput.zipCode}
                onChange={(e) => { setUpdateInput((prev) => ({ ...prev, zipCode: e.target.value })); }}>
              </InputField>
            </TableDataCell>
            <TableDataCell>
              <Button onClick={postcodeSearchHandler}>우편번호 찾기</Button>
            </TableDataCell>
          </tr>
          <tr>
            <TableHeaderCell>주소 <RequiredMark>*</RequiredMark></TableHeaderCell>
            <TableDataCell colSpan={3}>
              <InputField type="text" id="address" value={updateInput.address}
                onChange={(e) => { setUpdateInput((prev) => ({ ...prev, address: e.target.value })); }}>
              </InputField>
            </TableDataCell>
          </tr>
          <tr>
            <TableHeaderCell>상세주소</TableHeaderCell>
            <TableDataCell colSpan={3}>
              <InputField type="text" id="detailAddress" value={updateInput.detailAddress}
                onChange={(e) => { setUpdateInput((prev) => ({ ...prev, detailAddress: e.target.value })); }}>
              </InputField>
            </TableDataCell>
          </tr>
        </tbody>
      </Table>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <Button onClick={completeUpdateHandler}>수정</Button>
        <Button onClick={() => {}} style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}>취소</Button>
      </div>
      {updatePasswordModal !== false && (
        <MyPageUpdatePasswordModal/>
      )}
    </>
  );
}