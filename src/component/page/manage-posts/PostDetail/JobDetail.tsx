import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ManagePost, Posts } from "../../../../api/api";
import { AllDetail, ApplyDetailAll, companyDetail, IPostDetail } from "../../../../models/interface/IPost";
import { postPostApi } from "../../../../api/postPostApi";
import { PostDetailStyled } from "./ManagePostPage";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { IScrapResponse } from "../../../../models/interface/IScrap";
import { ApplyModalState } from "../../../../stores/modalState";
import { Portal } from "../../../common/portal/Portal";
import { ApplyModal } from "../applyModal/applyModal";

export const JobDetail = ({ data, Cdata }: { data: IPostDetail; Cdata: companyDetail }) => {
  const location = useLocation();
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const { postIdx, bizIdx } = location.state || {};
  const [param, setParam] = useState<{ postIdx: string | number; bizIdx: string | number } | null>(null);
  const [CDetail, setCDetail] = useState<companyDetail>();
  const [MDetail, setMDetail] = useState<IPostDetail>();
  const [modal, setModal] = useRecoilState<boolean>(ApplyModalState);
  const [index, setIndex] = useState<number[]>();

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
  const handlerScrapSave = async () => {
    const loginId = userInfo.loginId;
    const saveParam = { postIdx, loginId };

    const response = await postPostApi<IScrapResponse>(Posts.getScrapSave, saveParam);
    console.log(response.data);
    console.log("userInfo : " + userInfo.userType);
    if (response.data.result == "success") {
      alert("스크립 저장성공!!");
    } else {
      alert("이미 스크랩된 공고입니다.");
    }
  };

  const handlerModal = (postIdx: number, bizIdx: number) => {
    setModal(!modal);
    setIndex([postIdx, bizIdx]);
  };

  const onPostSuccess = () => {
    setModal(!modal);
    fetchPostDetail();
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
                <button type="button" className="btn btn-outline-secondary" onClick={handlerScrapSave}>
                  스크랩
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => handlerModal(data.postIdx, data.bizIdx)}
                >
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
      {modal && (
        <Portal>
          <ApplyModal onSuccess={onPostSuccess} indexGroup={index} />
        </Portal>
      )}
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
