export interface IFaq {
  faq_idx: number;
  title: string;
  content: string;
  author: string;
  created_date: string;
  faq_type: string;
}

export interface IPostResponse {
  result: string;
}

export interface IDetailResponse {
  detail: IFaq;
}

export interface IFaqListResponse {
  faqCnt: number;
  faq: IFaq[];
}

export interface SearchParam {
  faq_type?: string;
  currentPage: string;
  pageSize: string;
  // 추가적인 속성들
}
