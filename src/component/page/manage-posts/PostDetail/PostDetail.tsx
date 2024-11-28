import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Hire, ManagePost } from "../../../../api/api";
import { AllDetail, companyDetail, IPostDetail } from "../../../../models/interface/IPost";
import { postPostApi } from "../../../../api/postPostApi";
import { PostDetailStyled } from "./ManagePostPage";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { JobDetail } from "./JobDetail";
import { ContentBoxPost } from "../../../common/ContentBox/ContentBoxPost";
import { IScrap } from "../../../../models/interface/IScrap";
import { IPostResponse } from "../../../../models/interface/INotice";
import axios, { AxiosRequestConfig } from "axios";

export const PostDetail = () => {
  const location = useLocation();
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const { postIdx, bizIdx } = location.state || {};
  const [param, setParam] = useState<{ postIdx: string | number; bizIdx: string | number } | null>(null);
  const [CDetail, setCDetail] = useState<companyDetail | null>(null);
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
      const response = await postPostApi<AllDetail>(apiUrl, { postIdx, bizIdx });
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
    console.log(appStatus); // "승인"이 출력됩니다.

    const param = { postIdx, appStatus };
    // status 값을 이용하여 처리
    const response = await postPostApi<IPostResponse>(ManagePost.statusUpdate, param);
    console.log(response);
    if (response.data.result === "success") {
      alert(`${appStatus}되었습니다.`);
      handleBack();
    }
  };

  return (
    <PostDetailStyled>
      <ContentBoxPost>
        채용 상세정보
        {userInfo.loginId && userInfo.loginId === CDetail?.loginId && (
          <div className="action-buttons">
            <button className="btn btn-outline-primary">수정</button>
            <button className="btn btn-outline-danger">삭제</button>
          </div>
        )}
      </ContentBoxPost>
      <div id="container">
        <ul>
          <li className="contents">
            <div className="conTitle"></div>
            <div className="container1">
              <div className="job-details">
                {MDetail && CDetail && <JobDetail data={MDetail} Cdata={CDetail} />}
              </div>
              <aside className="company-info">
                {MDetail && CDetail && <CompanyInfo data={MDetail} Cdata={CDetail} postIdx={postIdx} bizIdx={bizIdx} />}
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

// 회사 정보 및 파일 다운로드 처리 컴포넌트
const CompanyInfo = ({
  data,
  Cdata,
  bizIdx,
  postIdx,
}: {
  data: IPostDetail;
  Cdata: companyDetail;
  bizIdx: string | number;
  postIdx: string | number;
}) => {
  const navigate = useNavigate();

  // 회사 상세 페이지로 이동
  const companyDetail = () => {
    navigate(`/react/company/companyDetailPage.do/${postIdx}/${bizIdx}`);
  };

  // 파일 다운로드 처리
  const downloadFile = async () => {
    const param = {
      bizIdx,
      postIdx,
    };

    const postAction: AxiosRequestConfig = {
      url: "/manage-hire/managehireDownloadBody.do",
      method: "post",
      data: param,
      responseType: "blob",
    };

    try {
      const response = await axios(postAction);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", data.fileName || "downloadedFile");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("파일 다운로드 중 오류 발생:", error);
    }
  };

  return (
    <PostDetailStyled>
      <div className="company-info-content">
        <img src={Cdata.logicalPath} alt="Company Logo" width="150" height="150" />
        <h4>기업 정보</h4>
        <p>
          <strong>기업명:</strong> {Cdata.bizName}
        </p>
        <p>
          <strong>연락처:</strong> {Cdata.bizContact}
        </p>
        <p>
          <strong>사원수:</strong> {Cdata.bizEmpCount}
        </p>
        <p>
          <strong>주소:</strong> {Cdata.bizAddr}
        </p>
        <p>
          <strong>대표명:</strong> {Cdata.bizCeoName}
        </p>
        <button onClick={companyDetail}>기업정보→</button>
      </div>
      <p>
        <strong>첨부파일:</strong> 
        <span className="download-link" onClick={downloadFile}>{data.fileName}</span>
      </p>
      <div className="date">
        <span className="remaining">남은 기간</span>
        <div className="date-details">
          <div className="date-item">
            <span>시작일</span>
            <span>마감일</span>
          </div>
          <div className="date-item">
            <span>{data.startDate}</span>
            <span>{data.endDate}</span>
          </div>
        </div>
      </div>
    </PostDetailStyled>
  );
};
