import { ChangeEvent, useEffect, useState } from "react";
import { StyledContainer, StyledRow, StyledTable, StyledTd, StyledTh } from "../../common/styled/StyledTable";
import axios from "axios";
import { ILoginInfo } from "../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../stores/userInfo";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import { IApplicant, IApplicantListResponse, IApplicantPostResponse, IDetailBiz } from "../../../models/interface/IApplicant";
import { postApplicantApi } from "../../../api/postApplicant";
import { Applicant } from "../../../api/api";
import { PageNavigateStyled } from "../../common/pageNavigation/styled";
import { PageNavigate } from "../../common/pageNavigation/PageNavigate";
import { modalState } from "../../../stores/modalState";
import { HistoryModal } from "../History/HistoryModal/HistoryModal";
import { ApplicantPageNavigateStyled } from "../../common/pageNavigation/styledApplicant";
//import '../../../common/styled/Applicant.css';


export const ApplicantMain = () => {
    // const [applicants, setApplicants]  = useState([]);
    // const [companyList, setCompanyList] = useState([]);
    const [userInfo, setUserInfo] = useRecoilState<ILoginInfo>(loginInfoState);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [cPage, setCPage] = useState<number>();
    const [postIdxList, setPostIdxList] = useState<IDetailBiz[]>([]);
    const [applicantList, setApplicantList] = useState<IApplicant[]>([]); //초기화  
    
    const [process, setProcess] = useState<string[]>([]); //채용과정 옵션 리스트
    const [keyword, setKeyword]  = useState<string>("서류심사중"); 
   // const [keyword, setKeyword]  = useState<string>(process[0]); 

    const [count, setCount] = useState<number>(0); // 지원자 수
    const [selectedPostIdx, setSelectedPostIdx] = useState<number>();
    const [selectedTitle, setSelectedTitle] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    // 모달 상태 관리
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [resIdx, setResIdx] = useState<number | null>(null);
    
    useEffect(() => {
        getPostIndexList();
    }, [userInfo.loginId]);

    // useEffect(() => {
    //     const process = applicantList.flatMap((applicant) => applicant.hirProcess.split(" - "));
    //     setProcess(process);
    // }, [applicantList]);


    //지원자 목록 불러오기 -> selectBox 선택에 따라서
    useEffect(() => {
        if(selectedPostIdx){
            getApplicantList();
            setMessage(""); //메세지 초기화            
            // console.log("postIdx 잘 불러오는지 useEffect 에서 ------------------------------>" + selectedPostIdx);
        }       
    }, [selectedPostIdx, keyword]); //공고제목, 채용절차 상태 값 바뀔 때 마다 실행

    //지원자 목록 가져오기위한 postIdx 리스트 받아오기
    const getPostIndexList = async () => {
        const userParam = { loginId: userInfo.loginId, };
        console.log("아이디는 "+userInfo.loginId);

        //requestParam 형식 --> encoded
        // await axios.post(Applicant.getListBody + "?loginId=" + encodeURIComponent(userInfo.loginId))
        //             .then((res) => {
        //                 setApplicantList(res.data.MDetail);
        //                 console.log("if문 타는지")
        //             })

         const getList = await axios.post(Applicant.getPostIdx, userParam); //requestBody 형식
        //const getList = await postApplicantApi<IApplicantListResponse>(Applicant.getListBody, userParam); //왜 작동 안하는지 모르겠음 제네릭..?

        if( getList ){
            const initialPostIdx:number = getList.data.MDetail[3]?.postIdx;
            console.log("initialPostIdxpostIdx==========================>" ,initialPostIdx)
            setPostIdxList(getList.data.MDetail);
            setSelectedPostIdx(initialPostIdx); // 첫 번째 postIdx 선택  
            //setSelectedTitle(response.data.MDetail[0].title); // 첫 번째 title 선택  
            
        }        
    };

    
    
    //지원자 목록 가져오기
    const getApplicantList = async(page?: number) => {   
        const currentPage = page || cPage || 1; //페이지 기본 값 설정

        const param = {
            loginId: userInfo.loginId, 
            postIdx: selectedPostIdx, 
            keyword: keyword, 
            currentPage: currentPage.toString(), 
            pageSize: "3"};
        const getList = await postApplicantApi<IApplicantListResponse>(Applicant.gitListBody, param);
        
        if(getList.data.list && getList.data.list.length > 0) {
            //리스트가 있을 경우
            setApplicantList(getList.data.list);
            setCount(getList.data.count);
            setCPage(currentPage);
            setMessage(""); // 메시지 초기화
        }else {
            //리스트가 없을 경우
            setApplicantList([]);
            setCount(getList.data.count);
            setCPage(currentPage);
            setMessage("지원자가 없습니다")
            
        }
             
    }
    //loginId
    useEffect(() => {
         if (sessionStorage.getItem("userInfo")) {
           setUserInfo(JSON.parse(sessionStorage.getItem("userInfo")!));
           console.log(sessionStorage.getItem("userInfo"));       
         }
       }, []);
    
    useEffect(() => {
        if (selectedPostIdx) {
            const selectedApplicant = postIdxList.find(applicant => applicant.postIdx === selectedPostIdx);
            if (selectedApplicant) {
                setSelectedTitle(selectedApplicant.title); // 제목을 설정
            }
        }
        console.log("useEffect postIdx로 title 찾는:", postIdxList);
    }, [selectedPostIdx, applicantList]); // selectedPostIdx가 변경될 때마다 실행

    // 공고제목 selectBox에서 선택된 값 처리
    const handleTitleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectPost = Number(e.target.value);
        setSelectedPostIdx(selectPost); // postIdx 업데이트
        console.log("핸들러 체인지 시작:", postIdxList);
    };
    // 채용절차 selectBox 선택된 값 처리
    const handleKeywordSelectChange = async (e: ChangeEvent<HTMLSelectElement>) => {
        const selectKeyword = e.target.value;
        setKeyword(selectKeyword);
    };

    


    //이력서 조회 버튼
    const handlerModal = async (loginId: string, resIdx: number) => {
        if (!modal) {
            setModal(true);
            //setIndex(appId);
            setResIdx(resIdx);
        }
        const param = {loginId: loginId, postIdx: selectedPostIdx}
        const viewChange = await postApplicantApi<IApplicantPostResponse>(Applicant.viewUpdate, param);

        if(viewChange && viewChange.data.result === "success"){
            await getApplicantList();
        }else{
            console.error("Failed to viewUpdate:", viewChange?.data);
        }
    }

    // //합격,불합격 버튼
    // const handleStatusChange = async(status: string, loginId: string, drop?: string) => {
    //     const currentIndex = process.indexOf(keyword); //현재 keyword의 인덱스 확인  status를 넣을지?
    //     if(currentIndex === -1 || currentIndex >= process.length -1){
    //         alert("더이상 진행할 수 없습니다");
    //         return;
    //     }else if(drop == '탈락'){
    //         setKeyword('탈락');
    //     }

    //     setKeyword(process[currentIndex + 1]); // 다음 채용단계

    //     const param = {keyword, postIdx: selectedPostIdx, loginId: loginId }
    //     const statusChange = await postApplicantApi<IApplicantPostResponse>(Applicant.statusUpdate, param);

    //     if(statusChange && statusChange.data.result ==="success"){
    //         alert("성공");
           
    //         await getApplicantList();
    //     }else{
    //         console.error("Failed to statusUpdate:", statusChange?.data);
    //     }
    // }

    const handleStatusChange = async (status: string, loginId: string, drop?: string) => {   
        console.log("상태 업데이트 핸들러 파람 ==========================>" +status);
        console.log("상태 업데이트 핸들러 로그인 아이디 파람 ==========================>" +loginId);
        //현재 상태에 따른 다음 상태 결정
        let nextKeyword = ""; //다음 상태를 지정할 변수
        if(status === '서류심사중' && drop === '탈락'){
            nextKeyword = '서류탈락';
            }else if(status === '서류심사중' && !drop){
                nextKeyword = '면접진행중'
            }
            else if(status === '면접진행중' && drop === '탈락'){
                nextKeyword = '면접탈락'
            }else if (status === '면접진행중' && !drop){
                nextKeyword = '최종합격';
            }

            
        

        console.log("상태 업데이트 ============================================>" + nextKeyword);
        const param = {keyword: nextKeyword, postIdx: selectedPostIdx, loginId: loginId }
        const statusChange = await postApplicantApi<IApplicantPostResponse>(Applicant.statusUpdate, param);

        if(statusChange && statusChange.data.result ==="success"){
            alert("성공");
           
            await getApplicantList();
        }else{
            console.error("Failed to statusUpdate:", statusChange?.data);
        }

    }

    

