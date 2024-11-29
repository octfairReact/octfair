import { Suspense, useEffect, useState } from "react";
import { LeftMenuBar } from "../LeftMenuBar/LeftMenuBar";
import { DashBoardStyled } from "./styled";
import { Outlet, useNavigate } from "react-router-dom";
import { ILoginInfo } from "../../../models/interface/store/userInfo";
import { useUserInfo } from "../../../hook/useUserInfo";
import { CustomAlert } from "../../../common/CustomAlert";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const DashBoard = () => {
  const [alertMessage, setAlertMessage] = useState("");
  const userInfo = sessionStorage.getItem("userInfo");
  const navigate = useNavigate();
  useUserInfo();

  useEffect(() => {
    if (userInfo) {
      const userInfoObj: ILoginInfo = JSON.parse(userInfo);
      if (userInfoObj.result !== "SUCCESS") {
        //alert("로그인을 실패했습니다");
        setAlertMessage("로그인을 실패했습니다");
        //navigate("/");
      }
    } else {
      //alert("로그인부터 해주세요");
      setAlertMessage("로그인 후에 이용 가능합니다.");
      //navigate("/");
    }
  }, [userInfo]);

  const handleCloseAlert = () => {
    setAlertMessage("");
    navigate("/");
  };

  return (
    <DashBoardStyled>
      {alertMessage && <CustomAlert message={alertMessage} onClose={handleCloseAlert} />}
      <ul className="dashboard-ul">
        <li className="menu-bar">{<LeftMenuBar />}</li>
        <li className="content">
          <Suspense fallback={<h2>Loading....</h2>}>{<Outlet />}</Suspense>
          {/* 토스트 메시지 기능 적용 */}
          <ToastContainer/>
        </li>
      </ul>
    </DashBoardStyled>
  );
};
