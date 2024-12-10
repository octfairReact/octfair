import { CancelModalStyled } from "./Styled";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { useEscapeClose } from "../../../common/CustomHook/CustomHook";

interface CancelModalProps {
  appId: number;
  setCancelAppId: (appId) => void;
  postTitle: string;
  handlerCancel: (appId: number, postTitle: string) => void; // 취소 처리 함수
}

export const CancelModal = ({ appId, setCancelAppId, postTitle, handlerCancel }: CancelModalProps) => {
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  
  // ESC 키를 눌러 모달을 닫을 수 있는 커스텀 훅
  useEscapeClose(() => {setModal(false); setCancelAppId(undefined);});

  const confirmCancel = async () => {
    // 직접 확인을 위해 confirm 대화상자를 제거하고, 버튼 클릭으로 취소
    await handlerCancel(appId, postTitle);
    setModal(false);
    setCancelAppId(undefined);
  };

  return (
    <CancelModalStyled>
      <div className="modal-content">
        <h2>지원 내역 삭제</h2>
        <p>
          {`정말로 '`}
          <span className="highlight-title">{postTitle}</span>
          {`' 지원을 취소하시겠습니까?`}
        </p>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={() => {setModal(false); setCancelAppId(undefined);}}>닫기</button>
          <button className="delete-button" onClick={confirmCancel}>지원취소</button>
        </div>
      </div>
    </CancelModalStyled>
  );
};
