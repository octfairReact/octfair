import React, { useEffect, useState } from "react";
import { IHistoryModal, ICertInfo } from "../../../../models/interface/IHistory";
import { postHistoryApi } from "../../../../api/postHistoryApi";
import { HistoryModalStyled } from "./styled";
import { useEscapeClose } from "../../../common/CustomHook/CustomHook";
import axios, { AxiosRequestConfig } from "axios";
import { modalState } from "../../../../stores/modalState";
import { useRecoilState } from "recoil";
import { History } from "../../../../api/api";

export const HistoryModal = ({ index, resIdx }) => {
  const [modal, setModal] = useRecoilState<boolean | string>(modalState);
  const [historyData, setHistoryData] = useState<IHistoryModal>(null);
  
  // ESC 키를 눌러 모달을 닫을 수 있는 커스텀 훅
  useEscapeClose(() => setModal(false));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await postHistoryApi<IHistoryModal>(History.historyModal, {
          userIdx: index,
          resIdx: resIdx,
        });
        setHistoryData(response.data); // 받아온 데이터를 상태에 저장
      } catch (error) {
        console.error("모달 데이터 로딩 실패", error);
      }
    };
    fetchData();
  }, [index, resIdx]);

  const handlerClose = () => {
    setModal(false);
  };

  const handlerPrint = () => {
    window.print();
  };

  const downloadFile = async () => {
    if (!historyData?.resumeInfo?.fileName) return;

    const param = new URLSearchParams();
    param.append("resIdx", resIdx.toString());

    const postAction: AxiosRequestConfig = {
      url: "/apply/resumeFileDownload.do",
      method: "post",
      data: param,
      responseType: "blob",
    };

    try {
      const res = await axios(postAction);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", historyData.resumeInfo.fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("파일 다운로드 중 오류 발생", error);
    }
  };

  const renderTableData = (label: string, data: string | undefined) => (
    <p className="no-align">
      {label} : {data || "정보 없음"}
    </p>
  );

  return (
    <HistoryModalStyled>
      <div>
        <h3>이력서 상세 정보</h3>
        <h2>{historyData?.resumeInfo?.title || "정보 없음"}</h2>
  
        {/* 기본 정보 */}
        <table>
          <tbody>
            {renderTableData("이름", historyData?.resumeInfo?.userNm)}
            {renderTableData("이메일", historyData?.resumeInfo?.email)}
            {renderTableData("전화번호", historyData?.resumeInfo?.phone)}
          </tbody>
        </table>
  
        {/* 이력서 소개 내용 */}
        {historyData?.resumeInfo?.shortIntro && (
          <table>
            <tbody>
              <tr>
                <td>
                  <p className="no-align">{historyData.resumeInfo.shortIntro}</p>
                </td>
              </tr>
            </tbody>
          </table>
        )}
  
        {/* 링크 및 첨부파일 */}
        {(historyData?.resumeInfo?.proLink || historyData?.resumeInfo?.fileName) && (
          <table>
            <tbody>
              <tr>
                <td>
                  {historyData.resumeInfo.proLink && (
                    <p className="no-align">
                      링크:{" "}
                      <a
                        href={historyData.resumeInfo.proLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proLink"
                      >
                        {historyData.resumeInfo.proLink}
                      </a>
                    </p>
                  )}
                  {historyData.resumeInfo.fileName && (
                    <p>
                      첨부파일:{" "}
                      <span className="download-link" onClick={downloadFile}>
                        {historyData.resumeInfo.fileName}
                      </span>
                    </p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        )}
  
        {/* 경력 정보 */}
        {historyData?.careerInfo?.length > 0 && (
          <table className="cert-table">
            <thead>
              <tr>
                <th colSpan={4}>경력</th>
              </tr>
            </thead>
            <tbody>
              {historyData.careerInfo.map((career, idx) => (
                <React.Fragment key={idx}>
                  <tr>
                    <td>{career.startDate} ~ {career.endDate}</td>
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
        )}
  
        {/* 학력 정보 */}
        {historyData?.educationInfo?.length > 0 && (
          <table className="cert-table">
            <thead>
              <tr>
                <th colSpan={4}>학력</th>
              </tr>
            </thead>
            <tbody>
              {historyData.educationInfo.map((education, idx) => (
                <tr key={idx}>
                  <td>{education.grdStatus}</td>
                  <td>{education.schoolName}</td>
                  <td>{education.major}</td>
                  <td>{education.admDate} ~ {education.grdDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
  
        {/* 스킬 정보 */}
        {historyData?.skillInfo?.length > 0 && (
          <table className="cert-table">
            <thead>
              <tr>
                <th colSpan={2}>스킬</th>
              </tr>
            </thead>
            <tbody>
              {historyData.skillInfo.map((skillInfo, idx) => (
                <tr key={idx}>
                  <td>{skillInfo.skillName}</td>
                  <td>{skillInfo.skillDetail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
  
        {/* 자격증 및 외국어 정보 */}
        {historyData?.certInfo?.length > 0 && (
          <table className="cert-table">
            <thead>
              <tr>
                <th colSpan={4}>자격증 및 외국어</th>
              </tr>
            </thead>
            <tbody>
              {historyData.certInfo.map((cert, idx) => (
                <tr key={idx}>
                  <td>{cert.certName}</td>
                  <td>{cert.grade}</td>
                  <td>{cert.issuer}</td>
                  <td>{cert.acqDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
  
        {/* 자기소개서 */}
        {historyData?.resumeInfo?.perStatement && (
          <table>
            <thead>
              <tr>
                <th>자기소개서</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{historyData.resumeInfo.perStatement}</td>
              </tr>
            </tbody>
          </table>
        )}
  
        {/* 버튼 */}
        <div className="button-container">
          <button className="close-button" onClick={handlerClose}>닫기</button>
          <button className="print-button" onClick={handlerPrint}>인쇄</button>
        </div>
      </div>
    </HistoryModalStyled>
  );
}