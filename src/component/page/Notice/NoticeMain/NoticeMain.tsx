import { useLocation } from "react-router-dom";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import axios from "axios";
import { useEffect, useState } from "react";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Portal } from "../../../common/portal/Portal";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { INoitce, INoitceListResponse } from "../../../../models/interface/INotice";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { Notice } from "../../../../api/api";

export const NoticeMain = () => {
  const { search } = useLocation();
  const [noticeList, setNoticeList] = useState<INoitce[]>();
  const [noticeCnt, setNoticeCnt] = useState<number>(0);
  //const [modalState, setModalState] = useState(false);  // 컴포넌트에서 만든 것
  const [modal, setModal] = useRecoilState<boolean>(modalState); // recoil에 저장된 state
  const [index, setIndex] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  // searchNoticeList가 currentPage가 변경될 때마다 호출되도록 useEffect 추가
  useEffect(() => {
    console.log("현재 페이지:", currentPage);
    searchNoticeList(currentPage);
  }, [currentPage]); // currentPage가 변경될 때마다 호출

  useEffect(() => {
    console.log("주소에서 받는 값", search);
    searchNoticeList(currentPage);
  }, [search]);
  // 변경을 감지하고 유스이펙트 안에 있는 함수를 실행 시켜주는 것이 의존성 배열

  const searchNoticeList = async (currentPage?: number) => {
    //currentPage = currentPage || 1;
    const searchParam = new URLSearchParams(search);
    searchParam.append("currentPage", currentPage.toString());
    searchParam.append("pageSize", pageSize.toString());

    const searchList = await postNoticeApi<INoitceListResponse>(Notice.getList, searchParam);

    if (searchList) {
      setNoticeList(searchList.data.notice);
      setNoticeCnt(searchList.data.noticeCnt);
      console.log("노티스 카운트에 뭐 들어 있어?", noticeCnt);
    }

    // axios.post("/board/noticeListJson.do", searchParam).then((res) => {
    //   console.log("응답 데이터", res.data);
    //   setNoticeList(res.data.notice);
    //   setNoticeCnt(res.data.noticeCnt);
    // });
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

  // 페이지 버튼 클릭 처리
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 페이지네이션을 위한 페이지 번호 계산
  const totalPages = Math.ceil(noticeCnt / pageSize);
  // 페이지 사이즈 계산

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  // 인덱스 생성

  return (
    <>
      총 갯수 : {noticeCnt} 현재 페이지 : 0
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
      {/* 페이지네이션 버튼 */}
      <div>
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
      </div>
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
