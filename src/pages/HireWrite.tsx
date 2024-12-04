import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ReloadButton } from "../component/common/ContentBox/ReloadButton";
import { HireWrite } from "../component/page/Hire/HireWrite";

export const HireAdd = () => {
  return (
    <>
      <ReloadButton></ReloadButton>
      <ContentBox>공고 등록</ContentBox>
      <HireWrite />
    </>
  );
};
export { HireWrite };
