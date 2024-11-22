import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postCompanyApi } from "../../../../api/postCompany";
import { Company } from "../../../../api/api";
import { IPostResponse } from "../../../../models/interface/INotice";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import "../../../../css/CompanyCss.css"; // CSS 파일 확장자 명시
import { CompanyWritePagStyled } from "./styled";

export const CompanyWritePage = () => {
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

    // 전화번호 필드일 경우 포맷팅
    if (name === "bizContact") {
      const formattedPhone = formatPhoneNumber(value); // 전화번호 포맷 적용
      setCompanyInfo((prev) => ({
        ...prev,
        [name]: formattedPhone, // 형식이 맞춰진 전화번호로 상태 업데이트
      }));
    } else {
      setCompanyInfo((prev) => ({
        ...prev,
        [name]: value, // 다른 필드는 그대로 처리
      }));
    }
  };

  // 전화번호 유효성 검사
  const formatPhoneNumber = (phoneNumber: string) => {
    let phone = phoneNumber.replace(/[^0-9]/g, ""); // 숫자만 남기기

    // 숫자가 아닌 문자가 있을 경우 알림
    if (/[^0-9]/.test(phone)) {
      alert("숫자만 입력 가능합니다.");
    }

    // 처음 3자리가 허용된 번호인지 확인
    if (phone.length >= 3) {
      const prefix = phone.substring(0, 3);
      if (["010", "019", "011", "016", "017"].indexOf(prefix) === -1) {
        alert("정확한 전화번호를 입력해주세요.");
        setCompanyInfo((prev) => ({
          ...prev,
          bizContact: "", // 입력 필드 비우고 포커스
        }));
        return;
      }
    }

    // 휴대폰 번호 형식에 맞게 하이픈 추가
    if (phone.length >= 3 && phone.length <= 7) {
      phone = phone.replace(/(\d{3})(\d{1,4})/, "$1-$2");
    } else if (phone.length >= 8) {
      phone = phone.replace(/(\d{3})(\d{3,4})(\d{0,4})/, "$1-$2-$3");
    }

    // 13자리까지만 입력받기 (한국 기준)
    if (phone.length > 13) {
      phone = phone.substring(0, 13);
    }

    return phone; // 전화번호 반환
  };

  // 세이브 함수
  const handlerSave = async (e: React.FormEvent) => {
    //e: React.FormEvent는 폼 이벤트(form event)에 대한 타입을 나타냅니다.
    e.preventDefault();

    // 사업 명
    if (!companyInfo.bizName) {
      alert("사업자 명을 입력해주세요.");
      document.getElementById("bizNameInput")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    }
    // 사업자 대표
    if (!companyInfo.bizCeoName) {
      alert("사업자 대표를 입력해주세요.");
      document.getElementById("bizCeoNameInput")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    }
    //연락처
    if (!companyInfo.bizContact) {
      alert("대표 연락처를 입력해주세요.");
      document.getElementById("bizContactInput")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    }

    //주소
    if (!companyInfo.bizAddr) {
      alert("사업지 주소를 입력해주세요.");
      document.getElementById("bizAddrInput")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    } else {
      const bizAddr = companyInfo.bizAddr;
      const urlBizAddr = /^[\w\s가-힣]+$/;
      if (!urlBizAddr.test(bizAddr)) {
        alert("주소는 특수 문자를 포함하지 않는 형식으로 입력해주세요.");
        document.getElementById("bizAddrInput")?.focus();
        return; // 유효성 검사 실패 시 함수 종료
      }
    }
    // 홈페이지 URL 검사
    if (!companyInfo.bizWebUrl) {
      alert("홈페이지 주소를 입력해주세요.");
      document.getElementById("bizWebUrlInput")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    } else {
      // URL 형식 검사
      const bizWebUrl = companyInfo.bizWebUrl;
      const urlPattern = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([\/?%&=]*)?$/;
      if (!urlPattern.test(bizWebUrl)) {
        alert("홈페이지 주소는 올바른 URL 형식으로 입력해주세요.");
        document.getElementById("bizWebUrlInput")?.focus();
        return; // 유효성 검사 실패 시 함수 종료
      }
    }
    // 설립일 검사
    if (!companyInfo.bizFoundDate) {
      alert("설립일을 입력해주세요.");
      return; // 유효성 검사 실패 시 함수 종료
    } else {
      // 설립일이 오늘보다 미래인 경우
      const inputDate = new Date(companyInfo.bizFoundDate);
      const today = new Date();

      // 시간은 비교에서 제외하기 위해 00:00으로 설정
      today.setHours(0, 0, 0, 0);
      if (inputDate > today) {
        alert("설립일은 오늘보다 이전이어야 합니다.");
        return; // 유효성 검사 실패 시 함수 종료
      }
    }
    //기업소개
    if (!companyInfo.bizIntro) {
      alert("사업 소개를 적어주세요");
      document.getElementById("bizIntroInput")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    }
    //로고
    if (!fileData) {
      alert("로고를 등록해주세요.");
      return; // 유효성 검사 실패 시 함수 종료
    }

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
      <CompanyWritePagStyled>
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
                      사업자명<span className="font_red">*</span>
                    </th>
                    <td>
                      <input
                        type="text"
                        className="inputTxt inputTable p100"
                        id="bizNameInput"
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
                        id="bizCeoNameInput"
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
                        id="bizContactInput"
                        name="bizContact"
                        value={companyInfo.bizContact}
                        onChange={handleChange}
                        placeholder="ex) 010-xxxx-xxxx 숫자만 입력 가능합니다."
                      />
                    </td>
                    <th scope="col">
                      사업자 주소<span className="font_red">*</span>
                    </th>
                    <td>
                      <input
                        type="text"
                        className="inputTxt inputTable p100"
                        id="bizAddrInput"
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
                        id="bizEmpCountInput"
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
                        id="bizWebUrlInput"
                        name="bizWebUrl"
                        value={companyInfo.bizWebUrl}
                        onChange={handleChange}
                        placeholder="ex) example@example.com"
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
                        value={companyInfo.bizFoundDate}
                        onChange={handleChange}
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
                        id="bizIntroInput"
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
                <button type="button" className="btnType gray" onClick={() => navigate("/react/mypage/update.do")}>
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
