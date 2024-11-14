import { FC, useEffect, useRef, useState } from "react";
import { modalState } from "../../../../stores/modalState";
import { NoticeModalStyled } from "./styled";
import { useRecoilState } from "recoil";
import { loginInfoState } from "../../../../stores/userInfo";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import axios, { Axios, AxiosResponse } from "axios";
import { IDetailResponse, INoitce, INoitceDetail, IPostResponse } from "../../../../models/interface/INotice";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { Notice } from "../../../../api/api";

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
    }

    // axios.post("/board/noticeDetailJson.do", { noticeSeq }).then((res: AxiosResponse<IDetailResponse>) => {
    //   setNoticeDetail(res.data.detail);
    // });
  };

  const handlerSave = async () => {
    const param = {
      title: title.current.value,
      context: context.current.value,
      loginId: userInfo.loginId,
    };

    const save = await postNoticeApi<IPostResponse>(Notice.postSave, param);

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

  //update
  const handlerUpdate = async () => {
    const param = {
      title: title.current.value,
      context: context.current.value,
      noticeSeq,
    };

    const update = await postNoticeApi<IPostResponse>(Notice.postUpdate, param);

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
      noticeSeq,
    };

    const postDelete = await postNoticeApi<IPostResponse>(Notice.postDelet, param);

    if (postDelete && postDelete.data.result === "success") {
      onSuccess();
    } else {
      console.error("Failed to save notice:", postDelete?.data);
    }

    // axios.post("/board/noticeDeleteJson.do", param).then((res: AxiosResponse<IPostResponse>) => {
    //   res.data.result === "success" && onSuccess();
    // });
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
        파일 :<input type="file" id="fileInput" style={{ display: "none" }}></input>
        <label className="img-label" htmlFor="fileInput">
          파일 첨부하기
        </label>
        <div>
          <div>
            <label>미리보기</label>
            <img src="" />
          </div>
        </div>
        <div className={"button-container"}>
          <button onClick={noticeSeq ? handlerUpdate : handlerSave}>{noticeSeq ? "수정" : "저장"}</button>
          {noticeSeq && <button onClick={handlerDelete}>삭제</button>}
          <button onClick={handlerModal}>나가기</button>
        </div>
      </div>
    </NoticeModalStyled>
  );
};
