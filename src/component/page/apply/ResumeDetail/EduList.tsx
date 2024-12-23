import { ResumeInput, ResumeButton, ResumeTable, InputBtnGroup } from "../styled";
import { Button } from "../../../common/Button/Button";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { Education, IPostResponse } from "../../../../models/interface/IResume";
import { ResumeContext } from "../../../../api/provider/ResumeProvider";
import { postResumeApi } from "../../../../api/postResumeApi";
import { Resume } from "../../../../api/api";
import React from "react";
import { useLocation } from "react-router-dom";

interface EduListDisplayProps {
  educations: Education[];
  setEducations: React.Dispatch<React.SetStateAction<Education[]>>;
  showTable: boolean;
  setShowTable: (value: boolean) => void;
}

export const EduList = () => {
  const location = useLocation();
  const context = useContext(ResumeContext);
  const resIdx = location.state?.resIdx || context.resIdx || 0;
  const [showTable, setShowTable] = useState(false);
  const [educations, setEducations] = useState<Education[]>([]);
  const handlerShowTable = () => {
    setShowTable(true);
  };

  const initialFormData: Education = {
    resIdx: resIdx || 0,
    eduLevel: "",
    schoolName: "",
    major: "",
    admDate: "",
    grdDate: "",
    grdStatus: "",
  };

  const [formData, setFormData] = useState<Education>(initialFormData);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value })); // 업데이트 해주깅

    // 학력 구분이 고등학교일 경우 전공을 초기화
    if (id === "eduLevel" && value === "고등학교") {
      setFormData((prev) => ({ ...prev, major: "" }));
    }
  };

  const handlerCancle = () => {
    setShowTable(false);
    setFormData(initialFormData);
  };

  const eduAdd = async () => {
    if (!formData.eduLevel.trim()) {
      alert("학력구분을 선택해주세요.");
      return;
    }
    if (!formData.schoolName.trim()) {
      alert("학교명을 입력해주세요.");
      return;
    }
    if (formData.eduLevel !== "고등학교" && !formData.major.trim()) {
      alert("전공명을 입력해주세요.");
      return;
    }
    if (!formData.admDate.trim()) {
      alert("입학일을 입력해주세요.");
      return;
    }
    if (!formData.grdDate.trim()) {
      alert("졸업일을 입력해주세요.");
      return;
    }
    if (!formData.grdStatus.trim()) {
      alert("졸업여부를 선택해주세요.");
      return;
    }

    // 입학일과 졸업일 비교
    const admDate = new Date(formData.admDate + "-01");
    const grdDate = new Date(formData.grdDate + "-01");
    if (admDate > grdDate) {
      alert("입학일은 졸업일보다 미래일 수 없습니다. 다시 선택해주세요.");
      return;
    }

    try {
      const param = {
        ...formData,
        resIdx,
        admDate: `${formData.admDate}-01`, // YYYY-MM -> YYYY-MM-DD (1일로 기본 설정 why? DB랑 맞추느라;;)
        grdDate: `${formData.grdDate}-01`,
      };
      const response = await postResumeApi<IPostResponse>(Resume.eduInsert, param);

      if (response.data.result === "success") {
        setEducations((prev) => [...prev, { ...param, eduIdx: response.data.eduIdx }]);
        handlerCancle();
      }
    } catch (error) {
      console.error("학력 저장 오류:", error);
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
            <ResumeTable style={{ width: "100%", border: "1px solid gray", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ border: "1px solid gray" }}>
                    <select style={{ width: "90%", padding: "5px" }} id="eduLevel" onChange={handlerChange}>
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
                      onChange={handlerChange}
                    />
                  </td>
                  <td style={{ border: "1px solid gray" }}>
                    <ResumeInput
                      id="major"
                      type="text"
                      style={{ padding: "5px", width: "90%", margin: "0px" }}
                      placeholder="전공명"
                      required
                      onChange={handlerChange}
                      value={formData.major} // 상태 관리
                      disabled={formData.eduLevel === "고등학교"} // 고등학교일 경우 비활성화
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid gray", whiteSpace: "nowrap", fontSize: "13px" }}>
                    입학일:
                    <ResumeInput
                      id="admDate"
                      type="month"
                      style={{ border: "1px solid gray", width: "70%", marginLeft: "8px" }}
                      required
                      onChange={handlerChange}
                    />
                  </td>
                  <td style={{ border: "1px solid gray", whiteSpace: "nowrap", fontSize: "13px" }}>
                    졸업일:
                    <ResumeInput
                      id="grdDate"
                      type="month"
                      style={{ border: "1px solid gray", width: "70%", marginLeft: "8px" }}
                      required
                      onChange={handlerChange}
                    />
                  </td>
                  <td style={{ border: "1px solid gray" }}>
                    <select style={{ width: "100%", padding: "5px" }} id="grdStatus" onChange={handlerChange}>
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
                  onClick={handlerCancle}
                >
                  취소
                </Button>
                <Button onClick={eduAdd}>저장</Button>
              </InputBtnGroup>
            </div>
          </li>
        </ul>
      )}
      <EduListDisplay
        educations={educations}
        setEducations={setEducations}
        showTable={showTable}
        setShowTable={setShowTable}
      />
    </>
  );
};

export const EduListDisplay: FC<EduListDisplayProps> = ({ educations, setEducations, showTable, setShowTable }) => {
  const location = useLocation();
  const context = useContext(ResumeContext);

  const resIdx = location.state?.resIdx || context.resIdx || 0;

  const fetchEduList = useCallback(async (resIdx: number) => {
    try {
      const response = await postResumeApi<{ edu: Education[] }>(Resume.getEduBody, { resIdx });
      console.log("학력 조회 성공");
      setEducations(response.data.edu || []);
    } catch (error) {
      console.error("학력 데이터 불러오기 실패:", error);
    }
  }, []);

  useEffect(() => {
    fetchEduList(resIdx);
  }, [resIdx, fetchEduList]);

  // Delete education
  const handlerDelete = useCallback(
    async (eduIdx?: number) => {
      const param = { resIdx, eduIdx };
      try {
        const response = await postResumeApi<IPostResponse>(Resume.eduDelete, param);

        if (response.data.result === "success") {
          alert("삭제되었습니다.");
          setEducations((prevEducations) => prevEducations.filter((education) => education.eduIdx !== eduIdx));
        }
      } catch (error) {
        console.error("삭제 중 오류:", error);
      }
    },
    [resIdx]
  );

  // Render empty state
  if (!educations.length && !showTable) {
    return <p>학력사항을 추가할 수 있습니다.</p>;
  }

  // Render education list
  if (educations.length && !showTable) {
    return (
      <ResumeTable style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ width: "15%" }}>기간</th>
            <th style={{ width: "15%" }}>학력</th>
            <th style={{ width: "20%" }}>학교명</th>
            <th style={{ width: "20%" }}>전공</th>
            <th style={{ width: "10%" }}>졸업</th>
            <th style={{ width: "10%" }}>삭제</th>
          </tr>
        </thead>
        <tbody>
          {educations.map((education) => (
            <React.Fragment key={education.eduIdx}>
              <tr>
                <td>
                  {education.admDate} ~ {education.grdDate}
                </td>
                <td>{education.eduLevel}</td>
                <td>{education.schoolName}</td>
                <td>{education.eduLevel === "고등학교" ? "" : education.major}</td>
                <td>{education.grdStatus}</td>
                <td>
                  <ResumeButton onClick={() => handlerDelete(education.eduIdx)}>삭제</ResumeButton>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </ResumeTable>
    );
  }
};
