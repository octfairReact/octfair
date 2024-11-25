import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { MyPageWithdrawMain } from "../component/page/MyPage/MyPageMain/MyPageWithdrawMain";

export const MyPageWithdraw = () => {
  return (
    <>
      {/* <MyPageWithdrawProvider> */}
      <ContentBox>회원탈퇴</ContentBox>
      <MyPageWithdrawMain />
      {/* </MyPageWithdrawProvider> */}
    </>
  );
};
