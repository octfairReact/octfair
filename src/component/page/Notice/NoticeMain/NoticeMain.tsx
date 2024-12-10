import { useLocation } from "react-router-dom";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { useContext, useEffect, useState } from "react";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Portal } from "../../../common/portal/Portal";
import { RecoilState, useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
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
  const [isLoaded, setIsLoaded] = useState(false);

  const { searchKeyWord } = useContext(NoticeContext);

  useEffect(() => {
    searchNoticeList(currentPage);
  }, [search]);

  useEffect(() => {
    searchNoticeList();
  }, [searchKeyWord]);

  //변경을 감지하고 유스이펙트 안에 있는 함수를 실행 시켜주는 것이 의존성 배열

  // useEffect(() => {
  //   console.log("주소에서 받는 값", search);
  //   searchNoticeList();
  // }, [search]);

  //검색 관련 잠시 주석
  // const searchNoticeList = async (currentPage?: number) => {
  //   currentPage = currentPage || 1;
  //   const searchParam = new URLSearchParams(search);
  //   searchParam.append("currentPage", currentPage.toString());
  //   searchParam.append("pageSize", "5");

  //   const searchList = await postNoticeApi<INoitceListResponse>(Notice.getList, searchParam);

  //   if (searchList) {
  //     setNoticeList(searchList.data.notice);
  //     setNoticeCnt(searchList.data.noticeCnt);
  //     console.log("노티스 카운트에 뭐 들어 있어?", noticeCnt);
  //     setCPage(currentPage);
  //   }

  //   // axios.post("/board/noticeListJson.do", searchParam).then((res) => {
  //   //   console.log("응답 데이터", res.data);
  //   //   setNoticeList(res.data.notice);
  //   //   setNoticeCnt(res.data.noticeCnt);
  //   // });
  // };

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
