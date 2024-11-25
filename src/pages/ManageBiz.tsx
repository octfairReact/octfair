import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ManageBizMain } from "../component/page/manage-user/ManageUserMain/ManageBizMain";
import { ManageUserSearch } from "../component/page/manage-user/ManageUserSearch/ManageUserSearch";

export const ManageBiz = () => {
  return (
    <>
      {/* <ManageBizProvider> */}
        <ContentBox>회원탈퇴</ContentBox>
        <ManageUserSearch />
        <ManageBizMain />
      {/* </ManageBizProvider> */}
    </>
  );
}