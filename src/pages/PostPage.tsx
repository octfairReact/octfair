import { PostProvider } from "../api/provider/PostProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ReloadButton } from "../component/common/ContentBox/ReloadButton";
import { PostMain } from "../component/page/manage-posts/PostMain/PostMain";
import { PostSearch } from "../component/page/manage-posts/PostSearch/PostSearch";
import { useLocation } from "react-router-dom";

export const PostPage = () => {
  const PageTitle = () => {
    const location = useLocation();

    // URL 경로에 따른 제목 매핑
    const getTitleByPath = (path) => {
      switch (path) {
        case "/react/manage-post/approval.do":
          return "공고심사";
        case "/react/manage-post/post.do":
          return "공고보기";
        case "/react/jobs/posts.do":
          return "채용공고";
        default:
          return "페이지 제목 없음";
      }
    };

    const title = getTitleByPath(location.pathname);
    return <>{title}</>; // 제목을 렌더링
  };

  return (
    <PostProvider>
      <ReloadButton></ReloadButton>
      <ContentBox>
        {/* PageTitle 컴포넌트를 호출하여 제목 렌더링 */}
        <PageTitle />
      </ContentBox>
      <PostSearch />
      <PostMain />
    </PostProvider>
  );
};
