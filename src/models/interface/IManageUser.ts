// 각 타입은 JSP(ApplicantList)와 DB(tb_userinfo)를 확인함
export interface IManageApplicant {
    userIdx: number;
    loginId: string;
    name: string;
    email: string;
    regdate: string; // date나 number 아님
}

// 위 IManageApplicant의 기본값
export const defaultApplicant: IManageApplicant = {
    userIdx: -1, // 페이지에서 SQL로는 생성이 안되는 -1인덱스를 읽으면 로딩중이라고 인식하게 코딩
    loginId: "",
    name: "",
    email: "",
    regdate: "",
}

export interface IManageApplicantListResponse {
    applicantCnt: number;
    applicant: IManageApplicant[];
}

// 각 타입은 JSP(bizList)와 DB(tb_biz)를 확인함
export interface IManageBiz {
    bizIdx: number;
    bizName: string;
    bizCeoName: string;
    bizContact: string;
    bizWebUrl: string;
}

// 위 IManageBiz의 기본값
export const defaultBiz: IManageBiz = {
    bizIdx: -1, // 페이지에서 SQL로는 생성이 안되는 -1인덱스를 읽으면 로딩중이라고 인식하게 코딩
    bizName: "",
    bizCeoName: "",
    bizContact: "",
    bizWebUrl: "",
}

export interface IManageBizListResponse {
    bizCnt: number;
    biz: IManageBiz[];
}
