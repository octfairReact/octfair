import { NoticeSearchStyled } from "./styled";
import { Button } from "../../../common/Button/Button";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { NoticeContext } from "../../../../api/provider/NoticeProvider";

export const NoticeSearch = () => {
  const title = useRef<HTMLInputElement>();
  //React에서 제공하는 훅으로, 컴포넌트에서 값을 참조(reference)할 수 있게
  // const [startDate, setStartDate] = useState<string>();
  // //[startDate = 값, setStartDate = 함수]
  // const [endDate, setEndDate] = useState<string>();
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [searchValue, setSearchValue] = useState<{ searchTitle: string; searchStDate: string; searchEdDate: string }>({
    searchTitle: "",
    searchStDate: "",
    searchEdDate: "",
  });

  const { setSearchKeyWord } = useContext(NoticeContext);

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

  const handlerModal = () => {
    setModal(!modal);
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
        <Button onClick={handlerModal}>등록</Button>
      </div>
    </NoticeSearchStyled>
  );
};
