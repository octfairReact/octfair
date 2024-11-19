import { useRecoilState, useRecoilValue } from "recoil";
import { loginInfoState } from "../../../../stores/userInfo";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { Button } from "../../../common/Button/Button";
import { ResumeStyled } from "../styled";
import { useContext, useEffect, useState } from "react";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { postResumeApi } from "../../../../api/postResumeApi";
import { IResume, IResumeListResponse } from "../../../../models/interface/IResume";
import { useLocation } from "react-router-dom";
import { ResumeContext } from "../../../../api/provider/ResumeProvicer";
import { Resume } from "../../../../api/api";
import { Login } from "../../../../pages/Login";

export const ResumeMain = () => {
  const { search } = useLocation();
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [resumeList, setResumeList] = useState<IResume[]>();
  const [index, setIndex] = useState<number>();
  const { searchKeyWord } = useContext(ResumeContext);
  // const getResume = {
  //   loginId: userInfo.loginId,
  //   userNm: userInfo.userNm,
  //   userType: userInfo.userType,
  // };
  console.log("test:::::::::::::", userInfo.loginId, userInfo.userNm, userInfo.userType);

  useEffect(() => {
    searchResumeList();
    // console.log("getResume:::::", getResume);
  }, [search]);

  useEffect(() => {
    searchResumeList();
    // console.log("getResume2:::::", getResume);
  }, [searchKeyWord]);

  const searchResumeList = async () => {
    const searchParam = {
      ...searchKeyWord,
      //loginId,
      //userNm,
      //userType,
    };
    console.log("searchParam:::::", searchParam);
    const searchList = await postResumeApi<IResumeListResponse>(Resume.getListBody, searchParam);
    console.log("searchList::::::::" + searchList);
    if (searchList) {
      setResumeList(searchList.data.resume);
    }
  };
  const onPostSuccess = () => {
    searchResumeList();
  };

  return (
    <>
      <ResumeStyled>
        <Button
        //onClick={""}
        >
          새 이력서 작성
        </Button>
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
                <tr>
                  <StyledTd>{resume.resTitle}</StyledTd>
                  <StyledTd>
                    <ResumeStyled>
                      {
                        <>
                          <Button
                          //onClick={""}
                          >
                            복사하기
                          </Button>
                          <Button
                            style={{
                              backgroundColor: "silver",
                            }}
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