return(
    <>
    <br/>
        <div style={{ display: "flex", alignItems: "center" ,justifyContent: "space-between", width: "100%"}}>
            <div style={{ marginRight: "20px"}}>
                <h2>{selectedTitle}</h2>
            </div>
            <div>
            <select value={selectedPostIdx} onChange={handleTitleSelectChange}>
                {postIdxList && postIdxList.length > 0 ? (
                    postIdxList.map((applicant) => (
                        <option key={applicant.postIdx} value={applicant.postIdx} >{applicant.title}</option>
                    ))
                ) : ( 
                        <option disabled> 데이터가 없습니다</option>
                )}
            </select>
            
            {/* <select value={keyword} onChange={handleKeywordSelectChange}>
                {process.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                    ))}
                    <option value={"탈락"}>탈락</option>

            </select> */}
            
            {/* const statusOptions = status.split(" - "); */}
            <select value={keyword} onChange={handleKeywordSelectChange}>
                <option value={"서류심사중"}>서류심사중</option>
                <option value={"면접진행중"}>면접진행중</option>
                <option value={"최종합격"}>최종합격</option>
                <option value={"탈락"}>탈락</option>
            </select>
            </div>
            
        </div>
        
        <div className="MainContent">
            <div>
                <h4>지원자 {count}명</h4>
            </div>
            <div>
            
            <StyledContainer>
            {message && <span>{message}</span>}    
                {applicantList.map((applicant) => (
                    <StyledRow key={applicant.appId}>
                    {/* 왼쪽: 지원자 이름 및 이력서 제목 */}
                    <div className="left">
                    
                        <span>{applicant.name}</span>
                        <span>{applicant.resTitle}</span>
                    </div>

                    {/* 중앙: 이메일, 전화번호, 학교 이름 */}
                    <div className="center">
                        <span>이메일: {applicant.email}</span>
                        <span>전화번호: {applicant.phone}</span>
                        <span>학교 이름: {applicant.schoolName}</span>
                    </div>

                    {/* 오른쪽: 버튼들 */}
                    <div className="right">
                        <button onClick={() => handlerModal(applicant.loginId, applicant.resIdx)}>지원자 이력서 보기</button>
                        {applicant.viewed === 1 && !applicant.status.includes("탈락") && ( // 이력서 조회해야 viewed가 1로 변하고 합/불 버튼이 활성화
                            <div className="decision-buttons">                  
                                <button onClick={() => handleStatusChange(applicant.status, applicant.loginId)}>합격</button>
                                <button onClick={() => handleStatusChange(applicant.status, applicant.loginId, "탈락")}>불합격</button>                  
                            </div>
                        )}
                        {applicant.viewed ===1 && applicant.status.includes("탈락") && (
                            <div className="decision-buttons">
                                <button>추가합격</button>
                            </div> 
                        )}
                    </div>
                
                    </StyledRow>
            ))}
            
            </StyledContainer>
            
            
            </div>  
        </div>
        <ApplicantPageNavigateStyled>
        <PageNavigate
          totalItemsCount={count}
          onChange={getApplicantList}
          activePage={cPage}
          itemsCountPerPage={5}
        ></PageNavigate>
      </ApplicantPageNavigateStyled>

 {/* 지원이력서 */}
 {modal && (
                <HistoryModal
                    index={0}
                    setModal={setModal}
                    resumeInfo={{ userNm: '', email: '', phone: '', resTitle: '', shortIntro: '', perStatement: '' }}
                    careerInfo={[]}
                    eduInfo={[]}
                    skillInfo={[]}
                    certInfo={[]}
                    resIdx={resIdx}
                />
            )}
        
    </>
    );
};
