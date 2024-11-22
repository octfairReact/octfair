import { useContext, useEffect, useState } from "react";
import { Hire } from "../../../api/api";
import { postHireApi } from "../../../api/postHireApi";
import { IHire, IHireListResponse } from "../../../models/interface/IHire";
import { StyledTable, StyledTd, StyledTh } from "../../common/styled/StyledTable";
import { PageNavigate } from "../../common/pageNavigation/PageNavigate";
// import { HireContext } from "../../../api/provider/HireProvider";
import { useLocation, useNavigate } from "react-router-dom";




export const HireMain = () => {
    const [hireCnt, setHireCnt] = useState<number>(0);
    const [hireList, setHireList] = useState<IHire[]>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();


    const buttonClick = () => {
      navigate("/react/manage-hire/managehireWritePage.do");
    };

    useEffect(() => {
      getHireList();
    },[]);


    const getHireList = async () => {
    
      const searchParam = { currentPage: currentPage.toString(), pageSize: "5" };
      //const searchList = await postHireApi<IHireListResponse>(Hire.getListBody, searchParam);
      const getList = await postHireApi<IHireListResponse>(Hire.getListBody, searchParam);
      console.log(getList);
  
      
       if (getList) {
         setHireList(getList.data.MList);
         setHireCnt(getList.data.MCount);  
       }
       
       
    };


    return (
        <>
          <br/>
          <button onClick={buttonClick}>공고 등록</button>

          <StyledTable>
            <thead>
              <tr>
                <StyledTh size={20}>공고제목</StyledTh>
                <StyledTh size={20}>경력여부</StyledTh>
                <StyledTh size={20}>게시일</StyledTh>
                <StyledTh size={20}>채용기간</StyledTh>
                <StyledTh size={20}>승인여부</StyledTh>
              </tr>
            </thead>
            <tbody>
              
              {hireList?.length > 0 ? (
                hireList?.map((hire) => {
              return (
                <tr key={hire.postIdx} >
                  <StyledTd>{hire.title}</StyledTd>
                  <StyledTd>{hire.expRequired}</StyledTd>              
                  <StyledTd>{hire.postDate}</StyledTd>
                  <StyledTd>{hire.endDate}</StyledTd>
                  <StyledTd>{hire.appStatus}</StyledTd>
                </tr>
              );
            })
          ) : (
            <tr>
              <StyledTd colSpan={3}>데이터가 없습니다.</StyledTd>
            </tr>
          )}
        </tbody>
            
          </StyledTable>
          
          {/* {modal && (
            <Portal>
              <NoticeModal onSuccess={onPostSuccess} noticeSeq={index} setNoticeSeq={setIndex} />
            </Portal>
          )} */}
        </>
      );



    
};
