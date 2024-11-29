
export interface IHire {
    postIdx:        number;
    title:          string;
    expRequired:    string; //경력여부
    appStatus:      string;
    postDate:       string;
    endDate:        string;
}

export interface IHireWrite extends IHire{
    expYears:              string;
    salary:                string;  //급여
    workLocation:          string;  //근무지역
    openings:              string;  //모집인원   
    posDescription:        string;  //포지션설명
    duties:                string;  //업무
    reqQualifications:     string;  //자격조건
    prefQualifications:    string;  //우대사항
    benefits:              string;  //혜택&복지
    hirProcess:            string;  //채용절차

    fileName:              string;
    phsycalPath:           string | null;
    logicalPath:           string | null;
    fileSize:              number;
    //fileExt
}

export interface IHirePostResponse{
    result: string;
}

export interface IHireListResponse{
    MCount: number;
    MList: IHire[];
}

export interface IHireProps {
    onSuccess: () => void;
    noticeSeq: number;
    setNoticeSeq: (noticeSeq: number | undefined) => void;
  }