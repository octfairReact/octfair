import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { RouterProvider } from "react-router-dom";
import { Routers } from "./routers/Routers";

// CSS 파일을 전역적으로 임포트
import "./css/common.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <RecoilRoot>
    <RouterProvider router={Routers} />
  </RecoilRoot>
);
