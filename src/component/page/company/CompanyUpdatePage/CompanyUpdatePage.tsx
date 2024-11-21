import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postCompanyApi } from "../../../../api/postCompany";
import { Company } from "../../../../api/api";
import { IPostResponse } from "../../../../models/interface/INotice";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import "../../../../css/CompanyCss.css"; // CSS 파일 확장자 명시

export const CompanyUpdatePage = () => {
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileData, setFileData] = useState<File>();
  const [companyInfo, setCompanyInfo] = useState({
    // 초기값 설정
    bizName: "",
    bizCeoName: "",
    bizContact: "",
    bizAddr: "",
    bizEmpCount: "10명 이하",
    bizWebUrl: "",
    bizFoundDate: "",
    bizRevenue: "10억 이하",
    bizIntro: "",
    bizLogo: null,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    // e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    // 핸들러 함수에서 전달받는 e (이벤트 객체)의 타입을 명시합니다
    const { name, value } = e.target;
    // 유효성 검사: value가 null, undefined, 또는 빈 문자열인지 확인
    if (value === null || value === undefined || value.trim() === "") {
      console.log(`${name}의 값이 유효하지 않습니다.`);
    }

    setCompanyInfo((prev) => ({
      ...prev, // 기존 상태를 복사
      [name]: value, // 해당 name 속성에 새로운 value를 할당
    }));
  };

  const handlerSave = async (e: React.FormEvent) => {
    //e: React.FormEvent는 폼 이벤트(form event)에 대한 타입을 나타냅니다.
    e.preventDefault();

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
      //bizLogo: companyInfo.bizLogo,
      loginId: loginId,
    };
    fileData && fileForm.append("file", fileData);
    fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));

    const save = await postCompanyApi<IPostResponse>(Company.postSave, fileForm);

    console.log("폼제출", fileForm);

    if (save && save.data.result === "success") {
      console.log("성공", "success");
      navigate("/react/mypage/update.do");
    } else {
      console.error("Failed to save notice:", save?.data);
    }
  };
  //  title: title.curren.value > title(dbname) : title.curren.value(프론트값)

  //파일등록
  const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInfo = e.target.files;
    console.log("파일 인포", fileInfo);

    if (fileInfo?.length > 0) {
      // 파일이 있다면
      const fileInfoSplit = fileInfo[0].name.split("."); // 파일 이름을 점(.)으로 분리하여 확장자 추출
      const fileExtension = fileInfoSplit[1].toLocaleLowerCase();

      //파일 확인용 콘솔
      const file = fileInfo[0]; // 첫 번째 파일

      console.log(file.name); // 파일 이름 (예: "example.jpg")
      console.log(file.size); // 파일 크기 (바이트 단위)
      console.log(file.type); // MIME 타입 (예: "image/jpeg" 또는 "image/png")

      if (fileExtension === "jpg" || fileExtension === "gif" || fileExtension === "png") {
        if (file.size <= 10 * 1024 * 1024) {
          // 10MB 이하로 제한
          setImageUrl(URL.createObjectURL(fileInfo[0])); // 이미지 미리보기 URL 생성
          console.log("미리보기", URL.createObjectURL(fileInfo[0]));
        } else {
          // 파일이 너무 크면 처리
          alert("파일이 너무 큽니다. 10MB 이하로 업로드해 주세요.");
          setImageUrl(""); // 이미지 미리보기 URL 초기화
        }
      } else {
        setImageUrl(""); // 다른 확장자일 경우 미리보기 URL 초기화
        alert("이미지 파일만 업로드 가능합니다.");
      }
      setFileData(fileInfo[0]); // 선택된 파일을 상태에 저장
    }
  };

  return (
    <div>
      <p className="conTitle">
        <span>기업등록</span>
      </p>
      <form id="companySaveForm" onSubmit={handlerSave}>
        <div id="companyWriteSt" style={{ marginTop: "10px" }}>
          <div id="writeTable">
            <table className="col" style={{ width: "1000px", border: "1px solid" }}>
              <colgroup>
                <col width="120px" />
                <col width="*" />
                <col width="120px" />
                <col width="*" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">
                    사업자명<span className="font_red">*</span>
                  </th>
                  <td>
                    <input
                      type="text"
                      className="inputTxt inputTable p100"
                      name="bizName"
                      value={companyInfo.bizName}
                      onChange={handleChange}
                    />
                  </td>
                  <th scope="col">
                    사업자 대표<span className="font_red">*</span>
                  </th>
                  <td>
                    <input
                      type="text"
                      className="inputTxt inputTable p100"
                      name="bizCeoName"
                      value={companyInfo.bizCeoName}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="col">
                    연락처<span className="font_red">*</span>
                  </th>
                  <td>
                    <input
                      type="text"
                      className="inputTxt inputTable p100"
                      name="bizContact"
                      value={companyInfo.bizContact}
                      onChange={handleChange}
                      placeholder="ex) 010-xxxx-xxxx"
                    />
                  </td>
                  <th scope="col">
                    사업자 주소<span className="font_red">*</span>
                  </th>
                  <td>
                    <input
                      type="text"
                      className="inputTxt inputTable p100"
                      name="bizAddr"
                      value={companyInfo.bizAddr}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="col">
                    사원수<span className="font_red">*</span>
                  </th>
                  <td>
                    <select
                      id="bizEmpCount"
                      name="bizEmpCount"
                      className="inputTxt inputTable p100"
                      value={companyInfo.bizEmpCount}
                      onChange={handleChange}
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
                      name="bizWebUrl"
                      value={companyInfo.bizWebUrl}
                      onChange={handleChange}
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
                      name="bizFoundDate"
                      value={companyInfo.bizFoundDate}
                      onChange={handleChange}
                    />
                  </td>
                  <th scope="col">
                    매출액<span className="font_red">*</span>
                  </th>
                  <td>
                    <select
                      id="bizRevenue"
                      name="bizRevenue"
                      className="inputTxt inputTable p100"
                      value={companyInfo.bizRevenue}
                      onChange={handleChange}
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
                    기업소개<span className="font_red">*</span>
                  </th>
                  <td colSpan={3}>
                    <textarea
                      className="inputTxt p100"
                      name="bizIntro"
                      value={companyInfo.bizIntro}
                      onChange={handleChange}
                      style={{ height: "200px" }}
                      placeholder="2000자 이내 입력해주세요"
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="col">
                    기업로고<span className="font_red">*</span>
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
                      {companyInfo.bizLogo && (
                        <img
                          // src={}
                          alt="Preview"
                          style={{ width: "100px", height: "100px" }}
                        />
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
              <button type="button" className="btnType gray" onClick={() => navigate("/react/mypage/update.do")}>
                <span>돌아가기</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
