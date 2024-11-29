import { ChangeEvent, useEffect, useState } from "react";
import { StyledTable, StyledTd, StyledTh } from "../../common/styled/StyledTable";
import axios from "axios";
import { ILoginInfo } from "../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../stores/userInfo";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import { IApplicant, IApplicantListResponse, IDetailBiz } from "../../../models/interface/IApplicant";
import { postApplicantApi } from "../../../api/postApplicant";
import { Applicant } from "../../../api/api";


export const ApplicantMain = () => {
    // const [applicants, setApplicants]  = useState([]);
    // const [companyList, setCompanyList] = useState([]);
    const [userInfo, setUserInfo] = useRecoilState<ILoginInfo>(loginInfoState);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [postIdxList, setPostIdxList] = useState<IDetailBiz[]>([]);
    const [applicantList, setApplicantList] = useState<IApplicant[]>([]); //초기화  
    const [keyword, setKeyword]  = useState<string>("");
    const [count, setCount] = useState<number>(0); // 지원자 수
    const [selectedPostIdx, setSelectedPostIdx] = useState<number>();
    const [selectedTitle, setSelectedTitle] = useState<string>("");


    //지원자 목록 가져오기위한 postIdx 리스트 받아오기
    const getPostIndexList = async () => {
        const userParam = { loginId: userInfo.loginId, };
        const searchParam = { currentPage: currentPage.toString(), pageSize: "5" };

        //requestParam 형식 --> encoded
        // await axios.post(Applicant.getListBody + "?loginId=" + encodeURIComponent(userInfo.loginId))
        //             .then((res) => {
        //                 setApplicantList(res.data.MDetail);
        //                 console.log("if문 타는지")
        //             })

         const getList = await axios.post(Applicant.getPostIdx, userParam); //requestBody 형식
        //const getList = await postApplicantApi<IApplicantListResponse>(Applicant.getListBody, userParam); //왜 작동 안하는지 모르겠음 제네릭..?

        if( getList ){
            setPostIdxList(getList.data.MDetail);    
        }

    };


    
    //지원자 목록 가져오기
    const getApplicantList = async() => {
        const param = {loginId: userInfo.loginId, postIdx: selectedPostIdx};
        //const getList = await axios.post(Applicant.gitListBody, param);
        console.log("리액트에서 postIdx값있는지=======================>" + selectedPostIdx);
        const getList = await postApplicantApi<IApplicantListResponse>(Applicant.gitListBody, param);

        if(getList){
            setApplicantList(getList.data.list)
            setCount(getList.data.count)
        }
        //console.log("getList------------------------------>" + applicantList[0].title);
    }



    // 첫 렌더링 시 한 번만 데이터를 가져오도록 설정
    useEffect(() => {
        getPostIndexList(); // 한 번만 실행
        getApplicantList();
    }, [userInfo.loginId]); // userInfo.loginId가 변경될 때만 실행

    




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
    }, [selectedPostIdx, applicantList]); // selectedPostIdx가 변경될 때마다 실행

    // selectBox에서 선택된 값 처리
    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectPost = Number(e.target.value);
        setSelectedPostIdx(selectPost); // postIdx 업데이트
    };


return(
    <>
    <br/>
        <div style={{ display: "flex", alignItems: "center" ,justifyContent: "space-between", width: "100%"}}>
            <div style={{ marginRight: "20px"}}>
                <h3>{selectedTitle}</h3>
            </div>
            <div>
            <select value={selectedPostIdx} onChange={handleSelectChange}>
                {postIdxList && postIdxList.length > 0 ? (
                    postIdxList.map((applicant) => (
                        <option key={applicant.postIdx} value={applicant.postIdx} >{applicant.title}</option>
                    ))
                ) : ( 
                        <option disabled> 데이터가 없습니다</option>
                )}
            </select>
            <select>
                <option value={"서류심사중"}>서류심사중</option>
                <option>면접진행중</option>
                <option>최종합격</option>
                <option>탈락</option>
            </select>
            </div>
            
        </div>

   
        
    </>
    );
};
