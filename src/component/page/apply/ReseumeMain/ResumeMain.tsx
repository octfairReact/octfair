import { useRecoilState } from "recoil";
import { loginInfoState } from "../../../../stores/userInfo";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { Button } from "../../../common/Button/Button";
import { ResumeStyled } from "../styled";
import { useContext, useEffect, useState } from "react";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { postResumeApi } from "../../../../api/postResumeApi";
import {
  IDetailResponse,
  IPostResponse,
  IResume,
  IResumeDetail,
  IResumeListResponse,
} from "../../../../models/interface/IResume";
import { useNavigate } from "react-router-dom";
import { Resume } from "../../../../api/api";
import { ResumeContext } from "../../../../api/provider/ResumeProvider";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

export const ResumeMain = () => {
  const { resIdx, resumeDetail, setResumeDetail, setResIdx } = useContext(ResumeContext);
  const [userInfo, setUserInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [resumeList, setResumeList] = useState<IResume[]>();
  const navigate = useNavigate();
  const [index, setIndex] = useState<number>();
  const [isLoaded, setIsLoaded] = useState(false); //로딩 상태 관리. 조회 결과 나오기전까지 랜더링 안되게

  console.log("test:::::::::::::", userInfo.loginId, userInfo.userNm, userInfo.userType);

  useEffect(() => {
    if (sessionStorage.getItem("userInfo")) {
      setUserInfo(JSON.parse(sessionStorage.getItem("userInfo")!));
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

    const bring_resumeList = await postResumeApi<IResumeListResponse>(Resume.getListBody, userParam);

    if (bring_resumeList) {
      setResumeList(bring_resumeList.data.resume);
    }
    setIsLoaded(true);
  };

  const moveResumeDetailPage = (resIdx: number) => {
    navigate(`/react/apply/resume-detail/${resIdx}`, {
      state: {
        moveDetail: "moveDetail",
      },
    });
  };

  const onSuccess = () => {
    MyResumeList();
  };

  const createNewResume = async () => {
    const param = {
      loginId: userInfo.loginId,
      userNm: userInfo.userNm,
      userType: userInfo.userType,
    };

    const response = await postResumeApi<IDetailResponse>(Resume.getResumeNew, param);
    console.log("새 이력서 작성 버튼 클릭 시::::::::", response.data);
    if (response && response.data.result) {
      //response.data가 IDetailResponse 타입이므로 response.data.result는 IResumeDetail 타입임.
      //IDetailResponse는 큰 상자, result는 상자 안에 담긴 작은 물건이라고 생각하면 상자 전체(IDetailResponse)를 쓸 필요 없이, 그 안에 담긴 물건(result)만 꺼내서 사용하겠다는 의미
      const resumeDetail: IResumeDetail = response.data.result;
      const createNewResume = response.data.createNewResume;
      const newResIdx = resumeDetail.resIdx;

      setResumeDetail(resumeDetail);
      setResIdx(newResIdx);
      console.log("새 이력서 작성 시 최종 데이터 보내기 전", resumeDetail);
      console.log(createNewResume);

      navigate("/react/apply/resume-new.do", {
        state: {
          resumeDetail,
          createNewResume: response.data.createNewResume || null,
          resIdx: newResIdx,
        },
      });
    }
  };

  const handlerDelete = async (resIdx: number) => {
    //if (!confirm("이력서를 삭제하시겠습니까?")) {
    //  return;
    //}
    console.log("삭제할 이력서 resIdx:", resIdx);
    const param = {
      resIdx,
    };

    const resumeDelete = await postResumeApi<IPostResponse>(Resume.resumeDelete, param);

    if (resumeDelete && resumeDelete.data.result === "success") {
      toast.error(`이력서가 성공적으로 삭제되었습니다.`);
      onSuccess();
    } else {
      console.error("삭제 실패:", resumeDelete?.data);
    }
  };

  const handlerFileDownload = async (fileName: string, resIdx: number) => {
    const param = new URLSearchParams();
    param.append("resIdx", resIdx.toString());

    const postAction: AxiosRequestConfig = {
      url: "/apply/resumeFileDownload",
      method: "post",
      data: param,
      responseType: "blob",
    };
    await axios(postAction)
      .then((res) => {
        console.log("다운로드 데이터 blob", res);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url; // Blob URL을 다운로드 링크로 설정
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error("파일 다운로드 중 오류 발생", error);
      });
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
        <Button onClick={createNewResume}>새 이력서 작성</Button>
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
                  <StyledTd>
                    <div
                      onClick={() => moveResumeDetailPage(resume.resIdx)}
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                    >
                      {resume.resTitle}
                    </div>
                    {resume?.fileName && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handlerFileDownload(resume.fileName, resume.resIdx);
                        }}
                        style={{ cursor: "pointer", color: "blue", marginTop: "5px" }}
                      >
                        {resume.fileName}
                      </div>
                    )}
                  </StyledTd>
                  <StyledTd
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <ResumeStyled>
                      {
                        <>
                          <Button onClick={() => handlerCopy(resume.resIdx, resume.resTitle)}>복사하기</Button>
                          <Button
                            style={{
                              backgroundColor: "silver",
                              width: "120px",
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
    </>
  );
};
