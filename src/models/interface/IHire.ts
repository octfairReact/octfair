
export interface IHire {
    postIdx:        number;
    title:          string;
    expRequired:    string;
    appStatus:      string;
    postDate:       string;
    endDate:        string;
}

export interface IHireWrite extends IHire{
    expYears:              string;
    salary:                string;
    workLocation:          string;
    openings:              string;     //모집인원   
    posDescription:        string; 
    duties:                string;
    reqQualifications:     string;
    prefQualifications:    string;
    benefits:              string;
    hirProcess:            string;

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