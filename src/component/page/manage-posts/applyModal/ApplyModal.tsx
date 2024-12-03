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
import { IPostResponse } from "../../../../models/interface/INotice";

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
  const [selectedValue, setSelectedValue] = useState({ resumeIdx: null, userIdx: null });

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
  const handleRadioChange = (event) => {
    const [resumeIdx, userIdx] = event.target.value.split(",").map(Number);
    setSelectedValue({ resumeIdx, userIdx }); // 상태 업데이트
  };

  const applyPostSaveHandler = async () => {
    const { loginId } = userInfo;
    console.log("여기 모스트헨들러", selectedValue);
    const param = {
      postIdx: indexGroup[0],
      bizIdx: indexGroup[1],
      loginId: loginId,
      resIdx: selectedValue.resumeIdx,
      userIdx: selectedValue.userIdx,
    };
    console.log("param : ", param);

    const applyPostSave = await postPostApi<IPostResponse>(Posts.saveApplyBody, param);
    console.log(applyPostSave);
    if (applyPostSave.data.result == "success") {
      alert("이력서를 넣었습니다.");
    } else {
      alert("이미 이력서를 넣었습니다.");
    }
    handleClose();
    managePostDetail();
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
                  const isSelected =
                    selectedValue.resumeIdx === list.resumeIdx && selectedValue.userIdx === list.userIdx;

                  return (
                    <tr
                      key={list.resumeIdx}
                      onClick={() =>
                        handleRadioChange({
                          target: {
                            value: `${list.resumeIdx},${list.userIdx}`,
                          },
                        })
                      }
                      style={{
                        cursor: "pointer",
                        backgroundColor: isSelected ? "#f0f8ff" : "inherit", // 선택된 행 강조
                      }}
                    >
                      <StyledTd>
                        <input
                          type="radio"
                          name="resume"
                          value={`${list.resumeIdx},${list.userIdx}`}
                          checked={isSelected}
                          readOnly
                        />
                      </StyledTd>
                      <StyledTd>{list.resumeTitle}</StyledTd>
                      <StyledTd>{list.userEmail}</StyledTd>
                      <StyledTd>{list.userPhone}</StyledTd>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <StyledTd colSpan={5}>이력서가 없습니다.</StyledTd>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </div>

        <div className={"button-container"}>
          <button onClick={applyPostSaveHandler}>등록</button>
          <button onClick={handleClose}>나가기</button>
        </div>
      </div>
    </ApplyModalStyled>
  );
};
