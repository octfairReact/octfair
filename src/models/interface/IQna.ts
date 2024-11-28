export interface IQna {
  qnaIdx: number;
  title: string;
  content: string;
  author: string;
  createdDate: string;
  password: string;
  qna_type: string;
}

export interface IPostResponse {
  result: string;
}

//답변
export interface IQnaAns extends IQna {
  ans_content: string;
  qna_type: string;
}

//사진 파일
export interface IQnaDetail extends IQnaAns {
  fileName: string | null;
  fileExt: string | null; // 확장자
  fileSize: number;
  logicalPath: string | null; // 서버
  phsycalPath: string | null; //v 드라이브
  updatedDate: string | null;
}

export interface IDetailResponse {
  detail: IQnaDetail;
}

export interface IDetailResponse2 extends IPostResponse {
  detail: IQnaDetail;
}

export interface IQnaListResponse {
  qnaCnt: number;
  qna: IQnaAns[];
}
