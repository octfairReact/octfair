import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postCompanyApi } from "../../../../api/postCompany";
import { Company } from "../../../../api/api";
import { IPostResponse } from "../../../../models/interface/INotice";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import "../../../../css/CompanyCss.css"; // CSS 파일 확장자 명시
import { CompanyWritePagStyled } from "./styled";
import { ContentBoxPost } from "../../../common/ContentBox/ContentBoxPost";
import { toast } from "react-toastify";
import { ICompany, ICompanyDetail } from "../../../../models/interface/ICompany";

export const CompanyWritePage = () => {
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileData, setFileData] = useState<File>();
  const [companyInfo, setCompanyInfo] = useState<ICompany>({
    bizName: "",
    bizCeoName: "",
    bizContact: "",
    bizAddr: "",
    bizEmpCount: "10명 이하",
    bizWebUrl: "",
    bizFoundDate: "",
    bizRevenue: "10억 이하",
    bizIntro: "",
    bizLogo: null, // 파일 객체로 null 초기화
  });

  const dataFieldName = {
    bizName: "기업명",
    bizCeoName: "기업 대표",
    bizContact: "기업 연락처",
    bizAddr: "기업 주소",
    bizEmpCount: "사원 수",
    bizWebUrl: "홈페이지 주소",
    bizFoundDate: "설립 일",
    bizRevenue: "매출액",
    bizIntro: "기업 소개",
    bizLogo: "기업 로고",
  };

  const navigate = useNavigate();

  // 세이브 함수
  const handlerSave = async (e: React.FormEvent) => {
    //e: React.FormEvent는 폼 이벤트(form event)에 대한 타입을 나타냅니다.
    e.preventDefault();

    let isProblem: boolean = false;

    Object.entries(companyInfo).some(([key, value]) => {
      if (!value || value.length <= 0) {
        // 'bizLogo'는 파일 업로드 필드이므로 빈 값 체크를 제외
        if (key !== "bizLogo") {
          toast.info(`'${dataFieldName[key]}'에 빈칸을 채워주세요!`);
          document.getElementById(key)?.focus();
          isProblem = true;
          return true; // 문제가 발생하면 더 이상 반복하지 않음
        }
      } else if (key === "bizContact") {
        let phone = companyInfo.bizContact.replace(/[^0-9]/g, ""); // 숫자만 남기기
        if (!/^\d+$/.test(phone)) {
          toast.warning("숫자만 입력 가능합니다.");
          document.getElementById("bizContactInput")?.focus();
          isProblem = true;
          return true;
        }

        // 전화번호 형식 자동 적용
        if (phone.length >= 3 && phone.length <= 7) {
          phone = phone.replace(/(\d{3})(\d{1,4})/, "$1-$2");
        } else if (phone.length >= 8) {
          phone = phone.replace(/(\d{3})(\d{3,4})(\d{0,4})/, "$1-$2-$3");
        }

        if (phone.length > 13) {
          phone = phone.substring(0, 13);
          setCompanyInfo((prev) => ({
            ...prev,
            bizContact: phone,
          }));
          isProblem = true;
          return true;
        }
      } else if (key === "bizAddr") {
        // 주소 유효성 검사 (특수문자 제외)
        if (!/^[\w\s가-힣\-]+$/.test(companyInfo.bizAddr)) {
          toast.warning("주소는 특수 문자를 포함하지 않는 형식으로 입력해주세요.");
          document.getElementById("bizAddrInput")?.focus();
          isProblem = true;
          return true;
        }
      } else if (key === "bizWebUrl") {
        // 홈페이지 URL 유효성 검사
        const urlPattern = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([\/?%&=]*)?$/;
        if (!urlPattern.test(companyInfo.bizWebUrl)) {
          toast.warning("홈페이지 주소는 올바른 URL 형식으로 입력해주세요.");
          document.getElementById("bizWebUrlInput")?.focus();
          isProblem = true;
          return true;
        }
      } else if (key === "bizFoundDate") {
        // 설립일 검사 (오늘보다 이전이어야 함)
        const inputDate = new Date(companyInfo.bizFoundDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (inputDate > today) {
          toast.warning("설립일은 오늘보다 이전이어야 합니다.");
          isProblem = true;
          return true;
        }
      }
    });

    if (isProblem) return;

    const fileForm = new FormData();
    const { loginId } = userInfo;
    const textData = {
      bizName: companyInfo.bizName,
      bizAddr: companyInfo.bizAddr,
      bizContact: companyInfo.bizContact,
      bizWebUrl: companyInfo.bizWebUrl,
      bizCeoName: companyInfo.bizCeoName,
      bizFoundDate: companyInfo.bizFoundDate,
      bizEmpCount: companyInfo.bizEmpCount,
      bizRevenue: companyInfo.bizRevenue,
      bizIntro: companyInfo.bizIntro,
      loginId: loginId,
    };
    fileData && fileForm.append("file", fileData);
    fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));

    const save = await postCompanyApi<IPostResponse>(Company.postSave, fileForm);
    if (save && save.data.result === "success") {
      navigate("/react/mypage/update.do");
    } else {
      console.error("Failed to save notice:", save?.data);
    }
  };

  //파일등록
  const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInfo = e.target.files;
    if (fileInfo?.length > 0) {
      const fileInfoSplit = fileInfo[0].name.split("."); // 파일 이름을 점(.)으로 분리하여 확장자 추출
      const fileExtension = fileInfoSplit[1].toLocaleLowerCase();
      const file = fileInfo[0]; // 첫 번째 파일

      if (fileExtension === "jpg" || fileExtension === "gif" || fileExtension === "png") {
        if (file.size <= 10 * 1024 * 1024) {
          setImageUrl(URL.createObjectURL(fileInfo[0])); // 이미지 미리보기 URL 생성
        } else {
          toast.warning("파일이 너무 큽니다. 10MB 이하로 업로드해 주세요.");
          setImageUrl(""); // 이미지 미리보기 URL 초기화
        }
      } else {
        setImageUrl(""); // 다른 확장자일 경우 미리보기 URL 초기화
        toast.warning("이미지 파일만 업로드 가능합니다.");
      }
      setFileData(fileInfo[0]); // 선택된 파일을 상태에 저장
    }
  };

  return (
    <div>
      <CompanyWritePagStyled>
        <ContentBoxPost>기업등록</ContentBoxPost>
        <form id="companySaveForm" onSubmit={handlerSave}>
          <div id="companyWriteSt" style={{ marginTop: "10px" }}>
            <div id="writeTable">
              <table className="col" style={{ border: "1px solid" }}>
                <colgroup>
                  <col width="120px" />
                  <col width="*" />
                  <col width="120px" />
                  <col width="*" />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">
                      기업명<span className="font_red">*</span>
                    </th>
                    <td>
                      <input
                        type="text"
                        className="inputTxt inputTable p100"
                        id="bizNameInput"
                        name="bizName"
                        value={companyInfo?.bizName}
                        onChange={(e) => {
                          setCompanyInfo((prev) => ({ ...prev, bizName: e.target.value }));
                        }}
                      ></input>
                    </td>
                    <th scope="col">
                      기업 대표<span className="font_red">*</span>
                    </th>
                    <td>
                      <input
                        type="text"
                        className="inputTxt inputTable p100"
                        id="bizCeoNameInput"
                        name="bizCeoName"
                        value={companyInfo?.bizCeoName}
                        onChange={(e) => {
                          setCompanyInfo((prev) => ({ ...prev, bizCeoName: e.target.value }));
                        }}
                      ></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="col">
                      기업 연락처<span className="font_red">*</span>
                    </th>
                    <td>
                      <input
                        type="text"
                        className="inputTxt inputTable p100"
                        id="bizContactInput"
                        name="bizContact"
                        value={companyInfo?.bizContact}
                        placeholder="ex) 010-xxxx-xxxx 숫자만 입력 가능합니다."
                        onChange={(e) => {
                          setCompanyInfo((prev) => ({ ...prev, bizContact: e.target.value }));
                        }}
                      ></input>
                    </td>
                    <th scope="col">
                      기업 주소<span className="font_red">*</span>
                    </th>
                    <td>
                      <input
                        type="text"
                        className="inputTxt inputTable p100"
                        id="bizAddrInput"
                        name="bizAddr"
                        value={companyInfo?.bizAddr}
                        onChange={(e) => {
                          setCompanyInfo((prev) => ({ ...prev, bizAddr: e.target.value }));
                        }}
                      ></input>
                    </td>
                  </tr>
                  <tr>
                    <th scope="col">
                      사원 수<span className="font_red">*</span>
                    </th>
                    <td>
                      <select
                        id="bizEmpCountInput"
                        name="bizEmpCount"
                        className="inputTxt inputTable p100"
                        value={companyInfo?.bizEmpCount}
                        onChange={(e) => {
                          setCompanyInfo((prev) => ({ ...prev, bizEmpCount: e.target.value }));
                        }}
                      >
                        <option value="10명 이하">10명 이하</option>
                        <option value="50명 이하">50명 이하</option>
                        <option value="100명 이하">100명 이하</option>
                        <option value="1000명 이하">1000명 이하</option>
                        <option value="1000명 이상">1000명 이상</option>
                      </select>
                    </td>
                    <th scope="col">
                      홈페이지 주소<span className="font_red">*</span>
                    </th>
                    <td>
                      <input
                        type="text"
                        className="inputTxt inputTable p100"
                        id="bizWebUrlInput"
                        name="bizWebUrl"
                        value={companyInfo?.bizWebUrl}
                        placeholder="ex) www.example.com"
                        onChange={(e) => {
                          setCompanyInfo((prev) => ({ ...prev, bizWebUrl: e.target.value }));
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th scope="col">
                      설립일<span className="font_red">*</span>
                    </th>
                    <td>
                      <input
                        type="date"
                        className="inputTxt inputTable p100"
                        id="bizFoundDateInput"
                        name="bizFoundDate"
                        value={companyInfo?.bizFoundDate}
                        onChange={(e) => {
                          setCompanyInfo((prev) => ({ ...prev, bizFoundDate: e.target.value }));
                        }}
                      />
                    </td>
                    <th scope="col">
                      매출액<span className="font_red">*</span>
                    </th>
                    <td>
                      <select
                        id="bizRevenueInput"
                        name="bizRevenue"
                        className="inputTxt inputTable p100"
                        value={companyInfo?.bizRevenue}
                        onChange={(e) => {
                          setCompanyInfo((prev) => ({ ...prev, bizRevenue: e.target.value }));
                        }}
                      >
                        <option value="10억 이하">10억 이하</option>
                        <option value="100억 이하">100억 이하</option>
                        <option value="1000억 이하">1000억 이하</option>
                        <option value="1000억 이상">1000억 이상</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th scope="col">
                      기업 소개<span className="font_red">*</span>
                    </th>
                    <td colSpan={3}>
                      <textarea
                        className="inputTxt p100"
                        id="bizIntroInput"
                        name="bizIntro"
                        value={companyInfo?.bizIntro}
                        style={{ height: "200px" }}
                        placeholder="2000자 이내 입력해주세요"
                        onChange={(e) => {
                          setCompanyInfo((prev) => ({ ...prev, bizIntro: e.target.value }));
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th scope="col">
                      기업 로고<span className="font_red">*</span>
                    </th>
                    <td colSpan={3}>
                      <input
                        type="file"
                        className="inputTxt p100"
                        name="bizLogo"
                        id="fileInput"
                        style={{ display: "none" }}
                        onChange={handlerFile}
                      />
                      <label className="logo-label" htmlFor="fileInput">
                        로고 선택하기
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <th scope="col">미리보기</th>
                    <td colSpan={3}>
                      <div id="companyWritePreview">
                        {imageUrl ? (
                          <img src={imageUrl} alt="Preview" style={{ width: "100px", height: "100px" }} />
                        ) : (
                          <span></span> // 값이 없을 때 표시할 대체 내용
                        )}
                      </div>
                    </td>
                  </tr>
                </thead>
              </table>
              <div className="btn_areaC mt30">
                <button type="submit" className="btnType blue" id="btnCompanySave">
                  <span>등록</span>
                </button>
                <button type="button" className="btnType gray" onClick={() => navigate(-1)}>
                  <span>돌아가기</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </CompanyWritePagStyled>
    </div>
  );
};
