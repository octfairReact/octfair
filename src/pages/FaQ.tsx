import { FaqProvider } from "../api/provider/FaqProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { FaqMain } from "../component/page/Faq/FaqMain/FaqMain";
import { FaqSearch } from "../component/page/Faq/FaqSearch/FaqSearch";

export const FaQ = () => {
  return (
    <>
      <FaqProvider>
        <ContentBox>FAQ</ContentBox>
        <FaqSearch />
        <FaqMain />
      </FaqProvider>
    </>
  );
};
