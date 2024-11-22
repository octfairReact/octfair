import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ManagePost } from "../../../../api/api";
import { AllDetail, companyDetail, IPostDetail } from "../../../../models/interface/IPost";
import { postPostApi } from "../../../../api/postPostApi";
import { ManagePostPage } from "./../../../../pages/ManagePostPage";
import { PostDetailStyled } from "./ManagePostPage";

export const PostDetail = () => {
  const location = useLocation();
  const { postIdx, bizIdx } = location.state || {}; // state가 없을 경우 빈 객체로 기본값 설정
  const [param, setParam] = useState<{ postIdx: string | number; bizIdx: string | number } | null>(null); // param 상태 초기값 설정
  const [CDetail, setCDetail] = useState<companyDetail>();
  const [MDetail, setMDetail] = useState<IPostDetail>();

  // postIdx와 bizIdx가 설정되었을 때 param 상태를 설정
  useEffect(() => {
    if (postIdx && bizIdx) {
      setParam({ postIdx, bizIdx });
    }
    fetchPostDetail();
  }, [postIdx, bizIdx]);

  // API URL을 동적으로 생성
  const apiUrl = postIdx && bizIdx ? ManagePost.getpostDetail(postIdx, bizIdx) : "";

  const fetchPostDetail = async () => {
    const param = { postIdx, bizIdx };
    const response = await postPostApi<AllDetail>(apiUrl, param); // URL을 직접 전달
    console.log(response.data); // API 응답 처리
    setCDetail(response.data.bizDetail);
    setMDetail(response.data.postDetail);
  };

  return (
    <>
      <PostDetailStyled>
        {/* Main Content */}
        <div id="container">
          <li className="contents">
            <div className="conTitle"></div>

            {/* Job Details Section */}
            <div className="container1">
              <div className="job-details">{MDetail && CDetail && <JobDetails data={MDetail} Cdata={CDetail} />}</div>
              <aside className="company-info">
                {MDetail && CDetail && <CompanyInfo data={MDetail} Cdata={CDetail} postIdx={postIdx} bizIdx={bizIdx} />}
              </aside>
            </div>
          </li>
        </div>
      </PostDetailStyled>
    </>
  );
};

const JobDetails = ({ data, Cdata }: { data: IPostDetail; Cdata: companyDetail }) => {
  return (
    <PostDetailStyled>
      <div className="job-details-content">
        <h2>(주){Cdata.bizName}</h2>
        <h3>{data.title}</h3>
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

        {/* 조건부 렌더링 */}
        {data.duties && (
          <div className="detail-item full-width duties">
            <strong>업무:</strong> <br />
            &emsp;{data.duties}
          </div>
        )}
        {data.posDescription && (
          <div className="detail-item full-width duties">
            <strong>포지션 소개:</strong> <br />
            &emsp;{data.posDescription}
          </div>
        )}
        {data.prefQualifications && (
          <div className="detail-item full-width duties">
            <strong>자격요건:</strong> <br />
            &emsp;{data.prefQualifications}
          </div>
        )}
        {data.prefQualifications && (
          <div className="detail-item full-width duties">
            <strong>우대사항:</strong> <br />
            &emsp;{data.prefQualifications}
          </div>
        )}
        {data.benefits && (
          <div className="detail-item full-width duties">
            <strong>혜택 & 복지:</strong> <br />
            &emsp;{data.benefits}
          </div>
        )}
      </div>
    </PostDetailStyled>
  );
};

const CompanyInfo = ({
  data,
  Cdata,
  postIdx,
  bizIdx,
}: {
  data: IPostDetail;
  Cdata: companyDetail;
  postIdx: number;
  bizIdx: number;
}) => {
  const navigate = useNavigate();

  const companyDetail = () => {
    // postIdx와 bizIdx가 각각 존재하는지 확인
    if (postIdx) {
      if (bizIdx) {
        // 두 값이 모두 존재하면 navigate로 이동
        navigate(`/react/company/companyDetailPage.do/${postIdx}/${bizIdx}`);
      } else {
        // bizIdx가 없을 경우 처리 로직
        console.error("bizIdx 값이 없습니다.");
        alert("bizIdx 값이 없습니다.");
      }
    } else {
      // postIdx가 없을 경우 처리 로직
      console.error("postIdx 값이 없습니다.");
      alert("postIdx 값이 없습니다.");
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
        <button onClick={companyDetail}>기업 정보</button>
      </div>
      <p>
        <strong>첨부파일:</strong> <a href="#">{data.fileName}</a>
      </p>
      <p>
        <div className="date">
          <span className="remaining">남은 기간</span>
          <div className="date-details">
            <div className="date-item">
              <span className="date-item">
                시작일
                <br />
              </span>
              <span className="date-item">마감일</span>
            </div>
            <div className="date-item">
              <span className="date-item">{data.startDate}</span>
              <span className="date-item">{data.endDate}</span>
            </div>
          </div>
        </div>
      </p>
    </PostDetailStyled>
  );
};
