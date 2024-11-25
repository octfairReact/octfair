import React, { useState } from "react";
import { HistoryModalStyled } from "./styled";

interface HistoryModalProps {
    index: number | null;
    setModal: React.Dispatch<React.SetStateAction<boolean>>;
    careerInfo?: { company: string; position: string }[];
    eduInfo?: { schoolName: string; major: string }[];
    skillInfo?: { skillName: string; skillDetail: string }[];
    certInfo?: { certName: string; grade: string }[];
}

export const HistoryModal = ({
    index,
    setModal,
    careerInfo = [],
    eduInfo = [],
    skillInfo = [],
    certInfo = [],
}: HistoryModalProps) => {
    if (index === null) return null; // index가 없으면 모달을 표시하지 않음

    const handleClose = () => {
        setModal(false);  // 모달 닫기
    };

    return (
        <HistoryModalStyled>
            <div>
                <div>모달 내용 - {index}</div>
                <div>
                    <p>resTitle</p>
                    <p>userNm</p>
                    <p>email</p>
                    <p>phone</p>
                </div>

                {/* 경력 정보 */}
                {careerInfo.length > 0 && (
                    <div>
                        <h3>경력</h3>
                        <ul>
                            {careerInfo.map((data, idx) => (
                                <li key={idx}>
                                    <span>{data.company}</span> - <span>{data.position}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 학력 정보 */}
                {eduInfo.length > 0 && (
                    <div>
                        <h3>학력</h3>
                        <ul>
                            {eduInfo.map((data, idx) => (
                                <li key={idx}>
                                    <span>{data.schoolName}</span> - <span>{data.major}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 스킬 정보 */}
                {skillInfo.length > 0 && (
                    <div>
                        <h3>스킬</h3>
                        <ul>
                            {skillInfo.map((data, idx) => (
                                <li key={idx}>
                                    <span>{data.skillName}</span> - <span>{data.skillDetail}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 자격증 정보 */}
                {certInfo.length > 0 && (
                    <div>
                        <h3>자격증 및 외국어</h3>
                        <ul>
                            {certInfo.map((data, idx) => (
                                <li key={idx}>
                                    <span>{data.certName}</span> - <span>{data.grade}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button onClick={handleClose}>닫기</button>
            </div>
        </HistoryModalStyled>
    );
};

// 임의 데이터 설정
const App = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [index, setIndex] = useState<number | null>(1);

    const mockCareerInfo = [
        { company: "ABC Corp", position: "Software Engineer" },
        { company: "XYZ Inc", position: "Senior Developer" },
    ];

    const mockEduInfo = [
        { schoolName: "서울대학교", major: "컴퓨터공학" },
        { schoolName: "고려대학교", major: "정보기술" },
    ];

    const mockSkillInfo = [
        { skillName: "JavaScript", skillDetail: "웹 개발" },
        { skillName: "React", skillDetail: "프론트엔드" },
    ];

    const mockCertInfo = [
        { certName: "정보처리기사", grade: "1급" },
        { certName: "TOEIC", grade: "950점" },
    ];

    return (
        <div>
            <button onClick={() => setModalVisible(true)}>모달 열기</button>
            {modalVisible && (
                <HistoryModal
                    index={index}
                    setModal={setModalVisible}
                    careerInfo={mockCareerInfo}
                    eduInfo={mockEduInfo}
                    skillInfo={mockSkillInfo}
                    certInfo={mockCertInfo}
                />
            )}
        </div>
    );
};

export default App;
