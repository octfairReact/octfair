import { createContext, FC, useState } from "react";

interface Context {
  searchKeyWord: object;
  setSearchKeyWord: (keyword: object) => void;
}

const defaultValue: Context = {
  searchKeyWord: {},
  setSearchKeyWord: () => {},
};
export const HistoryContext = createContext(defaultValue);

export const HistoryProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
  const [searchKeyWord, setSearchKeyWord] = useState({});
  return <HistoryContext.Provider value={{ searchKeyWord, setSearchKeyWord }}>{children}</HistoryContext.Provider>;
};
