import { FC, useState, createContext } from "react";

interface Context {
  searchKeyWord: object;
  setSearchKeyWord: (keyword: object) => void;
}

const defaultValue: Context = {
  searchKeyWord: {},
  setSearchKeyWord: () => {},
};
export const FqaContext = createContext(defaultValue);

export const FaqProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
  const [searchKeyWord, setSearchKeyWord] = useState({});

  return <FqaContext.Provider value={{ searchKeyWord, setSearchKeyWord }}>{children}</FqaContext.Provider>;
};
