import { NoticeSearchStyled } from "./styled";
import { Button } from "../../../common/Button/Button";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { IScrapResponse } from "../../../../models/interface/IScrap";
import { ScrapURL } from "../../../../api/api";
import { ScrapContext } from "../../../../api/provider/ScrapProvider";

export const ScrapSearch = () => {
  //React에서 제공하는 훅으로, 컴포넌트에서 값을 참조(reference)할 수 있게
  // const [startDate, setStartDate] = useState<string>();
  // //[startDate = 값, setStartDate = 함수]
  // const [endDate, setEndDate] = useState<string>();

  const [searchValue, setSearchValue] = useState<{ searchTitle: string; searchStDate: string; searchEdDate: string }>({
    searchTitle: "",
    searchStDate: "",
    searchEdDate: "",
  });
  const { scrapIndexes, setScrapIndexes, postIndexes, setPostIndexes, setSearchKeyWord } = useContext(ScrapContext);

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
    setSearchKeyWord(searchValue);
  };

  // NoticeSearch 컴포넌트
  const deleteScrap = async () => {
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
        setPostIndexes([]);
      } else {
        alert("삭제실패 했습니다.");
      }
      console.log("삭제 완료");
    }
  };
  return (
    <NoticeSearchStyled>
      {/*NoticeSearchStyled = 라이브러리(Styled 컴포넌드/ 패키지json에 있음) */}
      <div className="input-box">
        {/* <input ref={title}></input>
        <input type="date" onChange={(e) => setStartDate(e.target.value)}></input>
        <input type="date" onChange={(e) => setEndDate(e.target.value)}></input> */}
        <input onChange={(e) => setSearchValue({ ...searchValue, searchTitle: e.target.value })}></input>
        <input type="date" onChange={(e) => setSearchValue({ ...searchValue, searchStDate: e.target.value })}></input>
        <input type="date" onChange={(e) => setSearchValue({ ...searchValue, searchEdDate: e.target.value })}></input>
        <Button onClick={handlerSearch}>검색</Button>

        {/* 유저 타입 m일때만 보이게 하기  */}
        <Button onClick={deleteScrap}>삭제</Button>
      </div>
    </NoticeSearchStyled>
  );
};
