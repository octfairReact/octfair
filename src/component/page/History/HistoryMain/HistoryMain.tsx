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
import { useLocation, useNavigate } from 'react-router-dom';
import { CancelButton, DisabledButton, StyledHoverText } from './styled';
import { CancelModal } from '../CancelModal/CancelModal';
import { toast } from 'react-toastify';

export const HistoryMain = () => {
    const { search } = useLocation();
    const navigate = useNavigate();
    
    const [historyList, setHistoryList] = useState<IHistory[]>([]);

    const [historyCnt, setHistoryCnt] = useState<number>(0);
    const [currentPage] = useState<number>(1);
    const { searchKeyWord } = useContext(HistoryContext);
    const [cPage, setCPage] = useState<number>(1);
    const [modal, setModal] = useRecoilState<boolean>(modalState);

    // 로딩 상태 추가
    const [loading, setLoading] = useState<boolean>(true);

    // 지원이력서 모달
    const [index, setIndex] = useState<number>();
    const [resIdx, setResIdx] = useState<number | null>(null);
    
    // 지원취소 모달
    const [cancelAppId, setCancelAppId] = useState<number | null>(null);
    const [cancelPostTitle, setCancelPostTitle] = useState<string>('');

    // 지원이력서 모달 열기(apply index, resume index)
    const historyModalOpen = (appId: number, resIdx: number) => {
        setModal(true);
        setIndex(appId);
        setResIdx(resIdx);
    };

    // 지원취소 모달 열기(apply index, apply title)
    const applyCancelModalOpen = (appId: number, postTitle: string) => {
        setModal(true);
        setCancelAppId(appId);
        setCancelPostTitle(postTitle);
    };

    // 지원취소 모달 닫기
    const applyCancelModalClose = () => {
        setModal(false);
        setIndex(null);
        setCancelAppId(null);
        setCancelPostTitle('');
    };

    // search, searchKeyWord, currentPage 변경될때 실행되는 함수
    useEffect(() => {
        const isLoading = localStorage.getItem('loading');
        if (isLoading === 'true') {
            setLoading(true);
        } else {
            setLoading(false);  // 새로고침 후 로딩 상태를 false로 설정
        }

        const hisoryResultData = async () => {
            await searchHistoryList(currentPage);
        };
        hisoryResultData();
    }, [search, searchKeyWord, currentPage]);
    
    const searchHistoryList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = {
            ...searchKeyWord,
            currentPage: currentPage.toString(),
            pageSize: "5",      // 페이지에 표시되는 수
        };

        setLoading(true);  // 데이터 요청 시작 전에 로딩 상태 true로 설정
        
        const searchList = await postHistoryApi<IHistoryResponse>(History.searchListHistory, searchParam);
        if (searchList) {
            setHistoryList(searchList.data.history);
            setHistoryCnt(searchList.data.historyCnt);
            setCPage(currentPage);
            setLoading(false);  // 데이터 로딩 완료 후 로딩 상태 변경
        }
    };

    // 지원 내역 취소 처리
    const handlerCancel = async (appId: number, postTitle: string) => {
        const paramMap = { appId };
        try {
            const deleteResponse = await postHistoryApi<IHistoryResponse>(History.cancleApplyDelete, paramMap);
            if (deleteResponse) {
                toast.success(`${postTitle} 지원 내역이 취소되었습니다.`);
                searchHistoryList(currentPage);         // 삭제 후 리스트 갱신
                applyCancelModalClose();                     // 모달 닫기
            } else {
                console.error('삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
        } finally {
            setLoading(false);  // 로딩 끝
        }
    };

    // 상세 페이지로 이동
    const handlerDetail = (appId: number, bizIdx: number) => {
        const url = `/react/company/companyDetailPage.do/${appId}/${bizIdx}`;
        window.open(url, '_blank');
    };

    // 공고 페이지로 이동
    const handlerPost = (postIdx: number, bizIdx: number) => {
        navigate(`/react/manage-post/managePostDetailBody.do`, {
            state: { postIdx, bizIdx },
        });
    };

    // 채용 공고 리스트 페이지로 이동
    const handlerJobs = () => {
        navigate(`/react/jobs/posts.do`);
    };

    return (
        <>
            {/* 처음에 페이지 로딩 시 빈값으로 표시하게 하기 */}
            {loading ? (
                <></>
            ) : (
                <>
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
                                            <StyledHoverText onClick={() => handlerDetail(history.appId, history.bizIdx)}>
                                                {history.bizName}
                                            </StyledHoverText>
                                            <StyledHoverText
                                                className="bold"
                                                onClick={() => handlerPost(history.postingId, history.bizIdx)}
                                            >
                                                {history.postTitle}
                                            </StyledHoverText>
                                            <StyledHoverText onClick={() => historyModalOpen(history.appId, history.resIdx)}>
                                                지원이력서
                                            </StyledHoverText>
                                        </StyledTd>

                                        <StyledTd><p>{history.status}</p></StyledTd>
                                        <StyledTd>{history.viewed == 1 ? "열람" : "미열람"}</StyledTd>
                                        <StyledTd 
                                            style={{
                                                color: history.viewed == 1 ? 'gray' : 'black',
                                            }}
                                            onClick={history.viewed == 1 ? undefined : () => applyCancelModalOpen(history.appId, history.postTitle)}
                                        >
                                            {history.viewed == 1 ? 
                                                <DisabledButton>취소 불가</DisabledButton> : 
                                                <CancelButton>지원취소</CancelButton>
                                            }
                                        </StyledTd>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <StyledTd colSpan={5} height={400}>
                                        <img
                                            src='/images/admin/comm/history_not_found.png'
                                            alt='지원하러가기'
                                            style={{ transform: 'scaleX(-1)', margin: '5px' }}
                                            width={150}
                                        />
                                        <p>입사 지원 내역이 없어요.</p>
                                        <StyledHoverText >
                                            <p onClick={handlerJobs}>현재 채용중인 공고 보러가기▶</p>
                                        </StyledHoverText>
                                    </StyledTd>
                                </tr>
                            )}
                        </tbody>
                    </StyledTable>

                    {/* 페이지네비게이션 */}
                    {historyList.length > 0 && (
                        <PageNavigate
                            totalItemsCount={historyCnt}
                            onChange={searchHistoryList}
                            activePage={cPage}
                            itemsCountPerPage={5}
                        />
                    )}

                    {/* 지원이력서 모달 */}
                    {modal && index && (
                        <HistoryModal
                            index={index}
                            setIndex={setIndex}
                            resIdx={resIdx}
                        />
                    )}

                    {/* 지원 취소 모달 */}
                    {modal && cancelAppId && (
                        <CancelModal 
                            handlerCancel={handlerCancel}
                            appId={cancelAppId}
                            setCancelAppId={setCancelAppId}
                            postTitle={cancelPostTitle}
                        />
                    )}
                </>
            )}
        </>
    );
};
