import { PostProvider } from "../api/provider/PostProvider";
import { ContentBoxPost } from "../component/common/ContentBox/ContentBoxPost";
import { ApplyModal } from "../component/page/manage-posts/applyModal/applyModal";
import { PostDetailStyled } from "../component/page/manage-posts/PostDetail/ManagePostPage";
import { PostDetail } from "../component/page/manage-posts/PostDetail/PostDetail";

export const ManagePostPage = () => {
  return (
    <PostProvider>
      <PostDetail />
      <ApplyModal />
    </PostProvider>
  );
};
