export interface IPost {
  postIdx: number;
  bizIdx: number;
  title: string;
  workLocation: string;
  expRequired: string;
  endDate: string;
  postDate: string;
  appStatus: string;
}

export interface IPostResponse {
  result: string;
}

export interface IPostDetail extends IPost {
  expRequired: string;
  expYears: string;
  salary: string;
  workLocation: string;
  openings: string;
  posDescription: string;
  duties: string;
  reqQualifications: string;
  prefQualifications: string;
  benefits: string;
  postDate: string;
  startDate: string;
  endDate: string;
  hiringProc: string;
  fileName: string;
  hirProcess : string;
  appStatus: string;
  phsycalPath: string;
  logicalPath: string;
  fileSize: number;
  fileExt: string;
}
export interface companyDetail {
  bizName: string;
  bizAddr: string;
  bizContact: string;
  bizCeoName: string;
  bizEmpCount: string;
  bizLogo: string;
  phsycalPath: string;
  logicalPath: string;
  fileSize: number;
  fileExt: string;
  loginId: string;
}
export interface AllDetail {
  bizDetail: companyDetail;
  postDetail: IPostDetail;
}
export interface ApplybizDetail {
  bizName: string;
  postTitle: string;
}
export interface ApplyUserDetail {
  userIdx: number;
  userPhone: string;
  userEmail: string;
  resumeIdx: number;
  resumeTitle: string;
}
export interface ApplyDetailAll {
  userResumeList: ApplyUserDetail[];
  bizPostDetail: ApplybizDetail;
}

export interface IPostListResponse {
  approvalPostCnt: number;
  approvalList: IPost[];
  pendingList: IPost[];
  pendingPostCnt: number;
}
