import { useState } from "react";
import { PostProvider } from "../api/provider/PostProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { PostSearch } from "../component/page/manage-posts/PostSearch/PostSearch";
import { ScrapMain } from "../component/page/manage-posts/ScrapList/ScrapMain";

export const Scrap = () => {
  return (
    <PostProvider>
      <ContentBox>채용 공고</ContentBox>
      <PostSearch />
      <ScrapMain />
    </PostProvider>
  );
};
