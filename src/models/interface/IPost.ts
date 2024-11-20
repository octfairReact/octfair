export interface IPost {
  postIdx: number;
  title: string;
  workLocation: string;
  expRequired: string;
  endDate: string;
  postDate: string;
}

export interface IPostResponse {
  result: string;
}

export interface IPostListResponse {
  approvalPostCnt: number;
  approvalList: IPost[];
}
