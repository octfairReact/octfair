export interface IScrap {
  scrapIdx: number;
  postIdx: number;
  loginId: String;
  scrappedDate: String;
  postTitle: string; // 제목 검색할 때 필요해서 추가한 필드
  postExpRequired: string;
  postWorkLocation: string;
  postEndDate: string;
  postBizName: string;
  postBizIdx: number;
  postStatus: string;
}

export interface IScrapResponse {
  result: string;
}

export interface IScrapListResponse {
  scrapCnt: number;
  scrapList: IScrap[];
}
