import {
    Button,
} from "./styled";
import { withdrawModalState } from "../../../../stores/modalState";
import { useRecoilState } from "recoil";
import { MyPageWithdrawModal } from '../MyPageModal/MyPageWithdrawModal';

export const MyPageWithdrawMain = () => {
const [withdrawModal, setWithdrawModal] = useRecoilState<boolean>(withdrawModalState);

const withdrawHandler = () => {
    if (withdrawModal === false)
        setWithdrawModal(true);
}

// 모달창 닫기: 닫기/취소/외부클릭 등에 의해 작동
const close_Modal_Handler = () => {
    if (withdrawModal !== false)
        setWithdrawModal(false);
};

    return (
        <>
            사용하고 계신 아이디(세션ID)를 탈퇴할 경우 재사용 및 복구가 불가능합니다. <br></br>
            탈퇴 후 회원정보 및 개인형 서비스 이용기록은 모두 삭제됩니다. <br></br>
            안내 사항을 모두 확인하였으며, 이에 동의합니다. <br></br>
            <Button onClick={withdrawHandler}>확인</Button>
            {withdrawModal !== false && (
                <MyPageWithdrawModal onClose={close_Modal_Handler} />
            )}
        </>
);
}