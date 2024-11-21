import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ManagePost } from "../../../../api/api";
import { AllDetail, companyDetail, IPostDetail } from "../../../../models/interface/IPost";
import { postPostApi } from "../../../../api/postPostApi";
import { PostDetailStyled } from "./ManagePostPage";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";

export const JobDetail = ({ data, Cdata }: { data: IPostDetail; Cdata: companyDetail }) => {
  const location = useLocation();
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const { postIdx, bizIdx } = location.state || {};
  const [param, setParam] = useState<{ postIdx: string | number; bizIdx: string | number } | null>(null);
  const [CDetail, setCDetail] = useState<companyDetail>();
  const [MDetail, setMDetail] = useState<IPostDetail>();

  useEffect(() => {
    if (postIdx && bizIdx) {
      setParam({ postIdx, bizIdx });
    }

    fetchPostDetail();
  }, [postIdx, bizIdx]);

  const apiUrl = postIdx && bizIdx ? ManagePost.getpostDetail(postIdx, bizIdx) : "";

  const fetchPostDetail = async () => {
    const param = { postIdx, bizIdx };
    const response = await postPostApi<AllDetail>(apiUrl, param);
    console.log(response.data);
    console.log("userInfo : " + userInfo.userType);
    setCDetail(response.data.bizDetail);
    setMDetail(response.data.postDetail);
  };

  return (
    <PostDetailStyled>
      <div className="job-details-content">
        <div className="grid-layout">
          <div className="detail-item">
            <h2>(주) {Cdata.bizName}</h2>
            <h3>{data.title}</h3>
          </div>
          <div className="detail-item action-buttons">
            {userInfo.userType === "A" && (
              <>
                <button type="button" className="btn btn-outline-secondary">
                  스크랩
                </button>
                <button type="button" className="btn btn-warning">
                  입사지원
                </button>
              </>
            )}
          </div>
          <p>
            <strong>경력:</strong> {data.expRequired}
          </p>
          <p>
            <strong>급여:</strong> 연봉 {data.salary}만원
          </p>
          <p>
            <strong>모집인원:</strong> {data.openings}명
          </p>
          <p>
            <strong>근무지역:</strong> {data.workLocation}
          </p>
          {data.duties && <DetailSection title="업무" content={data.duties} />}
          {data.posDescription && <DetailSection title="포지션 소개" content={data.posDescription} />}
          {data.prefQualifications && <DetailSection title="자격요건" content={data.prefQualifications} />}
          {data.benefits && <DetailSection title="혜택 & 복지" content={data.benefits} />}
        </div>
      </div>
    </PostDetailStyled>
  );
};

const DetailSection = ({ title, content }: { title: string; content: string }) => (
  <div className="detail-item full-width">
    <strong>{title}</strong>
    <br />
    &emsp;{content}
  </div>
);
