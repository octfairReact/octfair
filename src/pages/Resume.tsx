import { ResumeProvider } from "../api/provider/ResumeProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ReloadButton } from "../component/common/ContentBox/ReloadButton";
import { ResumeMain } from "../component/page/apply/ReseumeMain/ResumeMain";

export const Resume = () => {
  return (
    <div>
      <ResumeProvider>
        <ReloadButton></ReloadButton>
        <ContentBox>나의 이력서</ContentBox>
        <ResumeMain />
      </ResumeProvider>
    </div>
  );
};
