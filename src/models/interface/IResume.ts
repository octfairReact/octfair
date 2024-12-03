import { CertificationList } from "./../../component/page/apply/ResumeDetail/CertificationList";
export interface IResume {
  resIdx: number;
  resTitle: string;
  updatedDate: string;
  fileName: string | null;
}

export interface IPostResponse {
  result: string;
  eduIdx?: number;
  crrIdx?: number;
  skillIdx?: number;
  certIdx?: number;
}

export interface IResumeDetail extends IResume {
  empStatus: string | null;
  shortIntro: string | null;
  proLink: string | null;
  perStatement: string | null;
  phsycalPath: string | null;
  logicalPath: string | null;
  fileSize: number;
  fileExt: string | null;
  userNm: string | null;
  phone: string | null;
  email: string | null;
}

export interface IDetailResponse {
  createNewResume?: any;
  result: IResumeDetail;
}

export interface IResumeListResponse {
  resume: IResume[];
}

export const defaultResumeDetail: IResumeDetail = {
  resIdx: 0,
  resTitle: "",
  updatedDate: "",
  fileName: null,
  empStatus: null,
  shortIntro: null,
  proLink: null,
  perStatement: null,
  phsycalPath: null,
  logicalPath: null,
  fileSize: 0,
  fileExt: null,
  userNm: null,
  phone: null,
  email: null,
};

export interface Career {
  resIdx: number;
  crrIdx?: number;
  company: string;
  startDate: string;
  endDate: string;
  dept: string;
  position: string;
  reason: string;
  crrDesc: string;
}

export interface Education {
  resIdx: number;
  eduIdx?: number;
  eduLevel: string;
  schoolName: string;
  major: string;
  admDate: string;
  grdDate: string;
  grdStatus: string;
}

export interface Skill {
  resIdx: number;
  skillIdx?: number;
  skillName: string;
  skillDetail: string;
}

export interface Certification {
  resIdx: number;
  certIdx?: number;
  certName: string;
  grade: string;
  issuer: string;
  acqDate: string;
}
