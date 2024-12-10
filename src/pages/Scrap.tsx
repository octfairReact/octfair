import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ScrapMain } from "../component/page/manage-posts/ScrapList/ScrapMain";
import { ScrapProvider } from "../api/provider/ScrapProvider";
import { ScrapSearch } from "../component/page/manage-posts/ScrapSearch/ScrapSearch";

export const Scrap = () => {
  return (
    <ScrapProvider>
      <ContentBox>스크랩</ContentBox>
      <ScrapSearch />
      <ScrapMain />
    </ScrapProvider>
  );
};
