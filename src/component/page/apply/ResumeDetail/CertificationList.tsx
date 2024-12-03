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
import { Certification, IPostResponse } from "../../../../models/interface/IResume";
import { ResumeContext } from "../../../../api/provider/ResumeProvider";
import { postResumeApi } from "../../../../api/postResumeApi";
import { Resume } from "../../../../api/api";
import React from "react";
import { useLocation } from "react-router-dom";

interface CertListDisplayProps {
  certifications: Certification[];
  setCertifications: React.Dispatch<React.SetStateAction<Certification[]>>;
  showTable: boolean;
  setShowTable: (value: boolean) => void;
}

export const CertificationList = () => {
  const location = useLocation();
  const context = useContext(ResumeContext);
  const resIdx = location.state?.resIdx || context.resIdx || 0;
  const [certifications, setCertifications] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const handlerShowTable = () => {
    setShowTable(true);
  };

  const initialFormData: Certification = {
    resIdx: resIdx || 0,
    certName: "",
    grade: "",
    issuer: "",
    acqDate: "",
  };

  const [formData, setFormData] = useState<Certification>(initialFormData);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value })); // 업데이트 해주깅
  };

  const handlerCancle = () => {
    setShowTable(false);
    setFormData(initialFormData);
  };

  const certAdd = async () => {
    if (!formData.certName.trim()) {
      alert("자격증명을 입력해주세요.");
      return;
    }
    if (!formData.grade.trim()) {
      alert("등급을 입력해주세요.");
      return;
    }
    if (!formData.issuer.trim()) {
      alert("발행처를 입력해주세요.");
      return;
    }
    if (!formData.acqDate.trim()) {
      alert("취득일자를 입력해주세요.");
      return;
    }
    try {
      const param = {
        ...formData,
        resIdx,
        acqDate: `${formData.acqDate}-01`, // "YYYY-MM" -> "YYYY-MM-DD" (1일로 기본 설정)
      };
      const response = await postResumeApi<IPostResponse>(Resume.certInsert, param);

      if (response.data.result === "success") {
        setCertifications((prev) => [...prev, { ...param, certIdx: response.data.certIdx }]);
        handlerCancle();
      }
    } catch (error) {}
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
                  <td style={{ border: "1px solid gray", width: "25%" }}>
                    <ResumeInput
                      id="certName"
                      type="text"
                      style={{ padding: "5px", width: "80%", margin: "0px" }}
                      placeholder="자격증명"
                      required
                      onChange={handlerChange}
                    />
                  </td>
                  <td style={{ border: "1px solid gray", width: "25%" }}>
                    <ResumeInput
                      id="grade"
                      type="text"
                      style={{ padding: "5px", width: "80%", margin: "0px" }}
                      placeholder="등급"
                      required
                      onChange={handlerChange}
                    />
                  </td>
                  <td style={{ border: "1px solid gray", width: "25%" }}>
                    <ResumeInput
                      id="issuer"
                      type="text"
                      style={{ padding: "5px", width: "80%", margin: "0px" }}
                      placeholder="발행처"
                      required
                      onChange={handlerChange}
                    />
                  </td>
                  <td style={{ border: "1px solid gray", whiteSpace: "nowrap", fontSize: "13px" }}>
                    취득일자:
                    <ResumeInput
                      id="acqDate"
                      type="month"
                      style={{ padding: "5px", width: "60%", marginLeft: "8px" }}
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
                <Button onClick={certAdd}>저장</Button>
              </InputBtnGroup>
            </div>
          </li>
        </ul>
      )}
      <CertListDisplay
        certifications={certifications}
        setCertifications={setCertifications}
        showTable={showTable}
        setShowTable={setShowTable}
      />
    </>
  );
};

export const CertListDisplay: FC<CertListDisplayProps> = ({
  certifications,
  setCertifications,
  showTable,
  setShowTable,
}) => {
  const location = useLocation();
  const context = useContext(ResumeContext);

  const resIdx = location.state?.resIdx || context.resIdx || 0;

  const fetchCertificationList = useCallback(async (resIdx: number) => {
    try {
      const response = await postResumeApi<{ cert: Certification[] }>(Resume.getCertBody, {
        resIdx,
      });
      console.log("자격증 조회 성공");
      setCertifications(response.data.cert || []);
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchCertificationList(resIdx);
  }, [resIdx, fetchCertificationList]);

  const handlerDelete = useCallback(
    async (certIdx?: number) => {
      const param = { resIdx, certIdx };
      console.log(param);
      try {
        const response = await postResumeApi<IPostResponse>(Resume.certDelete, param);
        if (response.data.result === "success") {
          alert("삭제되었습니다.");
          setCertifications((prevCertifications) =>
            prevCertifications.filter((certification) => certification.certIdx !== certIdx)
          );
        }
      } catch (error) {
        console.error("자격증 삭제 중 오류:", error);
      }
    },
    [resIdx]
  );

  if (!certifications.length && !showTable) {
    return <p>취득한 자격증을 추가할 수 있습니다.</p>;
  }

  if (certifications.length && !showTable) {
    return (
      <ResumeTable style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ width: "30%" }}>자격증명</th>
            <th style={{ width: "20%" }}>등급</th>
            <th style={{ width: "20%" }}>발행처</th>
            <th style={{ width: "20%" }}>취득일자</th>
            <th style={{ width: "10%" }}>삭제</th>
          </tr>
        </thead>
        <tbody>
          {certifications.map((certification) => (
            <React.Fragment key={certification.certIdx}>
              <tr>
                <td>{certification.certName}</td>
                <td>{certification.grade}</td>
                <td>{certification.issuer}</td>
                <td>{certification.acqDate}</td>
                <td>
                  <ResumeButton onClick={() => handlerDelete(certification.certIdx)}>
                    삭제
                  </ResumeButton>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </ResumeTable>
    );
  }
};
