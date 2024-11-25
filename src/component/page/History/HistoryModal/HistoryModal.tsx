import { useEffect, useState } from "react";
import { HistoryModalStyled } from "./styled";
import { IHistoryModal, IHistoryResponse } from "../../../../models/interface/IHistory";
import { History } from "../../../../api/api";
import { postHistoryApi } from "../../../../api/postHistoryApi";

export const HistoryModal = ({
    index,
    setModal,
    resumeInfo = { name: '', email: '', phone: '' },
    careerInfo = [],
    eduInfo = [],
    skillInfo = [],
    certInfo = []
  }: IHistoryModal) => {

  const [historyData, setHistoryData] = useState<IHistoryResponse | null>(null);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await postHistoryApi<IHistoryResponse>(History.getModal, { userIdx: index });
        setHistoryData(response.data);
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };

    if (index !== null) {
      fetchHistoryData();
    }
  }, [index]);

  // ESC 키로 닫기
  const handlerEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handlerClose();
    }
  };

  // 닫기 함수
  const handlerClose = () => {
    setModal(false);
  };

  // 인쇄 기능
  const handlerPrint = () => {
    window.print();
  };

  return (
    <HistoryModalStyled>
      <div>
        <h3>{resumeInfo?.name}</h3>

        {/* 개인 정보 테이블 */}
        <table>
          <thead>
            <tr>
              <th colSpan={2}>개인 정보</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>이름</td>
              <td>{resumeInfo.name}</td>
            </tr>
            <tr>
              <td>이메일</td>
              <td>{resumeInfo.email}</td>
            </tr>
            <tr>
              <td>연락처</td>
              <td>{resumeInfo.phone}</td>
            </tr>
          </tbody>
        </table>

        {/* 경력 사항 테이블 */}
        <table>
          <thead>
            <tr>
              <th colSpan={2}>경력 사항</th>
            </tr>
          </thead>
          <tbody>
            {careerInfo?.map((career, idx) => (
              <tr key={idx}>
                <td>{career.company}</td>
                <td>{career.position}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 학력 사항 테이블 */}
        <table>
          <thead>
            <tr>
              <th colSpan={2}>학력 사항</th>
            </tr>
          </thead>
          <tbody>
            {eduInfo?.map((edu, idx) => (
              <tr key={idx}>
                <td>{edu.schoolName}</td>
                <td>{edu.major}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 스킬 테이블 */}
        <table>
          <thead>
            <tr>
              <th colSpan={2}>스킬</th>
            </tr>
          </thead>
          <tbody>
            {skillInfo?.map((skill, idx) => (
              <tr key={idx}>
                <td>{skill.skillName}</td>
                <td>{skill.skillDetail}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 자격증 및 외국어 테이블 */}
        <table>
          <thead>
            <tr>
              <th colSpan={3}>자격증 및 외국어</th>
            </tr>
          </thead>
          <tbody>
            {certInfo?.map((cert, idx) => (
              <tr key={idx}>
                <td>{cert.certName}</td>
                <td>{cert.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 자기소개서 테이블 */}
        <table>
          <thead>
            <tr>
              <th>자기소개서</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>누구보다 NPC의 진심입니다</td>
            </tr>
          </tbody>
        </table>

        {/* 버튼들 */}
        <div className="button-container">
          <button className="close-button" onClick={handlerClose}>닫기</button>
          <button className="print-button" onClick={handlerPrint}>인쇄</button>
        </div>
      </div>
    </HistoryModalStyled>
  );
};
