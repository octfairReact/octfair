import { QnaProvider } from "../api/provider/QnaProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { QnaMain } from "../component/page/Qna/QnaMain/QnaMain";
import { QnaSearch } from "../component/page/Qna/QnaSearch/QnaSearch";

export const QnA = () => {
  return (
    <>
      <QnaProvider>
        <ContentBox>Q&A</ContentBox>
        <QnaSearch />
        <QnaMain />
      </QnaProvider>
    </>
  );
};
