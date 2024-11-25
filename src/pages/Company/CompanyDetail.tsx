import { ContentBoxPost } from "../../component/common/ContentBox/ContentBoxPost";
import { CompanyDetailPage } from "../../component/page/company/CompanyDetail/CompanyDetailPage";

export const CompanyDetail = () => {
  return (
    <>
      <ContentBoxPost>기업 상세 조회</ContentBoxPost>
      <CompanyDetailPage />
    </>
  );
};
