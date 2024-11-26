import { useRecoilState } from "recoil";
import { loginInfoState } from "../../../../stores/userInfo";
import { ApplyModalState } from "../../../../stores/modalState";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { useState } from "react";
import { StyledModal } from "./styled";

export const ApplyModal = () => {
  const [modal, setModal] = useRecoilState<boolean>(ApplyModalState);
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileData, setFileData] = useState<File>();

  const dummyResumeList = [
    {
      userIdx: 1,
      resumeTitle: "이력서 제목 1",
      userEmail: "user1@example.com",
      userPhone: "010-1234-5678",
      resumeIdx: 101,
    },
    {
      userIdx: 2,
      resumeTitle: "이력서 제목 2",
      userEmail: "user2@example.com",
      userPhone: "010-8765-4321",
      resumeIdx: 102,
    },
  ];

  const handleApply = () => {
    console.log("입사지원 완료");
  };

  const handleClose = () => {
    setModal(false);
  };

  return (
    <StyledModal isOpen={modal}>
      <div className="layerPop layerType2 apply-modal">
        <div className="modal-content">
          <strong className="modal-title">입사 지원</strong>
          <p className="company-name">기업 이름</p>
          <p className="job-title">공고 제목</p>

          <div className="resume-container">
            <table className="resume-table">
              <thead>
                <tr>
                  <th>지원 이력서</th>
                </tr>
              </thead>
              <tbody>
                {dummyResumeList.map((item) => (
                  <tr key={item.resumeIdx} className="spaceBetweenRB">
                    <td className="resume-details">
                      <input type="hidden" name="userIdx" value={item.userIdx} />
                      <div className="resumeTitle">
                        <strong>{item.resumeTitle}</strong>{" "}
                        <a href={`/apply/resume-detail.do?resumeNum=${item.resumeIdx}`} className="edit-link">
                          <span>수정</span>
                        </a>
                      </div>
                      <div className="resume-info">
                        <div>이메일 주소: {item.userEmail}</div>
                        <div>핸드폰: {item.userPhone}</div>
                      </div>
                    </td>
                    <td className="select-radio">
                      <input type="radio" name="resumeSelect" value={item.resumeIdx} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="btn-area">
            {userInfo?.userType === "A" && (
              <button type="button" className="btn btn-apply" onClick={handleApply}>
                입사지원
              </button>
            )}
            <button type="button" className="btn btn-close" onClick={handleClose}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </StyledModal>
  );
};
