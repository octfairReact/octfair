import { useState } from "react";
import { PostProvider } from "../api/provider/PostProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { PostDetail } from "../component/page/manage-posts/PostDetail/PostDtail";
import { PostMain } from "../component/page/manage-posts/PostMain/PostMain";
import { PostSearch } from "../component/page/manage-posts/PostSearch/PostSearch";

export const Post = () => {
  const [index, setIndex] = useState(null); // index 상태 관리
  const [showSavePage, setShowSavePage] = useState(false); // 등록 버튼 상태 관리

  // index를 변경하는 함수
  const handlerDetail = (postIdx) => {
    setIndex(postIdx); // 클릭된 postIdx를 index 상태에 저장
  };

  return (
    <>
      <PostProvider>
        <ContentBox>채용 공고</ContentBox>
        {index == null ? (
          <>
            <PostSearch />
            <PostMain onIndexChange={handlerDetail} />
          </>
        ) : (
          <PostDetail />
        )}
      </PostProvider>
    </>
  );
};
