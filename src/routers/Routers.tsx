import { RouteObject, createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/Login";
import { DashBoard } from "../component/layout/DashBoard/DashBoard";
import { NotFound } from "../component/common/NotFound/NotFound";
import { Notice } from "../pages/Notice";
import { History } from "../pages/history";
import { NoticeRouter } from "../component/page/Notice/NoticeRouter/NoticeRouter";
import { Post } from "../pages/Post";
import { ManagePostPage } from "../pages/ManagePostPage";
import { MyPage } from "../pages/MyPage";
import { CompanyDetail } from "../pages/Company/CompanyDetail";
import { CompanyWrite } from "../pages/Company/CompanyWrite";
import { CompanyUpdate } from "../pages/Company/CompanyUpdate";
import { MyPageUpdate } from "../pages/MyPageUpdate";
import { MyPageWithdraw } from "../pages/MyPageWithdraw";
import { Resume } from "../pages/Resume";
import { ResumeForm } from "../pages/ResumeForm";

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
      {
        path: "mypage",
        children: [
          { path: "update.do", element: <MyPageUpdate /> },
          { path: "withdraw.do", element: <MyPageWithdraw /> },
          //:id 이게 키값이 됨
        ],
      },
      {
        path: "apply",
        children: [
          { path: "history.do", element: <History /> },
          { path: "resume.do", element: <Resume /> },
          { path: "resume-new.do", element: <ResumeForm /> },
          { path: "resume-detail/:resIdx", element: <ResumeForm /> },
        ],
      },
    ],
  },
];

export const Routers = createBrowserRouter(routers);
