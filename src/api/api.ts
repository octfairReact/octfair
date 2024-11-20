export const Login = {
  login: "/loginProc.do",
};

export const Notice = {
  getList: "/board/noticeListJson.do",
  getListBody: "/board/noticeListBody.do",
  getDetail: "/board/noticeDetailJson.do",
  // postSave: "/board/noticeSaveBody.do",
  postSave: "/board/noticeSaveFileForm.do",
  //postUpdate: "/board/noticeUpdateJson.do",
  postDelet: "/board/noticeDeleteJson.do",
  postUpdate: "/board/noticeUpdateFileForm.do",
};

// 김호관 : 입자시원-지원이력
export const History = {
  getList: "/apply/historyJson.do",
  getListBody: "/apply/historyListBody.do",
  searchList: "/apply/searchHistoryBody.do",
  postDelete: "/apply/cancleApplyBody.do",
}
