import { NoticeSearchStyled } from "./styled";
import { Button } from "../../../common/Button/Button";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { modalState, noticeState, postIndexGrop, scrapIndexGrop, scrapState } from "../../../../stores/modalState";
import { NoticeContext } from "../../../../api/provider/NoticeProvider";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { IScrapResponse } from "../../../../models/interface/IScrap";
import { ScrapURL } from "../../../../api/api";
import { toast } from "react-toastify";

export const NoticeSearch = () => {
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [scrap] = useRecoilState<boolean>(scrapState);
  const [notice] = useRecoilState<boolean>(noticeState);
  const scrapIndexes = useRecoilValue(scrapIndexGrop);
  const setScrapIndexes = useSetRecoilState(scrapIndexGrop);
  const postIndexes = useRecoilValue(postIndexGrop);

  const [searchValue, setSearchValue] = useState<{ searchTitle: string; searchStDate: string; searchEdDate: string }>({
    searchTitle: "",
    searchStDate: "",
    searchEdDate: "",
  });

  const { setSearchKeyWord } = useContext(NoticeContext);
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const navigate = useNavigate();

  useEffect(() => {
    window.location.search && navigate(window.location.pathname, { replace: true });
  }, [navigate]);

  const handlerSearch = () => {
    setSearchKeyWord(searchValue);
  };

  const handlerModal = () => {
    setModal(!modal);
  };

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
      const updateScrap = await postNoticeApi<IScrapResponse>(ScrapURL.getScarpUpdate, postParam);
      if (updateScrap && updateScrap.data.result === "success") {
      } else {
        toast.warning("수정실패 했습니다.");
        return;
      }
    }

    if (scrapIndexes.length > 0) {
      const deleteScrap = await postNoticeApi<IScrapResponse>(ScrapURL.getScarpDelete, scrapParam);
      if (deleteScrap && deleteScrap.data.result === "success") {
        toast.success("삭제되었습니다.");
        setScrapIndexes([]); // 새로 고침을 위한 상태 초기화
        setSearchKeyWord({
          searchTitle: "",
          searchStDate: "",
          searchEdDate: "",
        }); // 상태 초기화
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
      <text>제목</text>
      <div className="input-box">
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
