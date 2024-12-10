import { NoticeSearchStyled } from "./styled";
import { Button } from "../../../common/Button/Button";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { IScrapResponse } from "../../../../models/interface/IScrap";
import { ScrapURL } from "../../../../api/api";
import { ScrapContext } from "../../../../api/provider/ScrapProvider";
import { toast } from "react-toastify";

export const NoticeSearch = () => {
  const [modal, setModal] = useRecoilState<boolean>(modalState);

  const [searchValue, setSearchValue] = useState<{ searchTitle: string; searchStDate: string; searchEdDate: string }>({
    searchTitle: "",
    searchStDate: "",
    searchEdDate: "",
  });
  const { scrapIndexes, setScrapIndexes, postIndexes, setPostIndexes, setSearchKeyWord } = useContext(ScrapContext);

  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
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

  const deleteScrap = async () => {
    console.log("딜리트 눌럿다." + postIndexes);
    console.log("딜리트 눌럿다." + scrapIndexes);
    const postParam = {
      postIndexes,
    };
    const scrapParam = {
      scrapIndexes,
    };

    if (postIndexes.length > 0) {
      const updateScrap = await postNoticeApi<IScrapResponse>(ScrapURL.getScarpUpdate, postParam);
      if (updateScrap && updateScrap.data.result === "success") {
      } else {
        toast.warning("수정실패 했습니다.");
        return;
      }

      console.log("업데이트 완료");
    }

    if (scrapIndexes.length > 0) {
      const deleteScrap = await postNoticeApi<IScrapResponse>(ScrapURL.getScarpDelete, scrapParam);
      if (deleteScrap && deleteScrap.data.result === "success") {
        toast.success("삭제되었습니다.");
        setScrapIndexes([]); // 새로 고침을 위한 상태 초기화
        setPostIndexes([]);
      } else {
        toast.warning("삭제실패 했습니다.");
      }
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
      <label>제목</label>
      <div className="input-box">
        <input
          onChange={(e) => setSearchValue({ ...searchValue, searchTitle: e.target.value })}
          onKeyDown={handleKeyDown} // 엔터 키 이벤트 추가
        ></input>
        <input type="date" onChange={(e) => setSearchValue({ ...searchValue, searchStDate: e.target.value })}></input>
        <input type="date" onChange={(e) => setSearchValue({ ...searchValue, searchEdDate: e.target.value })}></input>
        <Button onClick={handlerSearch}>검색</Button>

        {/* 유저 타입 m일때만 보이게 하기  */}
        <Button onClick={handlerModal}>등록</Button>
      </div>
    </NoticeSearchStyled>
  );
};
