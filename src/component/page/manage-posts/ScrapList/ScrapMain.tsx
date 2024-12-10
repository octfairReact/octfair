import { useLocation, useNavigate } from "react-router-dom";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { useContext, useEffect, useState } from "react";
import { ScrapURL } from "../../../../api/api";
import { IScrap, IScrapListResponse } from "./../../../../models/interface/IScrap";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { useRecoilState } from "recoil";
import { ApplyModalState } from "../../../../stores/modalState";
import { StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { Portal } from "../../../common/portal/Portal";
import { ApplyModal } from "../applyModal/ApplyModal";
import { StyledTablePost } from "../../../common/styled/StyledTablePost";
import { ScrapContext } from "../../../../api/provider/ScrapProvider";

export const ScrapMain = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [scrapList, setScrapList] = useState<IScrap[]>([]);
  const [scrapCnt, setScrapCnt] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cPage, setCPage] = useState<number>();
  const [selectedItems, setSelectedItems] = useState<IScrap[]>([]);
  const [modal, setModal] = useRecoilState<boolean>(ApplyModalState);
  const [index, setIndex] = useState<number[]>([]);
  const { scrapIndexes, setScrapIndexes, postIndexes, setPostIndexes, searchKeyWord } = useContext(ScrapContext);

  useEffect(() => {
    searchScrapList(currentPage);
  }, [search, searchKeyWord, selectedItems]);

  useEffect(() => {
    setScrapIndexes(scrapIndexes);
    setPostIndexes(postIndexes);
    searchScrapList(currentPage);
  }, [postIndexes, scrapIndexes]);

  const searchScrapList = async (currentPage: number = 1) => {
    const searchParam = {
      ...searchKeyWord,
      currentPage: currentPage.toString(),
      pageSize: "5",
    };

    const searchList = await postNoticeApi<IScrapListResponse>(ScrapURL.getScrapList, searchParam);
    if (searchList) {
      setScrapList(searchList.data.scrapList);
      setScrapCnt(searchList.data.scrapCnt);
      setCPage(currentPage);
    }
  };

  const handlerModal = (postIdx: number, bizIdx: number) => {
    setModal(!modal);
    setIndex([postIdx, bizIdx]);
  };

  const handlerDetail = (postIdx: number, bizIdx: number) => {
    navigate(`/react/manage-post/managePostDetailBody.do`, {
      state: { postIdx, bizIdx },
    });
  };

  const handleCheckboxChange = (e, item) => {
    if (e.target.checked) {
      // 항목 추가
      setScrapIndexes((prev: number[]) => [...prev, item.scrapIdx]);
      setPostIndexes((prev: number[]) => [...prev, item.postIdx]);
    } else {
      // 항목 제거
      setScrapIndexes((prev: number[]) => prev.filter((idx) => idx !== item.scrapIdx));
      setPostIndexes((prev: number[]) => prev.filter((idx) => idx !== item.postIdx));
    }
  };

  const onPostSuccess = () => {
    setModal(!modal);
    searchScrapList(currentPage);
  };

  const handleAllCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // 전체 선택
      const allScrapIndexes = scrapList.map((scrap) => scrap.scrapIdx);
      const allPostIndexes = scrapList.map((scrap) => scrap.postIdx);

      setScrapIndexes(allScrapIndexes);
      setPostIndexes(allPostIndexes);
    } else {
      // 전체 해제
      setScrapIndexes([]);
      setPostIndexes([]);
    }
  };

  const renderScrapRow = (scrap: IScrap) => {
    if (!scrap.loginId) {
      return (
        <>
          <StyledTd onClick={() => handlerDetail(scrap.postIdx, scrap.postBizIdx)}>{scrap.postBizName}</StyledTd>
          <StyledTd onClick={() => handlerDetail(scrap.postIdx, scrap.postBizIdx)}>{scrap.postTitle}</StyledTd>
          <StyledTd>{scrap.postExpRequired}</StyledTd>
          <StyledTd>{scrap.postWorkLocation}</StyledTd>
          <StyledTd>{scrap.postEndDate?.substring(0, 10) || "Invalid Date"}</StyledTd>
          <StyledTd>
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => handlerModal(scrap.postIdx, scrap.postBizIdx)}
            >
              입사지원
            </button>
          </StyledTd>
        </>
      );
    }
    return (
      <StyledTd colSpan={6}>
        <span>삭제된 공고입니다</span>
      </StyledTd>
    );
  };

  return (
    <>
      <StyledTablePost>
        <thead>
          <tr>
            <StyledTh size={5}>
              <input
                type="checkbox"
                onChange={(e) => handleAllCheckboxChange(e)}
                checked={scrapIndexes.length === scrapList.length && scrapList.length > 0}
              />
            </StyledTh>
            <StyledTh size={10}>기업명</StyledTh>
            <StyledTh size={20}>공고제목</StyledTh>
            <StyledTh size={10}>자격요건</StyledTh>
            <StyledTh size={18}>근무지역</StyledTh>
            <StyledTh size={10}>마감일</StyledTh>
            <StyledTh size={8}></StyledTh>
          </tr>
        </thead>
        <tbody>
          {scrapList.length > 0 ? (
            scrapList.map((scrap) => (
              <tr key={scrap.scrapIdx}>
                <StyledTd>
                  <input
                    type="checkbox"
                    checked={scrapIndexes.includes(scrap.scrapIdx)}
                    onChange={(e) => handleCheckboxChange(e, scrap)}
                  />
                </StyledTd>
                {renderScrapRow(scrap)}
              </tr>
            ))
          ) : (
            <tr>
              <StyledTd colSpan={7}>데이터가 없습니다.</StyledTd>
            </tr>
          )}
        </tbody>
      </StyledTablePost>
      {modal && (
        <Portal>
          <ApplyModal onSuccess={onPostSuccess} indexGroup={index} />
        </Portal>
      )}
      <PageNavigate totalItemsCount={scrapCnt} onChange={searchScrapList} activePage={cPage} itemsCountPerPage={5} />
    </>
  );
};
