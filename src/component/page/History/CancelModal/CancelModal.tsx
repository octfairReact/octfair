import { CancelModalStyled } from "./Styled";
import { useEscapeClose } from "../../../common/CustomHook/CustomHook";

interface CancelModalProps {
  appId: number;
  postTitle: string;
  closeModal: () => void; // 모달 닫기 함수
  handlerCancel: (appId: number, postTitle: string) => void; // 취소 처리 함수
}

export const CancelModal = ({ appId, postTitle, closeModal, handlerCancel }: CancelModalProps) => {
  // ESC 키로 모달 닫기 기능 활성화
  useEscapeClose(closeModal, true);

  const confirmCancel = async () => {
    // 직접 확인을 위해 confirm 대화상자를 제거하고, 버튼 클릭으로 취소
    await handlerCancel(appId, postTitle);
    closeModal(); // 모달 닫기
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
          <button className="cancel-button" onClick={closeModal}>닫기</button>
          <button className="delete-button" onClick={confirmCancel}>지원취소</button>
        </div>
      </div>
    </CancelModalStyled>
  );
};
