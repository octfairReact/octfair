import { HistoryProvider } from "../api/provider/HistoryProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { HistoryMain } from "../component/page/History/HistoryMain/HistoryMain";
import { HistorySearch } from "../component/page/History/HistorySearch/HistorySearch";

export const History = () => {
  return (
    <div>
      <HistoryProvider>
        {/* 제목 */}
        <ContentBox>
          입사지원 내역
          {/* 검색 기능 */}
          <HistorySearch />
        </ContentBox>

        {/* 지원내역 테이블 출력 */}
        <HistoryMain />
      </HistoryProvider>
    </div>
  );
};
