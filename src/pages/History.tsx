import React, { Suspense } from "react";
import { HistoryProvider } from "../api/provider/HistoryProvider";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ReloadButton } from "../component/common/ContentBox/ReloadButton";
import { HistorySearch } from "../component/page/History/HistorySearch/HistorySearch";
import { HistoryMain} from "../component/page/History/HistoryMain/HistoryMain";

export const History = () => {
  return (
    <div>
      <HistoryProvider>
        {/* 새로고침 버튼 */}
        <ReloadButton></ReloadButton>

        {/* 상위 제목 */}
        <ContentBox>
          <span>입사지원 내역</span>
        </ContentBox>

        {/* 지원내역 검색 기능 */}
        <HistorySearch />
        
        {/* 지원내역 테이블 출력 */}
        <Suspense fallback={null}>
          <HistoryMain />
        </Suspense>

      </HistoryProvider>
    </div>
  );
};
