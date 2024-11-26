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
import { HistoryMainStyled, StyledHoverText } from './styled';

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
    const [resIdx, setResIdx] = useState<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        searchHistoryList(currentPage);
    }, [search, searchKeyWord, currentPage]);

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
        setIsLoaded(true);
    };

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

    const handlerDetail = (appId, bizIdx) => {
        navigate(`/react/company/companyDetailPage.do/${appId}/${bizIdx}`);
    };

    const handlerPost = (postIdx: number, bizIdx: number) => {
        navigate(`/react/manage-post/managePostDetailBody.do`, {
          state: { postIdx, bizIdx },
        });
    };
    const handlerJobs = () => {
        navigate(`/react/jobs/posts.do`);
    };


    const handlerModal = (appId: number, resIdx: number) => {
        if (!modal) {
            setModal(true);
            setIndex(appId);
            setResIdx(resIdx);
        }
    };

    return (
        <HistoryMainStyled>
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
                    {!isLoaded ? (
                        <tr/>
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
                                    onClick={history.viewed == 1 ? undefined : () => handlerCancel(history.appId, history.postTitle)}
                                >
                                    {history.viewed == 1 ? '취소 불가' : '지원 취소'}
                                </StyledTd>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <StyledTd colSpan={5} height={400}>
                                <img src='/images/admin/comm/history_not_found.png' alt='지원하러가기' style={{ transform: 'scaleX(-1)', margin: '5px' }} width={150} />
                                <p>입사 지원 내역이 없어요.</p>
                                <p onClick={handlerJobs}>현재 채용중인 공고 보러가기▶</p>
                            </StyledTd>
                        </tr>
                    )}
                </tbody>
            </StyledTable>

            {historyList.length > 0 && (
                <PageNavigate 
                    totalItemsCount={historyCnt} 
                    onChange={searchHistoryList}
                    activePage={cPage} 
                    itemsCountPerPage={5}
                />
            )}

            {modal && (
                <HistoryModal
                    index={index}
                    setModal={setModal}
                    resumeInfo={{ userNm: '', email: '', phone: '', resTitle: '', shortIntro: '', perStatement: ''}}
                    careerInfo={[]}
                    eduInfo={[]}
                    skillInfo={[]}
                    certInfo={[]}
                    resIdx={resIdx}
                />
            )}
            <br/><br/>
        </HistoryMainStyled>
    );
};
