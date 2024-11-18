import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { PostMain } from "../component/page/manage-posts/PostMain/PostMain";

export const Post = () => {
  return (
    <>
      {/* //<PostProvider> */}
      <ContentBox>공지사항</ContentBox>
      {/* /<PostSearch /> */}
      <PostMain />
      {/* </postProvider> */}
    </>
  );
};
