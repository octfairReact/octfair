export const Login = {
  login: "/loginProcBCrypt.do",
  postSignup: "/registerBCrypt.do",
  getCheckId: "/check_loginId.do",
  getSearchId: "/selectFindInfoId.do",
  getSearchPw: "/selectFindInfoPw.do",
  putResetPw: "/updateFindPwBCrypt.do",
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
  postUpdate: "/board/noticeFileUpdateForm.do",
};

export const History = {
  searchListHistory: "/apply/searchHistoryBody.do",
  cancleApplyDelete: "/apply/cancleApplyBody.do",
  historyModal: "/apply/previewResumeBody.do",
};

export const Posts = {
  getPost: "/jobs/posts.do",
  getScrap: "/jobs/scrap.do",
  applyUserResumeDetail: "/jobs/applyUserResumeDetailBody.do",
  applyBizPostDetail: "/jobs/applyBizPostDetailBody.do",
  getScrapSave: "/jobs/saveScrapBody.do",
  saveApplyBody: "/jobs/saveApplyBody.do",
};

export const ManagePost = {
  getPostList: "/manage-post/readPostListBody.do",
  statusUpdate: "/manage-post/statusUpdateBody.do",
  getpostDetail: (postIdx: number, bizIdx: number) => `/manage-post/managePostDetailBody.do/${postIdx}/${bizIdx}`,
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
  getResumeNew: "/apply/resumeNew.do",
  getDetail: "/apply/resumeDetail.do",
  resumeSave: "/apply/resumeSaveBody.do",
  resumeDelete: "/apply/resumeDeleteBody.do",
  getCareerBody: "/apply/careerListBody",
  careerInsert: "/apply/insertCareerBody",
  careerDelete: "/apply/deleteCareerBody",
  getEduBody: "/apply/eduListBody",
  eduInsert: "/apply/insertEduBody",
  eduDelete: "/apply/deleteEduBody",
  getSkillBody: "/apply/skillListBody",
  skillInsert: "/apply/insertSkillBody",
  skillDelete: "/apply/deleteSkillBody",
  getCertBody: "/apply/certListBody",
  certInsert: "/apply/insertCertBody",
  certDelete: "/apply/deleteCertBody",
  fileDownload: "/apply/resumeFileDownload",
  fileDelete: "/apply/deleteAttachFile",
  resumeCopy: "/apply/resumeCopyBody.do",
};

//채용공고 리스트,등록 - 신효
export const Hire = {
  getListBody: "/manage-hire/managehireListBody.do",
  fileDownload: "manage-hire/managehireDownload.do",
  postSave: "/manage-hire/managehireSaveFileForm.do",
  getUpdate: "/manage-hire/managehireUpdateBody.do",
  getDelete: "/manage-hire/managehireDeleteBody.do"

};

//지원자관리 - 신효
export const Applicant = {
  getPostIdx: "/manage-hire/applicantJson.do",
  gitListBody: "/manage-hire/applicantListBody.do",
  statusUpdate: "/manage-hire/statusUpdateBody.do",
  viewUpdate: "/manage-hire/viewUpdateBody.do",
};

export const ScrapURL = {
  getScrapList: "/jobs/scrapListBody.do",
  getScarpDelete: "/jobs/deleteScrapBody.do",
  getScarpUpdate: "/jobs/updateScrapBody.do",

  getpostDetail: (postIdx: number, bizIdx: number) => `/manage-post//managePostDetailBody.do/${postIdx}/${bizIdx}`,
};

export const Faq = {
  getList: "/board/faqListRe.do",
  postSave: "/board/faqSaveRe.do",
  getDetail: "/board/faqDetailRe.do",
  postUpdate: "/board/faqUpdateRe.do",
  postDelete: "/board/faqDeleteRe.do",
};

export const Qna = {
  getList: "/board/qnaListRe.do",
  postSave: "/board/qnaFileSaveRe.do",
  getDetail: "/board/qnaDetailFileRe.do",
  postUpdate: "/board/qnaFileUpdateRe.do",
  postDelete: "/board/qnaFileDeleteRe.do",
  checkPassword: "/board/checkPassword.do",
};

export const ManageUser = {
  getApplicantListBody: "/manage-user/applicantListBody.do",
  getApplicantDetail: "/manage-user/applicantManageDetail.do",
  putApplicantInfo: "/manage-user/applicantInfoUpdate.do",
  putApplicantPassword: "/manage-user/applicantPwReset.do",
  getBizListBody: "/manage-user/bizListBody.do",
  getBizDetail: "/manage-user/bizManageDetail.do",
  putBizInfo: "/manage-user/bizInfoUpdate.do",
};

export const MyPage = {
  getUserInfo: "/mypage/userDetail.do",
  putUserInfo: "/mypage/updateUserInfo.do",
  putUserPw: "/mypage/updatePwBCrypt.do",
  deleteUser: "/mypage/deleteUserBCrypt.do",
};
