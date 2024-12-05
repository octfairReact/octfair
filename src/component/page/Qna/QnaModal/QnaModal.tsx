import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { modalState } from "../../../../stores/modalState";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { IDetailResponse2, IPostResponse, IQnaDetail } from "../../../../models/interface/IQna";
import { QnaModalStyled } from "./styled";
import { postQnaApi } from "../../../../api/postQnaApi";
import { Qna } from "../../../../api/api";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

export interface IQnaModalProps {
  onSuccess: () => void;
  qnaSeq: number;
  setQnaSeq: (qnaSeq: number | undefined) => void;
  qnaPassword: string;
}

export const QnaModal: FC<IQnaModalProps> = ({ onSuccess, qnaSeq, setQnaSeq, qnaPassword }) => {
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

  useEffect(() => {
    if (qnaSeq && modal) {
      searchDetail();
    }

    return () => {
      qnaSeq && setQnaSeq(undefined);
    };
  }, [qnaSeq, modal]);

  const searchDetail = async () => {
    const param = {
      qnaSeq,
      userType: userInfo.userType,
      password: qnaPassword,
    };

    const detail = await postQnaApi<IDetailResponse2>(Qna.getDetail, param);

    if (detail) {
      if (detail?.data.result === "fail") {
        setModal(!modal); // 모달 닫기
        setQnaSeq(undefined); // qnaSeq 초기화
        toast.warning("비밀번호가 일치하지 않습니다.");
        return;
      }
      setQnaDetail(detail.data.detail);
      const { fileExt, logicalPath } = detail?.data?.detail;

      if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
        setImageUrl(logicalPath);
      } else {
        setImageUrl("");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.current.value) {
      toast.warning("제목을 입력해주세요.");
      document.getElementById("qnaTit")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    }
    if (!context.current.value) {
      toast.warning("내용을 입력해주세요.");
      document.getElementById("qnaCon")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    }
    if (!password.current.value) {
      toast.warning("비밀번호를 입력해주세요.");
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
      onSuccess();
    } else {
      //console.error("Failed to save notice:", save?.data);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.current.value) {
      toast.warning("제목을 입력해주세요.");
      document.getElementById("qnaTit")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    }
    if (!context.current.value) {
      toast.warning("내용을 입력해주세요.");
      document.getElementById("qnaCon")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    }

    if (userInfo.userType !== "M") {
      if (!password.current.value) {
        toast.warning("비밀번호를 입력해주세요.");
        document.getElementById("password")?.focus();
        return; // 유효성 검사 실패 시 함수 종료
      }
    }

    const fileForm = new FormData();
    const textData = {
      qnaTit: title.current.value,
      qnaCon: context.current.value,
      loginId: userInfo.loginId,
      qna_type: userInfo.userType,
      qnaSeq: qnaDetail.qnaIdx,
    };

    if (userInfo.userType !== "M" && password.current.value) {
      textData["password"] = password.current.value;
    }
    if (userInfo.userType === "M" && ansContent.current?.value) {
      textData["ans_content"] = ansContent.current.value;
    }

    fileData && fileForm.append("file", fileData);
    fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));

    const update = await postQnaApi<IPostResponse>(Qna.postUpdate, fileForm);

    if (update && update.data.result === "success") {
      onSuccess();
    } else {
      //console.error("Failed to save notice:", update?.data);
    }
  };

  const handleDelete = async () => {
    const param = {
      qnaSeq: qnaDetail.qnaIdx,
    };

    const postDelete = await postQnaApi<IPostResponse>(Qna.postDelete, param);

    if (postDelete && postDelete.data.result === "success") {
      onSuccess();
    } else {
      //console.error("Failed to save notice:", postDelete?.data);
    }
  };

  const handlerModal = () => {
    setModal(!modal);
  };

  const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInfo = e.target.files; // input에서 선택한 파일 정보 가져오기

    if (fileInfo?.length > 0) {
      // 파일이 선택되었으면
      const fileInfoSplit = fileInfo[0].name.split("."); // 파일 이름을 점(.)으로 분리하여 확장자 추출
      const fileExtension = fileInfoSplit[1].toLowerCase(); // 확장자 소문자로 변환
      const file = fileInfo[0]; // 첫 번째 파일

      if (fileExtension === "jpg" || fileExtension === "gif" || fileExtension === "png") {
        if (file.size <= 10 * 1024 * 1024) {
          setImageUrl(URL.createObjectURL(fileInfo[0])); // 이미지 미리보기 URL 생성
        } else {
          toast.warning("파일이 너무 큽니다. 10MB 이하로 업로드해 주세요.");
          setImageUrl(""); // 이미지 미리보기 URL 초기화
        }
      } else {
        setImageUrl(""); // 다른 확장자일 경우 미리보기 URL 초기화
        toast.warning("이미지 파일만 업로드 가능합니다.");
      }

      setFileData(fileInfo[0]); // 선택된 파일을 상태에 저장
    }
  };

  const downloadFile = async () => {
    const param = new URLSearchParams();

    param.append("qnaSeq", qnaSeq.toString());

    const postAction: AxiosRequestConfig = {
      url: "/board/qnaDownload.do", // 백엔드의 파일 다운로드 API 엔드포인트
      method: "post", // HTTP 메서드: POST
      data: param, // 요청 바디에 URLSearchParams 객체를 포함 (form-urlencoded 형태로 전달)
      responseType: "blob", // 응답 데이터를 blob(이진 데이터)로 받음 (파일 다운로드 시 필요)
      // 참고: blob은 파일, 이미지, 영상 등과 같은 대용량 바이너리 데이터를 다룰 때 사용
    };

    await axios(postAction)
      .then((res) => {
        // 응답 데이터 확인: blob 형태로 반환되는 파일 데이터

        // Blob 데이터를 URL로 변환
        const url = window.URL.createObjectURL(new Blob([res.data]));

        // <a> 태그를 생성하여 파일 다운로드 기능 구현
        const link = document.createElement("a");
        link.href = url; // Blob URL을 다운로드 링크로 설정
        link.setAttribute("download", qnaDetail?.fileName as string);
        // 다운로드 시 저장할 파일 이름을 설정 (as string: 타입 단언)

        // 생성한 <a> 태그를 DOM에 추가한 후 클릭하여 다운로드 실행
        document.body.appendChild(link);
        link.click();

        // 다운로드가 완료되면 DOM에서 <a> 태그 제거 (효율성 및 메모리 관리)
        link.remove();
      })
      .catch((error) => {
        // 에러 처리: 다운로드 실패 시 로그 출력
        //console.error("파일 다운로드 중 오류 발생", error);
      });
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
                    readOnly={!!qnaDetail?.ans_content}
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
                    readOnly={!!qnaDetail?.ans_content}
                  ></textarea>
                </td>
              </tr>
              <tr id="file_column">
                <th scope="row">파일</th>
                <td colSpan={3}>
                  <input
                    type="file"
                    className="inputTxt p100"
                    name="fileInput"
                    id="fileInput"
                    onChange={handlerFile}
                    disabled={!!qnaDetail?.ans_content}
                  />
                  <div onClick={downloadFile}>
                    {imageUrl ? (
                      <div>
                        <img src={imageUrl} alt="미리보기" style={{ width: "100px" }} />
                      </div>
                    ) : (
                      <div>등록된 파일이 없습니다.</div>
                    )}
                  </div>
                </td>
              </tr>
              {userInfo.userType !== "M" && (
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
                      // defaultValue={qnaDetail?.password}
                      onFocus={(e) => (e.target.type = "text")} // 포커스 시 비밀번호로 전환
                      onBlur={(e) => (e.target.type = "password")} // 포커스 해제 시 일반 텍스트로 변경
                      readOnly={!!qnaDetail?.ans_content}
                    />
                  </td>
                </tr>
              )}
              {qnaDetail ? (
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
                      readOnly={userInfo.userType !== "M"} // 관리자만 수정 가능
                    ></textarea>
                  </td>
                </tr>
              ) : (
                userInfo.userType === "M" && (
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
                        readOnly={false} // 관리자만 입력 가능
                      ></textarea>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          <div className="btn_areaC mt30">
            {userInfo.userType !== "M" && !qnaDetail?.qnaIdx && (
              <button className="btn blue" id="qnaFileSave" onClick={handleSave}>
                저장
              </button>
            )}

            {userInfo.loginId === qnaDetail?.author && (
              <button className="btn blue" id="qnaFileUpdate" onClick={handleUpdate}>
                수정
              </button>
            )}
            {/* 답변등록 버튼: 관리자만 볼 수 있음 */}
            {userInfo.userType === "M" && (
              <button className="btn blue" id="qnaFileUpdate" onClick={handleUpdate}>
                답변등록
              </button>
            )}
            {/* 삭제는 작성자 또는 관리자만 삭제 가능하게 */}
            {qnaDetail && (userInfo.userType === "M" || userInfo.loginId === qnaDetail.author) && (
              <button className="btn blue" id="qnaFileDelete" onClick={handleDelete}>
                삭제
              </button>
            )}
            <button className="btn gray" onClick={handlerModal}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </QnaModalStyled>
  );
};
