import { useState } from "react";
import { PostProvider } from "../api/provider/PostProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { PostSearch } from "../component/page/manage-posts/PostSearch/PostSearch";
import { ScrapMain } from "../component/page/manage-posts/ScrapList/ScrapMain";
import { NoticeSearch } from "../component/page/Notice/NoticeSearch/NoticeSearch";
import { ReloadButton } from "../component/common/ContentBox/ReloadButton";

export const Scrap = () => {
  return (
    <PostProvider>
      <ReloadButton></ReloadButton>
      <ContentBox>스크랩</ContentBox>
      <NoticeSearch />
      <ScrapMain />
    </PostProvider>
  );
};
