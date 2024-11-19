import { createContext, FC, useState } from "react";

interface Context {
  searchKeyWord: object;
  setSearchKeyWord: (keyword: object) => void;
}

const defaultValue: Context = {
  searchKeyWord: {},
  setSearchKeyWord: () => {},
};
export const ResumeContext = createContext(defaultValue);

export const ResumeProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({
  children,
}) => {
  const [searchKeyWord, setSearchKeyWord] = useState({});
  return (
    <ResumeContext.Provider value={{ searchKeyWord, setSearchKeyWord }}>
      {children}
    </ResumeContext.Provider>
  );
};
