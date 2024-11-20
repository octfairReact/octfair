import { useRecoilState } from "recoil";
import { loginInfoState } from "../../../../stores/userInfo";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { Button } from "../../../common/Button/Button";
import { ResumeStyled } from "../styled";
import { useEffect, useState } from "react";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { postResumeApi } from "../../../../api/postResumeApi";
import { IResume, IResumeListResponse } from "../../../../models/interface/IResume";
import { useNavigate } from "react-router-dom";
import { Resume } from "../../../../api/api";

export const ResumeMain = () => {
  const [userInfo, setUserInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [resumeList, setResumeList] = useState<IResume[]>();
  const [isLoaded, setIsLoaded] = useState(false); //로딩 상태 관리. 조회 결과 나오기전까지 랜더링 안되게
  const navigate = useNavigate();
  //const [index, setIndex] = useState<number>();
  //const { searchKeyWord } = useContext(ResumeContext);

  console.log("test:::::::::::::", userInfo.loginId, userInfo.userNm, userInfo.userType);

  useEffect(() => {
    if (localStorage.getItem("loginInfoState")) {
      console.log("loginInfoState::::::::::::::::", localStorage.getItem("loginInfoState"));
      setUserInfo(JSON.parse(localStorage.getItem("loginInfoState")!));
      console.log("setUserInfo::::::::::::::::::::", setUserInfo);
    }
  }, []);

  useEffect(() => {
    MyResumeList();
  }, [userInfo]);
  //(처음에 같이 썼던게 문제였음)useEffect에서 userInfo와 MyResumeList를 같이 쓰지않고 따로 둔 이유
  //setUserInfo 후 바로 리스트 호출해서 상태가 업데이트가 되지 않아서 undefined가 될때도 잘 보일때도 있었음
  //userInfo가 완전히 변경된 후에 리스트를 호출하기 위해서 저렇게 따로 써서 의존성 배열 위치에 둠

  const MyResumeList = async () => {
    const searchParam = {
      //...searchKeyWord,
      loginId: userInfo.loginId,
      userNm: userInfo.userNm,
      userType: userInfo.userType,
    };
    console.log("searchParam::::::::", searchParam);
    const searchList = await postResumeApi<IResumeListResponse>(Resume.getListBody, searchParam);
    console.log("searchList::::::::" + searchList);
    if (searchList) {
      setResumeList(searchList.data.resume);
    }
    setIsLoaded(true);
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
