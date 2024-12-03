import { ChangeEvent, FC, useContext, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../stores/userInfo";
import { Hire } from "../../../api/api";
import { IPostResponse } from "../../../models/interface/INotice";
import { postHireApi } from "../../../api/postHireApi";
import { IHireWrite } from "../../../models/interface/IHire";
import { StyledTable, StyledTd, StyledTh } from "../../common/styled/StyledTable";
import Calendar from "../../Calendar";
import { StyledTableHire } from "../../common/styled/StyledTableHire";
import { useNavigate } from "react-router-dom";



export const HireWrite = () => {
  const title = useRef<HTMLInputElement>();
  const salary = useRef<HTMLInputElement>();
  const openings = useRef<HTMLInputElement>();
  const workLocation = useRef<HTMLInputElement>();
  const posDescription = useRef<HTMLInputElement>();
  const endDate = useRef<Date | null>(null);
  const startDate = useRef<Date | null>(null);
  const duties = useRef<HTMLInputElement>(null);
  const reqQualifications = useRef<HTMLInputElement>();
  const prefQualifications = useRef<HTMLInputElement>();
  const benefits = useRef<HTMLInputElement>();
  const hirProcess = useRef<HTMLInputElement>();
  const expRequired = useRef<string[]>([]);
  const expYears = useRef<HTMLSelectElement | null>(null);
  const [hireWrite, setHireWrite] = useState<IHireWrite>();
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [fileData, setFileData] = useState<File>();
  const navigate = useNavigate();

  //경력기간 selectBox
  const [year, setyear] = useState("");
  const years = ["1년", "2년", "3년", "4년"];

  // 초기값 리스트로 설정해서 입력할때 리스트 안에 push 하고 - 붙여주는 방식으로 코딩해보기
  //채용과정
  const [recruitProcessList, setRecruitProcessList] = useState([]);
  const [recruitProcess, setRecruitProcess] = useState("");

  //채용과정 등록 버튼
  const handleClick = () => {
    const trimmedProcess = recruitProcess.trim(); //공백 제거
    if (trimmedProcess === "") return; //빈 값 방지

    if (recruitProcessList.length >= 4) {
      alert("채용 절차는 최대 4단계까지만 가능합니다.");
      return;
    }
    setRecruitProcessList([...recruitProcessList, trimmedProcess]); //기존값 + 새로입력한값
    setRecruitProcess(""); //입력 필드 초기화
  };

  //채용과정 초기화 버튼
  const handleClickRefresh = () => {
    setRecruitProcessList([]);
  };
  const handleProcessSubmit = () => {
    const combineProcess = recruitProcessList.join(" - "); //부호 붙여서 단순 연결
    if (hirProcess.current) {
      hirProcess.current.value = combineProcess; //useRef로 참조한 DOM에 값 저장
    }
  };

  //경력기간 selectBox 클릭 이벤트
  const handleChange = (event) => {
    setyear(event.target.value); // 선택된 값을 상태에 저장
  };

  //급여 입력 필드에서 숫자만 허용
  const handleSalaryChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^\d*$/g.test(value)) { // 숫자만 허용
        salary.current!.value = value; // 값 저장
      } else {
        alert("급여는 숫자만 입력 가능합니다.");
        salary.current!.value = "";
      }
  };
  // 모집인원 입력 필드에서 숫자만 허용
  const handleOpeningsChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^\d*$/g.test(value)) { // 숫자만 허용
        openings.current!.value = value; // 값 저장
      } else {
        alert("모집 인원은 숫자만 입력 가능합니다.");
        openings.current!.value = "";
      }
  };


  // 날짜 데이터를 "yyyy-MM-dd HH" 형식으로 포맷
  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}`;
  };

  //체크박스
  const checkBoxData = [
    { id: 1, label: "신입", checked: false },
    { id: 2, label: "경력", checked: false },
    { id: 3, label: "경력무관", checked: false },
  ];
  const [checkBox, setCheckBox] = useState(checkBoxData);

  //체크박스 상태 변경
  const handleCheckboxChange = (id: number) => {
    setCheckBox((prevCheckBox) => {
      const updatedCheckBox = prevCheckBox.map((checkBox) =>
        checkBox.id === id ? { ...checkBox, checked: !checkBox.checked } : checkBox
      );

      const selectedValues = updatedCheckBox
        .filter((checkBox) => checkBox.checked) //선택된 항목만 추출
        .map((checkBox) => checkBox.label); //라벨값만 추출
      expRequired.current = selectedValues; //ref에 저장

      return updatedCheckBox; //수정된 상태를 반환
    });
  };

  //파일 선택 핸들러
  const handleFilechange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; //input에서 선택한 파일 정보
    setFileData(file); // 선택된 파일을 상태에 저장
  };


  const handlerSaveFile = async () => {
    // 입력 필드 검증
    if (!title.current?.value) {
      alert("채용 제목을 입력해주세요.");
      return;
    }
    if (!checkBox.some((checkbox) => checkbox.checked)) {
      alert("경력 여부를 선택해주세요.");
      return;
    }
    if (!salary.current?.value) {
      alert("급여를 입력해주세요.");
      return;
    }
    if (!openings.current?.value) {
      alert("모집 인원을 입력해주세요.");
      return;
    }
    if (!workLocation.current?.value) {
      alert("근무 지역을 입력해주세요.");
      return;
    }
    if (!posDescription.current?.value) {
      alert("포지션 설명을 입력해주세요.");
      return;
    }
    if (!startDate.current) {
      alert("시작 날짜를 선택해주세요.");
      return;
    }
    if (!endDate.current) {
      alert("종료 날짜를 선택해주세요.");
      return;
    }
    if (!recruitProcessList.length) {
      alert("채용 절차를 입력하고 등록 버튼을 눌러주세요.");
      return;
    }
    if (!reqQualifications.current?.value) {
      alert("자격 조건을 입력해주세요.");
      return;
    }
  

    const expRequiredString = expRequired.current.join(","); // 배열을 string으로 전환 예) "신입, 경력"
    handleProcessSubmit();
    const fileForm = new FormData();
    const textData = {
      title: title?.current.value,
      expRequired: expRequiredString,
      salary: salary?.current.value,
      expYears: year,
      openings: openings?.current.value,
      workLocation: workLocation?.current.value,
      posDescription: posDescription?.current.value,
      hirProcess: hirProcess.current ? hirProcess.current.value : "",
      startDate: startDate.current ? formatDate(startDate.current) : null,
      endDate: endDate.current ? formatDate(endDate.current) : null,
      reqQualifications: reqQualifications?.current.value,
      prefQualifications: prefQualifications?.current.value,
      duties: duties?.current.value,
      benefits: benefits?.current.value,
      loginId: userInfo?.loginId,
    };
    fileData && fileForm.append("file", fileData);
    fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));

    console.log(fileForm);
    console.log(textData);
    console.log("api 실행 전");

    const save = await postHireApi<IPostResponse>(Hire.postSave, fileForm);
    console.log("api 실행 후");
    console.log("save data : ", save);
    if (save && save.data.result === "success") {
      //onSuccess();
      alert("성공");
      handleBack();
    } else {
      console.error("Failed to save notice:", save?.data);
    }
  };
  const handleBack = () => {
    navigate(-1); // -1은 이전 페이지로 이동
  };

  return (
    <>
  <br />
  <StyledTableHire>
    <thead>
      <tr>
        <th>채용제목<span className="font_red">*</span></th>
        <td colSpan={3}>
          <input
            type="text"
            ref={title}
            defaultValue={hireWrite?.title}
            style={{ width: "100%", padding: "8px" }}
          />
        </td>
      </tr>
      <tr>
        <th>경력 여부<span className="font_red">*</span></th>
        <td>
          <div className="checkbox-group" style={{ display: "flex", gap: "8px" }}>
            {checkBox.map((checkbox) => (
              <label key={checkbox.id} style={{ display: "inline-flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={checkbox.checked}
                  onChange={() => handleCheckboxChange(checkbox.id)}
                />
                {checkbox.label}
              </label>
            ))}
          </div>
        </td>
        <th>경력</th>
        <td>
          <select
            value={year}
            onChange={handleChange}
            ref={expYears}
            disabled={!checkBox.find((checkbox) => checkbox.id === 2 && checkbox.checked)}
            style={{ width: "100%", padding: "8px" }}
          >
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </td>
      </tr>
      <tr>
        <th>급여<span className="font_red">*</span></th>
        <td>
          <input
            type="text"
            ref={salary}
            onChange={handleSalaryChange}
            defaultValue={hireWrite?.salary}
            style={{ width: "100%", padding: "8px" }}
          />
        </td>
        <th>모집인원<span className="font_red">*</span></th>
        <td>
          <input
            type="text"
            ref={openings}
            defaultValue={hireWrite?.openings}
            style={{ width: "100%", padding: "8px" }}
          />
        </td>
      </tr>
      <tr>
        <th>근무지역<span className="font_red">*</span></th>
        <td>
          <input
            type="text"
            ref={workLocation}
            defaultValue={hireWrite?.workLocation}
            style={{ width: "100%", padding: "8px" }}
          />
        </td>
        <th>포지션 설명<span className="font_red">*</span></th>
        <td>
          <input
            type="text"
            ref={posDescription}
            defaultValue={hireWrite?.posDescription}
            style={{ width: "100%", padding: "8px" }}
          />
        </td>
      </tr>
      <tr>
        <th>채용기간<span className="font_red">*</span></th>
        <td colSpan={3} className="date">
            <Calendar
              label="시작 날짜"
              onDateChange={(date) => (startDate.current = date)} 
            />
            <Calendar
              label="종료 날짜"
              onDateChange={(date) => (endDate.current = date)}
            />
        </td>
      </tr>
      <tr>
        <th>채용절차<span className="font_red">*</span></th>
        <td colSpan={3}>
          <div className="recruit-process-wrapper" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="text"
              value={recruitProcess}
              onChange={(e) => setRecruitProcess(e.target.value)}
              placeholder="과정을 하나씩 적은 후 절차등록 버튼을 눌러주세요"
              style={{ flex: 1, padding: "8px", width: "500px"}}
            />
            <button onClick={handleClick} style={{ padding: "8px 16px" }}>
              절차등록
            </button>
            <button onClick={handleClickRefresh} style={{ padding: "8px 16px" }}>
              초기화
            </button>
          </div>
          <label className="recruit-process-list" style={{ marginTop: "8px", display: "block" , width: "500px"}}>
            {recruitProcessList.join(" - ")}
          </label>
        </td>
      </tr>
      <tr>
        <th>자격조건<span className="font_red">*</span></th>
        <td colSpan={3}>
          <input
            type="text"
            ref={reqQualifications}
            defaultValue={hireWrite?.reqQualifications}
            style={{ width: "100%", padding: "8px" }}
          />
        </td>
      </tr>
      <tr>
        <th>우대사항</th>
        <td colSpan={3}>
          <input
            type="text"
            ref={prefQualifications}
            defaultValue={hireWrite?.prefQualifications}
            style={{ width: "100%", padding: "8px" }}
          />
        </td>
      </tr>
      <tr>
        <th>업무</th>
        <td colSpan={3}>
          <input
            type="text"
            ref={duties}
            defaultValue={hireWrite?.duties}
            style={{ width: "100%", padding: "8px" }}
          />
        </td>
      </tr>
      <tr>
        <th>혜택&복지</th>
        <td colSpan={3}>
          <input
            type="text"
            ref={benefits}
            defaultValue={hireWrite?.benefits}
            style={{ width: "100%", padding: "8px" }}
          />
        </td>
      </tr>
      <tr>
        <th>첨부파일</th>
        <td colSpan={3}>
          <input type="file" onChange={handleFilechange} style={{ padding: "8px" }} />
        </td>
      </tr>
    </thead>
  </StyledTableHire>
  <button onClick={handlerSaveFile} style={{ marginTop: "16px", padding: "12px 24px" }}>
    등록
  </button>
</>
  );
};
