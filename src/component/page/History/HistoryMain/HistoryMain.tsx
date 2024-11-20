import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HistoryContext } from '../../../../api/provider/HistoryProvider';
import { IHistory, IHistoryResponse } from '../../../../models/interface/IHistory';
import { postHistoryApi } from '../../../../api/postHistoryApi';
import { History } from '../../../../api/api';
import { StyledTable, StyledTd, StyledTh } from '../../../common/styled/StyledTable';
import { PageNavigate } from '../../../common/pageNavigation/PageNavigate';

export const HistoryMain = () => {
    const { search } = useLocation();
    const [historyList, setHistoryList] = useState<IHistory[]>();
    const [historyCnt, setHistoryCnt] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [cPage, setCPage] = useState<number>();
    const { searchKeyWord } = useContext(HistoryContext);

    useEffect(() => {
        searchHistoryList(currentPage);
    }, [currentPage, search, searchKeyWord]);

    // useEffect(() => {
    //   searchHistoryList();
    // }, [searchKeyWord]);
    
    // 기본 리스트 출력
    const searchHistoryList = async (currentPage?: number, isSearchTriggered = false) => {
        currentPage = currentPage || 1;
        const searchParam = { ...searchKeyWord, currentPage: currentPage.toString(), pageSize: "2" };
        const listBody = isSearchTriggered ? History.searchList : History.getListBody;
        try {
          const searchList = await postHistoryApi<IHistoryResponse>(listBody, searchParam);
  
          if (searchList) {
              setHistoryList(searchList.data.history);
              setHistoryCnt(searchList.data.historyCnt);
              setCPage(currentPage);
          }
      } catch (error) {
          console.error('API 호출 중 오류 발생:', error);
      }
        // const searchList = await postHistoryApi<IHistoryResponse>(History.getListBody, searchParam);
        // if (searchList) {
        //   setHistoryList(searchList.data.history);
        //   setHistoryCnt(searchList.data.historyCnt);
        //   setCPage(currentPage);
        // }
    };
    
    // 지원 취소
    const handlerCancel = async (appId : number) => {
      console.log("appId :", appId);
      const paramMap  = {appId};
      try {
        const deleteResponse = await postHistoryApi<IHistoryResponse>(History.postDelete, paramMap);

        if (deleteResponse) {
          searchHistoryList(currentPage);
          alert('지원 내역이 삭제되었습니다.');
        } else {
          alert('삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('삭제 중 오류 발생:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }

    
    return (
      <>
        총 갯수: {historyCnt}
        현재 페이지 : {cPage}
        <StyledTable>
          <thead>
            <tr>
              <StyledTh size={10}>지원일</StyledTh>
              <StyledTh size={30}>지원내역</StyledTh>
              <StyledTh size={10}>공고진행상태</StyledTh>
              <StyledTh size={5}>열람</StyledTh>
              <StyledTh size={10}>취소/삭제</StyledTh>
            </tr>
          </thead>
          <tbody>
          {historyList?.length > 0 ? (
            historyList.map((history) => (
              <tr key={history.appId}>
                <StyledTd>
                  <p>지원완료</p>
                  <p>{history.applyDate.toString()}</p>
                </StyledTd>
                <StyledTd>
                  {history.bizName}
                  <p style={{ fontWeight: 'bold' }}>{history.postTitle}</p>
                  지원이력서
                </StyledTd>
                <StyledTd><p>{history.status}</p></StyledTd>
                <StyledTd>{history.viewed == 1 ? "열람" : "미열람"}</StyledTd>
                <StyledTd onClick={() => handlerCancel(history.appId)}>취소</StyledTd>
              </tr>
              ))
            ) : (
              <tr>
                <StyledTd colSpan={5} height={300}>
                <p>데이터가 없습니다.</p>
                </StyledTd>
              </tr>
            )}
          </tbody>
        </StyledTable>
        <PageNavigate
          totalItemsCount={historyCnt}
          onChange={setCurrentPage}
          activePage={currentPage}
          itemsCountPerPage={2}
      ></PageNavigate>
      </>
    )
};

