import { ContentBoxPost } from "../../component/common/ContentBox/ContentBoxPost";
import { CompanyUpdatePage } from "../../component/page/company/CompanyUpdatePage/CompanyUpdatePage";

export const CompanyUpdate = () => {
  return (
    <>
      <ContentBoxPost>기업 수정 및 삭제</ContentBoxPost>
      <CompanyUpdatePage />
    </>
  );
};
