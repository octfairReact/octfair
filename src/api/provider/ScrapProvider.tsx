import { createContext, FC, useEffect, useState } from "react";

interface Context {
  searchKeyWord: object;
  setSearchKeyWord: (keyword: object) => void;
  scrapIndexes: number[];
  setScrapIndexes: (scrapIndex: any) => void;
  postIndexes: number[];
  setPostIndexes: (postIndex: any) => void;
}

const defaultValue: Context = {
  searchKeyWord: {},
  setSearchKeyWord: () => {},
  scrapIndexes: [],
  setScrapIndexes: () => {},
  postIndexes: [],
  setPostIndexes: () => {},
};

export const ScrapContext = createContext<Context>(defaultValue);
export const ScrapProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
  const [searchKeyWord, setSearchKeyWord] = useState<object>({});
  const [scrapIndexes, setScrapIndexes] = useState<number[]>([]); // 초기 상태가 빈 배열로 설정됨
  const [postIndexes, setPostIndexes] = useState<number[]>([]);
  useEffect(() => {
    console.log(scrapIndexes);
  }, [scrapIndexes]);
  return (
    <ScrapContext.Provider
      value={{
        searchKeyWord,
        setSearchKeyWord,
        scrapIndexes,
        setScrapIndexes,
        postIndexes,
        setPostIndexes,
      }}
    >
      {children}
    </ScrapContext.Provider>
  );
};
