export const Company = {
  postSave: "/company/companySaveBody.do",
  getDetail: (postIdx: number, bizIdx: number) =>
    `/company/companyDetailPageRe.do/${postIdx}/${bizIdx}`,
  getCompanyInfo: "/company/companyUpdatePageRe.do",
  postUpdate: "/company/companyUpdateBody.do",
};

// 김호관 : 입자시원-지원이력
export const History = {
  // getList: "/apply/historyJson.do",
  getListBody: "/apply/historyBody.do",
  searchList: "/apply/searchHistoryBody.do",
  postDelete: "/apply/cancleApplyBody.do",
};

export const Login = {
  login: "/loginProc.do",
};

export const ManagePost = {
  getPostList: "/manage-post/readPostListBody.do",
  getpostDetail: (postIdx: number, bizIdx: number) =>
    `/manage-post//managePostDetailBody.do/${postIdx}/${bizIdx}`,
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
};

export const Posts = {
  getPost: "/jobs/posts.do",
  getScrap: "/jobs/scrap.do",
};
