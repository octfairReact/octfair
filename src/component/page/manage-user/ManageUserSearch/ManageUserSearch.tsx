import { useContext, useEffect, useState } from "react";
import { ManageUserContext } from "../../../../api/provider/ManageUserProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../common/Button/Button";
import { ManageUserSearchStyled } from "./styled";

export const ManageUserSearch = () => {
  const { setSearchKeyWord } = useContext(ManageUserContext); // 이 Provider가 선언된 pages.해당페이지 내의 컴포넌트에 공유되는 광역변수
  const [searchValue, setSearchValue] = useState<{ searchName: string; }>({
    searchName: "", // searchName은 검색키워드이고, 보통 이외에 날짜 등이 있을 수 있음
  });

  // 검색입력란 입력 -> useState로 값 상태 반영 -> useEffect 작동 -> location/navigate로 데이터 전송 및 페이지 전환
  const navigate = useNavigate(); // 페이지 전환을 하는 내장함수
  const location = useLocation(); // 페이지 주소를 담은 내장변수
  useEffect(() => { // 검색 후 리로딩하면 공지사항으로 다시 감
    location.search && navigate(location.pathname, { replace: true });
  }, [navigate]);

  // Enter=완료, ESC=닫기 작동
  const pressEnterEscHandler = (event) => {
    if (event.key === "Enter")
      setSearchKeyWord(searchValue);
  };

  return (
    <>
      <ManageUserSearchStyled onKeyDown={pressEnterEscHandler}>
        <div className="input-box">
          <text>이름/사업자명: </text>
          <input onChange={(e) => setSearchValue({ ...searchValue, searchName: e.target.value })}></input>
          <Button onClick={() => setSearchKeyWord(searchValue)}>검색</Button>
        </div>
      </ManageUserSearchStyled>
    </>
  );
}