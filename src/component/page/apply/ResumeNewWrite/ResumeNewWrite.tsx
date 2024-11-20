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
} from "../styled";
import { Button } from "../../../common/Button/Button";
import { useState } from "react";
import { loginInfoState } from "../../../../stores/userInfo";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";

export const ResumeNewWrite = () => {
  const [userInfo, setUserInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [resTitle, setResTitle] = useState("");
  const [shortIntro, setShortIntro] = useState("");
  const [careers, setCareers] = useState([
    { company: "", startDate: "", endDate: "", dept: "", position: "", reason: "", desc: "" },
  ]);

  // 경력 추가 함수
  const handleCareerAdd = () => {
    setCareers([
      ...careers,
      { company: "", startDate: "", endDate: "", dept: "", position: "", reason: "", desc: "" },
    ]);
  };

  //취소함수
  const handleCancle = () => {};

  // 저장 함수
  const handleSave = () => {
    console.log("이력서 제목:", resTitle);
    console.log("간단소개글:", shortIntro);
    console.log("경력:", careers);
  };
  return (
    <>
      <StyledTable>
        <ResumeDetailBodyBasicInfo>
          <div>
            <input
              style={{ fontSize: "30px", marginBottom: "20px", padding: "5px", width: "700px" }}
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
              placeholder="소개글을 입력해주세요."
              onChange={(e) => setShortIntro(e.target.value)}
            />
          </div>
        </ResumeDetailBody>

        <ResumeDetailBody>
          <ResumeDetailBodyHeader>경력</ResumeDetailBodyHeader>
          <ResumeDetailBodyGuide>
            <p>
              • 담당하신 업무 중 우선순위가 높은 업무를 선별하여 최신순으로 작성해주세요. <br />•
              신입의 경우, 직무와 관련된 대외활동, 인턴, 계약직 경력 등이 있다면 작성해주세요.
              <br />• 업무 또는 활동 시 담당했던 역할과 과정, 성과에 대해 자세히 작성해주세요.
              <br />• 현재 재직중이면 퇴사일을 해당월로 입력해주세요.
            </p>
          </ResumeDetailBodyGuide>
          <div>
            <ResumeButton type="button" onClick={handleCareerAdd}>
              +추가
            </ResumeButton>
            <ul>
              {careers.map((career, index) => (
                <li key={index}>
                  <ResumeTable>
                    <tbody>
                      <tr>
                        <td>
                          <ResumeInput
                            id="company"
                            type="text"
                            value={career.company}
                            placeholder="회사명"
                            required
                            onChange={(e) => {
                              const newCareers = [...careers];
                              newCareers[index].company = e.target.value;
                              setCareers(newCareers);
                            }}
                          />
                        </td>
                        <td>
                          입사일:
                          <ResumeInput
                            id="startDate"
                            type="month"
                            value={career.startDate}
                            required
                            onChange={(e) => {
                              const newCareers = [...careers];
                              newCareers[index].startDate = e.target.value;
                              setCareers(newCareers);
                            }}
                          />
                        </td>
                        <td>
                          퇴사일:
                          <ResumeInput
                            id="endDate"
                            type="month"
                            value={career.endDate}
                            required
                            onChange={(e) => {
                              const newCareers = [...careers];
                              newCareers[index].endDate = e.target.value;
                              setCareers(newCareers);
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <ResumeInput
                            id="dept"
                            type="text"
                            value={career.dept}
                            placeholder="근무부서"
                            required
                            onChange={(e) => {
                              const newCareers = [...careers];
                              newCareers[index].dept = e.target.value;
                              setCareers(newCareers);
                            }}
                          />
                        </td>
                        <td>
                          <ResumeInput
                            id="position"
                            type="text"
                            value={career.position}
                            placeholder="직책/직급"
                            required
                            onChange={(e) => {
                              const newCareers = [...careers];
                              newCareers[index].position = e.target.value;
                              setCareers(newCareers);
                            }}
                          />
                        </td>
                        <td>
                          <ResumeInput
                            id="reason"
                            type="text"
                            value={career.reason}
                            placeholder="퇴사사유"
                            required
                            onChange={(e) => {
                              const newCareers = [...careers];
                              newCareers[index].reason = e.target.value;
                              setCareers(newCareers);
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3}>
                          <ResumeTextarea
                            id="crrDesc"
                            value={career.desc}
                            required
                            placeholder="담당업무를 입력해주세요."
                            onChange={(e) => {
                              const newCareers = [...careers];
                              newCareers[index].desc = e.target.value;
                              setCareers(newCareers);
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </ResumeTable>
                  <InputBtnGroup>
                    <Button
                      style={{
                        backgroundColor: "gray",
                      }}
                      onClick={handleCancle}
                    >
                      취소
                    </Button>
                    <Button onClick={handleSave}>저장</Button>
                  </InputBtnGroup>
                </li>
              ))}
            </ul>
          </div>
        </ResumeDetailBody>
      </StyledTable>
    </>
  );
};
