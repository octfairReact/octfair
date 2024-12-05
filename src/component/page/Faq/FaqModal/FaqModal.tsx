import { useRecoilState } from "recoil";
import { FaqModalStyled } from "./styled";
import { modalState } from "../../../../stores/modalState";
import { FC, useEffect, useState } from "react";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { postFaqApi } from "../../../../api/postFaqApi";
import { IDetailResponse, IFaq, IPostResponse } from "../../../../models/interface/IFaq";
import { Faq } from "../../../../api/api";
import { toast } from "react-toastify";

export interface IFaqModalProps {
  onSuccess: (faqType: string) => void;
  faqSeq: number;
  setFaqIndex: (faqIndex: number | undefined) => void;
}

export const FaqModal: FC<IFaqModalProps> = ({ onSuccess, faqSeq, setFaqIndex }) => {
  const [modal, setModal] = useRecoilState<boolean>(modalState);
  const [faqType, setFaqType] = useState<string>("1");
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
  const [faqDetail, setFaqDetail] = useState<IFaq>();

  useEffect(() => {
    faqSeq && searchDetail();
    return () => {
      faqSeq && setFaqIndex(undefined);
    };
  }, []);

  const searchDetail = async () => {
    try {
      const detail = await postFaqApi<IDetailResponse>(Faq.getDetail, { faqSeq });

      if (detail) {
        setFaqDetail(detail.data.detail);
        console.log("데이터 확인", detail.data.detail);

        setFaqType(detail.data.detail.faq_type); // faqType 설정
        setTitle(detail.data.detail.title); // 제목 설정
        setContext(detail.data.detail.content); // 내용 설정
      } else {
        console.error("Failed to FAQ details");
      }
    } catch (error) {
      // API 호출이 실패했을 경우의 에러 처리
      //console.error("Error details:", error);
    }
  };

  const handlerSave = async () => {
    if (!title) {
      toast.warning("제목을 입력해주세요.");
      document.getElementById("title")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    }

    if (!context) {
      toast.warning("내용을을 입력해주세요.");
      document.getElementById("context")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    }

    const param = {
      title: title,
      context: context,
      faq_type: faqType,
      loginId: userInfo.loginId,
    };
    const save = await postFaqApi<IPostResponse>(Faq.postSave, param);
    if (save && save.data.result === "success") {
      onSuccess(param.faq_type);
    } else {
      //console.error("Failed to save faq:", save?.data);
    }
  };

  const handlerUpdate = async () => {
    if (!title) {
      toast.warning("제목을 입력해주세요.");
      document.getElementById("title")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    }

    if (!context) {
      toast.warning("내용을을 입력해주세요.");
      document.getElementById("context")?.focus();
      return; // 유효성 검사 실패 시 함수 종료
    }

    const param = {
      title: title,
      context: context,
      faq_type: faqType,
      faqSeq,
    };
    console.log("폼제출", param);

    const update = await postFaqApi<IPostResponse>(Faq.postUpdate, param);
    if (update && update.data.result === "success") {
      onSuccess(param.faq_type);
    } else {
      console.error("Failed to update faq:", update?.data);
    }
  };

  const handlerDelete = async () => {
    const param = {
      faqSeq,
    };
    const postDelete = await postFaqApi<IPostResponse>(Faq.postDelete, param);

    if (postDelete && postDelete.data.result === "success") {
      onSuccess(faqType);
    } else {
      console.error("Failed to save notice:", postDelete?.data);
    }
  };

  const handlerModal = () => {
    setModal(!modal);
  };

  return (
    <FaqModalStyled>
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-overlay" onClick={handlerModal}>
            X
          </div>
          <div className="faq">
            <h2>FAQ 등록</h2>
          </div>
          <table>
            <tbody>
              <tr>
                <th>
                  유형 <span className="required">*</span>
                </th>
                <td colSpan={3}>
                  <label>
                    <input
                      type="radio"
                      name="faq_type"
                      value="1"
                      checked={faqType === "1"}
                      onChange={() => setFaqType("1")}
                    />{" "}
                    개인회원
                  </label>
                  <label style={{ marginLeft: "10px" }}>
                    <input
                      type="radio"
                      name="faq_type"
                      value="2"
                      checked={faqType === "2"}
                      onChange={() => setFaqType("2")}
                    />{" "}
                    기업회원
                  </label>
                </td>
              </tr>
              <tr>
                <th>
                  제목 <span className="required">*</span>
                </th>
                <td colSpan={3}>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                  />
                </td>
              </tr>
              <tr>
                <th>
                  내용 <span className="required">*</span>
                </th>
                <td colSpan={3}>
                  <textarea
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="내용을 입력하세요"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="button-group">
            <button className="btn blue" onClick={() => (faqSeq ? handlerUpdate() : handlerSave())}>
              {faqSeq ? "수정" : "저장"}
            </button>
            {faqSeq && (
              <button className="btn blue" onClick={handlerDelete}>
                삭제
              </button>
            )}
            <button className="btn gray" onClick={handlerModal}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </FaqModalStyled>
  );
};
