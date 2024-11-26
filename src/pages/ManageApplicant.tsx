import { ManageUserProvider } from "../api/provider/ManageUserProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ManageApplicantMain } from "../component/page/manage-user/ManageUserMain/ManageApplicantMain";
import { ManageUserSearch } from "../component/page/manage-user/ManageUserSearch/ManageUserSearch";

export const ManageApplicant = () => {
  return (
    <>
      <ManageUserProvider>
        <ContentBox>개인회원관리</ContentBox>
        <ManageUserSearch />
        <ManageApplicantMain />
      </ManageUserProvider>
    </>
  );
}