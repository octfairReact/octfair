import { PostProvider } from "../api/provider/PostProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { PostDetail } from "../component/page/manage-posts/PostDetail/PostDetail";

export const ManagePostPage = () => {
  return (
    <PostProvider>
      <ContentBox>채용 상세정보</ContentBox>
      <PostDetail />
    </PostProvider>
  );
};
