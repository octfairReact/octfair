import { createContext, FC, useState } from "react";
import { IResumeDetail } from "../../models/interface/IResume";

interface Context {
  resIdx?: number;
  resumeDetail: IResumeDetail | null;
  setResumeDetail: (detail: IResumeDetail) => void;
}

const defaultValue: Context = {
  resIdx: undefined,
  resumeDetail: null,
  setResumeDetail: () => {}, // 초기화 함수
};

export const ResumeContext = createContext(defaultValue);

export const ResumeProvider: FC<{
  resIdx?: number;
  children: React.ReactNode | React.ReactNode[];
}> = ({ resIdx, children }) => {
  const [resumeDetail, setResumeDetail] = useState<IResumeDetail | null>(null);
  return (
    <ResumeContext.Provider value={{ resIdx, resumeDetail, setResumeDetail }}>
      {children}
    </ResumeContext.Provider>
  );
};
