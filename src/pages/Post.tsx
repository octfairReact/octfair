import { PostProvider } from "../api/provider/PostProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { PostDetail } from "../component/page/manage-posts/PostDetail/PostDtail";
import { PostMain } from "../component/page/manage-posts/PostMain/PostMain";
import { PostSearch } from "../component/page/manage-posts/PostSearch/PostSearch";

export const Post = () => {
  return (
    <>
      <PostProvider>
        <ContentBox>채용 공고</ContentBox>
        <PostSearch />
        <PostMain />
        <PostDetail />
      </PostProvider>
    </>
  );
};
