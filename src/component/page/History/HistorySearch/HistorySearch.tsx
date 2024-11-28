import { useContext, useState } from 'react';
import { Button } from '../../../common/Button/Button';
import { HistoryContext } from '../../../../api/provider/HistoryProvider';
import { HistorySearchStyled } from './styled';

export const HistorySearch = () => {
  // 필터 상태 관리 (조회 기간, 열람 여부, 정렬 순서, 키워드)
  const [filters, setFilters] = useState({
    period: 'all', // 조회 기간 (전체)
    viewStatus: 'all', // 열람 여부 (전체)
    sortOrder: 'desc', // 정렬 순서 (최근지원순)
    keyWord: '', // 검색 키워드
  });

  // Context에서 setSearchKeyWord 함수 불러오기 (상위 컴포넌트에서 검색 키워드를 설정하기 위함)
  const { setSearchKeyWord } = useContext(HistoryContext);

  // 기간에 따라 시작 날짜를 계산하는 함수
  const getDateRange = (period) => {
    const today = new Date(); // 현재 날짜
    let startDate = today;

    if (period === 'all') return '2000-01-01'; // 전체 기간이면 '2000-01-01' 반환

    switch (period) {
      case '1week':
        startDate.setDate(today.getDate() - 7); // 지난 1주일
        break;
      case '1month':
        startDate.setMonth(today.getMonth() - 1); // 지난 1개월
        break;
      case '2month':
        startDate.setMonth(today.getMonth() - 2); // 지난 2개월
        break;
      case '3month':
        startDate.setMonth(today.getMonth() - 3); // 지난 3개월
        break;
      case '6month':
        startDate.setMonth(today.getMonth() - 6); // 지난 6개월
        break;
      case '1year':
        startDate.setFullYear(today.getFullYear() - 1); // 지난 1년
        break;
      default:
        return ''; // 기본적으로 빈 문자열 반환
    }

    return startDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 날짜 반환
  };

  // 필터 값 변경 시 호출되는 함수
  const handleFilterChange = (e) => {
    const { name, value } = e.target; // 이벤트에서 name과 value 값을 추출
    // 필터 상태를 업데이트
    setFilters((prevFilters) => ({
      ...prevFilters, // 기존 필터 값을 그대로 복사하고
      [name]: value, // 변경된 필터 값만 업데이트
    }));
  };

  // 검색 버튼 클릭 시 호출되는 함수
  const handlerSearch = () => {
    const searchParams = {
      keyWord: filters.keyWord, // 입력한 키워드
      startDate: getDateRange(filters.period), // 계산된 시작 날짜
      viewStatus: filters.viewStatus === 'all' ? 'all' : filters.viewStatus, // 열람 여부 필터
      sortOrder: filters.sortOrder, // 정렬 순서 (최근지원순 또는 과거지원순)
    };
    // 상위 컴포넌트에 검색 키워드를 전달
    setSearchKeyWord(searchParams);
  };

  // 초기화 버튼 클릭 시 호출되는 함수
  const handlerReset = () => {
    // 필터 값을 초기화
    setFilters({
      period: 'all', // 조회 기간 전체
      viewStatus: 'all', // 열람 여부 전체
      sortOrder: 'desc', // 정렬 순서 최근지원순
      keyWord: '', // 검색 키워드 초기화
    });
  };

  // 키보드에서 Enter 키를 누르면 검색 함수 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlerSearch(); // Enter 키가 눌리면 검색 실행
    }
  };

  return (
    <HistorySearchStyled>
      {/* 조회 기간 선택 */}
      <select
        className="period"
        id="period"
        name="period"
        value={filters.period} // 필터 상태에서 조회 기간 값
        onChange={handleFilterChange} // 필터 값 변경 시 실행될 함수
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
        value={filters.viewStatus} // 필터 상태에서 열람 여부 값
        onChange={handleFilterChange} // 필터 값 변경 시 실행될 함수
      >
        <option value="all">열람여부 전체</option>
        <option value="1">열람</option>
        <option value="0">미열람</option>
      </select>

      {/* 정렬 순서 선택 */}
      <select
        className="sort-order"
        id="sort-order"
        name="sortOrder"
        value={filters.sortOrder} // 필터 상태에서 정렬 순서 값
        onChange={handleFilterChange} // 필터 값 변경 시 실행될 함수
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
        value={filters.keyWord} // 필터 상태에서 키워드 값
        onChange={handleFilterChange} // 키워드 변경 시 실행될 함수
        onKeyDown={handleKeyDown} // Enter 키 입력 시 검색 실행
        placeholder="키워드 입력"
      />

      {/* 검색 버튼 */}
      <Button onClick={handlerSearch}>검색</Button>
      
      {/* 초기화 버튼 */}
      <Button onClick={handlerReset}>초기화</Button>
    </HistorySearchStyled>
  );
};
