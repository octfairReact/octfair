import { RouteObject, createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/Login";
import { DashBoard } from "../component/layout/DashBoard/DashBoard";
import { NotFound } from "../component/common/NotFound/NotFound";
import { Notice } from "../pages/Notice";
import { History } from "../pages/History";
import { Hire } from "../pages/HireMain";
import { HireAdd } from "../pages/HireWrite";
import { Post } from "../pages/Post";
import { ManagePostPage } from "../pages/ManagePostPage";
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
import { CompanyWritePage } from "../component/page/company/CompanyWritePage/CompanyWritePage";
import { CompanyUpdatePage } from "../component/page/company/CompanyUpdatePage/CompanyUpdatePage";
import { CompanyDetailPage } from "../component/page/company/CompanyDetail/CompanyDetailPage";
import { MenuMain } from "../component/page/Login/LoginMain/MenuMain";
import { ImageCardList } from "../component/page/Login/LoginMain/ImageCardList";

const routers: RouteObject[] = [
  { path: "*", element: <NotFound /> },
  { path: "/", element: <Login /> },
  {
    path: "/react",
    element: <DashBoard />,

    children: [
      {
        path: "",
        element:  <>
                    <MenuMain />, 
                    {/* <ImageCardList /> */}
                  </>
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
      {
        path: "board",
        children: [
          { path: "notice.do", element: <Notice /> },
          { path: "faq.do", element: <FaQ /> },
          { path: "qna.do", element: <QnA /> },
        ],
      },
      {
        path: "company",
        children: [
          { path: "companyWritePage.do", element: <CompanyWritePage /> },
          { path: "companyUpdatePage.do", element: <CompanyUpdatePage /> },
          {
            path: "companyDetailPage.do/:postIdx/:bizIdx", // :postIdx와 :bizIdx는 URL 파라미터로 취급됩니다.
            element: <CompanyDetailPage />,
          },
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
        path: "manage-hire",
        children: [
          { path: "post.do", element: <Hire /> },
          { path: "managehireWritePage.do", element: <HireAdd /> },
          { path: "managehireWritePageUpdate.do", element: <HireAdd /> },
          { path: "applicant.do", element: <Applicant /> },
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
        path: "manage-user",
        children: [
          { path: "applicant.do", element: <ManageApplicant /> },
          { path: "biz.do", element: <ManageBiz /> },
        ],
      },
      {
        path: "mypage",
        children: [
          { path: "update.do", element: <MyPageUpdate /> },
          { path: "withdraw.do", element: <MyPageWithdraw /> },
        ],
      },
    ],
  },
];

export const Routers = createBrowserRouter(routers);
