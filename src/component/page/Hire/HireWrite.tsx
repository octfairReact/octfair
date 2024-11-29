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
    } else {
      console.error("Failed to save notice:", save?.data);
    }
  };

  return (
    <>
      <br></br>
      <StyledTable>
        <thead>
          <tr>
            <th>채용제목</th>
            <td>
              <input type="text" ref={title} defaultValue={hireWrite?.title}></input>
            </td>
          </tr>
          <tr>
            <th>경력 여부</th>
            <td>
              <label style={{ display: "flex", gap: "16px" }}>
                {checkBox.map((checkbox) => (
                  <label key={checkbox.id}>
                    <input
                      type="checkbox"
                      checked={checkbox.checked}
                      onChange={() => handleCheckboxChange(checkbox.id)}
                    />
                    {checkbox.label}
                  </label>
                ))}
              </label>
            </td>
            <th>경력</th>
            <td>
              <select
                value={year}
                onChange={handleChange}
                ref={expYears}
                disabled={!checkBox.find((checkbox) => checkbox.id === 2 && checkbox.checked)}
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
            <th>급여</th>
            <td>
              <input type="text" ref={salary} defaultValue={hireWrite?.salary}></input>
            </td>
            <th>모집인원</th>
            <td>
              <input type="text" ref={openings} defaultValue={hireWrite?.openings}></input>
            </td>
          </tr>
          <tr>
            <th>근무지역</th>
            <td>
              <input type="text" ref={workLocation} defaultValue={hireWrite?.workLocation}></input>
            </td>
            <th>포지션 설명</th>
            <td>
              <input type="" ref={posDescription} defaultValue={hireWrite?.posDescription}></input>
            </td>
          </tr>
          <tr>
            <th>채용기간</th>
            <td>
              <Calendar label={"시작 날짜"} onDateChange={(date) => (startDate.current = date)}></Calendar>
            </td>
            <td>
              <Calendar label={"종료 날짜"} onDateChange={(date) => (endDate.current = date)}></Calendar>
            </td>
          </tr>
          <tr>
            <th>채용절차</th>
            <td>
              <input
                type="text"
                value={recruitProcess}
                onChange={(e) => setRecruitProcess(e.target.value)}
                placeholder="과정을 하나씩 적은 후 절차등록 버튼을 눌러주세요"
              ></input>
              <button onClick={handleClick}>절차등록</button>
              <button onClick={handleClickRefresh}>초기화</button>
              <input ref={hirProcess} type="hidden" /> {/* DOM 연결 */}
              <br />
              <label>{recruitProcessList.join(" - ")}</label>
            </td>
          </tr>
          <tr>
            <th>자격조건</th>
            <td>
              <input type="text" ref={reqQualifications} defaultValue={hireWrite?.reqQualifications}></input>
            </td>
          </tr>
          <tr>
            <th>우대사항</th>
            <td>
              <input type="text" ref={prefQualifications} defaultValue={hireWrite?.prefQualifications}></input>
            </td>
          </tr>
          <tr>
            <th>업무</th>
            <td>
              <input type="text" ref={duties} defaultValue={hireWrite?.duties}></input>
            </td>
          </tr>
          <tr>
            <th>혜택&복지</th>
            <td>
              <input type="text" ref={benefits} defaultValue={hireWrite?.benefits}></input>
            </td>
          </tr>
          <tr>
            <th>첨부파일</th>
            <input type="file" onChange={handleFilechange} />
          </tr>
        </thead>
      </StyledTable>
      <button onClick={handlerSaveFile}>등록</button>
    </>
  );
};

function onSuccess() {
  throw new Error("Function not implemented.");
}
function setStartDate(date: any) {
  throw new Error("Function not implemented.");
}

function setEndDate(date: any) {
  throw new Error("Function not implemented.");
}

function setIsChecked(checked: any) {
  throw new Error("Function not implemented.");
}

function sendDataToServer(checked: any) {
  throw new Error("Function not implemented.");
}
