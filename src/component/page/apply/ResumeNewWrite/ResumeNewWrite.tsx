import { StyledTable } from "../../../common/styled/StyledTable";

export const ResumeNewWrite = () => {
  return (
    <>
      <StyledTable>
        <div>
          <div>
            <div>
              <input
                style={{ border: "none", fontSize: "30px", marginBottom: "20px", padding: "5px" }}
                id="resumetitle"
                type="text"
                value=""
                data-num=""
                placeholder="이력서 제목"
              />
            </div>
            <div>
              <input
                style={{ border: "none", padding: "5px" }}
                id="userName"
                type="text"
                value=""
                placeholder="이름"
                readOnly
              />
            </div>
            <div>
              <input
                style={{ border: "none", padding: "5px" }}
                id="userEmail"
                type="text"
                value=""
                placeholder="이메일"
                readOnly
              />
            </div>
            <div>
              <input
                style={{ border: "none", padding: "5px" }}
                id="userPhone"
                type="text"
                value=""
                placeholder="연락처"
                readOnly
              />
            </div>
          </div>
          <div>
            <div>간단소개글</div>
            <div>
              <p>
                • 본인의 업무 경험을 기반으로 핵심역량과 업무 스킬을 간단히 작성해주세요.
                <br />• 3~5줄로 요약하여 작성하는 것을 추천합니다!
              </p>
            </div>
            <div>
              <textarea
                style={{ border: "none", padding: "5px", height: "auto" }}
                id="short_intro"
                value=""
                placeholder="소개글을 입력해주세요"
              />
            </div>
          </div>
          <div>
            <div>경력</div>
            <div>
              <p>
                • 담당하신 업무 중 우선순위가 높은 업무를 선별하여 최신순으로 작성해주세요. <br />•
                신입의 경우, 직무와 관련된 대외활동, 인턴, 계약직 경력 등이 있다면 작성해주세요.{" "}
                <br />
                • 업무 또는 활동 시 담당했던 역할과 과정, 성과에 대해 자세히 작성해주세요.
                <br />• 현재 재직중이면 퇴사일을 해당월로 입력해주세요.
              </p>
            </div>
            <div>
              <button type="button" className="showTableBtn" id="career">
                +추가
              </button>
              <ul>
                <li id="careerInputTable" style={{ display: "none" }}>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            style={{ width: "80%", padding: "5px", margin: "0px" }}
                            id="userPhone"
                            type="text"
                            value=""
                            placeholder="회사명"
                            required
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </StyledTable>
    </>
  );
};
