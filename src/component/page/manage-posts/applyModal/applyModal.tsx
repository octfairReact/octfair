import { useRecoilState } from "recoil";
import { loginInfoState } from "../../../../stores/userInfo";
import { ApplyModalState } from "../../../../stores/modalState";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { FC, useEffect, useState } from "react";
import { postPostApi } from "../../../../api/postPostApi";
import { IScrapResponse } from "../../../../models/interface/IScrap";
import { Posts } from "../../../../api/api";
import { ApplybizDetail, ApplyDetailAll, ApplyUserDetail } from "../../../../models/interface/IPost";
import { AxiosResponse } from "axios";
import { NoticeModalStyled } from "../../Notice/NoticeModal/styled";
import { ApplyModalStyled } from "./styled";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";

export interface IApplyModalProps {
  onSuccess: () => void;
  indexGroup: number[];
}

export const ApplyModal: FC<IApplyModalProps> = ({ onSuccess, indexGroup }) => {
  const [modal, setModal] = useRecoilState<boolean>(ApplyModalState);
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileData, setFileData] = useState<File>();
  const [index, setIndex] = useState<number>();
  const [bizDetail, setBizDetail] = useState<ApplybizDetail>();
  const [userResumeList, setUserResumeList] = useState<ApplyUserDetail[]>();

  useEffect(() => {
    if (bizDetail) {
      console.log("업데이트된 회사 detail", bizDetail);
    }

    if (userResumeList) {
      console.log("업데이트된 이력서 리스트", userResumeList);
    }
    if (modal) {
      console.log("모달 확인: ", modal);
      managePostDetail();
    }
    // }, [bizDetail, userResumeList]);
  }, [modal]);

  const handleApply = () => {
    console.log("입사지원 완료");
  };

  const handleClose = () => {
    setModal(!modal);
  };
  const managePostDetail = async () => {
    const { loginId } = userInfo;
    console.log(indexGroup[0]);
    console.log(indexGroup[1]);

    const param = {
      postIdx: indexGroup[0],
      bizIdx: indexGroup[1],
      loginId: loginId,
    };

    const applBizPostDetail = await postPostApi<ApplyDetailAll>(Posts.applyBizPostDetail, param);
    const applyUserResumeList = await postPostApi<ApplyDetailAll>(Posts.applyUserResumeDetail, param);

    console.log("여기는 JobDetail");
    console.log("회사 detail 데이터:", applBizPostDetail.data.bizPostDetail);
    console.log("이력서 리스트 데이터:", applyUserResumeList.data.userResumeList);

    // 상태 업데이트
    setBizDetail(applBizPostDetail.data.bizPostDetail);
    setUserResumeList(applyUserResumeList.data.userResumeList);
  };

  return (
    <ApplyModalStyled>
      <div className="container">
        {bizDetail && (
          <>
            <h1>{bizDetail?.bizName}</h1>
            <h2>{bizDetail?.postTitle}</h2>
          </>
        )}

        <div>
          <StyledTable>
            <thead>
              <tr>
                <StyledTh size={5}></StyledTh>
                <StyledTh size={50}>제목</StyledTh>
                <StyledTh size={50}>이메일 주소</StyledTh>
                <StyledTh size={20}>핸드폰</StyledTh>
              </tr>
            </thead>
            <tbody>
              {userResumeList?.length > 0 ? (
                userResumeList?.map((list) => {
                  return (
                    <tr key={list.resumeIdx}>
                      <StyledTd>
                        <input type="radio" />
                      </StyledTd>
                      <StyledTd>{list.resumeTitle}</StyledTd>
                      <StyledTd>{list.userEmail}</StyledTd>
                      <StyledTd>{list.userPhone}</StyledTd>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <StyledTd colSpan={5}>데이터가 없습니다.</StyledTd>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </div>

        <div className={"button-container"}>
          <button>등록</button>
          <button onClick={handleClose}>나가기</button>
        </div>
      </div>
    </ApplyModalStyled>
  );
};
