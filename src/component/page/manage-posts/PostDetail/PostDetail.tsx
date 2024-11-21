import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ManagePost } from "../../../../api/api";
import { AllDetail, companyDetail, IPostDetail } from "../../../../models/interface/IPost";
import { postPostApi } from "../../../../api/postPostApi";
import { PostDetailStyled } from "./ManagePostPage";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { JobDetail } from "./JobDetail";
import { CompanytDetail } from "./CompanytDetail";
import { ContentBoxPost } from "../../../common/ContentBox/ContentBoxPost";
import { IScrap } from "../../../../models/interface/IScrap";

export const PostDetail = () => {
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
    setCDetail(response.data.bizDetail);
    setMDetail(response.data.postDetail);
  };

  return (
    <PostDetailStyled>
      <ContentBoxPost>
        채용 상세정보
        {userInfo.loginId && userInfo.loginId === CDetail?.loginId && (
          <div className="action-buttons">
            <button className="btn btn-outline-primary">수정 </button>
            <button className="btn btn-outline-danger">삭제</button>
          </div>
        )}
      </ContentBoxPost>
      <div id="container">
        <ul>
          <li className="contents">
            <div className="conTitle"></div>
            <div className="container1">
              <div className="job-details">{MDetail && CDetail && <JobDetail data={MDetail} Cdata={CDetail} />}</div>
              <aside className="company-info">
                {MDetail && CDetail && <CompanytDetail data={MDetail} Cdata={CDetail} />}
              </aside>
            </div>
          </li>
        </ul>
      </div>
      <div className="date-item">
        <button type="button" id="updateAppStatusY" name="btn" className="btn btn-outline-secondary" data-status="승인">
          승인
        </button>
        <button type="button" id="updateAppStatusN" name="btn" className="btn btn-outline-secondary" data-status="불허">
          불허
        </button>

        <button type="button" id="backToList" name="btn" className="btn btn-close">
          뒤로 가기
        </button>
      </div>
    </PostDetailStyled>
  );
};
