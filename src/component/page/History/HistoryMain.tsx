import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HistoryContext } from '../../../api/provider/HistoryProvider';
import { IHistory, IHistoryResponse } from '../../../models/interface/IHistory';
import { postHistoryApi } from '../../../api/postHistoryApi';
import { History } from '../../../api/api';
import { StyledTable, StyledTh } from '../../common/styled/StyledTable';

export const HistoryMain = () => {
    const { search } = useLocation();
    const [noHistoryList, setHistoryList] = useState<IHistory[]>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { searchKeyWord } = useContext(HistoryContext);

    useEffect(() => {
        console.log(" 잘나오나? 주소에서 받는 값", search);
        searchHistoryList(currentPage);
    }, [search]);   

    const searchHistoryList = async (currentPage?: number) => {
        currentPage = currentPage || 1;

        const searchParam = { ...searchKeyWord, currentPage: currentPage.toString(), pageSize: "5" };
        const searchList = await postHistoryApi<IHistoryResponse>(History.getListBody, searchParam);
    
        if (searchList) {
            setHistoryList(searchList.data.history);
            //setHistoryCnt(searchList.data.historyCnt);
            //setCPage(currentPage);
        }
      };
    return 
      <>
        <StyledTable>
            <thead>
            <tr>
                <StyledTh size={5}>번호</StyledTh>
                <StyledTh size={50}>제목</StyledTh>
                <StyledTh size={10}>제목</StyledTh>
                <StyledTh size={20}>등록일</StyledTh>
            </tr>
            </thead>
        </StyledTable>

      </>
      
};
