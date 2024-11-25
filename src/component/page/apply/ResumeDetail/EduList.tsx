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

export const EduList = () => {
  const [showTable, setShowTable] = useState(false);
  const handlerShowTable = () => {
    setShowTable(true);
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
            <p style={{ marginTop: "20px", color: "gray" }}>학력사항을 추가해주세요</p>
          )}
          {showTable && (
            <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
              <li style={{ marginBottom: "24px" }}>
                <ResumeTable
                  style={{ width: "100%", border: "1px solid gray", borderCollapse: "collapse" }}
                >
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid gray" }}>
                        <select style={{ width: "90%", padding: "5px" }} id="eduLevel">
                          <option value="none" disabled selected>
                            학력구분
                          </option>
                          <option value="고등학교">고등학교</option>
                          <option value="대학교">대학교</option>
                          <option value="대학원(석사)">대학원(석사)</option>
                          <option value="대학원(박사)">대학원(박사)</option>
                        </select>
                      </td>
                      <td style={{ border: "1px solid gray" }}>
                        <ResumeInput
                          id="schoolName"
                          type="text"
                          style={{ padding: "5px", width: "90%", margin: "0px" }}
                          placeholder="학교명"
                          required
                        />
                      </td>
                      <td style={{ border: "1px solid gray" }}>
                        <ResumeInput
                          id="major"
                          type="text"
                          style={{ padding: "5px", width: "90%", margin: "0px" }}
                          placeholder="전공명"
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{ border: "1px solid gray", whiteSpace: "nowrap", fontSize: "13px" }}
                      >
                        입학일:
                        <ResumeInput
                          id="admDate"
                          type="month"
                          style={{ border: "1px solid gray", width: "70%", marginLeft: "8px" }}
                          required
                        />
                      </td>
                      <td
                        style={{ border: "1px solid gray", whiteSpace: "nowrap", fontSize: "13px" }}
                      >
                        졸업일:
                        <ResumeInput
                          id="grdDate"
                          type="month"
                          style={{ border: "1px solid gray", width: "70%", marginLeft: "8px" }}
                          required
                        />
                      </td>
                      <td style={{ border: "1px solid gray" }}>
                        <select style={{ width: "100%", padding: "5px" }} id="grdStatus">
                          <option value="none" disabled selected>
                            졸업여부
                          </option>
                          <option value="졸업">졸업</option>
                          <option value="재학">재학</option>
                          <option value="중퇴">중퇴</option>
                          <option value="휴학">휴학</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </ResumeTable>
                <div style={{ textAlign: "center" }}>
                  <InputBtnGroup style={{ marginTop: "15px", textAlign: "center", width: "100%" }}>
                    <Button
                      style={{
                        backgroundColor: "gray",
                      }}
                      onClick={handleCancle}
                    >
                      취소
                    </Button>
                    <Button>저장</Button>
                  </InputBtnGroup>
                </div>
              </li>
            </ul>
          )}
        </div>
      </StyledTable>
    </>
  );
};
