import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ManageApplicantMain } from "../component/page/manage-user/ManageUserMain/ManageApplicantMain";
import { ManageUserSearch } from "../component/page/manage-user/ManageUserSearch/ManageUserSearch";

export const ManageApplicant = () => {
  return (
    <>
      {/* <ManageApplicantProvider> */}
        <ContentBox>회원탈퇴</ContentBox>
        <ManageUserSearch />
        <ManageApplicantMain />
      {/* </ManageApplicantProvider> */}
    </>
  );
}