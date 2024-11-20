import { useLocation, useNavigate } from "react-router-dom";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { useContext, useEffect, useState } from "react";
import { IPost, IPostListResponse } from "../../../../models/interface/IPost";
import { PostContext } from "../../../../api/provider/PostProvider";
import { ManagePost } from "../../../../api/api";
import { postPostApi } from "../../../../api/postPostApi";

export const PostMain = () => {
  const { search } = useLocation();
  const navigate = useNavigate(); // useNavigate 훅을 컴포넌트의 최상단에서 선언
  const [postList, setPostList] = useState<IPost[]>([]);
  const [postCnt, setPostCnt] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cPage, setCPage] = useState<number>();

  const { searchKeyWord } = useContext(PostContext);

  // 검색어가 변경되거나 컴포넌트가 마운트될 때 포스트 리스트를 검색
  useEffect(() => {
    searchPostList(currentPage);
  }, [search, searchKeyWord]);

  // 포스트 리스트 검색 함수
  const searchPostList = async (currentPage?: number) => {
    currentPage = currentPage || 1;

    const searchParam = {
      ...searchKeyWord,
      currentPage: currentPage.toString(),
      pageSize: "5",
    };

    const searchList = await postPostApi<IPostListResponse>(ManagePost.getPostList, searchParam);

    if (searchList) {
      setPostList(searchList.data.approvalList);
      setPostCnt(searchList.data.approvalPostCnt);
      setCPage(currentPage);
    }
  };

  // 상세 보기 핸들러 함수
  const handlerDetail = (postIdx: number, bizIdx: number) => {
    navigate(`/react/manage-post/managePostDetailBody.do`, {
      state: { postIdx, bizIdx },
    });
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
          {postList.length > 0 ? (
            postList.map((post) => (
              <tr key={post.postIdx} onClick={() => handlerDetail(post.postIdx, post.bizIdx)}>
                <StyledTd>{post.postIdx}</StyledTd>
                <StyledTd>{post.title}</StyledTd>
                <StyledTd>{post.workLocation}</StyledTd>
                <StyledTd>{post.expRequired}</StyledTd>
                <StyledTd>{post.endDate}</StyledTd>
                <StyledTd>{new Date(post.postDate).toISOString().substring(0, 10)}</StyledTd>
              </tr>
            ))
          ) : (
            <tr>
              <StyledTd colSpan={6}>데이터가 없습니다.</StyledTd>
            </tr>
          )}
        </tbody>
      </StyledTable>
      <PageNavigate totalItemsCount={postCnt} onChange={searchPostList} activePage={cPage} itemsCountPerPage={5} />
    </>
  );
};
