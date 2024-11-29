import { createContext, FC, useState } from "react";

interface Context {
  searchKeyWord: object;
  setSearchKeyWord: (keyword: object) => void;
}

const defaultValue: Context = {
  searchKeyWord: {},
  setSearchKeyWord: () => {},
};
export const ManageUserContext = createContext(defaultValue);

export const ManageUserProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
  const [searchKeyWord, setSearchKeyWord] = useState({});
  return <ManageUserContext.Provider value={{ searchKeyWord, setSearchKeyWord }}>{children}</ManageUserContext.Provider>;
};
