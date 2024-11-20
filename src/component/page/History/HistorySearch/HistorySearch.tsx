import { useContext, useState } from 'react';
import { HistorySearchStyled } from './styled';
import { Button } from '../../../common/Button/Button';
import { HistoryContext } from '../../../../api/provider/HistoryProvider';

export const HistorySearch = () => {
  // 상태 변수 설정
  const [filters, setFilters] = useState({
    searchPeriod: 'all',
    viewStatus: 'all',
    sortOrder: 'desc',
    keyword: '',
  });
  // 검색 관련
  const { setSearchKeyWord } = useContext(HistoryContext);

  // 필터 값 변경 함수
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // 검색 버튼 클릭 시 실행되는 함수
  const handlerSearch = () => {
    console.log('===========검색 이벤트 동작===========');
    console.log('검색 키워드 :', filters);
    setSearchKeyWord({
      searchTitle: filters.keyword,
      searchPeriod: filters.searchPeriod,
      viewStatus: filters.viewStatus,
      sortOrder: filters.sortOrder,
    });
  };

  // 초기화 버튼 클릭 시 실행되는 함수
  const handlerReset = () => {
    setFilters({
      searchPeriod: 'all',
      viewStatus: 'all',
      sortOrder: 'desc',
      keyword: '',
    });
  };

  return (
    <HistorySearchStyled>
      <span className="fr">
        {/* 조회기간 선택 */}
        <select
          className="period"
          id="period"
          name="searchPeriod"
          value={filters.searchPeriod}
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
          className="keyword"
          id="keyword"
          name="keyword"
          value={filters.keyword}
          onChange={handleFilterChange}
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
