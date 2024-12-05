import { useLocation } from "react-router-dom";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { useContext, useEffect, useState } from "react";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Portal } from "../../../common/portal/Portal";
import { useRecoilState } from "recoil";
import { modalState, noticeState } from "../../../../stores/modalState";
import { INoitce, INoitceListResponse } from "../../../../models/interface/INotice";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { Notice } from "../../../../api/api";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { NoticeContext } from "../../../../api/provider/NoticeProvider";
import { PageNavigateStyled } from "../../../common/pageNavigation/styled";
import { HistoryModalStyled } from "../../History/HistoryModal/styled";

export const NoticeMain = () => {
  const { search } = useLocation();
  const [noticeList, setNoticeList] = useState<INoitce[]>();
  const [noticeCnt, setNoticeCnt] = useState<number>(0);
  const [modal, setModal] = useRecoilState<boolean>(modalState); // recoil에 저장된 state
  const [index, setIndex] = useState<number>();
  const [currentPage] = useState<number>(1);
  const [cPage, setCPage] = useState<number>();
  const [IsNotice, setIsNotice] = useRecoilState<boolean>(noticeState);
  const [isLoaded, setIsLoaded] = useState(false);

  const { searchKeyWord } = useContext(NoticeContext);

  useEffect(() => {
    searchNoticeList(currentPage);
  }, [search]);

  useEffect(() => {
    searchNoticeList();
  }, [searchKeyWord]);

  useEffect(() => {
    setIsNotice(true); // Scrap 페이지에 들어왔을 때
    return () => {
      setIsNotice(false); // Scrap 페이지를 나갈 때
    };
  }, []);

  const searchNoticeList = async (currentPage?: number) => {
    currentPage = currentPage || 1;
    const searchParam = { ...searchKeyWord, currentPage: currentPage.toString(), pageSize: "5" };
    const searchList = await postNoticeApi<INoitceListResponse>(Notice.getListBody, searchParam);
    if (searchList) {
      setNoticeList(searchList.data.notice);
      setNoticeCnt(searchList.data.noticeCnt);
      setCPage(currentPage);
    }
    setIsLoaded(true);
  };

  const handlerModal = (index: number) => {
    setModal(!modal);
    setIndex(index);
  };

  const onPostSuccess = () => {
    setModal(!modal);
    searchNoticeList();
  };

  if (!isLoaded) {
    return (
      <HistoryModalStyled>
        <div className="loading-container">
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      </HistoryModalStyled>
    );
  }

  return (
    <>
      <div>
        <div>
          <strong>총 갯수 :</strong> {noticeCnt}
        </div>
        <div>
          {" "}
          <strong>현재 페이지 :</strong> {cPage}
        </div>
      </div>

      <StyledTable>
        <thead>
          <tr>
            <StyledTh size={5}>번호</StyledTh>
            <StyledTh size={50}>제목</StyledTh>
            <StyledTh size={10}>작성자</StyledTh>
            <StyledTh size={20}>등록일</StyledTh>
          </tr>
        </thead>
        <tbody>
          {noticeList?.length > 0 ? (
            noticeList?.map((notice) => {
              return (
                <tr key={notice.noticeIdx} onClick={() => handlerModal(notice.noticeIdx)}>
                  <StyledTd>{notice.noticeIdx}</StyledTd>
                  <StyledTd>{notice.title}</StyledTd>
                  <StyledTd>{notice.author}</StyledTd>
                  <StyledTd>{new Date(notice.createdDate).toISOString().substring(0, 10)}</StyledTd>
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
      <PageNavigateStyled>
        <PageNavigate
          totalItemsCount={noticeCnt}
          onChange={searchNoticeList}
          activePage={cPage}
          itemsCountPerPage={5}
        ></PageNavigate>
      </PageNavigateStyled>
      {modal && (
        <Portal>
          <NoticeModal onSuccess={onPostSuccess} noticeSeq={index} setNoticeSeq={setIndex} />
        </Portal>
      )}
    </>
  );
};
