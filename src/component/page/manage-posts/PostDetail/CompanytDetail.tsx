import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ManagePost } from "../../../../api/api";
import { AllDetail, companyDetail, IPostDetail } from "../../../../models/interface/IPost";
import { postPostApi } from "../../../../api/postPostApi";
import { PostDetailStyled } from "./ManagePostPage";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";

export const CompanytDetail = ({ data, Cdata }: { data: IPostDetail; Cdata: companyDetail }) => {
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
      <div className="company-info-content">
        <div className="align">
          <img src={Cdata.logicalPath} alt="Company Logo" width="150" height="150" />
        </div>
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
        <div className="align">
          <a href="#" className="company-info-link">
            기업정보→
          </a>
        </div>
        {data.fileName && (
          <p>
            <strong>첨부파일:</strong> <a href="#">{data.fileName}</a>
          </p>
        )}
        <div className="date">
          <span className="remaining">남은 기간</span>
          <div className="date-details">
            <div className="date-item">
              <span className="date-item">시작일</span>
              <br />
              <span className="date-item">마감일</span>
            </div>
            <div className="date-item">
              <span className="date-item">{data.startDate}</span>
              <span className="date-item">{data.endDate}</span>
            </div>
          </div>
        </div>
      </div>
    </PostDetailStyled>
  );
};
