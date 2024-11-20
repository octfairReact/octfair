import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { modalState } from "../../../../stores/modalState";
import { NoticeModalStyled } from "./styled";
import { useRecoilState } from "recoil";
import { loginInfoState } from "../../../../stores/userInfo";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { IDetailResponse, INoitce, INoitceDetail, IPostResponse } from "../../../../models/interface/INotice";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { Notice } from "../../../../api/api";
import axios, { AxiosRequestConfig } from "axios";

interface INoitceModalProps {
  onSuccess: () => void;
  noticeSeq: number;
  setNoticeSeq: (noticeSeq: number | undefined) => void;
}

export const NoticeModal: FC<INoitceModalProps> = ({ onSuccess, noticeSeq, setNoticeSeq }) => {
  //FC 펑션 컴포넌트
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [noticeDetail, setNoticeDetail] = useState<INoitceDetail>();
  const title = useRef<HTMLInputElement>();
  const context = useRef<HTMLInputElement>();
  //const [seq, setSeq] = useState<number>(noticeSeq);
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileData, setFileData] = useState<File>();

  // props는 리드온리여서 바로 수정이 안된다.
  useEffect(() => {
    //컴포넌트가 열렸을 때 조건 확인 후 함수
    noticeSeq && searchDetail();

    //컴포넌트가 사라지기 직전에 발동
    return () => {
      noticeSeq && setNoticeSeq(undefined);
    };
    // 클립업 함수
    // 컴포넌트가 언마운티드 되기 전에 실행되는 콜백함수
    // 추가 공부
  }, []);

  const handlerModal = () => {
    setModal(!modal);
  };

  //상세조회
  const searchDetail = async () => {
    const detail = await postNoticeApi<IDetailResponse>(Notice.getDetail, { noticeSeq });

    if (detail) {
      setNoticeDetail(detail.data.detail);
      const { fileExt, logicalPath } = detail.data.detail;
      console.log("데이터", detail.data.detail);
      if (fileExt === "jpg" || fileExt === "gif" || fileExt === "png") {
        setImageUrl(logicalPath);

        console.log("미리보기", logicalPath);
      } else {
        setImageUrl("");
      }
    }

    // axios.post("/board/noticeDetailJson.do", { noticeSeq }).then((res: AxiosResponse<IDetailResponse>) => {
    //   setNoticeDetail(res.data.detail);
    // });
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
      console.error("Failed to save notice:", save?.data);
    }
    // axios.post(`/board/noticeSaveBody.do`, param).then((res: AxiosResponse<IPostResponse>) => {
    //   res.data.result === "success" && onSuccess();
    // });
  };
  //  title: title.curren.value > title(dbname) : title.curren.value(프론트값)

  // const handlerSave = async () => {
  //   const param = {
  //     title: title.current.value,
  //     context: context.current.value,
  //     loginId: userInfo.loginId,
  //   };

  //   const save = await postNoticeApi<IPostResponse>(Notice.postSave, param);

  //   if (save && save.data.result === "success") {
  //     onSuccess();
  //   } else {
  //     console.error("Failed to save notice:", save?.data);
  //   }
  //   // axios.post(`/board/noticeSaveBody.do`, param).then((res: AxiosResponse<IPostResponse>) => {
  //   //   res.data.result === "success" && onSuccess();
  //   // });
  // };
  // //  title: title.curren.value > title(dbname) : title.curren.value(프론트값)

  //update
  // const handlerUpdate = async () => {
  //   const param = {
  //     title: title.current.value,
  //     context: context.current.value,
  //     noticeSeq,
  //   };

  //   const update = await postNoticeApi<IPostResponse>(Notice.postUpdate, param);

  //   if (update && update.data.result === "success") {
  //     onSuccess();
  //   } else {
  //     console.error("Failed to save notice:", update?.data);
  //   }

  //   // axios.post("/board/noticeUpdateJson.do", param).then((res: AxiosResponse<IPostResponse>) => {
  //   //   res.data.result === "success" && onSuccess();
  //   // });
  // };

  const handlerUpdateFile = async () => {
    const fileForm = new FormData();
    const textData = {
      title: title.current.value,
      context: context.current.value,
      noticeSeq,
    };
    fileData && fileForm.append("file", fileData);
    fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));

    const update = await postNoticeApi<IPostResponse>(Notice.postUpdate, fileForm);

    if (update && update.data.result === "success") {
      onSuccess();
    } else {
      console.error("Failed to save notice:", update?.data);
    }

    // axios.post("/board/noticeUpdateJson.do", param).then((res: AxiosResponse<IPostResponse>) => {
    //   res.data.result === "success" && onSuccess();
    // });
  };

  const handlerDelete = async () => {
    const param = {
      noticeSeq : noticeSeq,
    };

    const postDelete = await postNoticeApi<IPostResponse>(Notice.postDelet, param);

    if (postDelete && postDelete.data.result === "success") {
      onSuccess();
    } else {
      console.error("Failed to save notice:", postDelete?.data);
    }
// 프론트 > 컨트롤러 > 서비스 > 서비스 임플 > dao > 맵퍼 > ... 생략 > 컨트롤러에서 리절트 값 확인 후 > 프론트로 > 
    // axios.post("/board/noticeDeleteJson.do", param).then((res: AxiosResponse<IPostResponse>) => {
    //   res.data.result === "success" && onSuccess();
    // });
  };

  const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInfo = e.target.files;
    console.log("파일 인포", fileInfo);
    if (fileInfo?.length > 0) {
      const fileInfoSplit = fileInfo[0].name.split(".");
      const fileExtension = fileInfoSplit[1].toLowerCase();

      if (fileExtension === "jpg" || fileExtension === "gif" || fileExtension === "png") {
        setImageUrl(URL.createObjectURL(fileInfo[0]));

        console.log("미리보기", URL.createObjectURL(fileInfo[0]));
      } else {
        setImageUrl("");
        // 정해진 확장자외 다른 파일이 들어오면 파일네임 스트링값만 나오게
      }

      setFileData(fileInfo[0]);
    }
  };

  // const handlerFileSave = async () => {
  //   const save = await postNoticeApi<IPostResponse>(Notice.postSave, fileForm);

  //   if (save && save.data.result === "success") {
  //     onSuccess();
  //   } else {
  //     console.error("Failed to save notice:", save?.data);
  //   }
  // };

  // 다운로드 기능을 구현하는 함수
  // URLSearchParams: 백엔드 컨트롤러에서 파라미터를 처리하기 위해 사용
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

  return (
    <NoticeModalStyled>
      <div className="container">
        <label>
          제목 :<input type="text" ref={title} defaultValue={noticeDetail?.title}></input>
        </label>
        <label>
          내용 : <input type="text" ref={context} defaultValue={noticeDetail?.content}></input>
        </label>
        파일 :<input type="file" id="fileInput" style={{ display: "none" }} onChange={handlerFile}></input>
        <label className="img-label" htmlFor="fileInput">
          파일 첨부하기
        </label>
        {/* 다운로드 액션 */}
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
          <button onClick={noticeSeq ? handlerUpdateFile : handlerSaveFile}>{noticeSeq ? "수정" : "저장"}</button>
          {noticeSeq && <button onClick={handlerDelete}>삭제</button>}
          <button onClick={handlerModal}>나가기</button>
        </div>
      </div>
    </NoticeModalStyled>
  );
};
