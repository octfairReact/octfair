import { useEffect, useState } from "react";
import { IHistoryModal, ISkillInfo, ICertInfo } from "../../../../models/interface/IHistory";
import { History } from "../../../../api/api";
import { postHistoryApi } from "../../../../api/postHistoryApi";
import { HistoryModalStyled } from "./styled";

export const HistoryModal = ({
  index,
  setModal,
  resumeInfo = { userNm: '', email: '', phone: '', perStatement: '', resTitle: '', shortIntro: ''},
  skillInfo = [],
  certInfo = [],
  resIdx,
}: IHistoryModal) => {
  const [historyData, setHistoryData] = useState<IHistoryModal | null>(null);
  const [isLoaded, setIsLoaded] = useState(false); // 로딩 상태 관리

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setIsLoaded(false); // 로딩 시작
        const response = await postHistoryApi<IHistoryModal>(History.getModal, {
          userIdx: index,
          resIdx: resIdx,
        });

        if (response?.data) {
          setHistoryData(response.data);
        }
      } catch (error) {
        console.error("기록 데이터를 가져오는 동안 오류가 발생했습니다:", error);
      } finally {
        setIsLoaded(true); // 로딩 완료
      }
    };

    if (index !== null) {
      fetchHistoryData();
    }

    const handlerEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handlerClose();
      }
    };

    window.addEventListener("keydown", handlerEsc);

    return () => {
      window.removeEventListener("keydown", handlerEsc);
    };
  }, [index, resIdx]);

  const handlerClose = () => {
    setModal(false);
  };

  const handlerPrint = () => {
    window.print();
  };

  const getResumeInfo = historyData?.resumeInfo || resumeInfo;
  const getSkillInfo = historyData?.skillInfo?.length > 0 ? historyData.skillInfo : skillInfo;
  const getCertInfo = historyData?.certInfo?.length > 0 ? historyData.certInfo : certInfo;

  if (!isLoaded) {
    return (
      <HistoryModalStyled>
        <div className="loading-container">
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      </HistoryModalStyled>
    );
  }

  return (
    <HistoryModalStyled>
      <div>
        <h3>이력서 상세 정보</h3>
        <h2>{getResumeInfo.resTitle ? getResumeInfo.resTitle : "정보 없음"}</h2>

        <table>
          <tbody>
            <tr>
              <p className="no-align">
                {getResumeInfo.shortIntro ? getResumeInfo.shortIntro : "정보 없음"}
              </p>
            </tr>
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th colSpan={2}>개인 정보</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>이름 : {getResumeInfo.userNm ? getResumeInfo.userNm : "정보 없음"}</td>
            </tr>
            <tr>
              <td>이메일 : {getResumeInfo.email ? getResumeInfo.email : "정보 없음"}</td>
            </tr>
            <tr>
              <td>연락처 : {getResumeInfo.phone ? getResumeInfo.phone : "정보 없음"}</td>
            </tr>
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th colSpan={2}>스킬</th>
            </tr>
          </thead>
          <tbody>
            {getSkillInfo.length > 0 ? (
              getSkillInfo.map((skill: ISkillInfo, idx) => (
                <tr key={idx}>
                  <td>{skill.skillName}</td>
                  <td>{skill.skillDetail}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>스킬 정보가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        <table className="cert-table">
          <thead>
            <tr>
              <th colSpan={4}>자격증 및 외국어</th>
            </tr>
          </thead>
          <tbody>
            {getCertInfo.length > 0 ? (
              getCertInfo.map((cert: ICertInfo, idx) => (
                <tr key={idx}>
                  <td>{cert.certName}</td>
                  <td>{cert.grade}</td>
                  <td>{cert.issuer}</td>
                  <td>{cert.acqDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>자격증 및 외국어 정보가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th>자기소개서</th>
            </tr>
          </thead>
          <tbody>
            {getResumeInfo.perStatement ? (
              <tr>
                <td>{getResumeInfo.perStatement}</td>
              </tr>
            ) : (
              <tr>
                <td>자기소개서 정보가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="button-container">
          <button className="close-button" onClick={handlerClose}>닫기</button>
          <button className="print-button" onClick={handlerPrint}>인쇄</button>
        </div>
      </div>
    </HistoryModalStyled>
  );
};
