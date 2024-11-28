export const Login = {
  login: "/loginProc.do",
};

export const Notice = {
  getList: "/board/noticeListJson.do",
  getListBody: "/board/noticeListBody.do",
  getDetail: "/board/noticeDetailBody.do",
  // postSave: "/board/noticeSaveBody.do",
  postSave: "/board/noticeSaveFileForm.do",
  //postUpdate: "/board/noticeUpdateJson.do",
  postDelet: "/board/noticeDeleteBody.do",
  //postUpdate: "/board/noticeUpdateBody.do",
  postUpdate: "/board/noticeUpdateFileForm.do",
};

// 김호관 : 입자시원-지원이력
export const History = {
  // getList: "/apply/historyJson.do",
  getListBody: "/apply/historyBody.do",
  searchList: "/apply/searchHistoryBody.do",
  postDelete: "/apply/cancleApplyBody.do",
};

export const Posts = {
  getPost: "/jobs/posts.do",
  getScrap: "/jobs/scrap.do",
  getScrapSave: "/jobs/saveScrapBody.do",
};

export const ManagePost = {
  getPostList: "/manage-post/readPostListBody.do",
  getpostDetail: (postIdx: number, bizIdx: number) => `/manage-post//managePostDetailBody.do/${postIdx}/${bizIdx}`,
};

export const Company = {
  postSave: "/company/companySaveBody.do",
  getDetail: (postIdx: number, bizIdx: number) => `/company/companyDetailPageRe.do/${postIdx}/${bizIdx}`,
  getCompanyInfo: "/company/companyUpdatePageRe.do",
  postUpdate: "/company/companyUpdateBody.do",
  postDelete: "/company/companyDeleteRe.do",
};

export const Resume = {
  getListBody: "/apply/resumeListBody.do",
  getDetail: "/apply/resumeDetail.do",
  resumeDelete: "/apply/resumeDelete.do",
};

//채용공고 리스트,등록 - 신효
export const Hire = {
  getListBody: "/manage-hire/managehireListBody.do",
  postSave: "/manage-hire/managehireSaveFileForm.do",

};

//지원자관리 - 신효
export const Applicant = {
  getPostIdx: "/manage-hire/applicantJson.do",
  gitListBody: "/manage-hire/applicantListBody.do",

};

export const ScrapURL = {
  getScrapList: "/manage-post/scrapListBody.do",
  getpostDetail: (postIdx: number, bizIdx: number) => `/manage-post//managePostDetailBody.do/${postIdx}/${bizIdx}`,
};

export const Faq = {
  getList: "/board/faqListRe.do",
  postSave: "/board/faqSaveRe.do",
  getDetail: "/board/faqDetailRe.do",
  postUpdate: "/board/faqUpdateRe.do",
  postDelete: "/board/faqDeleteRe.do",
};

export const ManageUser = {
  getApplicantList: "/manage-user/applicantListBody.do",
  getApplicantDetail: "/manage-user/applicantManageDetail.do",
  updateApplicantInfo: "/manage-user/applicantInfoUpdate.do",
  resetApplicantPassword: "/manage-user/applicantPwReset.do",
  getBizList: "/manage-user/bizListBody.do",
  getBizDetail: "/manage-user/bizManageDetail.do",
  updateBizInfo: "/manage-user/bizInfoUpdate.do",
}