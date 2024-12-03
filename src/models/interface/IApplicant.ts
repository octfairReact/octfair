export interface IDetailBiz{
    postIdx: number; //공고 제목
    bizIdx: number;
    title: string; //글제목
    startDate: string;
    endDate: string;
}

export interface IApplicant extends IDetailBiz {
    appId: number; //입사지원pk
    userIdx: number;//회원fk
    loginId: string; //회원아이디  
    name: string; //회원이름
    email: string;//회원 이메일
    phone: string;
    status: string; //지원현황
    resIdx: number; //이력서
    hirProcess: string; 
    resTitle: string; //지원자 이력서제목
    applyDate: Date;
    viewed: number; //열람유무
    company: string; //경력회사 이름
    grdStatus: string; //지원자 졸업상태
    schoolName: string; //지원자 학교이름


}

export interface IApplicantPostResponse{
    result: string;
}

export interface IApplicantListResponse{
    count: number;
    list: IApplicant[];
}