import { FC, useState, createContext } from "react";

interface Context {
  searchKeyWord: object;
  setSearchKeyWord: (keyword: object) => void;
  passwordStatus: boolean;
  setPasswordStatus: (status: boolean) => void;
}

const defaultValue: Context = {
  searchKeyWord: {},
  setSearchKeyWord: () => {},
  passwordStatus: false,
  setPasswordStatus: () => {},
};
export const QnaContext = createContext(defaultValue);

export const QnaProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
  const [searchKeyWord, setSearchKeyWord] = useState({});
  const [passwordStatus, setPasswordStatus] = useState(false);

  return (
    <QnaContext.Provider value={{ searchKeyWord, setSearchKeyWord, passwordStatus, setPasswordStatus }}>
      {children}
    </QnaContext.Provider>
  );
};
