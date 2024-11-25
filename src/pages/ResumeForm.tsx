import { useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ResumeContext, ResumeProvider } from "../api/provider/ResumeProvicer";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ResumeBasic } from "../component/page/apply/ResumeDetail/ResumeBasic";
import { postResumeApi } from "../api/postResumeApi";
import { IResumeListResponse } from "../models/interface/IResume";
import { Resume } from "../api/api";
import { IResumeDetail, IDetailResponse } from "../models/interface/IResume";

export const ResumeForm = () => {
  const { resIdx } = useParams<{ resIdx: string }>();

  return (
    <ResumeProvider resIdx={resIdx ? parseInt(resIdx, 10) : undefined}>
      <ResumeContent />
    </ResumeProvider>
  );
};

const ResumeContent = () => {
  const { resIdx, resumeDetail, setResumeDetail } = useContext(ResumeContext);

  useEffect(() => {
    const fetchResumeDetail = async () => {
      if (resIdx) {
        try {
          const response = await postResumeApi<IDetailResponse>(Resume.getDetail, { resIdx });
          setResumeDetail(response.data.detail);
        } catch (error) {}
      }
    };
    fetchResumeDetail();
  }, [resIdx]);

  return (
    <div>
      <ContentBox>{resIdx ? "내 이력서 수정/작성" : "새 이력서 작성"}</ContentBox>
      <ResumeBasic />
      {/* <CareerList />
      <EduList />
      <SkillList />
      <CertificationList /> */}
    </div>
  );
};
