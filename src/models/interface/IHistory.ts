export interface IHistory {
    appId: number;
    userIdx: number;
    postingId: number;
    applyDate: Date;
    viewed: number;
    postTitle: string;
    status: string;
    resIdx: number;
    bizName: String;
    resumeData: string;
    bizIdx : number;
}

export enum Status {
    지원완료 = "지원완료",
    서류심사중 = "서류심사중",
    서류탈락 = "서류탈락",
    면접진행중 = "면접진행중",
    면접탈락 = "면접탈락",
    최종합격 = "최종합격"
}

export interface IHistoryResponse {
    historyCnt: number;
    history: IHistory[];
}

export interface IHistoryModal {
    index: number | null;
    resIdx: number;
    resumeInfo: IResumeInfo;
    careerInfo: ICareerInfo[];
    educationInfo: IEduInfo[];
    skillInfo: ISkillInfo[];
    certInfo: ICertInfo[];
}
// 모달 출력 시 초기 값을 -1로 줘서 값이 안나오게해서 값이 없음을 출력하지 않게하기
export const defaultHistoryModal:IHistoryModal = {
    index: -1,
    resIdx: undefined,
    resumeInfo: undefined,
    careerInfo: undefined,
    educationInfo: undefined,
    skillInfo: undefined,
    certInfo: undefined,
}
export interface IResumeInfo {
    resTitle: string;
    userNm: string;
    email: string;
    phone: string;
    shortIntro: string;
    proLink: string;
    fileName: string;
    perStatement: string;
}
export interface ICareerInfo {
    company: string;
    dept: string;
    position: string;
    startDate: string;
    endDate: string;
    crrDesc: string;
}
export interface IEduInfo {
    schoolName: string;
    major: string;
    grdStatus: String;
    admDate: String;
    grdDate: String;
}
export interface ISkillInfo {
    skillName: string;
    skillDetail: string;
}
export interface ICertInfo {
    certName: string;
    grade: string;
    issuer: string;
    acqDate: string;
}