import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { modalState } from "../../../../stores/modalState";
import { NoticeModalStyled } from "./styled";
import { useRecoilState } from "recoil";
import { loginInfoState } from "../../../../stores/userInfo";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { IDetailResponse, INoitceDetail, IPostResponse } from "../../../../models/interface/INotice";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { Notice } from "../../../../api/api";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { useEscapeClose } from "../../../common/CustomHook/CustomHook";

export interface INoitceModalProps {
  onSuccess: () => void;
  noticeSeq: number;
  setNoticeSeq: (noticeSeq: number | undefined) => void;
}

export const NoticeModal: FC<INoitceModalProps> = ({ onSuccess, noticeSeq, setNoticeSeq }) => {
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [noticeDetail, setNoticeDetail] = useState<INoitceDetail>();
  const title = useRef<HTMLInputElement>();
  const context = useRef<HTMLInputElement>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileData, setFileData] = useState<File>();

  useEffect(() => {
    noticeSeq && searchDetail();
    return () => {
      noticeSeq && setNoticeSeq(undefined);
    };
    // 클립업 함수
    // 컴포넌트가 언마운티드 되기 전에 실행되는 콜백함수
  }, []);

  const handlerModal = () => {
    setModal(!modal);
  };

  const searchDetail = async () => {
    const detail = await postNoticeApi<IDetailResponse>(Notice.getDetail, { noticeSeq });

    if (detail) {
      setNoticeDetail(detail.data.detail);
      const { fileExt, logicalPath } = detail.data.detail;
      if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
        setImageUrl(logicalPath);
      } else {
        setImageUrl("");
      }
    }
  };

  const handlerSaveFile = async () => {
    const fileForm = new FormData();
    const textData = {
      title: title.current.value,
      context: context.current.value,
      loginId: userInfo.loginId,
    };
    fileData && fileForm.append("file", fileData);
    fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));

    const save = await postNoticeApi<IPostResponse>(Notice.postSave, fileForm);

    if (save && save.data.result === "success") {
      onSuccess();
    } else {
      //console.error("Failed to save notice:", save?.data);
    }
  };

  const handlerUpdateFile = async () => {
    const fileForm = new FormData();
    const textData = {
      title: title.current.value,
      content: context.current.value,
      noticeSeq,
    };
    fileData && fileForm.append("file", fileData);
    fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));

    // fileForm.forEach((value, key) => {
    //   console.log(key, value);
    // });

    const update = await postNoticeApi<IPostResponse>(Notice.postUpdate, fileForm);

    if (update && update.data.result === "success") {
      onSuccess();
    } else {
      //console.error("Failed to save notice:", update?.data);
    }
  };

  const handlerDelete = async () => {
    const param = {
      noticeSeq: noticeSeq,
    };

    const postDelete = await postNoticeApi<IPostResponse>(Notice.postDelet, param);

    if (postDelete && postDelete.data.result === "success") {
      onSuccess();
    } else {
      //console.error("Failed to save notice:", postDelete?.data);
    }
  };

  const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInfo = e.target.files; // input에서 선택한 파일 정보 가져오기

    console.log("파일 인포", fileInfo);
    if (fileInfo?.length > 0) {
      // 파일이 선택되었으면
      const fileInfoSplit = fileInfo[0].name.split("."); // 파일 이름을 점(.)으로 분리하여 확장자 추출
      const fileExtension = fileInfoSplit[1].toLowerCase(); // 확장자 소문자로 변환

      const file = fileInfo[0]; // 첫 번째 파일

      if (fileExtension === "jpg" || fileExtension === "gif" || fileExtension === "png") {
        if (file.size <= 10 * 1024 * 1024) {
          // 10MB 이하로 제한
          setImageUrl(URL.createObjectURL(fileInfo[0])); // 이미지 미리보기 URL 생성
          console.log("미리보기", URL.createObjectURL(fileInfo[0]));
        } else {
          // 파일이 너무 크면 처리
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
    // URLSearchParams 객체 생성
    const param = new URLSearchParams();

    // noticeSeq: 공지사항의 고유 번호를 문자열로 변환 후 파라미터에 추가
    param.append("noticeSeq", noticeSeq.toString());

    // Axios 요청 설정 객체
    const postAction: AxiosRequestConfig = {
      url: "/board/noticeDownload.do", // 백엔드의 파일 다운로드 API 엔드포인트
      method: "post", // HTTP 메서드: POST
      data: param, // 요청 바디에 URLSearchParams 객체를 포함 (form-urlencoded 형태로 전달)
      responseType: "blob", // 응답 데이터를 blob(이진 데이터)로 받음 (파일 다운로드 시 필요)
      // 참고: blob은 파일, 이미지, 영상 등과 같은 대용량 바이너리 데이터를 다룰 때 사용
    };

    // Axios 요청 실행
    await axios(postAction)
      .then((res) => {
        // 응답 데이터 확인: blob 형태로 반환되는 파일 데이터
        console.log("다운로드 데이터 blob", res);

        // Blob 데이터를 URL로 변환
        const url = window.URL.createObjectURL(new Blob([res.data]));

        // <a> 태그를 생성하여 파일 다운로드 기능 구현
        const link = document.createElement("a");
        link.href = url; // Blob URL을 다운로드 링크로 설정
        link.setAttribute("download", noticeDetail?.fileName as string);
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

  useEscapeClose(() => setModal(false));

  return (
    <NoticeModalStyled>
      <div className="container">
        <label>
          제목 :<input type="text" ref={title} defaultValue={noticeDetail?.title}></input>
        </label>
        <label>
          내용 : <input type="text" ref={context} defaultValue={noticeDetail?.content}></input>
        </label>
        {userInfo?.userType === "M" && (
          <>
            파일:
            <input type="file" id="fileInput" style={{ display: "none" }} onChange={handlerFile} />
            <label className="img-label" htmlFor="fileInput">
              파일 첨부하기
            </label>
          </>
        )}
        <div onClick={downloadFile}>
          {imageUrl ? (
            <div>
              <label>미리보기</label>
              <img src={imageUrl} alt="미리보기" />
              {fileData?.name || noticeDetail.fileName}
            </div>
          ) : (
            <div>{fileData?.name}</div>
          )}
        </div>
        <div className={"button-container"}>
          {userInfo.userType === "M" && (
            <button onClick={noticeSeq ? handlerUpdateFile : handlerSaveFile}>{noticeSeq ? "수정" : "저장"}</button>
          )}
          {userInfo.userType === "M" && noticeSeq && <button onClick={handlerDelete}>삭제</button>}
          <button onClick={handlerModal}>나가기</button>
        </div>
      </div>
    </NoticeModalStyled>
  );
};
