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
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    resumeInfo: { userNm: string; email: string; phone: string; resTitle: string; shortIntro: string; perStatement: string;};
    careerInfo: ICareerInfo[];
    eduInfo: IEduInfo[];
    skillInfo: ISkillInfo[];
    certInfo: ICertInfo[];
    resIdx: number;
}
export interface IResumeInfo {
    userNm: string;
    email: string;
    phone: string;
    resTitle: string;
    shortIntro: string;
    perStatement?: string;
}
export interface ICareerInfo {
    company: string;
    position: string;
}
export interface IEduInfo {
    schoolName: string;
    major: string;
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