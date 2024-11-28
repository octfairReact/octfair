import { FC, useState, createContext } from "react";

interface Context {
  searchKeyWord: object;
  setSearchKeyWord: (keyword: object) => void;
}

const defaultValue: Context = {
  searchKeyWord: {},
  setSearchKeyWord: () => {},
};
export const QnaContext = createContext(defaultValue);

export const QnaProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
  const [searchKeyWord, setSearchKeyWord] = useState({});

  return <QnaContext.Provider value={{ searchKeyWord, setSearchKeyWord }}>{children}</QnaContext.Provider>;
};
