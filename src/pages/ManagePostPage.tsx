import { PostProvider } from "../api/provider/PostProvider";
import { ContentBoxPost } from "../component/common/ContentBox/ContentBoxPost";
import { PostDetailStyled } from "../component/page/manage-posts/PostDetail/ManagePostPage";
import { PostDetail } from "../component/page/manage-posts/PostDetail/PostDetail";

export const ManagePostPage = () => {
  return (
    <PostProvider>
      <ContentBoxPost>
        <strong>채용 상세정보</strong>
        <div className="action-buttons">
          <button className="btn btn-outline-primary">수정</button>
          <button className="btn btn-outline-danger">삭제</button>
        </div>
      </ContentBoxPost>
      <PostDetail />
    </PostProvider>
  );
};
