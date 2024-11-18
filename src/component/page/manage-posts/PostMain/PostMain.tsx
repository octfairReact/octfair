import { useLocation, useNavigate } from "react-router-dom";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { useState } from "react";
import { IPost } from "../../../../models/interface/IPost";

export const PostMain = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [postList, setPostList] = useState<IPost[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [index, setIndex] = useState<number>();
  const [cPage, setCPage] = useState<number>();

  //const { searchKeyWord } = useContext();

  return (
    <>
      <StyledTable>
        <thead>
          <tr>
            <StyledTh size={5}>번호</StyledTh>
            <StyledTh size={20}>제목</StyledTh>
            <StyledTh size={10}>근무지역</StyledTh>
            <StyledTh size={8}>경력여부</StyledTh>
            <StyledTh size={15}>마감일</StyledTh>
            <StyledTh size={10}>등록일 </StyledTh>
          </tr>
        </thead>
        <tbody>
          {postList?.length > 0 ? (
            postList?.map((post) => {
              return (
                <tr>
                  <StyledTd>{post.postIdx}</StyledTd>
                  <StyledTd>{post.title}</StyledTd>
                  <StyledTd>{post.workLocation}</StyledTd>
                  <StyledTd>{post.expRequired}</StyledTd>
                  {/* <StyledTd>{notice.createdDate}</StyledTd> */}
                  <StyledTd>{new Date(post.endDate).toISOString().substring(0, 10)}</StyledTd>
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
      {/* <PageNavigate
        totalItemsCount={noticeCnt}
        onChange={searchNoticeList}
        activePage={cPage}
        itemsCountPerPage={5}
      ></PageNavigate> */}
    </>
  );
};
