import { Button } from "react-bootstrap";
import { FaqSearchStyled } from "./styled";
import { useContext, useState } from "react";
import { FqaContext } from "../../../../api/provider/FaqProvider";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";

export const FaqSearch = () => {
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [searchValue, setSearchValue] = useState<{ searchTitle: string; searchStDate: string; searchEdDate: string }>({
    searchTitle: "",
    searchStDate: "",
    searchEdDate: "",
  });
  const { setSearchKeyWord } = useContext(FqaContext);
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);

  const handlerSearch = () => {
    setSearchKeyWord(searchValue);
  };

  const handlerModal = () => {
    setModal(!modal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlerSearch(); // Enter 키가 눌리면 검색 실행
    }
  };

  return (
    <>
      <FaqSearchStyled>
        <div className="input-box">
          <label>제목</label>
          <input
            onChange={(e) => setSearchValue({ ...searchValue, searchTitle: e.target.value })}
            onKeyDown={handleKeyDown} // 엔터 키 이벤트 추가
          ></input>
          <label>기간</label>
          <input type="date" onChange={(e) => setSearchValue({ ...searchValue, searchStDate: e.target.value })}></input>
          <label>
            ~
            <input
              type="date"
              onChange={(e) => setSearchValue({ ...searchValue, searchEdDate: e.target.value })}
            ></input>
            <Button onClick={handlerSearch}>검색</Button>
          </label>
          {userInfo.userType === "M" ? <Button onClick={handlerModal}>신규등록</Button> : null}
        </div>
      </FaqSearchStyled>
    </>
  );
};
