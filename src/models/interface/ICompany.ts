// 텍스트 인터페이스
export interface ICompany {
  bizName: string;
  bizCeoName: string; // 회사명
  bizContact: string; // 전화번호
  bizAddr: string; // 주소
  bizEmpCount: number; //
  bizWebUrl: string; // 회사 url
  bizFoundDate: string; // 설립잉
  bizRevenue: string; // 매출액
  bizIntro: string; // 간략 소개
  bizLogo: null; //나무.jpg 이런식으로 저장됨
}

//사진 파일
export interface ICompanyDetail extends ICompany {
  fileExt: string | null; // 확장자
  fileSize: number;
  logicalPath: string | null; // 서버
  phsycalPath: string | null; //v 드라이브
  updatedDate: string | null;
}

export interface ICompanResponse {
  detail: ICompanyDetail;
}
