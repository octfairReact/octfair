import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ManagePost, Posts } from "../../../../api/api";
import { postPostApi } from "../../../../api/postPostApi";
import { PostDetailStyled } from "./ManagePostPage";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { IScrap, IScrapResponse } from "../../../../models/interface/IScrap";
import { ApplyModalState } from "../../../../stores/modalState";
import { Portal } from "../../../common/portal/Portal";
import { ApplyModal } from "../applyModal/ApplyModal";
import { IAllDetail, IApplyStatus, ICompanyDetail, IPostDetail } from "../../../../models/interface/IPost";

export const JobDetail = ({ data, Cdata }: { data: IPostDetail; Cdata: ICompanyDetail }) => {
  const location = useLocation();
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const { postIdx, bizIdx } = location.state || {};
  const [param, setParam] = useState<{ postIdx: string | number; bizIdx: string | number } | null>(null);
  const [CDetail, setCDetail] = useState<ICompanyDetail>();
  const [MDetail, setMDetail] = useState<IPostDetail>();
  const [modal, setModal] = useRecoilState<boolean>(ApplyModalState);
  const [index, setIndex] = useState<number[]>();
  const [scrapResult, setScrapReslt] = useState<String>();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [applyId, setApplyId] = useState<number | null>(null);
  const [scrapId, setScrapId] = useState<number | null>(null);

  useEffect(() => {
    if (postIdx && bizIdx) {
      setParam({ postIdx, bizIdx });
    }

    fetchPostDetail();
  }, [postIdx, bizIdx]);

  useEffect(() => {
    // 컴포넌트가 렌더링되자마자 실행
    scrapIdDetail(); // 스크랩아이디
    applyDetail(); // 이력서 넣은 아이디 / deleteid
  }, [scrapId, applyId]); // 빈 배열로 설정하여 한 번만 실행

  const apiUrl = postIdx && bizIdx ? ManagePost.getpostDetail(postIdx, bizIdx) : "";

  const fetchPostDetail = async () => {
    const param = { postIdx, bizIdx };
    const response = await postPostApi<IAllDetail>(apiUrl, param);
    setCDetail(response.data.bizDetail);
    setMDetail(response.data.postDetail);
  };
  const handlerScrapSave = async () => {
    const loginId = userInfo.loginId;
    const saveParam = { postIdx, loginId };

    const response = await postPostApi<IScrapResponse>(Posts.getScrapSave, saveParam);
    if (response.data.result === "success") {
      setScrapReslt(response.data.result);
      alert("스크립 저장성공!!");
      scrapIdDetail();
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
    applyDetail();
    fetchPostDetail();
  };

  const applyDetail = async () => {
    const { loginId } = userInfo;
    const param = {
      postIdx,
      loginId,
    };

    const applySuatus = await postPostApi<IApplyStatus>(Posts.statusApplyBody, param);
    if (applySuatus.data.applyIdx != -1) {
      setDeleteId(applySuatus.data.applyDeleteStatus);
      setApplyId(applySuatus.data.applyIdx);
    } else {
      setApplyId(null);
    }
  };
  const scrapIdDetail = async () => {
    const { loginId } = userInfo;
    const param = { postIdx, loginId };

    const scrapIdValue = await postPostApi<IScrap>(Posts.scrapId, param);
    if (scrapIdValue.data.scrapIdx != -1) {
      setScrapId(scrapIdValue.data.scrapIdx);
    } else {
      setScrapId(null);
    }
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
                {scrapId != null ? (
                  <button type="button" className="btn btn-outline-secondary">
                    스크랩 완료
                  </button>
                ) : (
                  <button type="button" className="btn btn-outline-secondary" onClick={handlerScrapSave}>
                    스크랩
                  </button>
                )}
                {applyId != null ? (
                  <>
                    <button type="button" className="btn btn-warning">
                      입사지원완료
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => handlerModal(data.postIdx, data.bizIdx)}
                    >
                      입사지원
                    </button>
                  </>
                )}
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
