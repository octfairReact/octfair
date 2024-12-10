import { useContext, useEffect, useState } from "react";
import { PostContext } from "../../../../api/provider/PostProvider";
import { useNavigate } from "react-router-dom";
import { NoticeSearchStyled } from "../../Notice/NoticeSearch/styled";
import { Button } from "react-bootstrap";

export const PostSearch = () => {
  const [searchValue, setSearchValue] = useState<{ searchTitle: string; searchStDate: string; searchEdDate: string }>({
    searchTitle: "",
    searchStDate: "",
    searchEdDate: "",
  });

  const { setSearchKeyWord } = useContext(PostContext);

  const navigate = useNavigate();

  useEffect(() => {
    window.location.search && navigate(window.location.pathname, { replace: true });
  }, [navigate]);

  // 검색 후 리로딩하면 공지
  const handlerSearch = () => {
    console.log(searchValue);
    setSearchKeyWord(searchValue);
  };

  return (
    <NoticeSearchStyled>
      <div className="input-box">
        <input onChange={(e) => setSearchValue({ ...searchValue, searchTitle: e.target.value })}></input>
        <input type="date" onChange={(e) => setSearchValue({ ...searchValue, searchStDate: e.target.value })}></input>
        <input type="date" onChange={(e) => setSearchValue({ ...searchValue, searchEdDate: e.target.value })}></input>
        <Button onClick={handlerSearch}>검색</Button>
        <Button>등록</Button>
      </div>
    </NoticeSearchStyled>
  );
};
