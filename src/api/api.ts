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
  postUpdate: "/board/noticeUpdateFileForm.do",
};

export const Posts = {
  getPost: "/jobs/posts.do",
  getScrap: "/jobs/scrap.do",
};

export const ManagePost = {
  getPostList: "/manage-post/readPostListBody.do",
  getpostDetail: (postIdx: number, bizIdx: number) => `/manage-post//managePostDetailBody.do/${postIdx}/${bizIdx}`,
};

export const Company = {
  postSave: "/company/companySaveBody.do",
  getDetail: (postIdx: number, bizIdx: number) => `/company/companyDetailPageRe.do/${postIdx}/${bizIdx}`,
};
