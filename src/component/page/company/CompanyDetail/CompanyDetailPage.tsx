import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postCompanyApi } from "../../../../api/postCompany";
import { Company } from "../../../../api/api";
import { ICompanResponse, ICompanyDetail } from "../../../../models/interface/ICompany";
import { CompanyDetailStyled } from "./styled";
import { ContentBoxPost } from "../../../common/ContentBox/ContentBoxPost";

export const CompanyDetailPage = () => {
  const { postIdx, bizIdx } = useParams();
  const [postDetail, setPostDetail] = useState<ICompanyDetail | null>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    if (postIdx && bizIdx) {
      searchCompanyDetail(Number(postIdx), Number(bizIdx));
    }
  }, [postIdx, bizIdx]);

  const searchCompanyDetail = async (postIdx: number, bizIdx: number) => {
    try {
      const detail = await postCompanyApi<ICompanResponse>(Company.getDetail(postIdx, bizIdx), {});
      setPostDetail(detail.data.detail); // 데이터를 상태에 저장
      const { fileExt, logicalPath } = detail.data.detail;
      if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
        setImageUrl(logicalPath);
      } else {
        setImageUrl("");
      }
    } catch (error) {
      //console.error("회사 상세 조회 실패", error);
    }
  };

  const goToManageHire = () => {
    navigate(-1); // 뒤로가기 "react-router-dom" 문서찾기;
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <ContentBoxPost>기업 상세 조회</ContentBoxPost>
      <CompanyDetailStyled>
        <div className="divComGrpCodList">
          <table className="col">
            <colgroup>
              <col width="25%" />
              <col width="25%" />
              <col width="25%" />
              <col width="25%" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" colSpan={4}>
                  기업로고
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {imageUrl ? (
                  <th colSpan={4}>
                    <div className="align">
                      <img src={imageUrl} alt="preview" />
                    </div>
                  </th>
                ) : (
                  <td>
                    <div>이미지가 없습니다.</div>
                  </td>
                )}
              </tr>
            </tbody>

            {/* 사업자 정보 테이블 */}
            <thead>
              <tr>
                <th scope="col">사업자명</th>
                <th scope="col">사업자 대표</th>
                <th scope="col">연락처</th>
                <th scope="col">사업자 주소</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{postDetail?.bizName}</td>
                <td>{postDetail?.bizCeoName}</td>
                <td>{postDetail?.bizContact}</td>
                <td>{postDetail?.bizAddr}</td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th scope="col">사원 수</th>
                <th scope="col">홈페이지 주소</th>
                <th scope="col">설립일</th>
                <th scope="col">매출액</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{postDetail?.bizEmpCount}</td>
                <td>{postDetail?.bizWebUrl}</td>
                <td>{postDetail?.bizFoundDate}</td>
                <td>{postDetail?.bizRevenue}</td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th scope="col" colSpan={4}>
                  기업소개
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4}>{postDetail?.bizIntro}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CompanyDetailStyled>
      <div className="btn_area" style={{ textAlign: "right", marginTop: "10px" }}>
        <button onClick={goToManageHire}>기업 지원공고 확인하기</button>
      </div>
    </div>
  );
};
