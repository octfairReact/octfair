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

export const History = {
  getListBody: "/apply/historyBody.do",
  searchList: "/apply/searchHistoryBody.do",
  postDelete: "/apply/cancleApplyBody.do",
  getModal: "/apply/previewResumeBody.do",
};

export const Posts = {
  getPost: "/jobs/posts.do",
  getScrap: "/jobs/scrap.do",
  applyUserResumeDetail: "/jobs/applyUserResumeDetailBody.do",
  applyBizPostDetail: "/jobs/applyBizPostDetailBody.do",
  getScrapSave: "/jobs/saveScrapBody.do",
};

export const ManagePost = {
  getPostList: "/manage-post/readPostListBody.do",
<<<<<<< HEAD
  statusUpdate: "/manage-post/statusUpdateBody.do",
  getpostDetail: (postIdx: number, bizIdx: number) => `/manage-post//managePostDetailBody.do/${postIdx}/${bizIdx}`,
=======
  getpostDetail: (postIdx: number, bizIdx: number) => `/manage-post/managePostDetailBody.do/${postIdx}/${bizIdx}`,
>>>>>>> f4052244656fd46c70bb943eda48588cadccf924
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

export const Hire = {
  getListBody: "/manage-hire/managehireListBody.do",
  postSave: "/manage-hire/managehireSaveBody.do",
  fileDownload: "manage-hire/managehireDownload.do",
  postSave: "/manage-hire/managehireSaveFileForm.do",
<<<<<<< HEAD
  postSaveBody: "/manage-hire/managehireSaveBody.do",
=======
>>>>>>> f4052244656fd46c70bb943eda48588cadccf924
};
export const ScrapURL = {
  getScrapList: "/jobs/scrapListBody.do",
  getScarpDelete: "/jobs/deleteScrapBody.do",
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
};
