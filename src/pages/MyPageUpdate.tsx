import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { MyPageUpdateMain } from "../component/page/MyPage/MyPageMain/MyPageUpdateMain";

export const MyPageUpdate = () => {
  return (
    <>
      {/* <MyPageUpdateProvider> */}
      <ContentBox>회원정보수정</ContentBox>
      <MyPageUpdateMain />
      {/* </MyPageUpdateProvider> */}
    </>
  );
};
