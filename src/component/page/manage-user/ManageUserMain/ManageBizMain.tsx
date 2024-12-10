import { useContext, useEffect, useState } from "react";
import { IManageBiz, IManageBizListResponse } from "../../../../models/interface/IManageUser";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { UpdateBizModal } from "../ManageUserModal/UpdateBizModal";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { Button } from "../../../common/Button/Button";
import { ManageUser } from "../../../../api/api";
import { postManageUserApi } from "../../../../api/postManageUserApi";
import { ManageUserContext } from "../../../../api/provider/ManageUserProvider";
import { toast } from "react-toastify";
import loading_circle from '../../../../assets/loading_circle.gif';

export const ManageBizMain = () => {
  // 모달에 쓰이는 변수
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [id, setId] = useState<number>();

  // 리스트(표)에 쓰이는 변수
  const [userList, setUserList] = useState<IManageBiz[]>(); // 아이템 리스트
  const [userCnt, setUserCnt] = useState<number>(0); // 총 아이템의 갯수 (리스트 페이지 갯수 x)
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 검색에 쓰이는 변수
  const { searchKeyWord } = useContext(ManageUserContext);

  // Provider를 통해 Provider가 위치한 페이지 내의 컴포넌트인 Search로부터 searchKeyWord가 갱신되어 작동하는 Hook
  useEffect(() => {
    try { searchUserList();
    } catch (error) { toast.error("서버통신 실패, 담당자에게 문의하세요!");
    }
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

  // 리스트(표) 새로고침 핸들러: 모달에서 전송성공시, 리스트새로고침 + 모달닫기
  const refreshUserListHandler = () => {
    setModal(false);
    searchUserList();
  };

  // 리스트(표) 아이템 선택 시 아이템관련 정보를 담은 모달 팝업
  const openUpdateUserModalHandler = (id: number) => {
    setModal(true);
    setId(id);
  };

  // ESC=닫기 작동
  const pressEscHandler = (event) => {
    if (event.key === "Escape")
      setModal(false);
  };

  return (
    <>
      총 갯수 : {userCnt}
      현재 페이지 : {currentPage}
      <StyledTable onKeyDown={pressEscHandler}>
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
          {!userList ? <tr><td colSpan={6} style={{ textAlign: "center", padding: "20px" }}><img src={loading_circle} alt="loading" /></td></tr> :
            userList?.length > 0 ? (
              userList?.map((user) => { return (
                <tr key={user.bizIdx} onClick={() => openUpdateUserModalHandler(user.bizIdx)}>
                  <StyledTd>{user.bizIdx}</StyledTd>
                  <StyledTd>{user.bizName}</StyledTd>
                  <StyledTd>{user.bizCeoName}</StyledTd>
                  <StyledTd>{user.bizContact}</StyledTd>
                  <StyledTd>{user.bizWebUrl}</StyledTd>
                  <StyledTd><Button>정보수정</Button></StyledTd>
                </tr>
              );})) : (
                <tr>
                  <StyledTd colSpan={6}>데이터가 없습니다.</StyledTd>
                </tr>
            )
          }
        </tbody>
      </StyledTable>
      <PageNavigate
        totalItemsCount={userCnt}
        onChange={searchUserList}
        activePage={currentPage}
        itemsCountPerPage={5}
      ></PageNavigate>
      {modal && (
        <UpdateBizModal refreshUserListHandler={refreshUserListHandler} userId={id} setUserId={setId} />
      )}
    </>
  );
}