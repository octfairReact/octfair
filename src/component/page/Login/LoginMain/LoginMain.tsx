import { useState } from "react";
import { ClickableLabel, LoginStyled, SearchIdPwContainer } from "./styled";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { loginInfoState } from "../../../../stores/userInfo";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import logo_img from "../../../../assets/logo_img.png";
import { signupModalState, searchIdPwModalState } from "../../../../stores/modalState";
import { SignupModal } from "../SignupModal/SignupModal";
import { SearchIdPwModal } from "../SearchIdPwModal/SearchIdPwModal";

export interface IAccount {
  lgn_Id: string;
  pwd: string;
}

export const LoginMain = () => {
  const setLoginInfo = useSetRecoilState<ILoginInfo>(loginInfoState);
  const [account, setAccount] = useState<IAccount>({
    lgn_Id: "",
    pwd: "",
  });
  const navigate = useNavigate();
  const [signupModal, setSignupModal] = useRecoilState<boolean>(signupModalState); // false(닫힘) 또는 true(열림)
  const [searchIdPwModal, setSearchIdPwModal] = useRecoilState<string>(searchIdPwModalState); // "close"(닫힘) 또는 "id"(아이디찾기 로 열림) 또는 "pw"(비밀번호찾기 로 열림) 또는 "pw2"(비밀번호재설정 로 열림)

  const loginHandler = () => {
    const param = new URLSearchParams();
    param.append("lgn_Id", account.lgn_Id);
    param.append("pwd", account.pwd);

    axios.post("/loginProc.do", param).then((res) => {
      const data = res.data;

      if (data.result === "SUCCESS") {
        setLoginInfo(data);
        sessionStorage.setItem("userInfo", JSON.stringify(data));
        navigate("/react");
      } else {
        alert("ID 혹은 비밀번호가 틀립니다");
        return;
      }
    });
  };

  // Enter키를 누를시 로그인 완료버튼 효과를 작동
  const completeEnterHandler = (event) => {
    if (event.key === "Enter") loginHandler();
  };

  // 회원가입 버튼 클릭시 회원가입 모달창 팝업
  const open_SignupModal_Handler = () => {
    if (signupModal === false) setSignupModal(true);
  };

  // 아이디/비밀번호 찾기 클릭시 찾기 모달창 팝업, 추가적으로 아이디/비밀번호 중 어떤걸 찾을지 prop할 대상을 지정
  const open_SearchIdModal_Handler = () => {
    if (searchIdPwModal === "close") setSearchIdPwModal("id");
  };

  // 아이디/비밀번호 찾기 클릭시 찾기 모달창 팝업, 추가적으로 아이디/비밀번호 중 어떤걸 찾을지 prop할 대상을 지정
  const open_SearchPwModal_Handler = () => {
    if (searchIdPwModal === "close") setSearchIdPwModal("pw");
  };

  // 모달창 닫기: 닫기/취소/외부클릭 등에 의해 작동
  const close_Modal_Handler = () => {
    if (signupModal !== false) setSignupModal(false);
    if (searchIdPwModal !== "close") setSearchIdPwModal("close");
  };

  // 모달 외부 클릭시 모달창닫기 수행
  const click_OutOf_Modal_Handler = (event) => {
    // if (event.target !== event.currentTarget)
    close_Modal_Handler();
    console.log(event.target);
    console.log(event.currentTarget);
  };

  return (
    <>
      <LoginStyled onKeyDown={completeEnterHandler}>
        <div className="login-container">
          <div>
            <div className="login-text">
              <div className="login-image">
                <img alt="" src={logo_img} />
              </div>
              <h3> 안되는 것이 실패가 아니라 포기하는 것이 실패다 </h3>
              <div>
                성공은 실패의 꼬리를 물고 온다.지금 포기한 것이 있는가 ?
                <br />
                그렇다면 다시 시작해 보자. <br />
                안되는 것이 실패가 아니라 포기하는 것이 실패다. <br />
                포기한 순간이 성공하기 5 분전이기 쉽다. <br />
                실패에서 더 많이 배운다. <br />
                실패를 반복해서 경험하면 실망하기 쉽다. <br />
                하지만 포기를 생각해선 안된다.실패는 언제나 중간역이지 종착역은 아니다. <br />
              </div>
              <div> -이대희, ‘1 % 의 가능성을 희망으로 바꾼 사람들’ 에서 </div>
            </div>
            <div className="login-box">
              <div className="buttons inputs">
                <div>
                  <label> 아이디 </label>
                  <input
                    required
                    onChange={(e) => {
                      setAccount((prev: IAccount) => {
                        return { ...prev, lgn_Id: e.target.value };
                      });
                    }}
                  />
                </div>
                <div>
                  <label> 비밀번호 </label>
                  <input
                    required
                    type="password"
                    onChange={(e) => {
                      setAccount((prev: IAccount) => {
                        return { ...prev, pwd: e.target.value };
                      });
                    }}
                  />
                </div>
                <div>
                  <button className="login-button" onClick={loginHandler}>
                    Login
                  </button>
                  <button className="signup-button" onClick={open_SignupModal_Handler}>
                    Sign Up
                  </button>
                  <SearchIdPwContainer>
                    <ClickableLabel onClick={open_SearchIdModal_Handler}>
                      아이디 찾기
                    </ClickableLabel>
                    <ClickableLabel onClick={open_SearchPwModal_Handler}>
                      비밀번호 찾기
                    </ClickableLabel>
                  </SearchIdPwContainer>
                  {signupModal !== false && <SignupModal onClose={close_Modal_Handler} />}
                  {searchIdPwModal !== "close" && <SearchIdPwModal onClose={close_Modal_Handler} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LoginStyled>
    </>
  );
};
