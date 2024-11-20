import { useLocation, useNavigate } from "react-router-dom";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { useContext, useEffect, useState } from "react";
import { IPost, IPostListResponse } from "../../../../models/interface/IPost";
import { PostContext } from "../../../../api/provider/PostProvider";
import { Post } from "../../../../pages/Post";
import { ManagePost } from "../../../../api/api";
import { postPostApi } from "../../../../api/postPostApi";

export const PostMain = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [postList, setPostList] = useState<IPost[]>();
  const [postCnt, setPostCnt] = useState<number>();
  const [postDetail, setPostDetail] = useState<IPost>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [index, setIndex] = useState<number>();
  const [cPage, setCPage] = useState<number>();

  const { searchKeyWord } = useContext(PostContext);

  useEffect(() => {
    searchPostList(currentPage);
  }, [search]);

  useEffect(() => {
    console.log("update: ", searchKeyWord);
    searchPostList();
  }, [searchKeyWord]);
  //변경을 감지하고 유스이펙트 안에 있는 함수를 실행 시켜주는 것이 의존성 배열

  //검색 관련 잠시 주석
  // const searchNoticeList = async (currentPage?: number) => {
  //   currentPage = currentPage || 1;
  //   const searchParam = new URLSearchParams(search);
  //   searchParam.append("currentPage", currentPage.toString());
  //   searchParam.append("pageSize", "5");

  //   const searchList = await postNoticeApi<INoitceListResponse>(Notice.getList, searchParam);

  //   if (searchList) {
  //     setNoticeList(searchList.data.notice);
  //     setNoticeCnt(searchList.data.noticeCnt);
  //     console.log("노티스 카운트에 뭐 들어 있어?", noticeCnt);
  //     setCPage(currentPage);
  //   }

  //   // axios.post("/board/noticeListJson.do", searchParam).then((res) => {
  //   //   console.log("응답 데이터", res.data);
  //   //   setNoticeList(res.data.notice);
  //   //   setNoticeCnt(res.data.noticeCnt);
  //   // });
  // };

  const searchPostList = async (currentPage?: number) => {
    currentPage = currentPage || 1;
    // const searchParam = new URLSearchParams(search);
    // searchParam.append("currentPage", currentPage.toString());
    // searchParam.append("pageSize", "5");

    const searchParam = { ...searchKeyWord, currentPage: currentPage.toString(), pageSize: "5" };
    console.log(searchKeyWord);
    const searchList = await postPostApi<IPostListResponse>(ManagePost.getPostList, searchParam);
    console.log(searchList);

    if (searchList) {
      setPostList(searchList.data.approvalList);
      setPostCnt(searchList.data.approvalPostCnt);
      setCPage(currentPage);
    }
  };
  //const { searchKeyWord } = useContext();

  const handlerDynamicRouter = (postIdx: number) => {
    navigate(`${postIdx}`);
  };

  return (
    <>
      <StyledTable>
        <thead>
          <tr>
            <StyledTh size={5}>번호</StyledTh>
            <StyledTh size={20}>제목</StyledTh>
            <StyledTh size={10}>근무지역</StyledTh>
            <StyledTh size={8}>경력여부</StyledTh>
            <StyledTh size={20}>마감일</StyledTh>
            <StyledTh size={10}>등록일 </StyledTh>
          </tr>
        </thead>
        <tbody>
          {postList?.length > 0 ? (
            postList?.map((post) => {
              return (
                <tr key={post.postIdx} onClick={() => handlerDynamicRouter(post.postIdx)}>
                  <StyledTd>{post.postIdx}</StyledTd>
                  <StyledTd>{post.title}</StyledTd>
                  <StyledTd>{post.workLocation}</StyledTd>
                  <StyledTd>{post.expRequired}</StyledTd>
                  {/* <StyledTd>{notice.createdDate}</StyledTd> */}
                  <StyledTd>{post.endDate}</StyledTd>
                  <StyledTd>{new Date(post.postDate).toISOString().substring(0, 10)}</StyledTd>
                </tr>
              );
            })
          ) : (
            <tr>
              <StyledTd colSpan={6}>데이터가 없습니다.</StyledTd>
            </tr>
          )}
        </tbody>
      </StyledTable>
      <PageNavigate
        totalItemsCount={postCnt}
        onChange={searchPostList}
        activePage={cPage}
        itemsCountPerPage={5}
      ></PageNavigate>
    </>
  );
};
