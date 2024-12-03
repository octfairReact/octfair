import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ReloadButton } from "../component/common/ContentBox/ReloadButton";
import { ApplicantMain } from "../component/page/Applicant/ApplicantMain";

export const Applicant = () => {
  return (
    <>
      <ReloadButton></ReloadButton>
      <ContentBox>지원자 관리</ContentBox>
      <ApplicantMain />
    </>
  );
};
