export const Login = {
  login: "/loginProc.do",
};

export const Notice = {
  getList: "/board/noticeListJson.do",
  getListBody: "/board/noticeListBody.do",
  getDetail: "/board/noticeDetailBody.do",
  // postSave: "/board/noticeSaveBody.do",
  postSave: "/board/noticeSaveFileForm.do",
  //postUpdate: "/board/noticeUpdateBody.do",
  postDelet: "/board/noticeDeleteBody.do",
  postUpdate: "/board/noticeUpdateFileForm.do",
};

export const Resume = {
  getListBody: "/apply/resumeListBody.do",
  getDetail: "/apply/resumeDetail.do",
  resumeDelete: "/apply/resumeDelete.do",
};
