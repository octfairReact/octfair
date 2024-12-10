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
import { ChangeEvent, useContext, useState, useEffect, useCallback, SetStateAction } from "react";
import { loginInfoState } from "../../../../stores/userInfo";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { ResumeContext } from "../../../../api/provider/ResumeProvider";
import { FC } from "react";
import {
  IResumeDetail,
  IDetailResponse,
  Career,
  IPostResponse,
  defaultResumeDetail,
} from "../../../../models/interface/IResume";
import { EduList } from "./EduList";
import { SkillList } from "./SkillList";
import { CertificationList } from "./CertificationList";
import { useLocation, useNavigate } from "react-router-dom";
import { postResumeApi } from "../../../../api/postResumeApi";
import { Resume } from "../../../../api/api";
import { CareerList } from "./CareerList";
import axios, { AxiosRequestConfig } from "axios";
import { modalState } from "../../../../stores/modalState";
import { HistoryModal } from "../../History/HistoryModal/HistoryModal";

export const ResumeBasic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(ResumeContext);

  const stateResumeDetail = location.state?.resumeDetail;
  const stateResIdx = location.state?.resIdx;

  const resIdx = stateResIdx || context.resIdx || 0;
  const resumeDetail = stateResumeDetail || context.resumeDetail || defaultResumeDetail;

  const { setResumeDetail } = context;

  useEffect(() => {
    if (stateResumeDetail && !context.resumeDetail) {
      setResumeDetail(stateResumeDetail);
    }
  }, [stateResumeDetail, context.resumeDetail, setResumeDetail]);

  console.log("resumeDetail in ResumeBasic:", resumeDetail);
  //const resIdx = location.state?.resIdx || context.resIdx || 0;
  //const { resumeDetail, setResumeDetail } = useContext(ResumeContext);
  console.log("resumeDetail in ResumeBasic:", resumeDetail); // 값 확인
  const [userInfo, setUserInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  // const [resTitle, setResTitle] = useState("");
  // const [shortIntro, setShortIntro] = useState("");
  // const [proLink, setProLink] = useState("");
  // const [perStatement, setPerStatement] = useState("");
  // const [imageUrl, setImageUrl] = useState<string>();
  const [fileData, setFileData] = useState<File>();
  const [fileName, setFileName] = useState<string | undefined>(resumeDetail?.fileName);
  const [formData, setFormData] = useState<IResumeDetail>(defaultResumeDetail);
  const [modal, setModal] = useRecoilState<boolean>(modalState);

  console.log(userInfo);
  console.log("123123resumeDetail::::::", resumeDetail);

  console.log(userInfo);

  useEffect(() => {
    if (resumeDetail) {
      setFormData(resumeDetail);
      setFileName(resumeDetail.fileName || "");
      console.log("fileName 상태:", fileName);
    }
  }, [resumeDetail]);

  const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInfo = e.target.files;
    if (fileInfo?.length > 0) {
      setFileData(fileInfo[0]);
      setFileName(fileInfo[0].name);
    }
  };

  const handlerFileDownload = async () => {
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
        link.href = url;
        link.setAttribute("download", resumeDetail?.fileName as string);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {});
  };

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlerSave = async () => {
    const fileForm = new FormData();
    console.log("fileForm:::::", fileForm);
    const textData = {
      resIdx: resumeDetail.resIdx,
      res_title: formData.resTitle || "",
      short_intro: formData.shortIntro || "",
      pfo_link: formData.proLink || "",
      per_statement: formData.perStatement || "",
      loginId: userInfo.loginId,
      userNm: userInfo.userNm,
      userType: userInfo.userType,
    };
    console.log("textData::::::::", textData);

    fileData && fileForm.append("file", fileData);
    fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));
    console.log("fileForm2:::::::::", fileForm);
    const response = await postResumeApi<IPostResponse>(Resume.resumeSave, fileForm);
    // const response = await axios.post(Resume.resumeSave, fileForm);
    console.log("이력서 폼 제출::::::::::::::", fileForm);

    if (response && response.data.result === "success") {
      alert("이력서가 저장되었습니다.");
      navigate(`/react/apply/resume.do`);
    } else {
      console.error("Failed to save resume:", response?.data);
    }
  };

  const handlerFileDelete = useCallback(
    async (resIdx?: number) => {
      const param = { resIdx };
      const response = await postResumeApi<IPostResponse>(Resume.fileDelete, param);

      if (response.data.result === "success") {
        alert("삭제되었습니다.");
        setFileData(undefined);
        setFileName(undefined);
      }
    },
    [resIdx]
  );

  const handlerModal = (resIdx: number) => {
    if (!modal) {
      setModal(true);
      console.log(`Modal opened with resIdx: ${resIdx}`);
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
              id="resTitle"
              type="text"
              value={formData.resTitle || ""}
              placeholder="이력서 제목"
              onChange={handlerChange}
            />
          </div>
          <div>
            <ResumeInput
              id="userName"
              type="text"
              value={userInfo.userNm}
              placeholder="이름"
              readOnly
              style={{ border: "none" }}
            />
            <ResumeInput
              id="userEmail"
              type="text"
              value={resumeDetail?.email || ""}
              placeholder="이메일"
              readOnly
              style={{ border: "none" }}
            />
            <ResumeInput
              id="userPhone"
              type="text"
              value={resumeDetail?.phone || ""}
              placeholder="연락처"
              readOnly
              style={{ border: "none" }}
            />
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
              id="shortIntro"
              value={formData.shortIntro || ""}
              placeholder=" 소개글을 입력해주세요."
              onChange={handlerChange}
            />
          </div>
        </ResumeDetailBody>

        <ResumeDetailBody>
          <ResumeDetailBodyHeader>경력</ResumeDetailBodyHeader>
          <ResumeDetailBodyGuide>
            <p>
              • 담당하신 업무 중 우선순위가 높은 업무를 선별하여 최신순으로 작성해주세요. <br />• 신입의 경우, 직무와
              관련된 대외활동, 인턴, 계약직 경력 등이 있다면 작성해주세요. <br />
              • 업무 또는 활동 시 담당했던 역할과 과정, 성과에 대해 자세히 작성해주세요. <br />• 현재 재직중이면
              퇴사일을 해당월로 입력해주세요.
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
              • 개발 스택, 디자인 툴, 마케팅 툴 등 가지고 있는 직무와 관련된 스킬을 추가해보세요. <br />• 데이터 분석
              툴이나 협업 툴 등의 사용해본 경험이 있으신 툴들도 추가해보세요.
            </p>
          </ResumeDetailBodyGuide>
          <SkillList />
        </ResumeDetailBody>

        <ResumeDetailBody>
          <ResumeDetailBodyHeader>자격증 및 외국어</ResumeDetailBodyHeader>
          <ResumeDetailBodyGuide>
            <p>
              • 직무 관련 자격증, 외국어 자격증이나 수료한 교육 등이 있다면 간략히 작성해주세요. <br />• 지원하는
              회사에서 요구하는 경우가 아니라면 운전면허증과 같은 자격증은 생략하는 것이 좋습니다!
            </p>
          </ResumeDetailBodyGuide>
          <CertificationList />
        </ResumeDetailBody>

        <ResumeDetailBody>
          <ResumeDetailBodyHeader>링크</ResumeDetailBodyHeader>
          <ResumeDetailBodyGuide>
            <p>
              • 깃허브, 노션으로 작성한 포트폴리오, 구글 드라이브 파일 등 업무 성과를 보여줄 수 있는 링크가 있다면
              작성해주세요.
            </p>
          </ResumeDetailBodyGuide>
          <div>
            <ResumeInput id="proLink" value={formData.proLink || ""} placeholder=" https://" onChange={handlerChange} />
          </div>
        </ResumeDetailBody>

        <ResumeDetailBody>
          <ResumeDetailBodyHeader>자기소개서</ResumeDetailBodyHeader>
          <ResumeDetailBodyGuide>
            <p>• 지원동기, 직무역량, 직무관련 성과와 경험, 포부 등 자유롭게 작성해 주세요.</p>
          </ResumeDetailBodyGuide>
          <div>
            <ResumeTextarea
              id="perStatement"
              value={formData.perStatement || ""}
              placeholder=" 자기소개서를 입력해주세요."
              onChange={handlerChange}
            />
          </div>
        </ResumeDetailBody>

        <ResumeDetailBody>
          <ResumeDetailBodyHeader>첨부파일</ResumeDetailBodyHeader>
          <ResumeDetailBodyGuide>
            <p>• 포트폴리오, 경력기술서 등 첨부파일이 있다면 등록해주세요.</p>
          </ResumeDetailBodyGuide>
          <ResumeInput type="file" id="fileInput" style={{ display: "none" }} onChange={handlerFile} />
          {fileName ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                onClick={handlerFileDownload}
                style={{ cursor: "pointer", color: "blue", marginRight: "10px", flex: 0.2 }}
              >
                {fileName}
              </div>
              <ResumeButton
                onClick={() => handlerFileDelete(resumeDetail.resIdx)}
                style={{ flex: "0 0 auto", width: "50px" }}
              >
                삭제
              </ResumeButton>
            </div>
          ) : (
            <FileLabel className="img-label" htmlFor="fileInput">
              파일 첨부하기
            </FileLabel>
          )}
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
            <Button onClick={handlerSave}>저장하기</Button>
            <Button
              style={{
                backgroundColor: "gray",
              }}
              onClick={() => handlerModal(resumeDetail.resIdx)}
            >
              미리보기
            </Button>
          </InputBtnGroup>
        </div>
      </StyledTable>
      {modal && (
        <HistoryModal
          resIdx={resIdx}
          setIndex={()=>{}}
          index={0}
        />
      )}
    </>
  );
};
