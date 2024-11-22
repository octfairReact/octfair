import { useContext, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../stores/userInfo";
import { Hire } from "../../../api/api";
import { IPostResponse } from "../../../models/interface/INotice";
import { postHireApi } from "../../../api/postHireApi";
import { IHireWrite } from "../../../models/interface/IHire";
import { StyledInput, StyledTable, StyledTableHire, StyledTd, StyledTh } from "../../common/styled/StyledTable";
import Calendar from "../../Calendar";
import { ListFormat } from "typescript";


export const HireWrite = () => {
    const title = useRef<HTMLInputElement>();
    const salary = useRef<HTMLInputElement>();
    const openings = useRef<HTMLInputElement>();
    const workLocation = useRef<HTMLInputElement>();
    const posDescription = useRef<HTMLInputElement>();
    const endDate = useRef<HTMLInputElement>();
    const duties = useRef<HTMLInputElement>();
    const reqQualifications = useRef<HTMLInputElement>();
    const prefQualifications = useRef<HTMLInputElement>();
    const benefits = useRef<HTMLInputElement>();
    const hirProcess = useRef<HTMLInputElement>();

    const [hireWrite, setHireWrite] = useState<IHireWrite>();
    const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
    const [fileData, setFileData] = useState<File>();
    //경력기간 selectBox
    const [expYears, setExpYears] = useState("");
    const years = ["1년", "2년", "3년", "4년"];
    //모집기간
    const [startDate, setStartDate] = useState(null);
    const [finishDate, setFinishDate] = useState(null);

    // 초기값 리스트로 설정해서 입력할때 리스트 안에 push 하고 - 붙여주는 방식으로 코딩해보기
    //채용과정
    const [recruitProcessList, setRecruitProcessList] = useState([]);
    const [recruitProcess, setRecruitProcess] = useState('');
    
    const handleClick = () => { 
    const trimmedProcess = recruitProcess.trim(); //공백 제거
        if (trimmedProcess === '') return; //빈 값 방지
        setRecruitProcessList([...recruitProcessList, trimmedProcess]); //기존값 + 새로입력한값
        setRecruitProcess(''); //입력 필드 초기화

        }
    
    //채용과정 초기화 버튼
    const handleClickRefresh = () =>    { 
        setRecruitProcessList([]);
    }
    //경력기간 selectBox 클릭 이벤트
    const handleChange = (event) => { 
        setExpYears(event.target.value); // 선택된 값을 상태에 저장
      };
    
    // 시작 날짜 업데이트
    const handleStartDateChange = (date) => {
        setStartDate(date); 
      };
    // 끝나는 날짜 업데이트
    const handleEndDateChange = (date) => {
        setFinishDate(date); 
      };

    //체크박스
    const checkBoxData = [
        {id: 1, label: "신입", checked: false},
        {id: 2, label: "경력", checked: false},
        {id: 3, label: "경력무관", checked: false},
    ]
    const [checkBox, setCheckBox] = useState(checkBoxData);

    //체크박스 상태 변경
    const handleCheckboxChange = (id: number) => {
        setCheckBox((prevCheckBox) =>
        prevCheckBox.map(( checkBox ) =>
            checkBox.id === id
            ? {...checkBox, checked: !checkBox.checked}
            : checkBox))
    }
    
    //체크박스
    // const checkboxComponent = () => {
    //     const [isChecked, setIsChecked] = useState(false);
    // }
    // const handleCheckboxChange = (e) => {
    //     const checked = e.target.checked;
    //     setIsChecked(checked);
    //     sendDataToServer(checked); // 상태 변경 시 서버로 값 전송
    //   };

    const handlerSaveFile = async () => {
        const fileForm = new FormData();
        const textData = {
          title: title?.current.value,
         
          salary: salary?.current.value,
          openings: openings?.current.value,
          loginId: userInfo?.loginId,
        };
        fileData && fileForm.append("file", fileData);
        fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));
    
        const save = await postHireApi<IPostResponse>(Hire.postSave, fileForm);
        
        if (save && save.data.result === "success") {
        //   onSuccess();
        alert("성공");
        } else {
          console.error("Failed to save notice:", save?.data);
        }
        // axios.post(`/board/noticeSaveBody.do`, param).then((res: AxiosResponse<IPostResponse>) => {
        //   res.data.result === "success" && onSuccess();
        // });
      };
        
   
    return(
        <>
    
  
            <br></br>
            <StyledTableHire>
                <thead>
                    <tr>
                        <th>채용제목</th>
                        <td><input type="text" ref={title} defaultValue={hireWrite?.title}></input></td>
                    </tr>
                    <tr>
                        <th>경력 여부</th>
                            <td>
                            <div style={{display: "flex", gap: "16px"}}>
                                {checkBox.map((checkbox) => (
                                    <label key={checkbox.id}>
                                        <input  type="checkbox" 
                                                checked={checkbox.checked}
                                                onChange={() => handleCheckboxChange(checkbox.id)}/>
                                        {checkbox.label}
                                    </label>
                            ))}</div></td>
                        <th>경력</th>
                            <td>
                            <select value={expYears} onChange={handleChange} 
                            disabled={!checkBox.find((checkbox) => checkbox.id === 2 && checkbox.checked )}>
                                {years.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))}                               
                            </select>
                            </td>
                    </tr>
                    <tr>
                        <th>급여</th>
                        <td><input type="text" ref={salary} defaultValue={hireWrite?.salary}></input></td>           
                        <th>모집인원</th>
                        <td><input type="text" ref={openings} defaultValue={hireWrite?.openings}></input></td>
                    </tr>
                    <tr>
                        <th>근무지역</th>
                        <td><input type="text" ref={workLocation} defaultValue={hireWrite?.workLocation}></input></td>
                        <th>포지션 설명</th>
                        <td><input type="" ref={posDescription} defaultValue={hireWrite?.posDescription}></input></td>
                    </tr>
                    <tr>
                        <th>채용기간</th>
                        <td><Calendar label={"시작날짜"} onDateChange={handleStartDateChange}></Calendar></td>
                        <td><Calendar label={"끝나는날짜"} onDateChange={handleStartDateChange}></Calendar></td>
                    </tr>
                    <tr>
                        <th>채용절차</th>
                        <td>
                            <input type="text" value={recruitProcess} onChange={(e) => setRecruitProcess(e.target.value)}
                                   placeholder="과정을 하나씩 적은 후 절차등록 버튼을 눌러주세요"></input>
                            <button onClick={handleClick}>절차등록</button>
                            <button onClick={handleClickRefresh}>초기화</button>
                            <div>
                                {recruitProcessList.join(' - ')}
                            </div>  
                        </td>                  
                    </tr>
                    <tr>
                        <th>자격조건</th>
                        <td><input type="text" ref={reqQualifications} defaultValue={hireWrite?.reqQualifications}></input></td>
                    </tr>
                    <tr>
                        <th>우대사항</th>
                        <td><input type="text" ref={prefQualifications} defaultValue={hireWrite?.prefQualifications}></input></td>
                    </tr>
                    <tr>
                        <th>업무</th>
                        <td><input type="text" ref={duties} defaultValue={hireWrite?.duties}></input></td>
                    </tr>
                    <tr>
                        <th>혜택&복지</th>
                        <td><input type="text" ref={benefits} defaultValue={hireWrite?.benefits}></input></td>
                    </tr>
                    <tr>
                        <th>첨부파일</th>
                        <td><button>파일선택</button></td>
                    </tr>

                    <div><button onClick={ handlerSaveFile }>등록</button></div>
                    


                </thead>
            </StyledTableHire>
            
         
            {/* <label>
                제목 :<input type="text" ref={title} defaultValue={hireWrite?.title}></input>
            </label>
            <label>
                급여 : <input type="text" ref={context} defaultValue={hireWrite?.salary}></input>
            </label> */}
             
        
        
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

