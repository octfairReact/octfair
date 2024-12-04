import { NoticeSearchStyled } from "./styled";
import { Button } from "../../../common/Button/Button";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { modalState, noticeState, postIndexGrop, scrapIndexGrop, scrapState } from "../../../../stores/modalState";
import { NoticeContext } from "../../../../api/provider/NoticeProvider";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { IScrapListResponse, IScrapResponse } from "../../../../models/interface/IScrap";
import { ScrapURL } from "../../../../api/api";

export const NoticeSearch = () => {
  const title = useRef<HTMLInputElement>();
  //React에서 제공하는 훅으로, 컴포넌트에서 값을 참조(reference)할 수 있게
  // const [startDate, setStartDate] = useState<string>();
  // //[startDate = 값, setStartDate = 함수]
  // const [endDate, setEndDate] = useState<string>();
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [scrap, setScrap] = useRecoilState<boolean>(scrapState);
  const [notice, setNotice] = useRecoilState<boolean>(noticeState);
  const scrapIndexes = useRecoilValue(scrapIndexGrop);
  const setScrapIndexes = useSetRecoilState(scrapIndexGrop);
  const postIndexes = useRecoilValue(postIndexGrop);
  const setPostIndexes = useSetRecoilState(postIndexGrop);

  const [searchValue, setSearchValue] = useState<{ searchTitle: string; searchStDate: string; searchEdDate: string }>({
    searchTitle: "",
    searchStDate: "",
    searchEdDate: "",
  });

  const { setSearchKeyWord } = useContext(NoticeContext);
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  console.log("유저 타입정보", userInfo.userType);
  // useEffect(() => {
  //   console.log(title, startDate, endDate);
  // }, [title, startDate, endDate]);
  //() => {}, [title, startDate, endDate (변화를 감지)]
  //의존성 배열

  const navigate = useNavigate();

  useEffect(() => {
    window.location.search && navigate(window.location.pathname, { replace: true });
  }, [navigate]);
  // 검색 후 리로딩하면 공지사항으로 다시 감

  // const handlerSearch = () => {
  //   const query: string[] = [];

  //   // 데이터 받기
  //   !title.current.value || query.push(`searchTitle=${title.current.value}`);
  //   !startDate || query.push(`searchStDate=${startDate}`);
  //   !endDate || query.push(`searchEdDate=${endDate}`);
  //   console.log("query", query);

  //   //데이터 주소로 만들기
  //   const queryString = query.length > 0 ? `?${query.join(`&`)}` : "";
  //   console.log("queryString", queryString);

  //   //url에 만든 데이터 넣기
  //   navigate(`/react/board/notice.do${queryString}`);
  // };

  const handlerSearch = () => {
    console.log("searchValue 여기는 NoticeSerch함수");
    console.log(searchValue);
    setSearchKeyWord(searchValue);
  };

  const handlerModal = () => {
    setModal(!modal);
  };

  // NoticeSearch 컴포넌트
  const deleteScrap = async () => {
    console.log("scrapIndex: ", scrapIndexes);
    console.log("postIndex: ", postIndexes);
    const postParam = {
      postIndexes,
    };
    const scrapParam = {
      scrapIndexes,
    };

    if (postIndexes.length > 0) {
      console.log("업데이트 작업 시작");
      const updateScrap = await postNoticeApi<IScrapResponse>(ScrapURL.getScarpUpdate, postParam);
      if (updateScrap && updateScrap.data.result === "success") {
        console.log("수정되었습니다.");
      } else {
        alert("수정실패 했습니다.");
        return;
      }
      console.log("업데이트 완료");
    }

    if (scrapIndexes.length > 0) {
      console.log("삭제 작업 시작");
      const deleteScrap = await postNoticeApi<IScrapResponse>(ScrapURL.getScarpDelete, scrapParam);
      if (deleteScrap && deleteScrap.data.result === "success") {
        alert("삭제되었습니다.");
        // 검색 결과 다시 로드
        setScrapIndexes([]); // 새로 고침을 위한 상태 초기화
        setSearchKeyWord({
          searchTitle: "",
          searchStDate: "",
          searchEdDate: "",
        }); // 상태 초기화
      } else {
        alert("삭제실패 했습니다.");
      }
      console.log("삭제 완료");
    }
  };

  // 엔터 키 입력 처리 함수
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlerSearch(); // Enter 키가 눌리면 검색 실행
    }
  };

  return (
    <NoticeSearchStyled>
      {/*NoticeSearchStyled = 라이브러리(Styled 컴포넌드/ 패키지json에 있음) */}
      <div className="input-box">
        {/* <input ref={title}></input>
        <input type="date" onChange={(e) => setStartDate(e.target.value)}></input>
        <input type="date" onChange={(e) => setEndDate(e.target.value)}></input> */}
        <input
          onChange={(e) => setSearchValue({ ...searchValue, searchTitle: e.target.value })}
          onKeyDown={handleKeyDown} // 엔터 키 이벤트 추가
        ></input>
        <input type="date" onChange={(e) => setSearchValue({ ...searchValue, searchStDate: e.target.value })}></input>
        <input type="date" onChange={(e) => setSearchValue({ ...searchValue, searchEdDate: e.target.value })}></input>
        <Button onClick={handlerSearch}>검색</Button>

        {/* 유저 타입 m일때만 보이게 하기  */}
        {userInfo.userType === "M" && notice == true && <Button onClick={handlerModal}>등록</Button>}
        {userInfo.userType === "A" && scrap == true && <Button onClick={deleteScrap}>삭제</Button>}
      </div>
    </NoticeSearchStyled>
  );
};
