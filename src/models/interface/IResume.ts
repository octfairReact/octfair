export interface IResume {
  resIdx: number;
  resTitle: string;
  updatedDate: string;
  fileName: string | null;
}

export interface IPostResponse {
  result: string;
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
  detail: IResumeDetail;
}

export interface IResumeListResponse {
  resume: IResume[];
}
