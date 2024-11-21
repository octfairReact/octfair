export interface IPost {
  postIdx: number;
  bizIdx: number;
  title: string;
  workLocation: string;
  expRequired: string;
  endDate: string;
  postDate: string;
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
}
export interface AllDetail {
  bizDetail: companyDetail;
  postDetail: IPostDetail;
}

export interface IPostListResponse {
  approvalPostCnt: number;
  approvalList: IPost[];
}
