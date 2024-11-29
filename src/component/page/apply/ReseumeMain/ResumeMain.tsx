import { useRecoilState } from "recoil";
import { loginInfoState } from "../../../../stores/userInfo";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { Button } from "../../../common/Button/Button";
import { ResumeStyled } from "../styled";
import { useContext, useEffect, useState } from "react";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { postResumeApi } from "../../../../api/postResumeApi";
import { IPostResponse, IResume, IResumeListResponse } from "../../../../models/interface/IResume";
import { useNavigate } from "react-router-dom";
import { Resume } from "../../../../api/api";
import { ResumeForm } from "../../../../pages/ResumeForm";
import { Portal } from "../../../common/portal/Portal";
import axios from "axios";
//import { ResumeContext } from "../../../../api/provider/ResumeProvicer";
import { toast } from "react-toastify";

export const ResumeMain = () => {
  const [userInfo, setUserInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [resumeList, setResumeList] = useState<IResume[]>();
  const navigate = useNavigate();
  const [index, setIndex] = useState<number>();
  const [isLoaded, setIsLoaded] = useState(false); //로딩 상태 관리. 조회 결과 나오기전까지 랜더링 안되게
  //const { searchKeyWord } = useContext(ResumeContext);

  console.log("test:::::::::::::", userInfo.loginId, userInfo.userNm, userInfo.userType);

  useEffect(() => {
    if (localStorage.getItem("loginInfoState")) {
      setUserInfo(JSON.parse(localStorage.getItem("loginInfoState")!));
    }
  }, []);

  useEffect(() => {
    MyResumeList();
  }, [userInfo]);

  const MyResumeList = async () => {
    const userParam = {
      loginId: userInfo.loginId,
      userNm: userInfo.userNm,
      userType: userInfo.userType,
    };

    const bring_resumeList = await postResumeApi<IResumeListResponse>(
      Resume.getListBody,
      userParam
    );

    if (bring_resumeList) {
      setResumeList(bring_resumeList.data.resume);
    }
    setIsLoaded(true);
  };

  const moveResumeDetailPage = (resIdx: number) => {
    navigate(`/react/apply/resume-detail/${resIdx}`);
  };

  const onSuccess = () => {
    MyResumeList();
  };
  const handlerDelete = async (resIdx: number) => {
    console.log("Deleting resume with resIdx:", resIdx);
    const param = {
      resIdx,
    };

    const postDelete = await postResumeApi<IPostResponse>(Resume.resumeDelete, param);

    if (postDelete && postDelete.data.result === "success") {
      onSuccess();
    } else {
      console.error("Failed to save notice:", postDelete?.data);
    }

    // axios.post("/board/noticeDeleteJson.do", param).then((res: AxiosResponse<IPostResponse>) => {
    //   res.data.result === "success" && onSuccess();
    // });
  };

  // 이력서 복사하기 기능
  const handlerCopy = async (resIdx: number, resumeTitle: string) => {
    const param = {
      resIdx,
    };
    const postCopy = await postResumeApi<IPostResponse>(Resume.resumeCopy, param);

    if (postCopy && postCopy.data.result === "success") {
      onSuccess();
      console.log("이력서 복사 성공");
      // 복사 성공 메시지에 이력서 이름을 포함하여 표시
      toast.success(`이력서 "${resumeTitle}"이 성공적으로 복사되었습니다.`);
    } else {
      console.error("복사 실패:", postCopy?.data);
    }
  };

  if (!isLoaded) {
    return null; // 로딩 완료 전까지 아무것도 렌더링하지 않음
  }

  return (
    <>
      <ResumeStyled>
        <Button onClick={() => navigate("/react/apply/resume-new.do")}>새 이력서 작성</Button>
      </ResumeStyled>
      <StyledTable>
        <thead>
          <tr>
            <StyledTh size={55}>이력서 제목</StyledTh>
            <StyledTh size={30}>관리</StyledTh>
            <StyledTh size={15}>최종수정일</StyledTh>
          </tr>
        </thead>
        <tbody>
          {resumeList?.length > 0 ? (
            resumeList?.map((resume) => {
              return (
                <tr key={resume.resIdx}>
                  <StyledTd onClick={() => moveResumeDetailPage(resume.resIdx)}>
                    {resume.resTitle}
                  </StyledTd>
                  <StyledTd>
                    <ResumeStyled>
                      {
                        <>
                          <Button onClick={() => handlerCopy(resume.resIdx, resume.resTitle)}>복사하기</Button>
                          <Button
                            style={{
                              backgroundColor: "silver",
                            }}
                            onClick={() => handlerDelete(resume.resIdx)}
                          >
                            삭제하기
                          </Button>
                        </>
                      }
                    </ResumeStyled>
                  </StyledTd>
                  <StyledTd>{resume.updatedDate}</StyledTd>
                </tr>
              );
            })
          ) : (
            <tr>
              <StyledTd colSpan={3}>데이터가 없습니다.</StyledTd>
            </tr>
          )}
        </tbody>
      </StyledTable>

      {/* 토스트 메시지 출력 컴포넌트 추가 */}
      {/* <ToastContainer/> */}
    </>
  );
};
