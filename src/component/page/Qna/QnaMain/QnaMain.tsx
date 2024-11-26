import { useContext, useEffect, useState } from "react";
import { QnaMainStyled, StyledButton } from "./styled";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { useRecoilState } from "recoil";
import { loginInfoState } from "../../../../stores/userInfo";
import { StyledTable, StyledTh } from "../../../common/styled/StyledTable";
import { PageNavigateStyled } from "../../../common/pageNavigation/styled";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { QnaModal } from "../QnaModal/QnaModal";
import { modalState } from "../../../../stores/modalState";
import { IQnaAns, IQnaListResponse } from "../../../../models/interface/IQna";
import { FqaContext } from "../../../../api/provider/FaqProvider";
import { postQnaApi } from "../../../../api/postQnaApi";
import { Qna } from "../../../../api/api";

export const QnaMain = () => {
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [qnaType, setQnaType] = useState<string>(userInfo.userType);
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [qnaCnt, setQnaCnt] = useState<number>(0);
  const [qPage, setQPage] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [qnaList, setQnaList] = useState<IQnaAns[]>();
  const [isLoaded, setIsLoaded] = useState(false); //로딩 상태 관리. 조회 결과 나오기전까지 랜더링 안되게
  const { searchKeyWord } = useContext(FqaContext);

  useEffect(() => {
    console.log(userInfo.userType);
    if (qnaType) {
      searchQnaList(currentPage, qnaType);
    } else {
      console.log("User info is not loaded yet.");
    }
  }, [qnaType]);

  useEffect(() => {
    searchQnaList();
  }, [searchKeyWord]);

  const searchQnaList = async (currentPage?: number, qnaType?: string) => {
    currentPage = currentPage || 1;
    const searchParam = {
      ...searchKeyWord,
      currentPage: currentPage.toString(),
      pageSize: "5",
      qna_type: qnaType,
    };
    const searchList = await postQnaApi<IQnaListResponse>(Qna.getList, searchParam);

    if (searchList) {
      console.log("뭐들어와?", searchList.data.qna);
      setQnaList(searchList.data.qna);
      setQnaCnt(searchList.data.qnaCnt);
      setQPage(currentPage);
    }
    setIsLoaded(true);
  };

  // faqType 변경하는 버튼 클릭 핸들러
  const handleFaqTypeChange = (type: string) => {
    setQnaType(type); // 클릭된 타입으로 faqType 상태 변경
  };

  if (!isLoaded) {
    return null; // 로딩 완료 전까지 아무것도 렌더링하지 않음
  }

  return (
    <>
      <QnaMainStyled>
        <div>
          <StyledButton
            isActive={qnaType === "A"} // faqType이 "1"이면 해당 버튼이 활성화됨
            onClick={() => handleFaqTypeChange("A")}
          >
            개인회원
          </StyledButton>
          <StyledButton
            isActive={qnaType === "B"} // faqType이 "2"이면 해당 버튼이 활성화됨
            onClick={() => handleFaqTypeChange("B")}
          >
            기업회원
          </StyledButton>
        </div>
      </QnaMainStyled>
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
          {qnaList?.length > 0 ? (
            qnaList.map((qna) => (
              <>
                {/* 클릭 가능한 FAQ 리스트 */}
                <tr key={qna.qnaIdx}>
                  <td>{qna.qnaIdx}</td>
                  <td>
                    {qna.title}
                    {qna.ans_content && <span style={{ color: "green", marginLeft: "8px" }}>답변 완료</span>}
                  </td>
                  <td>{qna.author}</td>
                  <td>{new Date(qna.createdDate).toISOString().substring(0, 10)}</td>
                </tr>
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
          totalItemsCount={qnaCnt}
          onChange={searchQnaList}
          activePage={qPage}
          itemsCountPerPage={5}
        ></PageNavigate>
      </PageNavigateStyled>

      {/* 모달 컴포넌트 */}
      {modal && <QnaModal />}
    </>
  );
};
