import { useContext, useEffect, useState } from 'react';
import { HistoryContext } from '../../../../api/provider/HistoryProvider';
import { IHistory, IHistoryResponse } from '../../../../models/interface/IHistory';
import { postHistoryApi } from '../../../../api/postHistoryApi';
import { History, ManagePost } from '../../../../api/api';
import { StyledTable, StyledTd, StyledTh } from '../../../common/styled/StyledTable';
import { PageNavigate } from '../../../common/pageNavigation/PageNavigate';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { HistoryModal } from '../HistoryModal/HistoryModal';
import { useLocation, useNavigate } from 'react-router-dom';

export const HistoryMain = () => {
    const { search } = useLocation();
    const navigate = useNavigate();
    const [historyList, setHistoryList] = useState<IHistory[]>([]);
    const [historyCnt, setHistoryCnt] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { searchKeyWord } = useContext(HistoryContext);
    const [cPage, setCPage] = useState<number>(1);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [index, setIndex] = useState<number>();

    // 검색어가 변경되거나 컴포넌트가 마운트될 때 포스트 리스트를 검색
    useEffect(() => {
        searchHistoryList(currentPage);
    }, [search, searchKeyWord, currentPage]);

    // 포스트 리스트 검색 함수
    const searchHistoryList = async (currentPage?: number) => {
        const searchParam = {
            ...searchKeyWord,
            currentPage: currentPage.toString(),
            pageSize: "5",
        };

        const searchList = await postHistoryApi<IHistoryResponse>(History.searchList, searchParam);

        if (searchList) {
            setHistoryList(searchList.data.history);
            setHistoryCnt(searchList.data.historyCnt);
            setCPage(currentPage);
        }
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

    // 상세 페이지로 이동
    const handlerDetail = (appId, bizIdx) => {
        navigate(`/react/company/companyDetailPage.do/${appId}/${bizIdx}`);
    };

    // 채용 공고로 이동
    const handlerPost = (postIdx: number, bizIdx: number) => {
        navigate(`/react/manage-post/managePostDetailBody.do`, {
          state: { postIdx, bizIdx },
        });
    };

    // 모달창 열기
    const handlerModal = (appId: number) => {
        setModal(true);
        setIndex(appId);
    };

    return (
        <>
         <pre>총 갯수 : {historyCnt}   현재 페이지 : {cPage} </pre>
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
                    {historyList.length > 0 ? (
                        historyList.map((history) => (
                            <tr key={history.appId}>
                                <StyledTd>
                                    <p>지원완료</p>
                                    <p>{history.applyDate.toString()}</p>
                                </StyledTd>
                                <StyledTd>
                                    <span onClick={() => handlerDetail(history.appId, history.bizIdx)}>{history.bizName}</span>
                                    <p style={{ fontWeight: 'bold' }} onClick={() => handlerPost(history.postingId, history.bizIdx)}>{history.postTitle}</p>
                                    <span 
                                        onClick={() => handlerModal(history.appId)}>
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

            {/* 페이징 처리 */}
            <PageNavigate 
                totalItemsCount={historyCnt} 
                onChange={searchHistoryList}
                activePage={cPage} 
                itemsCountPerPage={5}
            ></PageNavigate>

            {/* 지원이력서 모달 */}
            {/* {modal && (
                <HistoryModal
                    index={index}
                    setModal={setModal}
                    resumeInfo={{ name: '', email: '', phone: '' }}
                    careerInfo={[]}
                    eduInfo={[]}
                    skillInfo={[]}
                    certInfo={[]}
                />
            )} */}

            <br></br>
            <br></br>
        </>
    );
};
