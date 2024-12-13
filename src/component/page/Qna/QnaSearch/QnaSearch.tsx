import { Button } from "react-bootstrap";
import { QnaSearchStyled } from "./styled";
import { useRecoilState } from "recoil";
import { useContext, useState } from "react";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { modalState } from "../../../../stores/modalState";
import { QnaContext } from "../../../../api/provider/QnaProvider";
import { qnaMyListState } from "../../../../stores/qnaModalState";

export const QnaSearch = () => {
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [searchValue, setSearchValue] = useState<{ searchTitle: string; searchStDate: string; searchEdDate: string }>({
    searchTitle: "",
    searchStDate: "",
    searchEdDate: "",
  });
  const { setSearchKeyWord } = useContext(QnaContext);
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [qnaMyList, setQnaMyList] = useRecoilState<string>(qnaMyListState);

  const handlerSearch = () => {
    setSearchKeyWord(searchValue);
  };

  const handlerModal = () => {
    setModal(!modal);
  };

  const handlerMylist = (requestType: string) => {
    setQnaMyList(requestType);
  };

  // 엔터 키 입력 처리 함수
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlerSearch(); // Enter 키가 눌리면 검색 실행
    }
  };
  return (
    <>
      <QnaSearchStyled>
        <div className="input-box">
          {/* userInfo.userType이 "M"일 때만 검색 필드 보이기 */}
          {userInfo.userType === "M" && (
            <>
              <label>제목</label>
              <input
                onChange={(e) => setSearchValue({ ...searchValue, searchTitle: e.target.value })}
                onKeyDown={handleKeyDown} // 엔터 키 이벤트 추가
              ></input>

              <label>기간</label>
              <input
                type="date"
                onChange={(e) => setSearchValue({ ...searchValue, searchStDate: e.target.value })}
              ></input>

              <label>
                ~
                <input
                  type="date"
                  onChange={(e) => setSearchValue({ ...searchValue, searchEdDate: e.target.value })}
                ></input>
                <Button onClick={handlerSearch}>검색</Button>
              </label>
            </>
          )}
          {/* 유저 타입 m일때만 보이게 하기  */}
          {(userInfo?.userType === "B" || userInfo?.userType === "A") && (
            <>
              <Button onClick={() => handlerMylist("my")}>내가 쓴 글</Button>
              <Button onClick={handlerModal}>질문등록</Button>
            </>
          )}
        </div>
      </QnaSearchStyled>
    </>
  );
};
