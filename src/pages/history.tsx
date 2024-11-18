import { HistoryProvider } from '../api/provider/HistoryProvider';
import { ContentBox } from '../component/common/ContentBox/ContentBox';
import { HistoryMain } from '../component/page/History/HistoryMain';

export const History = () => {
    return (
        <div>
            <HistoryProvider>
                {/* 제목 */}
                <ContentBox>지원내역</ContentBox>

                {/* 검색 기능 */}

                {/* 지원내역 테이블 출력 */}
                {/* <HistoryMain /> */}

            </HistoryProvider>
            
        </div>
    );
};
