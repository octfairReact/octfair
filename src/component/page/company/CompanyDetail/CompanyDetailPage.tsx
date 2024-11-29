import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postCompanyApi } from "../../../../api/postCompany";
import { Company } from "../../../../api/api";
import { ICompanResponse, ICompanyDetail } from "../../../../models/interface/ICompany";
import { CompanyDetailStyled } from "./styled";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { useRecoilState } from "recoil";

export const CompanyDetailPage = () => {
  const { postIdx, bizIdx } = useParams();
  const [postDetail, setPostDetail] = useState<ICompanyDetail | null>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const navigate = useNavigate();

  useEffect(() => {
    if (postIdx && bizIdx) {
      searchCompanyDetail(Number(postIdx), Number(bizIdx));
    }
  }, [postIdx, bizIdx]);

  const searchCompanyDetail = async (postIdx: number, bizIdx: number) => {
    try {
      // postIdx와 bizIdx를 String으로 변환하여 API 호출
      const detail = await postCompanyApi<ICompanResponse>(Company.getDetail(postIdx, bizIdx), {});
      console.log("API Response", detail.data); // detail이 무엇인지 확인
      console.log("회사정보", detail.data.detail); // detail.data.detail에 접근
      setPostDetail(detail.data.detail); // 데이터를 상태에 저장
      const { fileExt, logicalPath } = detail.data.detail;
      console.log("데이터", detail.data.detail);
      if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
        setImageUrl(logicalPath);

        console.log("미리보기", logicalPath);
      } else {
        setImageUrl("");
      }
    } catch (error) {
      console.error("회사 상세 조회 실패", error);
    }
  };

  console.log("방문객 유저타입 확인", userInfo.userType);

  const goToManageHire = () => {
    const userType = userInfo.userType;

    if (userType === "B") {
      navigate(`/react/manage-hire/managehireDetail.do/${postIdx}/${bizIdx}`);
    } else if (userType === "M" || userType === "A") {
      navigate(`/react/manage-post/${postIdx}/${bizIdx}`);
    } else {
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <CompanyDetailStyled>
        {/* 전체 로딩 중 메시지 */}
        {!postDetail && (
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // 배경을 흐리게 처리
              fontSize: "24px", // 폰트 크기 키우기
              fontWeight: "bold",
              color: "#fff", // 글씨 색을 하얀색으로
              zIndex: "9999", // 다른 요소 위에 오도록 설정
              textAlign: "center", // 텍스트 가운데 정렬
              padding: "10px", // 약간의 패딩 추가
            }}
          >
            로딩 중...
          </div>
        )}
        {/* 기업 로고 테이블 */}
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
                    <div>로고를 등록해주세요</div>
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

            {postDetail ? (
              (() => {
                const {
                  bizName,
                  bizCeoName,
                  bizContact,
                  bizAddr,
                  bizEmpCount,
                  bizWebUrl,
                  bizFoundDate,
                  bizRevenue,
                  bizIntro,
                } = postDetail;

                return (
                  <>
                    <tbody>
                      <tr>
                        <td>{bizName}</td>
                        <td>{bizCeoName}</td>
                        <td>{bizContact}</td>
                        <td>{bizAddr}</td>
                      </tr>
                    </tbody>
                    <thead>
                      <tr>
                        <th scope="col">사원수</th>
                        <th scope="col">홈페이지 주소</th>
                        <th scope="col">설립일</th>
                        <th scope="col">매출액</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{bizEmpCount}</td>
                        <td>{bizWebUrl}</td>
                        <td>{bizFoundDate}</td>
                        <td>{bizRevenue}</td>
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
                        <td colSpan={4}>{bizIntro}</td>
                      </tr>
                    </tbody>
                  </>
                );
              })()
            ) : (
              <tbody>
                <tr></tr>
              </tbody>
            )}
          </table>
        </div>
      </CompanyDetailStyled>
      <div className="btn_area" style={{ textAlign: "right", marginTop: "10px" }}>
        <button onClick={goToManageHire}>기업 지원공고 확인하기</button>
      </div>
    </div>
  );
};
