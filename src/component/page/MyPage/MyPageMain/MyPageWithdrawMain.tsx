import { Button, CautionText, NoticeContainer } from "./styled";
import { withdrawModalState } from "../../../../stores/modalState";
import { MyPageWithdrawModal } from "../MyPageModal/MyPageWithdrawModal";
import { useRecoilState } from "recoil";

export const MyPageWithdrawMain = () => {
  const [withdrawModal, setWithdrawModal] = useRecoilState<boolean>(withdrawModalState);

  // 회원탈퇴 버튼 누를시 회원탈퇴 관련 모달 팝업
  const withdrawHandler = () => {
    if (withdrawModal === false)
      setWithdrawModal(true);
  }

  // ESC=닫기 작동
  const pressEscHandler = (event) => {
    if (event.key === "Escape")
      setWithdrawModal(false);
  };

  return (
    <>
      <div style={{ marginTop: '20px' }}></div>
      <>
        <NoticeContainer onKeyDown={pressEscHandler}>
          <CautionText> 사용하고 계신 아이디(세션ID)를 탈퇴할 경우 재사용 및 복구가 불가능합니다. </CautionText>
          <CautionText> 탈퇴 후 회원정보 및 개인형 서비스 이용기록은 모두 삭제됩니다. </CautionText>
          <CautionText> 안내 사항을 모두 확인하였으며, 이에 동의합니다. </CautionText>
          <Button onClick={withdrawHandler} style={{ width: '100px' }}>확인</Button>
        </NoticeContainer>
        {withdrawModal !== false && (
          <MyPageWithdrawModal/>
        )}
      </>
    </>
  );
}