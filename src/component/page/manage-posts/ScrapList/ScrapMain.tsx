import { useLocation, useNavigate } from "react-router-dom";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { useContext, useEffect, useState } from "react";
import { IPost, IPostListResponse } from "../../../../models/interface/IPost";
import { ManagePost, ScrapURL } from "../../../../api/api";
import { IScrap, IScrapListResponse } from "./../../../../models/interface/IScrap";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { NoticeContext } from "../../../../api/provider/NoticeProvider";
import { Scrap } from "./../../../../pages/Scrap";
import { useRecoilState, useRecoilValue } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { scrapIndexGrop, scrapState } from "../../../../stores/modalState";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";

export const ScrapMain = () => {
  const { search } = useLocation();
  const navigate = useNavigate(); // useNavigate 훅을 컴포넌트의 최상단에서 선언
  const [scrapList, setScrapList] = useState<IScrap[]>([]);
  const [scrapCnt, setScrapCnt] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cPage, setCPage] = useState<number>();
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const { searchKeyWord } = useContext(NoticeContext);
  const [isScrap, setIsScrap] = useRecoilState<boolean>(scrapState);
  const [scrapIndexG, setScrapIndexG] = useRecoilState<number[]>(scrapIndexGrop);
  const scrapIndexes = useRecoilValue(scrapIndexGrop);
  const [selectedItems, setSelectedItems] = useState([]);

  // 검색어가 변경되거나 컴포넌트가 마운트될 때 포스트 리스트를 검색
  useEffect(() => {
    searchScrapList(currentPage);
  }, [search, searchKeyWord, scrapIndexes]);

  useEffect(() => {
    setIsScrap(true); // Scrap 페이지에 들어왔을 때
    setScrapIndexG(selectedItems);
    return () => {
      setIsScrap(false); // Scrap 페이지를 나갈 때
    };
  }, [selectedItems]);

  // 포스트 리스트 검색 함수
  const searchScrapList = async (currentPage?: number) => {
    currentPage = currentPage || 1;
    const searchParam = {
      ...searchKeyWord,
      currentPage: currentPage.toString(),
      pageSize: "5",
    };

    const searchList = await postNoticeApi<IScrapListResponse>(ScrapURL.getScrapList, searchParam);
    console.log(searchParam);
    console.log(searchList);
    if (searchList) {
      setScrapList(searchList.data.scrapList);
      setScrapCnt(searchList.data.scrapCnt);
      setCPage(currentPage);
    }
  };

  // 상세 보기 핸들러 함수
  const handlerDetail = (postIdx: number, bizIdx: number) => {
    navigate(`/react/manage-post/managePostDetailBody.do`, {
      state: { postIdx, bizIdx },
    });
  };

  const handleCheckboxChange = (e, item) => {
    if (e.target.checked) {
      // 체크박스가 선택된 경우, 항목 추가
      setSelectedItems((prev) => {
        const updatedItems = [...prev, item];
        console.log("항목 추가 후 selectedItems:", updatedItems);
        setTimeout(() => setScrapIndexG(updatedItems), 0);
        return updatedItems;
      });
    } else {
      // 체크박스 선택 해제, 항목 제거
      setSelectedItems((prev) => {
        const updatedItems = prev.filter((i) => i !== item);
        console.log("항목 제거 후 selectedItems:", updatedItems);
        setTimeout(() => setScrapIndexG(updatedItems), 0);
        return updatedItems;
      });
    }
  };

  return (
    <>
      <StyledTable>
        <thead>
          <tr>
            <StyledTh size={5}></StyledTh>
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
                  <input type="checkbox" onChange={(e) => handleCheckboxChange(e, scrap.scrapIdx)} />
                </StyledTd>
                {!scrap.loginId ? (
                  <>
                    <StyledTd onClick={() => handlerDetail(scrap.postIdx, scrap.postBizIdx)}>
                      {scrap.postBizName}
                    </StyledTd>
                    <StyledTd onClick={() => handlerDetail(scrap.postIdx, scrap.postBizIdx)}>
                      {scrap.postTitle}
                    </StyledTd>
                    <StyledTd>{scrap.postExpRequired}</StyledTd>
                    <StyledTd>{scrap.postWorkLocation}</StyledTd>
                    <StyledTd>{scrap.postEndDate?.substring(0, 10) || "Invalid Date"}</StyledTd>
                    <StyledTd>
                      <button type="button" className="btn btn-warning">
                        입사지원
                      </button>
                    </StyledTd>
                  </>
                ) : (
                  <StyledTd colSpan={6}>
                    <span>삭제된 공고입니다</span>
                  </StyledTd>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <StyledTd colSpan={7}>데이터가 없습니다.</StyledTd>
            </tr>
          )}
        </tbody>
      </StyledTable>

      <PageNavigate totalItemsCount={scrapCnt} onChange={searchScrapList} activePage={cPage} itemsCountPerPage={5} />
    </>
  );
};
