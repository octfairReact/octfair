import { ChangeEvent, FC, useContext, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../stores/userInfo";
import { Hire, ManagePost } from "../../../api/api";
import { IPostResponse } from "../../../models/interface/INotice";
import { postHireApi } from "../../../api/postHireApi";
import { IHireWrite } from "../../../models/interface/IHire";
import { StyledTable, StyledTd, StyledTh } from "../../common/styled/StyledTable";
import Calendar from "../../Calendar";
import { StyledTableHire } from "../../common/styled/StyledTableHire";
import { useLocation, useNavigate } from "react-router-dom";
import { AllDetail, companyDetail, IPostDetail } from "../../../models/interface/IPost";
import { postPostApi } from "../../../api/postPostApi";
import { StyledButton } from "../../common/styled/StyledButton";
import { toast } from "react-toastify";



export const HireWrite = () => {
  const navigate = useNavigate();
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const startDate = useRef<Date | null>(null); //시작날짜
  const endDate = useRef<Date | null>(null);  //종료날짜
  const expRequired = useRef<string[]>([]);

  const inputRefs = useRef<{name:string, ref: HTMLInputElement | HTMLSelectElement}[]>([]); //참조 배열 초기화 useRef<HTMLInputElement> 
  const addToRefs = (name:string, el:HTMLInputElement | HTMLSelectElement) => {
      if(el && !inputRefs.current.find((ref) => ref.name === name)) {
        inputRefs.current.push({ name, ref: el });
      }
    };  
  
  const [hireWrite, setHireWrite] = useState<IHireWrite>();
  const [fileData, setFileData] = useState<File>();
  
  const location = useLocation();
  const { postIdx, bizIdx } = location.state || {};
  const [param, setParam] = useState<{ postIdx: string | number; bizIdx: string | number } | null>(null);
  const [MDetail, setMDetail] = useState<IPostDetail | null>(null);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setMDetail((prev) => ({ ...prev, [id]: value }));
  };

  //경력기간 selectBox
  const [year, setyear] = useState("");
  const years = ["1년", "2년", "3년", "4년"];

  // 초기값 리스트로 설정해서 입력할때 리스트 안에 push 하고 - 붙여주는 방식으로 코딩해보기
  //채용과정
  const [recruitProcessList, setRecruitProcessList] = useState([]);
  const [recruitProcess, setRecruitProcess] = useState("");


  useEffect(() => {
    if (postIdx && bizIdx) {
      setParam({ postIdx, bizIdx });
      fetchPostDetail();
    }
  }, [postIdx, bizIdx]);


  //채용과정 등록 버튼
  const handleClick = () => {
    const trimmedProcess = recruitProcess.trim(); //공백 제거
    if (trimmedProcess === "") return; //빈 값 방지

    if (recruitProcessList.length >= 4) {
      toast.warn("채용 절차는 최대 4단계까지만 가능합니다.");
      return;
    }
    setRecruitProcessList([...recruitProcessList, trimmedProcess]); //기존값 + 새로입력한값
    
     //입력 필드 초기화
     setRecruitProcess(""); // recruitProcess 상태를 초기화
     handleProcessSubmit();  // 추가: 초기화 시 ref도 업데이트
    
  };

//채용과정 초기화 버튼
const handleClickRefresh = () => {
  setRecruitProcessList([]);
  setRecruitProcess(""); // recruitProcess 상태를 초기화
  handleProcessSubmit();  // 추가: 초기화 시 ref도 업데이트
};

  //채용과정 처리 후 ref에 저장
  const handleProcessSubmit = () => {
    const combineProcess = recruitProcessList.join(" - "); //부호 붙여서 단순 연결
    const hirProcessInput = inputRefs.current.find(
      (input) => input.name === 'hirProcess'
    );
    if(hirProcessInput){
      hirProcessInput.ref.value = combineProcess;
    }

    // if (hirProcess.current) {
    //   hirProcess.current.value = combineProcess; //useRef로 참조한 DOM에 값 저장
    // }
  };

  //경력기간 selectBox 클릭 이벤트
  const handleChange = (event) => {
    setyear(event.target.value); // 선택된 값을 상태에 저장
  };

  // //급여 입력 필드에서 숫자만 허용
  const handleInputAlert = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const inputField = inputRefs.current.find(
        (input) => input.name === name
      )

      if(/^\d*$/g.test(value)){
        if(inputField) inputField.ref.value = value; 
      }
      else {
        toast.warn(`${name === 'salary' ? '급여는' : '모집인원은'} 숫자만 입력 가능합니다`)
        setTimeout(() => {
          if(inputField) inputField.ref.value = ""; //초기화
        }, 0);
      }
    }


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
  
      // expRequired 값 갱신
      expRequired.current = selectedValues; // expRequired에 체크된 값 저장
      
  // inputRefs에 체크박스 값 동기화
  const checkboxGroupRef = inputRefs.current.find((input) => input.name === "checkboxGroup");
    if (checkboxGroupRef?.ref) {
      (checkboxGroupRef.ref as HTMLInputElement).value = selectedValues.join(", ");
    }

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
    // input 요소 중 유효성 검사가 필요한 부분
    const reqiredFields = {
      title: "채용제목을", 
      salary: "급여를", 
      openings: "모집인원을", 
      workLocation: "근무지역을", 
      //hirProcess: "채용절차를", 
      posDescription: "포지션 설명을", 
      reqQualifications: "자격조건을"
      
    };

   
  // 필드를 순차적으로 검사
  for (const input of inputRefs.current) {
    if (reqiredFields[input.name] && !input.ref.value) {
      // 해당 필드가 비어있을 때만 알림을 띄움
      toast.warn(`"${reqiredFields[input.name]}" 입력해 주세요`);
      return;  // 알림을 띄운 후, 즉시 종료하여 다른 필드는 검사하지 않음
    }
  }

    if (!checkBox.some((checkbox) => checkbox.checked)) {
      toast.warn("경력 여부를 선택해주세요.");
      return;
    }
 
    if (!startDate.current) {
      toast.warn("시작 날짜를 선택해주세요.");
      return;
    }
    if (!endDate.current) {
      toast.warn("종료 날짜를 선택해주세요.");
      return;
    }
    if (recruitProcessList.length === 0) {
      toast.warn("채용 절차를 입력하고 등록 버튼을 눌러주세요.");
      return;
    }


    handleProcessSubmit();
    const fileForm = new FormData();
    // expRequired 배열을 문자열로 변환
    const expRequiredString = expRequired.current.join(", "); 
    const textData = {
      expRequired: expRequiredString,
      startDate: startDate.current ? formatDate(startDate.current) : null,
      endDate: endDate.current ? formatDate(endDate.current) : null,
      loginId: userInfo?.loginId,
    };

    //HTMLInputElement 값들 textData에 담기
    inputRefs.current.forEach(({name, ref}) => {
      if(ref){
        textData[name] = ref.value; //name 속성을 키로 사용
      }
    });

        // //HTMLInputElement 값들 textData에 담기
        // inputRefs.current.forEach((input) => {
        //   if(input && input.name){
        //     textData[input.name] = input.value; //name 속성을 키로 사용
        //   }
        // });

    fileData && fileForm.append("file", fileData);
    fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));

    const save = await postHireApi<IPostResponse>(Hire.postSave, fileForm);
    if (save && save.data.result === "success") {
        toast("성공");
        handleBack();
      } else {
      }
  };

  const handleBack = () => {
      navigate(-1); // -1은 이전 페이지로 이동
    };

  const fetchPostDetail = async () => {
      if (!postIdx || !bizIdx) return; // 유효하지 않으면 요청하지 않음
      const apiUrl = ManagePost.getpostDetail(postIdx, bizIdx);
      try {
        const response = await postPostApi<AllDetail>(apiUrl, { postIdx, bizIdx });
        setMDetail(response.data.postDetail);


      } catch (error) {
      } finally {
        // setLoading(false); // 로딩 종료
      }
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
            name="title"
            ref={(el) => addToRefs("title", el)}
            //placeholder="채용 제목을 입력하세요"
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
                  name={`checkbox-${checkbox.id}`}
                  ref={(el) => addToRefs("checkboxGroup", el)}
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
            name="expYears"
            ref={(el) => addToRefs("expYears", el)}
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
            name="salary"
            ref={(el) => addToRefs("salary", el)}
            onChange={handleInputAlert}
            placeholder="급여는 숫자만 입력 가능합니다"
            style={{ width: "100%", padding: "8px" }}
            onClick={() => handlerChange}
          />
        </td>
        <th>모집인원<span className="font_red">*</span></th>
        <td>
          <input
            type="text"
            name="openings"
            ref={(el) => addToRefs("openings", el)}
            onChange={handleInputAlert}
            placeholder="모집인원은 숫자만 입력 가능합니다"
            style={{ width: "100%", padding: "8px" }}

          />
        </td>
      </tr>
      <tr>
        <th>근무지역<span className="font_red">*</span></th>
        <td>
          <input
            type="text"
            name="workLocation"
            ref={(el) => addToRefs("workLocation", el)}
            //placeholder="근무지역을 입력하세요"
            style={{ width: "100%", padding: "8px" }}
          />
        </td>
        <th>포지션 설명<span className="font_red">*</span></th>
        <td>
          <input
            type="text"
            name="posDescription"
            ref={(el) => addToRefs("posDescription", el)}
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
               name="hirProcess"
              value={recruitProcess}
             ref={(el) => addToRefs("hirProcess", el)}
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
          <label className="recruit-process-list" style={{ marginTop: "8px", display: "block" }}>
            {recruitProcessList.join(" - ")}
          </label>
        </td>
      </tr>
      <tr>
        <th>자격조건<span className="font_red">*</span></th>
        <td colSpan={3}>
          <input
            type="text"
            name="reqQualifications"
            ref={(el) => addToRefs("reqQualifications", el)}
            //placeholder="자격조건을 입력하세요"
            style={{ width: "100%", padding: "8px" }}
          />
        </td>
      </tr>
      <tr>
        <th>우대사항</th>
        <td colSpan={3}>
          <input
            type="text"
            name="prefQualifications"
            ref={(el) => addToRefs("prefQualifications", el)}
            //placeholder="우대사항을 입력하세요"
            style={{ width: "100%", padding: "8px" }}
          />
        </td>
      </tr>
      <tr>
        <th>업무</th>
        <td colSpan={3}>
          <input
            type="text"
            name="duties"
            ref={(el) => addToRefs("duties", el)}
            //placeholder="업무내용을 입력하세요"
            style={{ width: "100%", padding: "8px" }}
          />
        </td>
      </tr>
      <tr>
        <th>혜택&복지</th>
        <td colSpan={3}>
          <input
            type="text"
            name="benefits"
            ref={(el) => addToRefs("benefits", el)}
            //placeholder="혜택 및 복지내용을 입력하세요"
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
  <StyledButton onClick={handlerSaveFile} style={{ marginTop: "16px", padding: "12px 24px" }}>
    등록
  </StyledButton>
</>
  );
};
