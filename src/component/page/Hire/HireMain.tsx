import { useContext, useEffect, useState } from "react";
import { Hire } from "../../../api/api";
import { postHireApi } from "../../../api/postHireApi";
import { IHire, IHireListResponse } from "../../../models/interface/IHire";
import { StyledTable, StyledTd, StyledTh } from "../../common/styled/StyledTable";
import { PageNavigate } from "../../common/pageNavigation/PageNavigate";
// import { HireContext } from "../../../api/provider/HireProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { PageNavigateStyled } from "../../common/pageNavigation/styled";
import { StyledButton } from "../../common/styled/StyledButton";




export const HireMain = () => {
    const [hireCnt, setHireCnt] = useState<number>(0);
    const [hireList, setHireList] = useState<IHire[]>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [cPage, setCPage] = useState<number>();
    const navigate = useNavigate();


    const buttonClick = () => {
      navigate("/react/manage-hire/managehireWritePage.do");
    };

    useEffect(() => {
      getHireList();
    },[]);


    const getHireList = async (currentPage?: number) => {
      currentPage = currentPage || 1;
      const searchParam = { currentPage: currentPage.toString(), pageSize: "5" };
      //const searchList = await postHireApi<IHireListResponse>(Hire.getListBody, searchParam);
      const getList = await postHireApi<IHireListResponse>(Hire.getListBody, searchParam);
      console.log(getList);
  
      
       if (getList) {
         setHireList(getList.data.MList);
         setHireCnt(getList.data.MCount);  
         setCPage(currentPage);
       }
       
       
    };

    const handlerDetail = (postIdx: number,bizIdx:number) => {
      console.log(postIdx)
      navigate(`/react/manage-post/managePostDetailBody.do`, {
        state: { postIdx,bizIdx },
      });
    };


    return (
        <>
          <br/>
          <StyledButton onClick={buttonClick}>공고 등록</StyledButton>

          <StyledTable>
            <thead>
              <tr>
                <StyledTh size={20}>공고제목</StyledTh>
                <StyledTh size={20}>경력여부</StyledTh>
                <StyledTh size={20}>게시일</StyledTh>
                <StyledTh size={30}>채용기간</StyledTh>
                <StyledTh size={20}>승인여부</StyledTh>
              </tr>
            </thead>
            <tbody>
            
              {hireList?.length > 0 ? (
                hireList?.map((hire) => {
              return (
                <tr key={hire.postIdx} onClick={() => handlerDetail(hire.postIdx,hire.bizIdx)}>
                  <StyledTd>{hire.title}</StyledTd>
                  <StyledTd>{hire.expRequired}</StyledTd>              
                  <StyledTd>{hire.postDate}</StyledTd>
                  <StyledTd>{hire.startDate.slice(0,10)} ~ {hire.endDate.slice(0,10)}</StyledTd>
                  <StyledTd>{hire.appStatus}</StyledTd>
                </tr>
              );
            })
          ) : (
            <tr>
              <StyledTd colSpan={5}>데이터가 없습니다.</StyledTd>
            </tr>
          )}
        </tbody>
            
          </StyledTable>
          <PageNavigateStyled>
        <PageNavigate
          totalItemsCount={hireCnt}
          onChange={getHireList}
          activePage={cPage}
          itemsCountPerPage={5}
        ></PageNavigate>
      </PageNavigateStyled>
          
          {/* {modal && (
            <Portal>
              <NoticeModal onSuccess={onPostSuccess} noticeSeq={index} setNoticeSeq={setIndex} />
            </Portal>
          )} */}
        </>
      );



    
};
