export interface IHistory {
    appId: number;
    userIdx: number;
}

export interface IHistoryResponse {
    historyCnt: number;
    history: IHistory[];
}