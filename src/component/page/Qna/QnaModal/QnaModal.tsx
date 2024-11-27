import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { modalState } from "../../../../stores/modalState";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { IDetailResponse, IPostResponse, IQnaDetail } from "../../../../models/interface/IQna";
import { QnaModalStyled } from "./styled";
import { postQnaApi } from "../../../../api/postQnaApi";
import { Qna } from "../../../../api/api";

export interface IQnaModalProps {
  onSuccess: () => void;
  qnaSeq: number;
  setQnaSeq: (qnaSeq: number | undefined) => void;
}

export const QnaModal: FC<IQnaModalProps> = ({ onSuccess, qnaSeq, setQnaSeq }) => {
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [modal, setModal] = useRecoilState<boolean>(modalState);

  //save
  const title = useRef<HTMLInputElement>();
  const context = useRef<HTMLTextAreaElement>();
  const password = useRef<HTMLInputElement>();
  const ansContent = useRef<HTMLTextAreaElement>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileData, setFileData] = useState<File>();
  const [qnaDetail, setQnaDetail] = useState<IQnaDetail>();

  console.log("qnaDetail", qnaDetail);

  useEffect(() => {
    //컴포넌트가 열렸을 때 조건 확인 후 함수
    qnaSeq && searchDetail();

    //컴포넌트가 사라지기 직전에 발동
    return () => {
      qnaSeq && setQnaSeq(undefined);
    };
    // 클립업 함수
    // 컴포넌트가 언마운티드 되기 전에 실행되는 콜백함수
    // 추가 공부
  }, []);

  const searchDetail = async () => {
    const param = {
      qnaSeq,
      userType: userInfo.userType,
    };

    const detail = await postQnaApi<IDetailResponse>(Qna.getDetail, param);

    if (detail) {
      setQnaDetail(detail.data.detail);
      const { fileExt, logicalPath } = detail.data.detail;
      console.log("데이터", detail.data.detail);
      if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
        setImageUrl(logicalPath);

        console.log("미리보기", logicalPath);
      } else {
        setImageUrl("");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // 제목을 입력해주세요
    if (!title.current.value) {
      alert("제목을 입력해주세요.");
      document.getElementById("qnaTit")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    }
    // 내용을 입력해주세요
    if (!context.current.value) {
      alert("내용을 입력해주세요.");
      document.getElementById("qnaCon")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    }
    // 비밀번호를 입력해주세요
    if (!password.current.value) {
      alert("비밀번호를 입력해주세요.");
      document.getElementById("password")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    }

    const fileForm = new FormData();
    const textData = {
      qnaTit: title.current.value,
      qnaCon: context.current.value,
      loginId: userInfo.loginId,
      password: password.current.value,
      qna_type: userInfo.userType,
    };
    fileData && fileForm.append("file", fileData);
    fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));

    const save = await postQnaApi<IPostResponse>(Qna.postSave, fileForm);

    if (save && save.data.result === "success") {
      console.log("성공");
      // onSuccess();
    } else {
      console.error("Failed to save notice:", save?.data);
    }
  };

  const handleUpdate = () => {};
  const handleDelete = () => {};
  const handlerModal = () => {
    setModal(!modal);
  };

  const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInfo = e.target.files; // input에서 선택한 파일 정보 가져오기

    console.log("파일 인포", fileInfo);
    if (fileInfo?.length > 0) {
      // 파일이 선택되었으면
      const fileInfoSplit = fileInfo[0].name.split("."); // 파일 이름을 점(.)으로 분리하여 확장자 추출
      const fileExtension = fileInfoSplit[1].toLowerCase(); // 확장자 소문자로 변환

      const file = fileInfo[0]; // 첫 번째 파일

      console.log(file.name); // 파일 이름 (예: "example.jpg")
      console.log(file.size); // 파일 크기 (바이트 단위)
      console.log(file.type); // MIME 타입 (예: "image/jpeg" 또는 "image/png")

      if (fileExtension === "jpg" || fileExtension === "gif" || fileExtension === "png") {
        if (file.size <= 10 * 1024 * 1024) {
          // 10MB 이하로 제한
          setImageUrl(URL.createObjectURL(fileInfo[0])); // 이미지 미리보기 URL 생성
          console.log("미리보기", URL.createObjectURL(fileInfo[0]));
        } else {
          // 파일이 너무 크면 처리
          alert("파일이 너무 큽니다. 10MB 이하로 업로드해 주세요.");
          setImageUrl(""); // 이미지 미리보기 URL 초기화
        }
      } else {
        setImageUrl(""); // 다른 확장자일 경우 미리보기 URL 초기화
        alert("이미지 파일만 업로드 가능합니다.");
      }

      setFileData(fileInfo[0]); // 선택된 파일을 상태에 저장
    }
  };

  return (
    <QnaModalStyled>
      <div className="modal-container">
        <div className="modal-overlay" onClick={handlerModal}>
          X
        </div>
        <div className="modal-content">
          <div className="qna">
            <strong>Q&A 등록</strong>
          </div>
          <table className="row">
            <tbody>
              <tr>
                <th scope="row">
                  제목<span className="font_red">*</span>
                </th>
                <td colSpan={3}>
                  <input
                    type="text"
                    className="inputTxt p100"
                    name="qnaTit"
                    id="qnaTit"
                    ref={title}
                    defaultValue={qnaDetail?.title}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">
                  내용<span className="font_red">*</span>
                </th>
                <td colSpan={3}>
                  <textarea
                    name="qnaCon"
                    id="qnaCon"
                    cols={40}
                    rows={5}
                    ref={context}
                    defaultValue={qnaDetail?.content}
                  ></textarea>
                </td>
              </tr>
              <tr id="file_column">
                <th scope="row">파일</th>
                <td colSpan={3}>
                  <input type="file" className="inputTxt p100" name="fileInput" id="fileInput" onChange={handlerFile} />
                  {imageUrl ? (
                    <div>
                      <img src={imageUrl} alt="미리보기" style={{ width: "100px" }} />
                    </div>
                  ) : (
                    <div>등록된 파일이 없습니다.</div>
                  )}
                </td>
              </tr>

              <tr>
                <th scope="row">
                  비밀번호<span className="font_red">*</span>
                </th>
                <td colSpan={3}>
                  <input
                    type="text"
                    className="inputTxt p100"
                    name="password"
                    id="password"
                    ref={password}
                    defaultValue={qnaDetail?.password}
                    onFocus={(e) => (e.target.type = "text")} // 포커스 시 비밀번호로 전환
                    onBlur={(e) => (e.target.type = "password")} // 포커스 해제 시 일반 텍스트로 변경
                  />
                </td>
              </tr>
              {userInfo.userType === "M" && (
                <tr id="ansContent">
                  <th scope="row">답변</th>
                  <td colSpan={3}>
                    <textarea
                      name="ans_content"
                      id="ans_content"
                      cols={40}
                      rows={5}
                      ref={ansContent}
                      defaultValue={qnaDetail?.ans_content}
                      readOnly={userInfo.userType !== "M"}
                    ></textarea>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="btn_areaC mt30">
            {userInfo.userType !== "M" && (
              <button className="btn blue" id="qnaFileSave" onClick={handleSave}>
                저장
              </button>
            )}
            {userInfo.userType !== "M" ? (
              <button className="btn blue" id="qnaFileUpdate" onClick={handleUpdate}>
                수정
              </button>
            ) : (
              <button className="btn blue" id="qnaFileUpdate" onClick={handleUpdate}>
                답변등록
              </button>
            )}
            <button className="btn blue" id="qnaFileDelete" onClick={handleDelete}>
              삭제
            </button>
            <button className="btn gray" onClick={handlerModal}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </QnaModalStyled>
  );
};
