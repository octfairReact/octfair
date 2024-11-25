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

export const SkillList = () => {
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
          {!showTable && <p style={{ marginTop: "20px", color: "gray" }}>스킬을 추가해주세요</p>}
          {showTable && (
            <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
              <li style={{ marginBottom: "24px" }}>
                <ResumeTable
                  style={{ width: "100%", border: "1px solid gray", borderCollapse: "collapse" }}
                >
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid gray", width: "30%" }}>
                        <ResumeInput
                          id="skillName"
                          type="text"
                          style={{ padding: "5px", width: "80%", margin: "0px", fontSize: "15px" }}
                          placeholder="스킬명"
                          required
                        />
                      </td>
                      <td style={{ border: "1px solid gray" }}>
                        <ResumeTextarea
                          id="skillDetail"
                          style={{
                            height: "auto",
                            width: "100%",
                            padding: "5px",
                            fontSize: "15px",
                            fontSize: "15px",
                          }}
                          placeholder="스킬상세기재"
                          required
                        />
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
