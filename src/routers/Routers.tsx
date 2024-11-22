import { RouteObject, createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/Login";
import { DashBoard } from "../component/layout/DashBoard/DashBoard";
import { NotFound } from "../component/common/NotFound/NotFound";
import { Notice } from "../pages/Notice";
import { History } from "../pages/History";
import { NoticeRouter } from "../component/page/Notice/NoticeRouter/NoticeRouter";
import { Post } from "../pages/Post";
import { ManagePostPage } from "../pages/ManagePostPage";
import { MyPage } from "../pages/MyPage";
import { MyPageWithdraw } from "../pages/MyPageWithdraw";
import { CompanyDetail } from "../pages/Company/CompanyDetail";
import { CompanyWrite } from "../pages/Company/CompanyWrite";
import { CompanyUpdate } from "../pages/Company/CompanyUpdate";

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
        path: "jobs",
        children: [{ path: "posts.do", element: <Post /> }],
      },

      {
        path: "manage-post",
        children: [{ path: "managePostDetailBody.do", element: <ManagePostPage /> }],
      },
      {
        path: "mypage",
        children: [
          { path: "update.do", element: <MyPage /> },
          { path: "withdraw.do", element: <MyPageWithdraw /> },
        ],
      },
      {
        path: "company",
        children: [
          { path: "companyWritePage.do", element: <CompanyWrite /> },
          { path: "companyUpdatePage.do", element: <CompanyUpdate /> },
          {
            path: "companyDetailPage.do/:postIdx/:bizIdx", // :postIdx와 :bizIdx는 URL 파라미터로 취급됩니다.
            element: <CompanyDetail />,
          },
        ],
      },

      // =========================== 김호관 : 입사지원 =========================
      {
        path: "apply",
        children: [
          { path: "history.do", element: <History/>},
          // { path: "history.do/:historyIds", element: <HistoryRouter/>}
        ]
      },

    ],
  },
];

export const Routers = createBrowserRouter(routers);
