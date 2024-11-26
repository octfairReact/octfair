import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { updatePasswordModalState } from "../../../../stores/modalState";
import { MyPageUpdatePasswordModal } from "../MyPageModal/MyPageUpdatePasswordModal";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    // 페이지 로드시 로그인정보(RecoilState의 userInfo.loginId)를 기반으로 이름 등의 회원정보를 읽어온다.
    useEffect(() => {
        axios.get("/mypage/userDetail.do?loginId=" + userInfo.loginId)
            .then((res) => {
                let prevData = res.data.detail;
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
    }, [userInfo.loginId]);

    // Enter키를 누를시 완료버튼 효과를 작동
    const completeEnterHandler = (event) => {
        if (event.key === "Enter" 
            && updatePasswordModal === false)
            completeUpdateHandler();
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
                    alert(`'${key}'에 빈칸을 채워주세요!`);
                    isProblem = true;
                    return true; // 이 return값(true)는 'Object.values.some'반복문을 종료시킨다는 문법일뿐
                }
            }
            return false;
        });
        
        // 2. 양식검사: 입력창에 대하여 지켜야할 정규식패턴 검사
        const emailRules = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        const phoneRules = /^[0-9]([-]?[0-9])*$/;

        if (isProblem === false) {
            if (new Date(updateInput.birthday) > new Date()) {
                alert("생년월일은 미래의 날짜일 수 없습니다.");
                isProblem = true;
            } else if (!phoneRules.test(updateInput.phone)) {
                alert("전화번호는 숫자로 시작해야하며 중간에만 '-'를 쓰실수는 있습니다.");
                isProblem = true;
            } else if (!emailRules.test(updateInput.email)) {
                alert("이메일 형식을 확인해주세요. 숫자나 알파벳으로 시작해야하며 중간값으로 '-_.'를 넣으실 순 있습니다. 그리고 당연히 @와 메일 홈페이지까지도 작성하셔야 합니다.")
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

            axios.get("/mypage/updateUserInfo.do" + queryString)
            .then((res) => {
                if (res.data.result.toUpperCase() === "SUCCESS") {
                    alert("회원수정이 완료되었습니다!");
                } else {
                    alert("회원수정 실패, 담당자(유성찬)에게 문의하세요!");
                }
            })
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
            }
        };
    
        document.body.appendChild(script);
    
        return () => { document.body.removeChild(script); };
    }, []);

    // 기업 등록 버튼 누를시 기업등록 페이지로 이동
    const createBizHandler = () => {
        navigate("/react/company/companyWritePage.do");
    };

    // 기업 수정 버튼 누를시 기업수정 페이지로 이동
    const updateBizHandler = () => {
        navigate("/react/company/companyUpdatePage.do");
    };

    // 비밀번호 수정 버튼 누를시 비밀번호수정 관련 모달 팝업
    const updatePasswordHandler = () => {
        if (updatePasswordModal === false)
            setUpdatePasswordModal(true);
    }

    return (
        <>
            <Table onKeyDown={completeEnterHandler}>
                <TableCaption>회원가입</TableCaption>
                <tbody>
                    <tr>
                        <TableHeaderCell>아이디 <RequiredMark>*</RequiredMark></TableHeaderCell>
                        <TableDataCell colSpan={3}>
                            <InputField type="text" id="id" placeholder="숫자, 영문자 조합으로 6~20자리" value={userInfo.loginId} readOnly // 아이디 칸은 읽기전용
                                onChange={(e) => { setUpdateInput((prev) => ({ ...prev, loginId: e.target.value })); }}>
                            </InputField>
                        </TableDataCell>
                    </tr>
                    <tr>
                        <TableHeaderCell>비밀번호 <RequiredMark>*</RequiredMark></TableHeaderCell>
                        <Button onClick={updatePasswordHandler}>수정</Button>
                    </tr>
                    <tr>
                        <TableHeaderCell>이름 <RequiredMark>*</RequiredMark></TableHeaderCell>
                        <TableDataCell>
                            <InputField type="text" id="name" value={updateInput.name}
                                onChange={(e) => { setUpdateInput((prev) => ({ ...prev, name: e.target.value })); }}>
                            </InputField>
                        </TableDataCell>
                        <TableHeaderCell>성별 <RequiredMark>*</RequiredMark></TableHeaderCell>
                        <TableDataCell>
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
                    { bizIdx >= 0 && ( // bizIdx: 0이상이면 기업회원이기에 기업정보 칸 동적생성, 0이상 중에서도 0이면 등록 1이상이면 수정
                        <tr>
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