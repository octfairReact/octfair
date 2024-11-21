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

export interface ISearchKeyword {
    searchTitle?: string;
    searchPeriod?: string;
    viewStatus?: "열람" | "미열람";
    sortOrder?: string;
  }

export interface IResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
    historyData: IHistory;
}