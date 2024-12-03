import React, { useEffect, useState } from "react";
import { IHistoryModal, ICertInfo } from "../../../../models/interface/IHistory";
import { History } from "../../../../api/api";
import { postHistoryApi } from "../../../../api/postHistoryApi";
import { HistoryModalStyled } from "./styled";
import { useEscapeClose } from "../../../common/CustomHook/CustomHook";
import axios, { AxiosRequestConfig } from "axios";

// HistoryModal 컴포넌트
export const HistoryModal = ({
  index, // 해당 이력서의 고유 인덱스
  setModal, // 모달 상태를 변경하는 함수 (모달 닫기)
  resumeInfo = { userNm: '', email: '', phone: '', perStatement: '', resTitle: '', shortIntro: '', proLink: '', fileName: ''}, // 기본 이력서 정보
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

  // 파일 다운로드 처리
  const downloadFile = async () => {
    const param = new URLSearchParams();
    param.append("resIdx", resIdx.toString());
 
    const postAction: AxiosRequestConfig = {
      url: "/apply/resumeFileDownload.do",
      method: "post",
      data: param,
      responseType: "blob",
    };
    await axios(postAction)
      .then((res) => {
        // 응답 데이터 확인: blob 형태로 반환되는 파일 데이터
        console.log("다운로드 데이터 blob", res);

        // Blob 데이터를 URL로 변환
        const url = window.URL.createObjectURL(new Blob([res.data]));

        // <a> 태그를 생성하여 파일 다운로드 기능 구현
        const link = document.createElement("a");
        link.href = url; // Blob URL을 다운로드 링크로 설정
        link.setAttribute("download", getResumeInfo?.fileName as string);
        // 다운로드 시 저장할 파일 이름을 설정 (as string: 타입 단언)

        // 생성한 <a> 태그를 DOM에 추가한 후 클릭하여 다운로드 실행
        document.body.appendChild(link);
        link.click();

        // 다운로드가 완료되면 DOM에서 <a> 태그 제거 (효율성 및 메모리 관리)
        link.remove();
      })
      .catch((error) => {
        // 에러 처리: 다운로드 실패 시 로그 출력
        console.error("파일 다운로드 중 오류 발생", error);
      });
  };

  // 로딩이 끝난 후, 모달에서 이력서의 상세 정보를 표시
  return (
    <HistoryModalStyled>
      <div>
        <h3>이력서 상세 정보</h3>
        {/* 이력서 제목이 있으면 표시, 없으면 "정보 없음" 표시 */}
        <h2>{getResumeInfo.resTitle ? getResumeInfo.resTitle : "정보 없음"}</h2>


        {/* 1. 이력서 소개 내용 (shortIntro) */}
        <table>
          <tbody>
            <tr>
              <p className="no-align">이름 : &nbsp;
                {getResumeInfo.userNm ? getResumeInfo.userNm : "정보 없음"}
              </p>
              <p className="no-align">이메일 : &nbsp;
                {getResumeInfo.email ? getResumeInfo.email : "정보 없음"}
              </p>
              <p className="no-align">전화번호 : &nbsp;
                {getResumeInfo.phone ? getResumeInfo.phone : "정보 없음"}
              </p>
            </tr>

            {/* 인트로 */}
            {getResumeInfo.shortIntro && (
              <tr>
                <td>
                  <p className="no-align">
                    {getResumeInfo.shortIntro}
                  </p>
                </td>
              </tr>
            )}

            {/* 깃링크*/}
            {getResumeInfo.proLink && (
              <tr>
                <td>
                  <p className="no-align">
                    링크 : <a href={getResumeInfo.proLink} target="_blank" className="proLink">
                    {getResumeInfo.proLink}
                    </a>
                  </p>
                </td>
              </tr>
            )}

            {/* 첨부파일 */}
            {getResumeInfo.fileName && (
              <tr>
                <td>
                  <p>
                    첨부파일 : &nbsp;
                    <span className="download-link" onClick={downloadFile}>
                    {getResumeInfo.fileName}
                  </span>
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 2. 경력 정보 */}
        {getCareerInfo.length > 0 ? (
          <table className="cert-table">
            <thead>
              <tr>
                <th colSpan={4}>경력</th>
              </tr>
            </thead>
            <tbody>
            {getCareerInfo.map((career, idx) => (
              <React.Fragment key={idx}>
                <tr>
                  <td>{career.startDate}&nbsp;~&nbsp;{career.endDate}</td>
                  <td>{career.company}</td>
                  <td>{career.dept}</td>
                  <td>{career.position}</td>
                </tr>
                <tr>
                  <td colSpan={4}>{career.crrDesc}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
          </table>
        ): (
          <></>
        )}

        {/* 3. 학력 정보 */}
        {getEducationInfo.length > 0 ? (
        <table className="cert-table">
          <thead>
            <tr>
              <th colSpan={4}>학력</th>
            </tr>
          </thead>
          <tbody>
              {getEducationInfo.map((education, idx) => (
                <tr key={idx}>
                  <td>{education.grdStatus}</td>
                  <td>{education.schoolName}</td>
                  <td>{education.major}</td>
                  <td>{education.admDate}&nbsp;~&nbsp;{education.grdDate}</td>
                </tr>
              ))}
          </tbody>
        </table>
        ) : (
          <></>
        )}

        {/* 4. 스킬 정보 */}
        {getSkillInfo.length > 0 ? (
        <table className="cert-table">
          <thead>
            <tr>
              <th colSpan={2}>스킬</th>
            </tr>
          </thead>
          <tbody>
              {getSkillInfo.map((skillInfo, idx) => (
                <tr key={idx}>
                  <td>{skillInfo.skillName}</td>
                  <td>{skillInfo.skillDetail}</td>
                </tr>
              ))}
          </tbody>
        </table>
        ) : (
          <></>
        )}

        {/* 5. 자격증 및 외국어 정보 */}
        {getCertInfo.length > 0 ? (
        <table className="cert-table">
          <thead>
            <tr>
              <th colSpan={4}>자격증 및 외국어</th>
            </tr>
          </thead>
          <tbody>
              {getCertInfo.map((cert: ICertInfo, idx) => (
                <tr key={idx}>
                  <td>{cert.certName}</td>
                  <td>{cert.grade}</td>
                  <td>{cert.issuer}</td>
                  <td>{cert.acqDate}</td>
                </tr>
              ))}
          </tbody>
        </table>
        ) : (
          <></>
        )}

        {/* 6. 자기소개서 */}
        {getResumeInfo.perStatement ? (
        <table>
          <thead>
            <tr>
              <th>자기소개서</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td>{getResumeInfo.perStatement}</td>
              </tr>
          </tbody>
        </table>
        ) : (
          <></>
        )}

        {/* 버튼 컨테이너: 닫기 및 인쇄 버튼 */}
        <div className="button-container">
          <button className="close-button" onClick={handlerClose}>닫기</button>
          <button className="print-button" onClick={handlerPrint}>인쇄</button>
        </div>
      </div>
    </HistoryModalStyled>
  );
};
