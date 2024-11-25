import { useContext, useState } from 'react';
import { HistorySearchStyled } from './styled';
import { Button } from '../../../common/Button/Button';
import { HistoryContext } from '../../../../api/provider/HistoryProvider';

export const HistorySearch = () => {
  const [filters, setFilters] = useState({
    period: 'all',
    viewStatus: 'all',
    sortOrder: 'desc',
    keyWord: '',
  });

  // HistoryContext에서 setSearchKeyWord 가져오기
  const { setSearchKeyWord } = useContext(HistoryContext);

  // 날짜 변환 함수
  const getDateRange = (period) => {
    const today = new Date();
    let startDate = today;

    if (period === 'all') return '2000-01-01';

    switch (period) {
      case '1week':
        startDate.setDate(today.getDate() - 7);
        break;
      case '1month':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case '2month':
        startDate.setMonth(today.getMonth() - 2);
        break;
      case '3month':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case '6month':
        startDate.setMonth(today.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        return '';
    }

    return startDate.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식의 날짜 반환
  };

  // 필터 값 변경 함수
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    console.log(value);
  };

  // 검색 버튼 클릭 시 실행되는 함수
  const handlerSearch = () => {
    console.log('===========검색 이벤트 동작===========');
    console.log('검색 키워드:', filters);

    const searchParams = {
      keyWord: filters.keyWord,
      startDate: getDateRange(filters.period),
      viewStatus: filters.viewStatus === 'all' ? 'all' : filters.viewStatus,
      sortOrder: filters.sortOrder,
    };

    // HistoryContext에 검색 파라미터 전달
    setSearchKeyWord(searchParams);
  };

  // 초기화 버튼 클릭 시 실행되는 함수
  const handlerReset = () => {
    setFilters({
      period: 'all',
      viewStatus: 'all',
      sortOrder: 'desc',
      keyWord: '',
    });
  };

  // 엔터키 입력 시 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlerSearch();
    }
  };

  return (
    <HistorySearchStyled>
      <span className="fr">
        {/* 조회기간 선택 */}
        <select
          className="period"
          id="period"
          name="period"
          value={filters.period}
          onChange={handleFilterChange}
        >
          <option value="all">조회기간 전체</option>
          <option value="1week">지난 1주일</option>
          <option value="1month">지난 1개월</option>
          <option value="2month">지난 2개월</option>
          <option value="3month">지난 3개월</option>
          <option value="6month">지난 6개월</option>
          <option value="1year">지난 1년</option>
        </select>

        {/* 열람 여부 선택 */}
        <select
          className="view-status"
          id="view-status"
          name="viewStatus"
          value={filters.viewStatus}
          onChange={handleFilterChange}
        >
          <option value="all">열람여부 전체</option>
          <option value="1">열람</option>
          <option value="0">미열람</option>
        </select>

        {/* 정렬 기준 선택 */}
        <select
          className="sort-order"
          id="sort-order"
          name="sortOrder"
          value={filters.sortOrder}
          onChange={handleFilterChange}
        >
          <option value="desc">최근지원순</option>
          <option value="asc">과거지원순</option>
        </select>

        {/* 키워드 입력 필드 */}
        <input
          type="text"
          className="keyWord"
          id="keyWord"
          name="keyWord"
          value={filters.keyWord}
          onChange={handleFilterChange}
          onKeyDown={handleKeyDown}
          placeholder="키워드 입력"
        />

        {/* 검색 버튼 */}
        <Button onClick={handlerSearch}>검색</Button>

        {/* 초기화 버튼 */}
        <Button onClick={handlerReset}>초기화</Button>
      </span>
    </HistorySearchStyled>
  );
};
