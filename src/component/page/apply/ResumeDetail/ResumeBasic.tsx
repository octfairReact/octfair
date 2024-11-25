import { StyledTable } from "../../../common/styled/StyledTable";
import {
  ResumeDetailBody,
  ResumeDetailBodyBasicInfo,
  ResumeDetailBodyHeader,
  ResumeDetailBodyGuide,
  ResumeInput,
  ResumeTextarea,
  ResumeButton,
  ResumeTable,
  InputBtnGroup,
  BtnGroup,
  AttachContainer,
  AttachFileName,
  AttachDeleteButton,
  FileLabel,
} from "../styled";
import { Button } from "../../../common/Button/Button";
import { ChangeEvent, useContext, useState } from "react";
import { loginInfoState } from "../../../../stores/userInfo";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { ResumeContext } from "../../../../api/provider/ResumeProvicer";
import { FC } from "react";
import { IResumeDetail, IDetailResponse } from "../../../../models/interface/IResume";
import { CareerList } from "./CareerList";
import { EduList } from "./EduList";
import { SkillList } from "./SkillList";
import { CertificationList } from "./CertificationList";
import { useNavigate } from "react-router-dom";

export const ResumeBasic = () => {
  const { resIdx } = useContext(ResumeContext);
  const [userInfo, setUserInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [resTitle, setResTitle] = useState("");
  const [shortIntro, setShortIntro] = useState("");
  const [proLink, setProLink] = useState("");
  const [personalStatement, setPersonalStatement] = useState("");
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileData, setFileData] = useState<File>();

  const navigate = useNavigate();
  const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInfo = e.target.files;
    console.log("파일 인포", fileInfo);
    if (fileInfo?.length > 0) {
      const fileInfoSplit = fileInfo[0].name.split(".");
      const fileExtension = fileInfoSplit[1].toLowerCase();

      if (fileExtension === "jpg" || fileExtension === "gif" || fileExtension === "png") {
        setImageUrl(URL.createObjectURL(fileInfo[0]));

        console.log("미리보기", URL.createObjectURL(fileInfo[0]));
      } else {
        setImageUrl("");
        // 정해진 확장자외 다른 파일이 들어오면 파일네임 스트링값만 나오게
      }

      setFileData(fileInfo[0]);
    }
  };

  return (
    <>
      <StyledTable>
        {/* 이력서 제목 및 회원 이름, 메일, 전화번호 화면 */}
        <ResumeDetailBodyBasicInfo>
          <div>
            <input
              style={{ fontSize: "30px", marginBottom: "20px", padding: "5px", width: "1100px" }}
              id="restitle"
              type="text"
              value={resTitle}
              placeholder="이력서 제목"
              onChange={(e) => setResTitle(e.target.value)}
            />
          </div>
          <div>
            <ResumeInput
              id="userName"
              type="text"
              value={userInfo.userNm}
              placeholder="이름"
              readOnly
            />
            <ResumeInput id="userEmail" type="text" value="" placeholder="이메일" readOnly />
            <ResumeInput id="userPhone" type="text" value="" placeholder="연락처" readOnly />
          </div>
        </ResumeDetailBodyBasicInfo>

        <ResumeDetailBody>
          <ResumeDetailBodyHeader>간단소개글</ResumeDetailBodyHeader>
          <ResumeDetailBodyGuide>
            <p>
              • 본인의 업무 경험을 기반으로 핵심역량과 업무 스킬을 간단히 작성해주세요.
              <br />• 3~5줄로 요약하여 작성하는 것을 추천합니다!
            </p>
          </ResumeDetailBodyGuide>
          <div>
            <ResumeTextarea
              id="short_intro"
              value={shortIntro}
              placeholder=" 소개글을 입력해주세요."
              onChange={(e) => setShortIntro(e.target.value)}
            />
          </div>
        </ResumeDetailBody>

        <ResumeDetailBody>
          <ResumeDetailBodyHeader>경력</ResumeDetailBodyHeader>
          <ResumeDetailBodyGuide>
            <p>
              • 담당하신 업무 중 우선순위가 높은 업무를 선별하여 최신순으로 작성해주세요. <br />•
              신입의 경우, 직무와 관련된 대외활동, 인턴, 계약직 경력 등이 있다면 작성해주세요.{" "}
              <br />
              • 업무 또는 활동 시 담당했던 역할과 과정, 성과에 대해 자세히 작성해주세요. <br />•
              현재 재직중이면 퇴사일을 해당월로 입력해주세요.
            </p>
          </ResumeDetailBodyGuide>
          <CareerList />
        </ResumeDetailBody>

        <ResumeDetailBody>
          <ResumeDetailBodyHeader>학력</ResumeDetailBodyHeader>
          <ResumeDetailBodyGuide>
            <p>• 최신순으로 작성해주세요.</p>
          </ResumeDetailBodyGuide>
          <EduList />
        </ResumeDetailBody>

        <ResumeDetailBody>
          <ResumeDetailBodyHeader>스킬</ResumeDetailBodyHeader>
          <ResumeDetailBodyGuide>
            <p>
              • 개발 스택, 디자인 툴, 마케팅 툴 등 가지고 있는 직무와 관련된 스킬을 추가해보세요.{" "}
              <br />• 데이터 분석 툴이나 협업 툴 등의 사용해본 경험이 있으신 툴들도 추가해보세요.
            </p>
          </ResumeDetailBodyGuide>
          <SkillList />
        </ResumeDetailBody>

        <ResumeDetailBody>
          <ResumeDetailBodyHeader>자격증 및 외국어</ResumeDetailBodyHeader>
          <ResumeDetailBodyGuide>
            <p>
              • 직무 관련 자격증, 외국어 자격증이나 수료한 교육 등이 있다면 간략히 작성해주세요.{" "}
              <br />• 지원하는 회사에서 요구하는 경우가 아니라면 운전면허증과 같은 자격증은 생략하는
              것이 좋습니다!
            </p>
          </ResumeDetailBodyGuide>
          <CertificationList />
        </ResumeDetailBody>

        <ResumeDetailBody>
          <ResumeDetailBodyHeader>링크</ResumeDetailBodyHeader>
          <ResumeDetailBodyGuide>
            <p>
              • 깃허브, 노션으로 작성한 포트폴리오, 구글 드라이브 파일 등 업무 성과를 보여줄 수 있는
              링크가 있다면 작성해주세요.
            </p>
          </ResumeDetailBodyGuide>
          <div>
            <ResumeInput
              id="proLink"
              value={proLink}
              placeholder=" https://"
              onChange={(e) => setProLink(e.target.value)}
            />
          </div>
        </ResumeDetailBody>

        <ResumeDetailBody>
          <ResumeDetailBodyHeader>자기소개서</ResumeDetailBodyHeader>
          <ResumeDetailBodyGuide>
            <p>• 지원동기, 직무역량, 직무관련 성과와 경험, 포부 등 자유롭게 작성해 주세요.</p>
          </ResumeDetailBodyGuide>
          <div>
            <ResumeTextarea
              id="personalStatement"
              value={shortIntro}
              placeholder=" 자기소개서를 입력해주세요."
              onChange={(e) => setPersonalStatement(e.target.value)}
            />
          </div>
        </ResumeDetailBody>

        <ResumeDetailBody>
          <ResumeDetailBodyHeader>첨부파일</ResumeDetailBodyHeader>
          <ResumeDetailBodyGuide>
            <p>• 포트폴리오, 경력기술서 등 첨부파일이 있다면 등록해주세요.</p>
          </ResumeDetailBodyGuide>
          <ResumeInput
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handlerFile}
          />
          <FileLabel className="img-label" htmlFor="fileInput">
            파일 첨부하기
          </FileLabel>
          <div id="preview"></div>
        </ResumeDetailBody>

        <div style={{ textAlign: "center" }}>
          <InputBtnGroup style={{ marginTop: "15px", textAlign: "center", width: "100%" }}>
            <Button
              style={{
                backgroundColor: "gray",
              }}
              onClick={() => navigate(`/react/apply/resume.do`)}
            >
              목록으로
            </Button>
            <Button>저장하기</Button>
            <Button
              style={{
                backgroundColor: "gray",
              }}
            >
              미리보기
            </Button>
          </InputBtnGroup>
        </div>
      </StyledTable>
    </>
  );
};
