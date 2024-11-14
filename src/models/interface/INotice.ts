export interface INoitce {
  noticeIdx: number;
  title: string;
  content: string;
  author: string;
  createdDate: string;
}

export interface IPostResponse {
  result: string;
}

export interface INoitceDetail extends INoitce {
  content: string;
  fileExt: string | null;
  fileName: string | null;
  fileSize: number;
  logicalPath: string | null;
  phsycalPath: string | null;
  updatedDate: string | null;
}

export interface IDetailResponse {
  detail: INoitceDetail;
}

export interface INoitceListResponse {
  noticeCnt: number;
  notice: INoitce[];
}
