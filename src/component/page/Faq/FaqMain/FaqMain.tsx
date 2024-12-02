import { useContext, useEffect, useState } from "react";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { PageNavigateStyled } from "../../../common/pageNavigation/styled";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { FqaContext } from "../../../../api/provider/FaqProvider";
import { useLocation } from "react-router-dom";
import { postFaqApi } from "../../../../api/postFaqApi";
import { Faq } from "../../../../api/api";
import { IFaq, IFaqListResponse } from "../../../../models/interface/IFaq";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { FaqMainStyled, StyledButton } from "./styled";
import { FaqModal } from "../FaqModal/FaqModal";
import { modalState } from "../../../../stores/modalState";
import { HistoryModalStyled } from "../../History/HistoryModal/styled";

export const FaqMain = () => {
  // const { search } = useLocation();
  const [faqCnt, setFaqCnt] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cPage, setCPage] = useState<number>();
  const { searchKeyWord } = useContext(FqaContext);
  const [faqList, setFaqList] = useState<IFaq[]>();
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [faqType, setFaqType] = useState<string>(userInfo.userType === "B" ? "2" : "1");
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [showContext, setShowContext] = useState(null);
  const [faqIndex, setFaqIndex] = useState<number>();
  const [isLoaded, setIsLoaded] = useState(false); //로딩 상태 관리. 조회 결과 나오기전까지 랜더링 안되게

  useEffect(() => {
    if (userInfo && userInfo.userType) {
      if (userInfo.userType === "M") {
        setFaqType("1"); // userType이 "M"일 경우 faqType을 1로 설정
      } else {
        setFaqType(userInfo.userType); // 그 외의 경우 userInfo.userType 값을 그대로 설정
      }
    }
  }, [userInfo]);

  useEffect(() => {
    let transFaqType = faqType;
    if (faqType === "B") {
      transFaqType = "2";
    } else if (faqType === "M" || faqType === "A") {
      transFaqType = "1";
    }
    setFaqType(transFaqType);

    if (faqType && searchKeyWord) {
      searchFaqList(currentPage, faqType);
    } else {
      console.log("유저정보 아직");
    }
  }, [faqType, searchKeyWord]);

  // useEffect(() => {
  //   searchFaqList(currentPage);
  // }, [search]);

  // useEffect(() => {
  //   searchFaqList();
  // }, [searchKeyWord]);

  const searchFaqList = async (currentPage?: number, faqType?: string) => {
    currentPage = currentPage || 1;
    const searchParam = {
      ...searchKeyWord,
      currentPage: currentPage.toString(),
      pageSize: "5",
      faq_type: faqType,
    };
    const searchList = await postFaqApi<IFaqListResponse>(Faq.getList, searchParam);

    if (searchList) {
      setFaqList(searchList.data.faq);
      setFaqCnt(searchList.data.faqCnt);
      setCPage(currentPage);
    }
    setIsLoaded(true);
  };

  // faqType 변경하는 버튼 클릭 핸들러
  const handleFaqTypeChange = (type: string) => {
    setFaqType(type); // 클릭된 타입으로 faqType 상태 변경
  };

  const toggleFaqContent = (faq_idx: number) => {
    setShowContext((prev) => (prev === faq_idx ? null : faq_idx)); // 클릭된 항목 토글
  };

  const handlerModal = ({ faqIdx }) => {
    setModal(!modal);
    setFaqIndex(faqIdx);
  };

  const onPostSuccess = (faqType: string) => {
    setModal(!modal);
    setFaqType(faqType);
    if (faqType) {
      searchFaqList(currentPage, faqType);
    } else {
      console.log("유저정보 아직2");
    }
  };

  if (!isLoaded || faqType === undefined) {
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
      <FaqMainStyled>
        <div>
          <StyledButton
            isActive={faqType === "1"} // faqType이 "1"이면 해당 버튼이 활성화됨
            onClick={() => handleFaqTypeChange("1")}
          >
            개인회원
          </StyledButton>
          <StyledButton
            isActive={faqType === "2"} // faqType이 "2"이면 해당 버튼이 활성화됨
            onClick={() => handleFaqTypeChange("2")}
          >
            기업회원
          </StyledButton>
        </div>
      </FaqMainStyled>
      <StyledTable>
        <thead>
          <tr>
            <StyledTh size={5}>번호</StyledTh>
            <StyledTh size={50}>제목</StyledTh>
            <StyledTh size={10}>작성자</StyledTh>
            <StyledTh size={20}>등록일</StyledTh>
            {/* 관리자만 볼 수 있음 */}
            {userInfo.userType === "M" && <StyledTh size={10}>관리</StyledTh>}
          </tr>
        </thead>
        <tbody>
          {faqList?.length > 0 ? (
            faqList.map((faq) => (
              <>
                {/* 클릭 가능한 FAQ 리스트 */}
                <tr key={faq.faq_idx}>
                  <td>{faq.faq_idx}</td>
                  <td
                    onClick={() => toggleFaqContent(faq.faq_idx)}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                    style={{ cursor: "pointer" }}
                  >
                    {faq.title}
                  </td>
                  <td>{faq.author}</td>
                  <td>{new Date(faq.created_date).toISOString().substring(0, 10)}</td>
                  {userInfo.userType === "M" && (
                    <td className="btn blue">
                      <button onClick={() => handlerModal({ faqIdx: faq.faq_idx })}>관리</button>
                    </td>
                  )}
                </tr>
                {/* 클릭된 FAQ의 내용 표시 */}
                {showContext === faq.faq_idx && (
                  <tr>
                    <td
                      colSpan={userInfo.userType === "M" ? 6 : 5}
                      style={{ backgroundColor: "#D7D7D7", height: "100px" }}
                    >
                      {faq.content || "내용이 없습니다."}
                    </td>
                  </tr>
                )}
              </>
            ))
          ) : (
            <tr>
              <td colSpan={5}>데이터가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </StyledTable>
      <PageNavigateStyled>
        <PageNavigate
          totalItemsCount={faqCnt}
          onChange={(page) => {
            setCurrentPage(page); // 페이지 번호 변경(클릭시)
            searchFaqList(page, faqType); // 페이지 변경 시 목록을 다시 로드
          }}
          activePage={cPage}
          itemsCountPerPage={5}
        ></PageNavigate>
      </PageNavigateStyled>

      {/* 모달 컴포넌트 */}
      {modal && <FaqModal onSuccess={onPostSuccess} faqSeq={faqIndex} setFaqIndex={setFaqIndex} />}
    </>
  );
};
