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
import { CancelButton, DisabledButton, StyledHoverText } from './styled';   // 스타일 적용
import { CancelModal } from '../CancelModal/CancelModal';
import { toast } from 'react-toastify';

export const HistoryMain = () => {
    const { search } = useLocation();       // URL 쿼리 파라미터에서 검색 정보 가져오기
    const navigate = useNavigate();         // 페이지 이동을 위한 navigate 함수
    
    // 지원 내역 상태 및 페이지 관련 상태 관리
    const [historyList, setHistoryList] = useState<IHistory[]>([]);
    const [historyCnt, setHistoryCnt] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    
    // 검색 키워드 상태
    const { searchKeyWord } = useContext(HistoryContext);
    
    // 페이지 상태
    const [cPage, setCPage] = useState<number>(1);
    
    // 모달 상태 관리
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [index, setIndex] = useState<number>();
    const [resIdx, setResIdx] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // 취소 관련 상태
    const [cancelAppId, setCancelAppId] = useState<number | null>(null);
    const [cancelPostTitle, setCancelPostTitle] = useState<string>('');
    const [cancelModalVisible, setCancelModalVisible] = useState<boolean>(false);

    // 이력서 모달 열기
    const handlerModal = (appId: number, resIdx: number) => {
        if (!modal) {
            setModal(true);
            setIndex(appId);
            setResIdx(resIdx);
        }
    };
    // 취소 모달 열기
    const openCancelModal = (appId: number, postTitle: string) => {
        setCancelAppId(appId);
        setCancelPostTitle(postTitle);
        setCancelModalVisible(true);
    };
    // 취소 모달 닫기
    const closeCancelModal = () => {
        setCancelModalVisible(false);
        setCancelAppId(null);
        setCancelPostTitle('');
    };

    // 데이터 fetching 함수
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await searchHistoryList(currentPage);
            setIsLoading(false);
        };
        fetchData();
    }, [search, searchKeyWord, currentPage]);

    // 지원 내역 조회 API 호출
    const searchHistoryList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = {
            ...searchKeyWord,
            currentPage: currentPage.toString(),
            pageSize: "5",      // 페이지에 표시되는 수
        };

        const searchList = await postHistoryApi<IHistoryResponse>(History.searchList, searchParam);
        console.log(searchList);
        if (searchList) {
            setHistoryList(searchList.data.history);
            setHistoryCnt(searchList.data.historyCnt);
            setCPage(currentPage);
        }
    };

    // 지원 내역 취소 처리
    const handlerCancel = async (appId: number, postTitle: string) => {
        const paramMap = { appId };
        try {
            const deleteResponse = await postHistoryApi<IHistoryResponse>(History.postDelete, paramMap);
            if (deleteResponse) {

                toast.success(`${postTitle} 지원 내역이 취소되었습니다.`);
                searchHistoryList(currentPage);         // 삭제 후 리스트 갱신
                closeCancelModal();                     // 모달 닫기
            } else {
                console.error('삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
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
                    {isLoading ? (
                        <tr>
                            <StyledTd colSpan={5} height={400}>
                                {/* 로딩 중에 보여줄 UI */}
                                <p>로딩 중...</p>
                            </StyledTd>
                        </tr>
                    ) : historyList.length > 0 ? (
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
                                    <StyledHoverText onClick={() => handlerModal(history.appId, history.resIdx)}>
                                        지원이력서
                                    </StyledHoverText>
                                </StyledTd>

                                <StyledTd><p>{history.status}</p></StyledTd>
                                <StyledTd>{history.viewed == 1 ? "열람" : "미열람"}</StyledTd>
                                <StyledTd 
                                    style={{
                                        color: history.viewed == 1 ? 'gray' : 'black',
                                    }}
                                    onClick={history.viewed == 1 ? undefined : () => openCancelModal(history.appId, history.postTitle)}
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

            {/* 지원이력서 */}
            {modal && (
                <HistoryModal
                    index={index}
                    setModal={setModal}
                    resumeInfo={{ userNm: '', email: '', phone: '', resTitle: '', shortIntro: '', perStatement: '' }}
                    careerInfo={[]}
                    eduInfo={[]}
                    skillInfo={[]}
                    certInfo={[]}
                    resIdx={resIdx}
                />
            )}

            {/* 지원 취소 */}
            {cancelModalVisible && (
                <CancelModal
                    appId={cancelAppId!}
                    postTitle={cancelPostTitle}
                    closeModal={closeCancelModal}
                    handlerCancel={handlerCancel}
                />
            )}
        </>
    );
};
