import { useLocation, useNavigate } from "react-router-dom";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { useContext, useEffect, useState } from "react";
import { IPost, IPostListResponse } from "../../../../models/interface/IPost";
import { PostContext } from "../../../../api/provider/PostProvider";
import { ManagePost } from "../../../../api/api";
import { postPostApi } from "../../../../api/postPostApi";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";

interface PostData {
  list: IPost[];
  count: number;
}

export const PostMain = () => {
  const { pathname } = useLocation(); // 경로 가져오기
  const navigate = useNavigate();
  const [postData, setPostData] = useState<PostData>({ list: [], count: 0 });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const { searchKeyWord } = useContext(PostContext);

  // 데이터 검색 및 상태 업데이트 함수
  const searchPostList = async (page?: number) => {
    const currentPage = page || 1;

    const searchParam = {
      ...searchKeyWord,
      currentPage: currentPage.toString(),
      pageSize: "5",
    };

    const searchList = await postPostApi<IPostListResponse>(ManagePost.getPostList, searchParam);

    if (searchList) {
      const data: PostData = { list: [], count: 0 };

      switch (pathname) {
        case "/react/manage-post/approval.do":
          data.list = searchList.data.pendingList;
          data.count = searchList.data.pendingPostCnt;
          break;

        case "/react/manage-post/post.do":
          data.list = searchList.data.approvalList;
          data.count = searchList.data.approvalPostCnt;
          break;

        case "/react/jobs/posts.do":
          data.list = searchList.data.approvalList;
          data.count = searchList.data.approvalPostCnt;
          break;

        default:
          break;
      }

      setPostData(data);
      setCurrentPage(currentPage); // 현재 페이지 업데이트
    }
  };

  // 초기 데이터 로드 및 검색어 변경 시 데이터 로드
  useEffect(() => {
    searchPostList(currentPage);
  }, [pathname, searchKeyWord, currentPage]);

  // 상세 보기 핸들러
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
            <StyledTh size={10}>등록일</StyledTh>
            {userInfo.userType === "M" && <StyledTh>승인 여부</StyledTh>}
          </tr>
        </thead>
        <tbody>
          {postData.list.length > 0 ? (
            postData.list.map((post) => (
              <tr key={post.postIdx} onClick={() => handlerDetail(post.postIdx, post.bizIdx)}>
                <StyledTd>{post.postIdx}</StyledTd>
                <StyledTd>{post.title}</StyledTd>
                <StyledTd>{post.workLocation}</StyledTd>
                <StyledTd>{post.expRequired}</StyledTd>
                <StyledTd>{post.endDate}</StyledTd>
                <StyledTd>{new Date(post.postDate).toISOString().substring(0, 10)}</StyledTd>
                {userInfo.userType === "M" && <StyledTd>{post.appStatus}</StyledTd>}
              </tr>
            ))
          ) : (
            <tr>
              <StyledTd colSpan={userInfo.userType === "M" ? 7 : 6}>데이터가 없습니다.</StyledTd>
            </tr>
          )}
        </tbody>
      </StyledTable>
      <PageNavigate
        totalItemsCount={postData.count}
        onChange={searchPostList}
        activePage={currentPage}
        itemsCountPerPage={5}
      />
    </>
  );
};
