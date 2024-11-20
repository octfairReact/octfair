import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

export const PostDetail = () => {
  const location = useLocation();

  // URL에서 쿼리 파라미터 추출
  const params = new URLSearchParams(location.search);
  const postIdx = params.get("postIdx");
  useEffect(() => {}, []);

  const postDetail = async () => {};

  return <>안녕하세요 여기는 detail페이지입니다 {postIdx}</>;
};
