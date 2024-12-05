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
import { IPasswordCheck, IPasswordCheckResponse, IQnaAns, IQnaListResponse } from "../../../../models/interface/IQna";
import { postQnaApi } from "../../../../api/postQnaApi";
import { Qna } from "../../../../api/api";
import { QnaContext } from "../../../../api/provider/QnaProvider";
import { QnaPassword } from "../QnaModal/QnaPassword";
import { HistoryModalStyled } from "../../History/HistoryModal/styled";
import { qnaMyListState, qnaPasswordModalState } from "../../../../stores/qnaModalState";
import { toast } from "react-toastify";

export const QnaMain = () => {
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [qnaType, setQnaType] = useState<string>(userInfo.userType);
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [qnaCnt, setQnaCnt] = useState<number>(0);
  const [qPage, setQPage] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [qnaList, setQnaList] = useState<IQnaAns[]>();
  const { searchKeyWord } = useContext(QnaContext);
  const [qnaMyList, setQnaMyList] = useRecoilState<string>(qnaMyListState);
  const [index, setIndex] = useState<number>();
  const [passwordmodal, setPasswordModal] = useRecoilState<boolean>(qnaPasswordModalState);
  const [password, setPassword] = useState<string>(""); // 비밀번호 상태 관리
  const [isLoaded, setIsLoaded] = useState(false); //로딩 상태 관리. 조회 결과 나오기전까지 랜더링 안되게

  useEffect(() => {
    if (userInfo && userInfo.userType) {
      if (userInfo.userType === "M") {
        setQnaType("A"); // userInfo가 로드되면 qnaType 설정
      } else {
        setQnaType(userInfo.userType); // 그 외의 경우 userInfo.userType 값을 그대로 설정
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (qnaType && searchKeyWord) {
      searchQnaList(currentPage, qnaType, qnaMyList);
    }
  }, [qnaType, searchKeyWord, qnaMyList]);

  const searchQnaList = async (currentPage?: number, qnaType?: string, requestType?: string) => {
    currentPage = currentPage || 1;
    const searchParam = {
      ...searchKeyWord,
      currentPage: currentPage.toString(),
      pageSize: "5",
      qna_type: qnaType,
      loginId: userInfo.loginId,
      requestType: qnaMyList || "all",
    };
    const searchList = await postQnaApi<IQnaListResponse>(Qna.getList, searchParam);

    if (searchList) {
      setQnaList(searchList.data.qna);
      setQnaCnt(searchList.data.qnaCnt);
      setQPage(currentPage);
    }
    setIsLoaded(true);
  };

  // faqType 변경하는 버튼 클릭 핸들러
  const handleFaqTypeChange = (type: string) => {
    setQnaType(type); // 클릭된 타입으로 faqType 상태 변경
    setQnaMyList("all");
  };

  const onPostSuccess = () => {
    setModal(!modal);
    setQnaType(qnaType);
    if (qnaType) {
      searchQnaList(currentPage, qnaType);
    }
  };

  const handlerModal = (qnaIdx: number) => {
    setModal(!modal);
    setIndex(qnaIdx);
  };

  const handlerPasswordModal = (qnaIdx: number) => {
    setPasswordModal(!passwordmodal);
    setIndex(qnaIdx);
  };

  // 비밀번호 체크
  const handlePasswordSubmit = async (submittedPassword: string, index: number) => {
    const param = {
      qnaSeq: index,
      password: submittedPassword,
    };

    // 비밀번호 확인 시작 전 로딩 상태 설정
    setIsLoaded(false);
    try {
      const passwordCheckRe = await postQnaApi<IPasswordCheck>(Qna.checkPassword, param); // 서버로 비밀번호 확인 요청

      if (passwordCheckRe?.data?.result === "success") {
        setPassword(passwordCheckRe.data.password);
        setIndex(passwordCheckRe.data.qnaSeq); // 글 번호 저장
        setPasswordModal(false); // 비밀번호 입력 모달 닫기
        setModal(!modal);
      } else {
        toast.warning("비밀번호가 일치하지 않습니다.");
        setPasswordModal(false); // 비밀번호 입력 모달 닫기
      }
    } catch (error) {
      toast.warning("비밀번호 확인 중 오류가 발생했습니다. 다시 시도해주세요.");
      setPasswordModal(false); // 비밀번호 입력 모달 닫기
    } finally {
      // 요청이 완료된 후 로딩 상태 해제
      setIsLoaded(true);
    }
  };

  if (!isLoaded || qnaType === undefined) {
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
      <QnaMainStyled>
        <div>
          <StyledButton
            isActive={qnaType === "A" || qnaType === "M"} // faqType이 "A"이면 해당 버튼이 활성화됨
            onClick={() => handleFaqTypeChange("A")}
          >
            개인회원
          </StyledButton>
          <StyledButton
            isActive={qnaType === "B"} // faqType이 "b"이면 해당 버튼이 활성화됨
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
          </tr>
        </thead>
        <tbody>
          {qnaList?.length > 0 ? (
            qnaList.map((qna) => (
              <>
                {/* 클릭 가능한 FAQ 리스트 */}
                <tr key={qna?.qnaIdx}>
                  <td>{qna?.qnaIdx}</td>
                  <td
                    onClick={() => {
                      if (userInfo.userType !== "M") {
                        handlerPasswordModal(qna?.qnaIdx); // ans_content가 null이면 비밀번호 모달을 띄운다
                      } else {
                        handlerModal(qna?.qnaIdx); // 그렇지 않으면 기존의 모달을 띄운다
                      }
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                    style={{ cursor: "pointer" }}
                  >
                    {qna?.title}
                    {qna?.ans_content && (
                      <span
                        style={{
                          marginLeft: "8px",
                          display: "inline-block",
                          padding: "4px 8px",
                          backgroundColor: "#e6f7ff",
                          borderRadius: "4px", // 선택적으로 둥근 모서리 추가
                        }}
                      >
                        답변 완료
                      </span>
                    )}
                  </td>
                  <td>{qna?.author}</td>
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
          // onChange={searchQnaList}
          onChange={(page) => {
            setCurrentPage(page); // 페이지 번호 변경(클릭시)
            searchQnaList(page, qnaType, qnaMyList); // 페이지 변경 시 목록을 다시 로드
          }}
          activePage={qPage}
          itemsCountPerPage={5}
        ></PageNavigate>
      </PageNavigateStyled>

      {/* 모달 컴포넌트 */}
      {modal && <QnaModal onSuccess={onPostSuccess} qnaSeq={index} setQnaSeq={setIndex} qnaPassword={password} />}
      {passwordmodal && <QnaPassword onPasswordSubmit={handlePasswordSubmit} qnaIdx={index} />}
    </>
  );
};
