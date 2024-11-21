import { createContext, FC, useState } from "react";

// 검색 키워드 상태의 타입 정의
interface SearchKeyWord {
  searchTitle: string;
  searchPeriod: string;
  viewStatus: string;
  sortOrder: string;
}

// Context의 타입 정의
interface Context {
  searchKeyWord: SearchKeyWord;
  setSearchKeyWord: (keyword: SearchKeyWord) => void;
}

// 기본값 설정
const defaultValue: Context = {
  searchKeyWord: {
    searchTitle: "",
    searchPeriod: "all",
    viewStatus: "all",
    sortOrder: "desc",
  },
  setSearchKeyWord: () => {},
};

// Context 생성
export const HistoryContext = createContext(defaultValue);

// Provider 컴포넌트
export const HistoryProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
  const [searchKeyWord, setSearchKeyWord] = useState<SearchKeyWord>({
    searchTitle: "",
    searchPeriod: "all",
    viewStatus: "all",
    sortOrder: "desc",
  });

  return (
    <HistoryContext.Provider value={{ searchKeyWord, setSearchKeyWord }}>
      {children}
    </HistoryContext.Provider>
  );
};
