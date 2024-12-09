import { Suspense, useEffect, useState } from "react";
import { LeftMenuBar } from "../LeftMenuBar/LeftMenuBar";
import { DashBoardStyled } from "./styled";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ILoginInfo } from "../../../models/interface/store/userInfo";
import { useUserInfo } from "../../../hook/useUserInfo";
import { CustomAlert } from "../../../common/CustomAlert";
import { MenuMain } from "../../page/Login/LoginMain/MenuMain";
import { toast, ToastContainer } from "react-toastify";
import { Login } from "../../../pages/Login";
import 'react-toastify/dist/ReactToastify.css';

export const DashBoard = () => {
  const userInfo = sessionStorage.getItem("userInfo");
  const location = useLocation();
  const navigate = useNavigate();
  
  useUserInfo();

  useEffect(() => {
    if (checkLogin()==="logoutUser")
      toast("로그인 후에 이용 가능합니다.") ? navigate("/") : navigate("/");
  }, [userInfo]);

  const checkLogin = () => {
    if (!userInfo || JSON.parse(userInfo).result !== "SUCCESS")
      return "logoutUser";
    return "loginUser";
  }

  return (
    checkLogin()==="logoutUser" ? <Login /> :
    <DashBoardStyled>
      <ul className="dashboard-ul">
        <li className="menu-bar">{<LeftMenuBar />}</li>
        <li className="content">
          <Suspense fallback={<h2>Loading....</h2>}>{<Outlet />}</Suspense>
          {location.pathname === "/react" && <MenuMain />} {/* 웹크롤링한 메뉴판, 좌측과같이 쓰거나 Router에서 '/'(DashBoard)의 ''자식으로 등록해도 됨 */}
          <ToastContainer /> {/* 토스트 메시지 기능 적용 */}
        </li>
      </ul>
    </DashBoardStyled>
  );
};
