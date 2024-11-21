import { useContext, useEffect, useState } from 'react';
import { HistoryContext } from '../../../../api/provider/HistoryProvider';
import { IHistory, IHistoryResponse } from '../../../../models/interface/IHistory';
import { postHistoryApi } from '../../../../api/postHistoryApi';
import { History } from '../../../../api/api';
import { StyledTable, StyledTd, StyledTh } from '../../../common/styled/StyledTable';
import { PageNavigate } from '../../../common/pageNavigation/PageNavigate';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { HistoryModal } from '../HistoryModal/HistoryModal';

export const HistoryMain = () => {
    const [historyList, setHistoryList] = useState<IHistory[]>([]);
    const [historyCnt, setHistoryCnt] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { searchKeyWord } = useContext(HistoryContext);

    // 모달
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [index, setIndex] = useState<number>();

    useEffect(() => {
        searchHistoryList(currentPage);
    }, [currentPage, searchKeyWord]);

    // 기본 리스트 출력
    const searchHistoryList = async (currentPage: number, isSearchTriggered = false) => {
        const searchParam = { 
            ...searchKeyWord, 
            currentPage: currentPage.toString(), 
            pageSize: "5"
        };
        try {
            let searchList;
            if (isSearchTriggered) {
                searchList = await postHistoryApi<IHistoryResponse>(History.searchList, searchParam);
                console.log("2. 검색 데이터 출력");
            } else {
                searchList = await postHistoryApi<IHistoryResponse>(History.getListBody, searchParam);
                console.log("1. 기본 데이터 출력");
            }
    
            if (searchList) {
                setHistoryList(searchList.data.history);
                setHistoryCnt(searchList.data.historyCnt);
            }
        } catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    };

    // 현재 페이지에 맞는 항목만 추출
    const getPagedHistoryList = () => {
        const startIndex = (currentPage - 1) * 5;
        const endIndex = startIndex + 5;
        return historyList?.slice(startIndex, endIndex);
    };

    // 지원 취소 기능
    const handlerCancel = async (appId: number, postTitle: string) => {
        const isConfirmed = window.confirm(`정말로 '${postTitle}' 지원 내역을 삭제하시겠습니까?`);
        if (!isConfirmed) {
            alert('삭제가 취소되었습니다.');
            return;
        }
        const paramMap = { appId };
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
    };

    // 모달창
    const handlerModal = (appId: number) => {
        setModal(true);
        setIndex(appId);
    };

    return (
        <>
            총 갯수: {historyCnt}
            현재 페이지 : {currentPage}
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
                    {getPagedHistoryList()?.length > 0 ? (
                        getPagedHistoryList()?.map((history) => (
                            <tr key={history.appId}>
                                <StyledTd>
                                    <p>지원완료</p>
                                    <p>{history.applyDate.toString()}</p>
                                </StyledTd>
                                <StyledTd>
                                    {history.bizName}
                                    <p style={{ fontWeight: 'bold' }}>{history.postTitle}</p>
                                    <span onClick={() => handlerModal(history.appId)}>
                                    지원이력서
                                    </span>
                                </StyledTd>
                                <StyledTd><p>{history.status}</p></StyledTd>
                                <StyledTd>{history.viewed == 1 ? "열람" : "미열람"}</StyledTd>
                                <StyledTd
                                    style={{
                                        color: history.viewed == 1 ? 'gray' : 'black',
                                    }}
                                    onClick={history.viewed == 1 ? undefined : () => handlerCancel(history.appId, history.postTitle)}
                                >
                                    {history.viewed == 1 ? '취소 불가' : '지원 취소'}
                                </StyledTd>

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
                itemsCountPerPage={5}
            />

            {/* 이력서 모달 */}
            {modal && (
                <HistoryModal
                    index={index}
                    setModal={setModal}
                />
            )}
        </>
    );
};
