// 각 타입은 JSP(ApplicantList)와 DB(tb_userinfo)를 확인함
export interface IManageApplicant {
    userIdx: number;
    loginId: string;
    name: string;
    email: string;
    regdate: string; // date나 number 아님
}

// 각 타입은 JSP(bizList)와 DB(tb_biz)를 확인함
export interface IManageBiz {
    bizIdx: number;
    bizName: string;
    bizCeoName: string;
    bizContact: string;
    bizWebUrl: string;
}

export interface IManageApplicantListResponse {
    applicantCnt: number;
    applicant: IManageApplicant[];
}
export interface IManageBizListResponse {
    bizCnt: number;
    biz: IManageBiz[];
}
