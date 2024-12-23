import { useLocation, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ResumeContext, ResumeProvider } from "../api/provider/ResumeProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ResumeBasic } from "../component/page/apply/ResumeDetail/ResumeBasic";
import { postResumeApi } from "../api/postResumeApi";
import { defaultResumeDetail, IResumeListResponse } from "../models/interface/IResume";
import { Resume } from "../api/api";
import { IResumeDetail, IDetailResponse } from "../models/interface/IResume";
import { useRecoilState } from "recoil";
import { loginInfoState } from "../stores/userInfo";
import { ILoginInfo } from "../models/interface/store/userInfo";
import { ReloadButton } from "../component/common/ContentBox/ReloadButton";

export const ResumeForm = () => {
  const { resIdx } = useParams<{ resIdx: string }>();
  // const location = useLocation();
  // const context = useContext(ResumeContext);
  // const resIdx = location.state?.resIdx || context.resIdx || 0;
  return (
    <ResumeProvider resIdx={resIdx ? parseInt(resIdx, 10) : undefined}>
      <ResumeContent />
    </ResumeProvider>
  );
};

const ResumeContent = () => {
  const { resIdx, resumeDetail, setResumeDetail } = useContext(ResumeContext);
  const location = useLocation();
  const createNewResumeDetail = location.state.resumeDetail || defaultResumeDetail;
  const createNewResume = location.state?.createNewResume || false;
  const moveDetail = location.state?.moveDetail || false;

  console.log("ResumeMain -> ResumeForm으로 받은 resumeDetail:", createNewResumeDetail);
  console.log("ResumeMain -> ResumeForm으로 받은 createNewResume:", createNewResume);

  if (createNewResume && createNewResumeDetail) {
    setResumeDetail(createNewResumeDetail); // createNewResume 상태일 경우 데이터 설정
  } else if (moveDetail) {
    setResumeDetail(resumeDetail);
  }

  return (
    <div>
      <ReloadButton></ReloadButton>
      <ContentBox>이력서 작성/수정</ContentBox>
      <ResumeBasic />
    </div>
  );
};
