import { createContext, FC, useState } from "react";

interface Context {
  searchKeyWord: object;
  setSearchKeyWord: (keyword: object) => void;
}

const defaultValue: Context = {
  searchKeyWord: {},
  setSearchKeyWord: () => {},
};
export const HireContext = createContext(defaultValue);

export const HireProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
  const [searchKeyWord, setSearchKeyWord] = useState({});
  return <HireContext.Provider value={{ searchKeyWord, setSearchKeyWord }}>{children}</HireContext.Provider>;
};
