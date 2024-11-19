import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ResumeNewWrite } from "../component/page/apply/ResumeNewWrite/ResumeNewWrite";

export const ResumeForm = () => {
  return (
    <div>
      <ContentBox>새 이력서 작성</ContentBox>
      <ResumeNewWrite />
    </div>
  );
};
