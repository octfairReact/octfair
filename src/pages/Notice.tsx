import { NoticeProvider } from "../api/provider/NoticeProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ReloadButton } from "../component/common/ContentBox/ReloadButton";
import { ImageCardList } from "../component/page/Login/LoginMain/ImageCardList";
import { NoticeMain } from "../component/page/Notice/NoticeMain/NoticeMain";
import { NoticeSearch } from "../component/page/Notice/NoticeSearch/NoticeSearch";

export const Notice = () => {
  return (
    <>
      <NoticeProvider>
        <ReloadButton></ReloadButton>
        <ContentBox>공지사항</ContentBox>
        <NoticeSearch />
        <NoticeMain />
        <ImageCardList />
      </NoticeProvider>
    </>
  );
};
