import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Hire, ManagePost } from "../../../../api/api";
import { IAllDetail, ICompanyDetail, IPostDetail } from "../../../../models/interface/IPost";
import { postPostApi } from "../../../../api/postPostApi";
import { PostDetailStyled } from "./ManagePostPage";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { JobDetail } from "./JobDetail";
import { ContentBoxPost } from "../../../common/ContentBox/ContentBoxPost";
import { IPostResponse } from "../../../../models/interface/INotice";
import { CompanytDetail } from "./CompanytDetail";

export const PostDetail = () => {
  const location = useLocation();
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const { postIdx, bizIdx } = location.state || {};
  const [param, setParam] = useState<{ postIdx: string | number; bizIdx: string | number } | null>(null);
  const [CDetail, setCDetail] = useState<ICompanyDetail | null>(null);
  const [MDetail, setMDetail] = useState<IPostDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    if (postIdx && bizIdx) {
      setParam({ postIdx, bizIdx });

      fetchPostDetail();
    }
  }, [postIdx, bizIdx]);

  // API 요청 함수
  const fetchPostDetail = async () => {
    if (!postIdx || !bizIdx) return; // 유효하지 않으면 요청하지 않음

    setLoading(true); // 요청 전 로딩 시작
    const apiUrl = ManagePost.getpostDetail(postIdx, bizIdx);
    try {
      const response = await postPostApi<IAllDetail>(apiUrl, { postIdx, bizIdx });
      setCDetail(response.data.bizDetail);
      setMDetail(response.data.postDetail);
    } catch (error) {
      console.error("데이터 로드 중 오류 발생:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const handleBack = () => {
    navigate(-1); // -1은 이전 페이지로 이동
  };

  const statusUpdate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // data-status 값을 가져오기
    const appStatus = event.currentTarget.dataset.status;

    const param = { postIdx, appStatus };
    // status 값을 이용하여 처리
    const response = await postPostApi<IPostResponse>(ManagePost.statusUpdate, param);
    if (response.data.result === "success") {
      alert(`${appStatus}되었습니다.`);
      handleBack();
    }
  };
  const hireUpdate = (postIdx: number, bizIdx: number) => {
    navigate("/react/manage-hire/managehireWritePageUpdate.do", {
      state: { postIdx, bizIdx },
    });
  };

  const hireDelete = async () => {
    // data-status 값을 가져오기
    const param = { postIdx, bizIdx };

    // status 값을 이용하여 처리
    const response = await postPostApi<IPostResponse>(Hire.getDelete, param);
    console.log(response);
    if (response.data.result === "success") {
      alert("삭제 되었습니다.");
      handleBack();
    }
  };

  return (
    <PostDetailStyled>
      <ContentBoxPost>
        채용 상세정보
        {userInfo.loginId && userInfo.loginId === CDetail?.loginId && (
          <div className="action-buttons">
            {/* <button className="btn btn-outline-primary" onClick={()=>hireUpdate(postIdx,bizIdx)}>수정</button> */}
            <button className="btn btn-outline-danger" onClick={hireDelete}>
              삭제
            </button>
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
                {MDetail && CDetail && (
                  <CompanytDetail data={MDetail} Cdata={CDetail} postIdx={postIdx} bizIdx={bizIdx} />
                )}
              </aside>
            </div>
          </li>
        </ul>
      </div>
      <div className="date-item">
        {userInfo.userType === "M" && (
          <>
            <button type="button" className="btn btn-outline-secondary" data-status="승인" onClick={statusUpdate}>
              승인
            </button>
            <button type="button" className="btn btn-outline-secondary" data-status="불허" onClick={statusUpdate}>
              불허
            </button>
          </>
        )}
        <button type="button" id="backToList" name="btn" className="btn btn-close" onClick={handleBack}>
          뒤로 가기
        </button>
      </div>
    </PostDetailStyled>
  );
};
