import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ReloadButton } from "../component/common/ContentBox/ReloadButton";
import { HireMain } from "../component/page/Hire/HireMain";

export const Hire = () => {
  return (
    <>
      <ReloadButton></ReloadButton>
      <ContentBox>공고 관리</ContentBox>
      <HireMain />
    </>
  );
};
