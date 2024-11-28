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

    const navigate = useNavigate(); // 페이지 전환을 하는 내장함수
    const location = useLocation(); // 페이지 주소를 담은 내장변수
    useEffect(() => { // 검색 후 리로딩하면 공지사항으로 다시 감
        location.search && navigate(location.pathname, { replace: true });
    }, [navigate]);

    return (
        <>
            <ManageUserSearchStyled>
                <div className="input-box">
                    <input onChange={(e) => setSearchValue({ ...searchValue, searchName: e.target.value })}></input>
                    <Button onClick={() => setSearchKeyWord(searchValue)}>검색</Button>
                </div>
            </ManageUserSearchStyled>
        </>
    );
}