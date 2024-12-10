import { ResumeInput, ResumeTextarea, ResumeButton, ResumeTable } from "../styled";
import { Button } from "../../../common/Button/Button";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { postResumeApi } from "../../../../api/postResumeApi";
import { IPostResponse } from "../../../../models/interface/IResume";
import { Resume } from "../../../../api/api";
import { Career } from "../../../../models/interface/IResume";
import { ResumeContext } from "../../../../api/provider/ResumeProvider";
import React from "react";
import { useLocation } from "react-router-dom";

interface CareerListDisplayProps {
  careers: Career[];
  setCareers: React.Dispatch<React.SetStateAction<Career[]>>;
  showTable: boolean;
  setShowTable: (value: boolean) => void;
}

export const CareerList = () => {
  const location = useLocation();
  const context = useContext(ResumeContext);
  const resIdx = location.state?.resIdx || context.resIdx || 0;
  const [careers, setCareers] = useState([]);
  const [showTable, setShowTable] = useState<boolean>(false);
  const handlerShowTable = () => {
    setShowTable(true);
  };

  const initialFormData: Career = {
    resIdx: resIdx || 0,
    company: "",
    startDate: "",
    endDate: "",
    dept: "",
    position: "",
    reason: "",
    crrDesc: "",
  };

  const [formData, setFormData] = useState<Career>(initialFormData);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value })); // 업데이트 해주깅
  };

  const handlerCancle = () => {
    setShowTable(false);
    setFormData(initialFormData);
  };

  const careerAdd = async () => {
    // 유효성 검사
    if (!formData.company.trim()) {
      alert("회사명을 입력해주세요.");
      return;
    }
    if (!formData.startDate.trim()) {
      alert("입사일을 입력해주세요.");
      return;
    }
    if (!formData.endDate.trim()) {
      alert("퇴사일을 입력해주세요.");
      return;
    }
    if (!formData.dept.trim()) {
      alert("근무부서를 입력해주세요.");
      return;
    }
    if (!formData.position.trim()) {
      alert("직책/직급을 입력해주세요.");
      return;
    }
    if (!formData.reason.trim()) {
      alert("퇴사사유를 입력해주세요.");
      return;
    }
    if (!formData.crrDesc.trim()) {
      alert("담당업무를 입력해주세요.");
      return;
    }

    // 입학일과 졸업일 비교
    const startDate = new Date(formData.startDate + "-01");
    const endDate = new Date(formData.endDate + "-01");
    if (startDate > endDate) {
      alert("입사일은 퇴사일보다 미래일 수 없습니다. 다시 선택해주세요.");
      return;
    }

    try {
      const param = {
        ...formData,
        resIdx,
        startDate: `${formData.startDate}-01`, // "YYYY-MM" -> "YYYY-MM-DD" (1일로 기본 설정)
        endDate: `${formData.endDate}-01`,
      };
      const response = await postResumeApi<IPostResponse>(Resume.careerInsert, param);

      if (response.data.result === "success") {
        setCareers((prev) => [...prev, { ...param, crrIdx: response.data.crrIdx }]);
        handlerCancle();
      }
    } catch (error) {
      console.error("경력 저장 오류:", error);
    }
  };

  return (
    <>
      <ResumeButton type="button" onClick={handlerShowTable}>
        +추가
      </ResumeButton>
      {showTable && (
        <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
          <li key={resIdx} style={{ marginBottom: "24px" }}>
            <ResumeTable
              style={{
                width: "100%",
                border: "1px solid gray",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <tr>
                  <td style={{ border: "1px solid gray" }}>
                    <ResumeInput
                      id="company"
                      type="text"
                      value={formData.company}
                      placeholder="회사명"
                      required
                      onChange={handlerChange}
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
                      value={formData.startDate}
                      required
                      onChange={handlerChange}
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
                      value={formData.endDate}
                      required
                      onChange={handlerChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid gray" }}>
                    <ResumeInput
                      id="dept"
                      type="text"
                      value={formData.dept}
                      placeholder="근무부서"
                      required
                      onChange={handlerChange}
                    />
                  </td>
                  <td style={{ border: "1px solid gray" }}>
                    <ResumeInput
                      id="position"
                      type="text"
                      value={formData.position}
                      placeholder="직책/직급"
                      required
                      onChange={handlerChange}
                    />
                  </td>
                  <td style={{ border: "1px solid gray" }}>
                    <ResumeInput
                      id="reason"
                      type="text"
                      value={formData.reason}
                      placeholder="퇴사사유"
                      required
                      onChange={handlerChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ border: "1px solid gray" }}>
                    <ResumeTextarea
                      id="crrDesc"
                      value={formData.crrDesc}
                      required
                      placeholder="담당업무를 입력해주세요."
                      onChange={handlerChange}
                    />
                  </td>
                </tr>
              </tbody>
            </ResumeTable>
            <table style={{ textAlign: "center", border: "none", width: "100%" }}>
              <tbody>
                <tr>
                  <td style={{ marginTop: "15px", textAlign: "center", width: "100%" }}>
                    <Button
                      style={{
                        backgroundColor: "gray",
                        width: "200px",
                      }}
                      onClick={handlerCancle}
                    >
                      취소
                    </Button>
                    <Button style={{ width: "200px" }} onClick={careerAdd}>
                      저장
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </li>
        </ul>
      )}
      <CareerListDisplay careers={careers} setCareers={setCareers} showTable={showTable} setShowTable={setShowTable} />
    </>
  );
};

export const CareerListDisplay: FC<CareerListDisplayProps> = ({ careers, setCareers, showTable, setShowTable }) => {
  const location = useLocation();
  const context = useContext(ResumeContext);

  const resIdx = location.state?.resIdx || context.resIdx || 0;

  const fetchCareerList = useCallback(async (resIdx: number) => {
    try {
      const response = await postResumeApi<{ career: Career[] }>(Resume.getCareerBody, { resIdx });
      console.log("경력 조회 성공");
      setCareers(response.data.career || []);
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchCareerList(resIdx);
  }, [resIdx, fetchCareerList]);

  const handlerDelete = useCallback(
    async (crrIdx?: number) => {
      const param = { resIdx, crrIdx };
      const careerDelete = await postResumeApi<IPostResponse>(Resume.careerDelete, param);

      if (careerDelete && careerDelete.data.result === "success") {
        alert("삭제되었습니다.");
        setCareers((prevCareers) => prevCareers.filter((career) => career.crrIdx !== crrIdx));
      } else {
        console.error("삭제 실패:", careerDelete?.data);
      }
    },
    [resIdx]
  );

  if (!careers.length && !showTable) {
    return <p>경력사항을 추가할 수 있습니다.</p>;
  }

  if (careers.length && !showTable) {
    return (
      <ResumeTable style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ width: "30%" }}>기간</th>
            <th>회사명</th>
            <th>부서명</th>
            <th>직급/직책</th>
            <th>퇴사사유</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {careers.map((career) => (
            <React.Fragment key={career.crrIdx}>
              <tr>
                <td rowSpan={2}>
                  {career.startDate} ~ {career.endDate}
                </td>
                <td>{career.company}</td>
                <td>{career.dept}</td>
                <td>{career.position}</td>
                <td>{career.reason}</td>
                <td rowSpan={2}>
                  <ResumeButton onClick={() => handlerDelete?.(career.crrIdx)}>삭제</ResumeButton>
                </td>
              </tr>
              <tr>
                <td colSpan={4} style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                  {career.crrDesc}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </ResumeTable>
    );
  }
};
