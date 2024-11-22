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
import { useContext, useState } from "react";

export const CareerList = () => {
  const [showTable, setShowTable] = useState(false);
  const handlerShowTable = () => {
    setShowTable(true);
  };
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

  const handleCancle = () => {
    setShowTable(false);
  };

  return (
    <>
      <StyledTable>
        <div>
          <ResumeButton type="button" onClick={handlerShowTable}>
            +추가
          </ResumeButton>
          {!showTable && (
            <p style={{ marginTop: "20px", color: "gray" }}>경력사항을 추가해주세요</p>
          )}
          {showTable && (
            <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
              {careers.map((career, index) => (
                <li key={index} style={{ marginBottom: "24px" }}>
                  <ResumeTable
                    style={{ width: "100%", border: "1px solid gray", borderCollapse: "collapse" }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ border: "1px solid gray" }}>
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
                        <td
                          style={{
                            border: "1px solid gray",
                            whiteSpace: "nowrap",
                            fontSize: "13px",
                          }}
                        >
                          입사일:
                          <ResumeInput
                            style={{ border: "1px solid gray", width: "60%", marginLeft: "8px" }}
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
                        <td
                          style={{
                            border: "1px solid gray",
                            whiteSpace: "nowrap",
                            fontSize: "13px",
                          }}
                        >
                          퇴사일:
                          <ResumeInput
                            style={{ border: "1px solid gray", width: "60%", marginLeft: "8px" }}
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
                        <td style={{ border: "1px solid gray" }}>
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
                        <td style={{ border: "1px solid gray" }}>
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
                        <td style={{ border: "1px solid gray" }}>
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
                        <td colSpan={3} style={{ border: "1px solid gray" }}>
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
                  <div style={{ textAlign: "center" }}>
                    <InputBtnGroup
                      style={{ marginTop: "15px", textAlign: "center", width: "100%" }}
                    >
                      <Button
                        style={{
                          backgroundColor: "gray",
                        }}
                        onClick={handleCancle}
                      >
                        취소
                      </Button>
                      <Button onClick={handleCareerAdd}>저장</Button>
                    </InputBtnGroup>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </StyledTable>
    </>
  );
};
