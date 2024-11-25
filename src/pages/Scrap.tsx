import { useState } from "react";
import { PostProvider } from "../api/provider/PostProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { PostSearch } from "../component/page/manage-posts/PostSearch/PostSearch";
import { ScrapMain } from "../component/page/manage-posts/ScrapList/ScrapMain";
import { NoticeSearch } from "../component/page/Notice/NoticeSearch/NoticeSearch";

export const Scrap = () => {
  return (
    <PostProvider>
      <ContentBox>스크랩</ContentBox>
      <NoticeSearch />
      <ScrapMain />
    </PostProvider>
  );
};
