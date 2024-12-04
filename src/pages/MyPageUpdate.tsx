import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ReloadButton } from "../component/common/ContentBox/ReloadButton";
import { MyPageUpdateMain } from "../component/page/MyPage/MyPageMain/MyPageUpdateMain";

export const MyPageUpdate = () => {
  return (
    <>
      {/* <MyPageUpdateProvider> */}
      <ReloadButton></ReloadButton>
      <ContentBox>회원정보수정</ContentBox>
      <MyPageUpdateMain />
      {/* </MyPageUpdateProvider> */}
    </>
  );
};
