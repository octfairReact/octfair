import { ResumeProvider } from "../api/provider/ResumeProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ResumeMain } from "../component/page/apply/ReseumeMain/ResumeMain";

export const Resume = () => {
  return (
    <div>
      <ResumeProvider>
        <ContentBox>나의 이력서</ContentBox>
        <ResumeMain />
      </ResumeProvider>
    </div>
  );
};
