import { Button } from "./styled";
import { withdrawModalState } from "../../../../stores/modalState";
import { MyPageWithdrawModal } from "../MyPageModal/MyPageWithdrawModal";
import { useRecoilState } from "recoil";

export const MyPageWithdrawMain = () => {
    const [withdrawModal, setWithdrawModal] = useRecoilState<boolean>(withdrawModalState);

    const withdrawHandler = () => {
        if (withdrawModal === false)
            setWithdrawModal(true);
    }

    return (
        <>
            사용하고 계신 아이디(세션ID)를 탈퇴할 경우 재사용 및 복구가 불가능합니다. <br></br>
            탈퇴 후 회원정보 및 개인형 서비스 이용기록은 모두 삭제됩니다. <br></br>
            안내 사항을 모두 확인하였으며, 이에 동의합니다. <br></br> <br></br>
            <Button onClick={withdrawHandler} style={{width: '100px'}}>확인</Button>
            {withdrawModal !== false && (
                <MyPageWithdrawModal/>
            )}
        </>
);
}