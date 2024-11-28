import React, { FC, useState } from "react";
import { qnaPasswordModalState } from "../../../../stores/modalState";
import { useRecoilState } from "recoil";
import { QnaModalStyled } from "./styled";

interface QnaPasswordProps {
  onPasswordSubmit: (qnaPassword: string, qnaIdx: number) => void; // 비밀번호 제출 함수 프롭스
  qnaIdx: number | undefined;
}

export const QnaPassword: FC<QnaPasswordProps> = ({ onPasswordSubmit, qnaIdx }) => {
  const [passwordmodal, setPasswordModal] = useRecoilState<boolean>(qnaPasswordModalState);
  const [password, setPassword] = useState<string>(""); // 비밀번호 입력 상태
  const [index, setIndex] = useState<number>();

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value); // 비밀번호 상태 업데이트
  };

  const submitPassword = () => {
    onPasswordSubmit(password, qnaIdx); // 부모 컴포넌트로 비밀번호 전달
    setPasswordModal(!passwordmodal);
  };

  const handlerModal = () => {
    setPasswordModal(!passwordmodal);
  };

  return (
    <QnaModalStyled>
      <div id="passwordModal" className="modal-container" style={{ width: "300px" }}>
        <div className="modal-content">
          <div className="password">
            <strong>비밀번호 입력</strong>
            <div className="modal-overlay" onClick={handlerModal}>
              X
            </div>
          </div>
          <div className="passinput">
            <input
              type="password"
              id="passwordInput"
              name="passwordInput"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호"
              className="inputTxt p100"
            />
            <div className="btn_areaC mt30">
              <button onClick={submitPassword} className="btn blue">
                <span>확인</span>
              </button>
              <button onClick={handlerModal} className="btn gray">
                <span>취소</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </QnaModalStyled>
  );
};
