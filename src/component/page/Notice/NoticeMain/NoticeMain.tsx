import { useLocation, useNavigate } from "react-router-dom";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Portal } from "../../../common/portal/Portal";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { INoitce, INoitceListResponse } from "../../../../models/interface/INotice";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { Notice } from "../../../../api/api";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { NoticeContext } from "../../../../api/provider/NoticeProvider";
import { start } from "repl";

export const NoticeMain = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [noticeList, setNoticeList] = useState<INoitce[]>();
  const [noticeCnt, setNoticeCnt] = useState<number>(0);
  //const [modalState, setModalState] = useState(false);  // 컴포넌트에서 만든 것
  const [modal, setModal] = useRecoilState<boolean>(modalState); // recoil에 저장된 state
  const [index, setIndex] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cPage, setCPage] = useState<number>();

  const { searchKeyWord } = useContext(NoticeContext);
  // 혼자 페이징 처리
  // searchNoticeList가 currentPage가 변경될 때마다 호출되도록 useEffect 추가
  // useEffect(() => {
  //   console.log("현재 페이지:", currentPage);
  //   searchNoticeList(currentPage);
  // }, [currentPage]); // currentPage가 변경될 때마다 호출

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
    // const searchParam = new URLSearchParams(search);
    // searchParam.append("currentPage", currentPage.toString());
    // searchParam.append("pageSize", "5");

    const searchParam = { ...searchKeyWord, currentPage: currentPage.toString(), pageSize: "5" };
    const searchList = await postNoticeApi<INoitceListResponse>(Notice.getListBody, searchParam);
    if (searchList) {
      setNoticeList(searchList.data.notice);
      setNoticeCnt(searchList.data.noticeCnt);
      setCPage(currentPage);
    }
  };

  // const handlerModal = () => {
  //     setModalState(!modalState);
  // }

  const handlerModal = (index: number) => {
    setModal(!modal);
    setIndex(index);
  };

  const onPostSuccess = () => {
    setModal(!modal);
    searchNoticeList();
  };

  // // 페이지 버튼 클릭 처리
  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

  // // 페이지네이션을 위한 페이지 번호 계산
  // const totalPages = Math.ceil(noticeCnt / pageSize);
  // // 페이지 사이즈 계산

  // const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  // // 인덱스 생성

  const handlerDynamicRouter = (noticeIdx: number) => {
    navigate(`${noticeIdx}`);
  };

  return (
    <>
      총 갯수 : {noticeCnt}
      현재 페이지 : {cPage}
      <StyledTable>
        <thead>
          <tr>
            <StyledTh size={5}>번호</StyledTh>
            <StyledTh size={50}>제목</StyledTh>
            <StyledTh size={10}>제목</StyledTh>
            <StyledTh size={20}>등록일</StyledTh>
          </tr>
        </thead>
        <tbody>
          {noticeList?.length > 0 ? (
            noticeList?.map((notice) => {
              return (
                <tr key={notice.noticeIdx} onClick={() => handlerModal(notice.noticeIdx)}>
                  {/* 다이나믹 라우터 
                // 버전 1
                // <tr key={notice.noticeIdx} onClick={() => handlerDynamicRouter(notice.noticeIdx)}>
                // 버전 2
                // <tr 
                //   key={notice.noticeIdx}
                //   onClick={() => {
                //     navigate(`${notice.noticeIdx}`, {
                //       state: { title: notice.title },
                //     });
                //     // 스테이트 조금 더 확인
                //   }}
                // > */}
                  <StyledTd>{notice.noticeIdx}</StyledTd>
                  <StyledTd>{notice.title}</StyledTd>
                  <StyledTd>{notice.author}</StyledTd>
                  {/* <StyledTd>{notice.createdDate}</StyledTd> */}
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
      <PageNavigate
        totalItemsCount={noticeCnt}
        onChange={searchNoticeList}
        activePage={cPage}
        itemsCountPerPage={5}
      ></PageNavigate>
      {/* 페이지네이션 버튼 */}
      {/* <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          이전
        </button>
        {pageNumbers.map((page) => (
          <button key={page} onClick={() => handlePageChange(page)}>
            {page}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          다음
        </button>
      </div> */}
      {/* {modalState &&  (
            <Portal>
                <NoticeModal />
            </Portal>
            )} */}
      {modal && (
        <Portal>
          <NoticeModal onSuccess={onPostSuccess} noticeSeq={index} setNoticeSeq={setIndex} />
        </Portal>
      )}
    </>
  );
};
