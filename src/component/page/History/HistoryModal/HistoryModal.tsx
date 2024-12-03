import { useEffect, useState } from "react";
import { IHistoryModal, ICertInfo } from "../../../../models/interface/IHistory";
import { History } from "../../../../api/api";
import { postHistoryApi } from "../../../../api/postHistoryApi";
import { HistoryModalStyled } from "./styled";
import { useEscapeClose } from "../../../common/CustomHook/CustomHook";

// HistoryModal 컴포넌트
export const HistoryModal = ({
  index, // 해당 이력서의 고유 인덱스
  setModal, // 모달 상태를 변경하는 함수 (모달 닫기)
  resumeInfo = { userNm: '', email: '', phone: '', perStatement: '', resTitle: '', shortIntro: ''}, // 기본 이력서 정보
  careerInfo = [], // 경력 정보
  eduInfo = [], // 학력 정보
  skillInfo = [], // 기본 스킬 정보
  certInfo = [], // 기본 자격증 정보
  resIdx, // 이력서 고유 ID
}: IHistoryModal) => {
  const [historyData, setHistoryData] = useState<IHistoryModal | null>(null);     // 이력서 모달 데이터를 저장하는 상태
  const [isLoaded, setIsLoaded] = useState(false);                              // 데이터 로딩 상태 (로딩 중인지 확인)

  useEscapeClose(() => setModal(false), true);  // ESC 키를 눌러 모달을 닫을 수 있는 커스텀 훅
  // useEffect 훅으로 컴포넌트가 마운트될 때 데이터 요청
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setIsLoaded(false); // 데이터 로딩 시작
        // 이력서 데이터를 API로부터 가져오기
        const response = await postHistoryApi<IHistoryModal>(History.getModal, {
          userIdx: index,  // 요청할 유저의 인덱스
          resIdx: resIdx,  // 요청할 이력서의 고유 ID
        });

        // 데이터가 있으면 상태 업데이트
        if (response?.data) {
          setHistoryData(response.data);
        }
      } catch (error) {
        // 오류가 발생하면 콘솔에 출력
        console.error("기록 데이터를 가져오는 동안 오류가 발생했습니다:", error);
      } finally {
        setIsLoaded(true); // 로딩이 끝났으므로 로딩 상태를 false로 변경
      }
    };

    // index 값이 유효하면 fetchHistoryData 함수 실행
    if (index !== null) {
      fetchHistoryData();
    }
  }, [index, resIdx]); // index나 resIdx가 변경되면 다시 호출

  // 모달을 닫는 함수
  const handlerClose = () => {
    setModal(false);
  };

  // 이력서 정보를 인쇄하는 함수
  const handlerPrint = () => {
    window.print();
  };

  // API로 받아온 이력서 정보가 있을 경우 그 정보를, 없으면 기본 정보를 사용
  const getResumeInfo = historyData?.resumeInfo || resumeInfo;
  const getCareerInfo = historyData?.careerInfo?.length > 0 ? historyData.careerInfo : careerInfo;
  const getEducationInfo = historyData?.eduInfo?.length > 0 ? historyData.eduInfo : eduInfo;
  const getSkillInfo = historyData?.skillInfo?.length > 0 ? historyData.skillInfo : skillInfo;
  const getCertInfo = historyData?.certInfo?.length > 0 ? historyData.certInfo : certInfo;
  
  // 데이터가 로딩 중일 경우 로딩 화면을 표시
  if (!isLoaded) {
    return (
      <HistoryModalStyled>
        <div className="loading-container">
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      </HistoryModalStyled>
    );
  }

  // 로딩이 끝난 후, 모달에서 이력서의 상세 정보를 표시
  return (
    <HistoryModalStyled>
      <div>
        <h3>이력서 상세 정보</h3>
        {/* 이력서 제목이 있으면 표시, 없으면 "정보 없음" 표시 */}
        <h2>{getResumeInfo.resTitle ? getResumeInfo.resTitle : "정보 없음"}</h2>

        {/* 이력서 소개 내용 (shortIntro) */}
        <table>
          <tbody>
            <tr>
              <p className="no-align">
                {getResumeInfo.shortIntro ? getResumeInfo.shortIntro : "정보 없음"}
              </p>
            </tr>
          </tbody>
        </table>

        {/* 경력 정보 */}
        <table className="cert-table">
          <thead>
            <tr>
              <th colSpan={2}>경력</th>
            </tr>
          </thead>
          <tbody>
            {getCareerInfo.length > 0 ? (
              getCareerInfo.map((career, idx) => (
                <tr key={idx}>
                  <td>{career.company}</td>
                  <td>{career.position}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>경력 정보가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 학력 정보 */}
        <table className="cert-table">
          <thead>
            <tr>
              <th colSpan={2}>학력</th>
            </tr>
          </thead>
          <tbody>
            {getEducationInfo.length > 0 ? (
              getEducationInfo.map((education, idx) => (
                <tr key={idx}>
                  <td>{education.schoolName}</td>
                  <td>{education.major}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>학력 정보가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 자격증 및 외국어 정보 */}
        <table className="cert-table">
          <thead>
            <tr>
              <th colSpan={4}>자격증 및 외국어</th>
            </tr>
          </thead>
          <tbody>
            {/* 자격증 정보가 있으면 표시, 없으면 "정보 없음" 표시 */}
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

        {/* 자기소개서 */}
        <table>
          <thead>
            <tr>
              <th>자기소개서</th>
            </tr>
          </thead>
          <tbody>
            {/* 자기소개서가 있으면 표시, 없으면 "정보 없음" 표시 */}
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

        {/* 버튼 컨테이너: 닫기 및 인쇄 버튼 */}
        <div className="button-container">
          <button className="close-button" onClick={handlerClose}>닫기</button>
          <button className="print-button" onClick={handlerPrint}>인쇄</button>
        </div>
      </div>
    </HistoryModalStyled>
  );
};
