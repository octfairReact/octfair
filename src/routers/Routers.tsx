import { RouteObject, createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/Login";
import { DashBoard } from "../component/layout/DashBoard/DashBoard";
import { NotFound } from "../component/common/NotFound/NotFound";
import { Notice } from "../pages/Notice";
import { NoticeRouter } from "../component/page/Notice/NoticeRouter/NoticeRouter";
import { MyPageUpdate } from "../pages/MyPageUpdate";
import { MyPageWithdraw } from "../pages/MyPageWithdraw";

const routers: RouteObject[] = [
  { path: "*", element: <NotFound /> },
  { path: "/", element: <Login /> },
  {
    path: "/react",
    element: <DashBoard />,
    children: [
      {
        path: "board",
        children: [
          { path: "notice.do", element: <Notice /> },
          { path: "notice.do/:noticeIdx", element: <NoticeRouter /> },
          //:id 이게 키값이 됨
        ],
      },
      {
        path: "mypage",
        children: [
          { path: "update.do", element: <MyPageUpdate /> },
          { path: "withdraw.do", element: <MyPageWithdraw /> },
          //:id 이게 키값이 됨
        ],
      },
    ],
  },
];

export const Routers = createBrowserRouter(routers);
