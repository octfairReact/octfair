import { RouteObject, createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/Login";
import { DashBoard } from "../component/layout/DashBoard/DashBoard";
import { NotFound } from "../component/common/NotFound/NotFound";
import { Notice } from "../pages/Notice";
import { History } from "../pages/History";
import { NoticeRouter } from "../component/page/Notice/NoticeRouter/NoticeRouter";
import { Hire } from "../pages/HireMain";
import { HireAdd } from "../pages/HireWrite";
import { Post } from "../pages/Post";
import { ManagePostPage } from "../pages/ManagePostPage";
import { CompanyDetail } from "../pages/Company/CompanyDetail";
import { CompanyWrite } from "../pages/Company/CompanyWrite";
import { CompanyUpdate } from "../pages/Company/CompanyUpdate";
import { MyPageUpdate } from "../pages/MyPageUpdate";
import { MyPageWithdraw } from "../pages/MyPageWithdraw";
import { Resume } from "../pages/Resume";
import { ResumeForm } from "../pages/ResumeForm";
import { Scrap } from "../pages/Scrap";
import { FaQ } from "../pages/FaQ";
import { Applicant } from "../pages/Applicant";
import { QnA } from "../pages/QnA";
import { ManageApplicant } from "../pages/ManageApplicant";
import { ManageBiz } from "../pages/ManageBiz";

const routers: RouteObject[] = [
  { path: "*", element: <NotFound /> },
  { path: "/", element: <Login /> },
  {
    path: "/react",
    element: <DashBoard />,

    children: [
      {
        path: "apply",
        children: [
          { path: "history.do", element: <History /> },
          { path: "resume.do", element: <Resume /> },
          { path: "resume-new.do", element: <ResumeForm /> },
          { path: "resume-detail/:resIdx", element: <ResumeForm /> },
        ],
      },
      {
        path: "board",
        children: [
          { path: "notice.do", element: <Notice /> },
          { path: "notice.do/:noticeIdx", element: <NoticeRouter /> },
          { path: "faq.do", element: <FaQ /> },
          { path: "qna.do", element: <QnA /> },
        ],
      },
      {
        path: "manage-hire",
        children: [
          { path: "post.do", element: <Hire /> },
          { path: "managehireWritePage.do", element: <HireAdd /> },
          { path: "applicant.do", element: <Applicant /> },
        ],
      },
      {
        path: "jobs",
        children: [
          { path: "posts.do", element: <Post /> },
          { path: "scrap.do", element: <Scrap /> },
        ],
      },

      {
        path: "manage-post",
        children: [
          { path: "managePostDetailBody.do", element: <ManagePostPage /> },
          { path: "approval.do", element: <Post /> },
          { path: "post.do", element: <Post /> },
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
      {
        path: "mypage",
        children: [
          { path: "update.do", element: <MyPageUpdate /> },
          { path: "withdraw.do", element: <MyPageWithdraw /> },
          //:id 이게 키값이 됨
        ],
      },
      {
        path: "manage-user",
        children: [
          { path: "applicant.do", element: <ManageApplicant /> },
          { path: "biz.do", element: <ManageBiz /> },
        ],
      },
    ],
  },
];

export const Routers = createBrowserRouter(routers);
