import { useEffect, useState } from "react";
import {
    ModalOverlay,
    ModalStyled,
    SignupTable,
    TableCaption,
    TableHeaderCell,
    TableDataCell,
    InputField,
    RequiredMark,
    Button,
} from "./styled";
import axios from "axios";
import { useRecoilState } from "recoil";
import { searchIdPwModalState } from "../../../../stores/modalState";

// 닫기버튼/액션도 부모(LoginMain)에서 생성된 SignupModal의 상태(0/1)를 참조/조절함
interface SearchIdPwModalProps {
    onClose: () => void;
}

// 회원가입 입력데이터 구조체/멤버변수
export interface Inputs {
    inputA: string; // 아이디찾기의 경우 이름, 비밀번호찾기의 경우 아이디가 입력됨
    inputB: string; // 이메일이 입력됨
}

export const SearchIdPwModal: React.FC<SearchIdPwModalProps> = ({ onClose, }) => {
    const [searchIdPwModal, setSearchIdPwModal] = useRecoilState<string>(searchIdPwModalState); // "close"(닫힘) 또는 "id"(아이디찾기 로 열림) 또는 "pw"(비밀번호찾기 로 열림) 또는 "pw2"(비밀번호재설정 로 열림)
    const [inputs, setInputs] = useState<Inputs>({ inputA: '', inputB: '', }); // 기본값
    const [saveId, setSaveId] = useState<string>(); // '비밀번호찾기'->'비밀번호재설정' 으로 넘어갈시에 '비밀번호재설정'에서 아이디를 입력받지않기에 '비밀번호찾기'에서 입력했던 아이디를 기억해놓는 것
    let title  = searchIdPwModal === "id" ? "아이디 찾기" : (searchIdPwModal === "pw" ? "비밀번호 찾기" : "비밀번호 변경");
    let input1 = searchIdPwModal === "id" ? "이름" : (searchIdPwModal === "pw" ? "아이디" : "변경할 비밀번호");
    let input2 = searchIdPwModal === "id" ? "이메일" : (searchIdPwModal === "pw" ? "이메일" : "비밀번호 재입력");
    let input1_type = searchIdPwModal === "id" ? "text" : (searchIdPwModal === "pw" ? "text" : "password");
    let input2_type = searchIdPwModal === "id" ? "email" : (searchIdPwModal === "pw" ? "email" : "password");

    // Enter키를 누를시 완료버튼 효과를 작동
    const completeEnterHandler = (event) => {
        if (event.key === "Enter")
            completeHandler ();
    }

    // 완료버튼 누를시 작동
    const completeHandler = () => {
        let isProblem = false;

        // 빈값검사
        if (!inputs.inputA || !inputs.inputB) {
            alert("빈칸을 채워주세요!")
            isProblem = true;
        }

        // 이메일형식에 맞지 않아도 서버랑 매칭하는 걸로 대체가능하긴 하나
        // 가능한 서버에 요청시키지 않는게 프론트의 역할
        const passwordRules = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        const emailRules = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if (!isProblem) {
            if (searchIdPwModal !== "pw2") {
                if (!emailRules.test(inputs.inputB)) {// .test()는 정규식패턴에 맞으면 true를 반환
                    alert("이메일 형식을 확인해주세요. 숫자나 알파벳으로 시작해야하며 중간값으로 '-_.'를 넣으실 순 있습니다. 그리고 당연히 @와 메일 홈페이지까지도 작성하셔야 합니다.")
                    isProblem = true;
                }
            } else {
                if (!passwordRules.test(inputs.inputA)) {
                    alert("비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다.");
                    isProblem = true;
                } else if (inputs.inputA !== inputs.inputB) {
                    alert("비밀번호와 비밀번호확인에 입력하신 값이 일치하지 않습니다.")
                    isProblem = true;
                }
            }
        }

        // 입력정보 문제없음! 서버로 매칭요청!
        if (isProblem === false) {
            const query: string[] = [];
            
            if (searchIdPwModal === "id") {
                query.push(`name=${inputs.inputA}`);
                query.push(`email=${inputs.inputB}`);
            } else if (searchIdPwModal === "pw") {
                query.push(`id=${inputs.inputA}`);
                query.push(`email=${inputs.inputB}`);
            } else {
                query.push(`id=${saveId}`);
                query.push(`pw=${encodeURIComponent(inputs.inputB)}`);
            }

            // 쿼리 앞에 '?' 붙이고 쿼리key/value쌍 사이마다 '&' 붙이기
            const queryString = query.length > 0 ? `?${query.join(`&`)}` : "";
            
            let serverApiAddress = "";
            if (searchIdPwModal === "id") {
                serverApiAddress = "/selectFindInfoId.do";
            } else if (searchIdPwModal === "pw") {
                serverApiAddress = "/selectFindInfoPw.do";
            } else {
                serverApiAddress = "/updateFindPw.do";
            }
            
            // 전송주소의 'board'와 같은 상위경로가 없는 이유는 Spring컨트롤러의 @RequestMapping에 분류토록 명시된 상위경로가 없기 때문
            // axios.post()가 아니라 axios.get()인 이유는 Spring컨트롤러가 @RequestBody가 아니라 @RequestParam이기 때문
            // navigate()가 아니라 axios인 이유는 navigate식 URL쿼리전송은 React페이지 내의 전송일때고, 서버로의 URL쿼리 전송은 axios
            axios.post(serverApiAddress + queryString)
            .then((res) => {
                if (res.data.result.toUpperCase() === "SUCCESS") {
                    if (searchIdPwModal === "id") {
                        alert("찾으시는 아이디는 " + res.data.id + "입니다.");
                        onClose();
                    } else if (searchIdPwModal === "pw") {
                        alert("확인되었습니다. 비밀번호를 변경해 주세요!");
                        setSaveId(inputs.inputA);
                        setSearchIdPwModal("pw2");
                        setInputs({ inputA: '', inputB: '' });
                    } else {
                        alert("비밀번호 변경이 완료되었습니다!");
                        onClose();
                    }
                } else {
                    alert("일치하는 정보가 존재하지 않습니다.");
                }
            })
        }
    }

    return (
        <>
            <ModalOverlay onMouseDown={onClose}>                        {/* <----- 모달 외부 클릭시 모달창닫기 수행 */}
                <ModalStyled onMouseDown={(e) => e.stopPropagation()} //{/* <----- 모달 내부 클릭엔 모달창닫기 방지 */}
                                style={{ backgroundColor: searchIdPwModal==="pw2" && 'cornsilk' }}> {/* <----- 비밀번호찾기->비밀번호변경으로 모달 변경시 배경색을 변경 */}
                    <SignupTable onKeyDown={completeEnterHandler}>
                        <TableCaption>{title}</TableCaption>
                        <tbody>
                            <tr>
                                <TableHeaderCell>{input1} <RequiredMark>*</RequiredMark></TableHeaderCell>
                                <TableDataCell colSpan={2}>
                                    <InputField type={input1_type} id="id" placeholder={`가입하신 ${input1}을 입력해주세요`} value={inputs.inputA}
                                        onChange={(e) => { setInputs((prev) => ({ ...prev, inputA: e.target.value })); }}>
                                    </InputField>
                                </TableDataCell>
                            </tr>
                            <tr>
                                <TableHeaderCell>{input2} <RequiredMark>*</RequiredMark></TableHeaderCell>
                                <TableDataCell colSpan={3}>
                                    <InputField type={input2_type} id="pwd" placeholder={`가입하신 ${input2}을 입력해주세요`} value={inputs.inputB}
                                        onChange={(e) => { setInputs((prev) => ({ ...prev, inputB: e.target.value })); }}>
                                    </InputField>
                                </TableDataCell>
                            </tr>
                        </tbody>
                    </SignupTable>
                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                        <Button onClick={completeHandler}>찾기</Button>
                        <Button onClick={onClose} style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}>취소</Button>
                    </div>
                </ModalStyled>
            </ModalOverlay>
        </>
    );
};
