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
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { Skill, IPostResponse } from "../../../../models/interface/IResume";
import { ResumeContext } from "../../../../api/provider/ResumeProvider";
import { postResumeApi } from "../../../../api/postResumeApi";
import { Resume } from "../../../../api/api";
import React from "react";

interface SkillListDisplayProps {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  showTable: boolean;
  setShowTable: (value: boolean) => void;
}

export const SkillList = () => {
  const { resIdx } = useContext(ResumeContext);
  const [showTable, setShowTable] = useState(false);
  const [skills, setSkills] = useState([]);
  const handlerShowTable = () => {
    setShowTable(true);
  };

  const initialFormData: Skill = {
    resIdx,
    skillName: "",
    skillDetail: "",
  };

  const [formData, setFormData] = useState<Skill>(initialFormData);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value })); // 업데이트 해주깅
  };

  const handlerCancle = () => {
    setShowTable(false);
    setFormData(initialFormData);
  };

  const skillAdd = async () => {
    try {
      const param = {
        ...formData,
      };
      const response = await postResumeApi<IPostResponse>(Resume.skillInsert, param);

      if (response.data.result === "success") {
        setSkills((prev) => [...prev, { ...param, skillIdx: response.data.skillIdx }]);
        handlerCancle();
      }
    } catch (error) {
      console.error("스킬 저장 오류:", error);
    }
  };

  return (
    <>
      <ResumeButton type="button" onClick={handlerShowTable}>
        +추가
      </ResumeButton>
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
                      onChange={handlerChange}
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
                      }}
                      placeholder="스킬상세기재"
                      required
                      onChange={handlerChange}
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
                  onClick={handlerCancle}
                >
                  취소
                </Button>
                <Button onClick={skillAdd}>저장</Button>
              </InputBtnGroup>
            </div>
          </li>
        </ul>
      )}
      <SkillListDisplay
        skills={skills}
        setSkills={setSkills}
        showTable={showTable}
        setShowTable={setShowTable}
      />
    </>
  );
};

export const SkillListDisplay: FC<SkillListDisplayProps> = ({
  skills,
  setSkills,
  showTable,
  setShowTable,
}) => {
  const { resIdx } = useContext(ResumeContext);

  const fetchSkillList = useCallback(async (resIdx: number) => {
    try {
      const response = await postResumeApi<{ skill: Skill[] }>(Resume.getSkillBody, { resIdx });
      console.log("스킬 조회 성공");
      setSkills(response.data.skill || []);
      console.log("response.data.skill::::::", response.data.skill);
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchSkillList(resIdx);
  }, [resIdx, fetchSkillList]);

  const handlerDelete = useCallback(
    async (skillIdx?: number) => {
      const param = { resIdx, skillIdx };
      try {
        const response = await postResumeApi<{ result: string }>(Resume.skillDelete, param);
        if (response.data.result === "success") {
          alert("삭제되었습니다.");
          setSkills((prevSkills) => prevSkills.filter((skill) => skill.skillIdx !== skillIdx));
        }
      } catch (error) {
        console.error("스킬 삭제 중 오류:", error);
      }
    },
    [resIdx]
  );

  // 빈 상태일 때 렌더링
  if (!skills.length && !showTable) {
    return <p>보유스킬을 추가할 수 있습니다.</p>;
  }

  // 스킬 목록 렌더링
  if (skills.length && !showTable) {
    return (
      <ResumeTable style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ width: "25%" }}>스킬명</th>
            <th style={{ width: "65%" }}>스킬상세내용</th>
            <th style={{ width: "10%" }}>삭제</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill) => (
            <React.Fragment key={skill.skillIdx}>
              <tr>
                <td>{skill.skillName}</td>
                <td style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>{skill.skillDetail}</td>
                <td>
                  <ResumeButton onClick={() => handlerDelete(skill.skillIdx)}>삭제</ResumeButton>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </ResumeTable>
    );
  }

  return null; // 기본적으로 아무것도 표시하지 않음
};
