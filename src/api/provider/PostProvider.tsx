import { createContext, FC, useState } from "react";

interface Context {
  searchKeyWord: object;
  setSearchKeyWord: (keyword: object) => void;
}

const defaultValue: Context = {
  searchKeyWord: {},
  setSearchKeyWord: () => {},
};
export const PostContext = createContext(defaultValue);

export const PostProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
  const [searchKeyWord, setSearchKeyWord] = useState({});
  return <PostContext.Provider value={{ searchKeyWord, setSearchKeyWord }}>{children}</PostContext.Provider>;
};
