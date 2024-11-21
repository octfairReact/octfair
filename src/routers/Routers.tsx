import { RouteObject, createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/Login";
import { DashBoard } from "../component/layout/DashBoard/DashBoard";
import { NotFound } from "../component/common/NotFound/NotFound";
import { Notice } from "../pages/Notice";
import { NoticeRouter } from "../component/page/Notice/NoticeRouter/NoticeRouter";
import { Post } from "../pages/Post";
import { ManagePostPage } from "../pages/ManagePostPage";
import { Scrap } from "../pages/Scrap";

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
        children: [
          { path: "posts.do", element: <Post /> },
          { path: "scrap.do", element: <Scrap /> },
        ],
      },

      {
        path: "manage-post",
        children: [{ path: "managePostDetailBody.do", element: <ManagePostPage /> }],
      },
    ],
  },
];

export const Routers = createBrowserRouter(routers);
