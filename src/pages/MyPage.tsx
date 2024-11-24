import { MyPageUpdate } from "./MyPageUpdate"; // component/page/MyPageUpdate가 아닌 pages/MyPageUpdate로 가도록 수정

export const MyPage = () => {
  return (
    <>
      <MyPageUpdate />
    </>
  );
};
