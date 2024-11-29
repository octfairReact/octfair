import { ManageUserProvider } from "../api/provider/ManageUserProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ManageBizMain } from "../component/page/manage-user/ManageUserMain/ManageBizMain";
import { ManageUserSearch } from "../component/page/manage-user/ManageUserSearch/ManageUserSearch";

export const ManageBiz = () => {
  return (
    <>
      <ManageUserProvider>
        <ContentBox>기업회원관리</ContentBox>
        <ManageUserSearch />
        <ManageBizMain />
      </ManageUserProvider>
    </>
  );
}