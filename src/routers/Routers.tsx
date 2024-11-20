import { RouteObject, createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/Login";
import { DashBoard } from "../component/layout/DashBoard/DashBoard";
import { NotFound } from "../component/common/NotFound/NotFound";
import { Notice } from "../pages/Notice";
import { NoticeRouter } from "../component/page/Notice/NoticeRouter/NoticeRouter";
import { Hire } from "../pages/HireMain";
import { HireAdd } from "../pages/HireWrite";



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
        path: "manage-hire",
        children: [
          { path: "post.do", element: <Hire/>},
          { path: "managehireWritePage.do", element: <HireAdd/>},


        ]
      }
    ],
  },
];

export const Routers = createBrowserRouter(routers);
