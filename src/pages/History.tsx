import { HistoryProvider } from "../api/provider/HistoryProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ReloadButton } from "../component/common/ContentBox/ReloadButton";
import { HistoryMain } from "../component/page/History/HistoryMain/HistoryMain";
import { HistorySearch } from "../component/page/History/HistorySearch/HistorySearch";

export const History = () => {
  return (
    <div>
      <HistoryProvider>
        <ReloadButton></ReloadButton>
        <ContentBox>
          <span>입사지원 내역</span>
        </ContentBox>
        {/* 지원내역 검색 기능 */}
        <HistorySearch />

        {/* 지원내역 테이블 출력 */}
        <HistoryMain />
      </HistoryProvider>
    </div>
  );
};
