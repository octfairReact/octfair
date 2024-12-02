import { createContext, FC, useEffect, useState } from "react";
import {
  defaultResumeDetail,
  IDetailResponse,
  IResumeDetail,
} from "../../models/interface/IResume";
import { postResumeApi } from "../postResumeApi";
import { Resume } from "../api";

interface Context {
  resIdx?: number;
  resumeDetail: IResumeDetail | null;
  setResumeDetail: (detail: IResumeDetail) => void;
  setResIdx: (resIdx: number | null) => void;
}

const defaultValue: Context = {
  resIdx: undefined,
  resumeDetail: null,
  setResumeDetail: () => {}, // 초기화 함수
  setResIdx: () => {},
};

export const ResumeContext = createContext(defaultValue);

export const ResumeProvider: FC<{
  resIdx?: number;
  children: React.ReactNode | React.ReactNode[];
}> = ({ resIdx: initialResIdx, children }) => {
  const [resIdx, setResIdx] = useState<number | null>(initialResIdx || null); // resIdx를 state로 관리

  useEffect(() => {
    console.log("ResumeProvider resIdx 초기값:", resIdx);
  }, [resIdx]);

  const [resumeDetail, setResumeDetail] = useState<IResumeDetail | null>(
    resIdx ? null : defaultResumeDetail
  );

  useEffect(() => {
    const fetchResumeDetail = async () => {
      if (resIdx) {
        const response = await postResumeApi<IDetailResponse>(Resume.getDetail, { resIdx });
        setResumeDetail(response.data.result);
      } else {
        setResumeDetail(defaultResumeDetail);
      }
    };
    fetchResumeDetail();
  }, [resIdx]);

  return (
    <ResumeContext.Provider value={{ resIdx, resumeDetail, setResumeDetail, setResIdx }}>
      {children}
    </ResumeContext.Provider>
  );
};
