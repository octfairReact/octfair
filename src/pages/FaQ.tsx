import { FaqProvider } from "../api/provider/FaqProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ReloadButton } from "../component/common/ContentBox/ReloadButton";
import { FaqMain } from "../component/page/Faq/FaqMain/FaqMain";
import { FaqSearch } from "../component/page/Faq/FaqSearch/FaqSearch";

export const FaQ = () => {
  return (
    <>
      <FaqProvider>
        <ReloadButton></ReloadButton>
        <ContentBox>FAQ</ContentBox>
        <FaqSearch />
        <FaqMain />
      </FaqProvider>
    </>
  );
};
