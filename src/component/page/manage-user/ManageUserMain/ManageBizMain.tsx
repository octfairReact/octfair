import { useContext, useEffect, useState } from "react";
import { IManageBiz, IManageBizListResponse } from "../../../../models/interface/IManageUser";
import { useRecoilState } from "recoil";
import { modalState, updateBizModalState } from "../../../../stores/modalState";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { UpdateBizModal } from "../ManageUserModal/UpdateBizModal";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { Button } from "../../../common/Button/Button";
import { ManageUser } from "../../../../api/api";
import { postManageUserApi } from "../../../../api/postManageUserApi";
import { ManageUserContext } from "../../../../api/provider/ManageUserProvider";
import { toast } from "react-toastify";

export const ManageBizMain = () => {
  // 모달에 쓰이는 변수
  const [updateUserModal, setUpdateUserModal] = useRecoilState<boolean>(updateBizModalState);
  const [id, setId] = useState<number>();

  // 리스트(표)에 쓰이는 변수
  const [userList, setUserList] = useState<IManageBiz[]>(); // 아이템 리스트
  const [userCnt, setUserCnt] = useState<number>(0); // 총 아이템의 갯수 (리스트 페이지 갯수 x)
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 검색에 쓰이는 변수
  const { searchKeyWord } = useContext(ManageUserContext);

  // Provider를 통해 Provider가 위치한 페이지 내의 컴포넌트인 Search로부터 searchKeyWord가 갱신되어 작동하는 Hook
  useEffect(() => {
    searchUserList();
  }, [searchKeyWord]);

  // 리스트(표)를 생성하는 함수
  const searchUserList = async (currentPage?: number) => {
    currentPage = currentPage || 1;
    const searchParam = { ...searchKeyWord, currentPage: currentPage.toString(), pageSize: "5" };
    const searchList = await postManageUserApi<IManageBizListResponse>(ManageUser.getBizListBody, searchParam);

    if (searchList) {
      setUserList(searchList.data.biz);
      setUserCnt(searchList.data.bizCnt);
      setCurrentPage(currentPage);
    }
  };

  const openUpdateUserModalHandler = (id: number) => {
    setUpdateUserModal(true);
    setId(id);
  };

  const refreshUserListHandler = () => {
    setUpdateUserModal(!updateUserModal);
    searchUserList();
  };

  return (
    <>
      총 갯수 : {userCnt}
      현재 페이지 : {currentPage}
      <StyledTable>
        <thead>
          <tr>
            <StyledTh size={5}>사업자번호</StyledTh>
            <StyledTh size={16}>사업자명</StyledTh>
            <StyledTh size={16}>대표자</StyledTh>
            <StyledTh size={16}>연락처</StyledTh>
            <StyledTh size={16}>홈페이지</StyledTh>
            <StyledTh size={16}>관리</StyledTh>
          </tr>
        </thead>
        <tbody>
          {userList?.length > 0 ? (
            userList?.map((user) => {
              return (
                <tr key={user.bizIdx} onClick={() => openUpdateUserModalHandler(user.bizIdx)}>
                  <StyledTd>{user.bizIdx}</StyledTd>
                  <StyledTd>{user.bizName}</StyledTd>
                  <StyledTd>{user.bizCeoName}</StyledTd>
                  <StyledTd>{user.bizContact}</StyledTd>
                  <StyledTd>{user.bizWebUrl}</StyledTd>
                  <StyledTd>
                    <Button>정보수정</Button>
                  </StyledTd>
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
        totalItemsCount={userCnt}
        onChange={searchUserList}
        activePage={currentPage}
        itemsCountPerPage={5}
      ></PageNavigate>
      {updateUserModal && (
        <UpdateBizModal refreshUserListHandler={refreshUserListHandler} userId={id} setUserId={setId} />
      )}
    </>
  );
};
