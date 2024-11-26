import { useRecoilState } from "recoil";
import { FaqModalStyled } from "./styled";
import { modalState } from "../../../../stores/modalState";
import { FC, useEffect, useState } from "react";
import { ILoginInfo } from "../../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../../stores/userInfo";
import { postFaqApi } from "../../../../api/postFaqApi";
import { IDetailResponse, IFaq, IPostResponse } from "../../../../models/interface/IFaq";
import { Faq } from "../../../../api/api";

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

  // props는 리드온리여서 바로 수정이 안된다.
  useEffect(() => {
    //컴포넌트가 열렸을 때 조건 확인 후 함수
    faqSeq && searchDetail();

    //컴포넌트가 사라지기 직전에 발동
    return () => {
      faqSeq && setFaqIndex(undefined);
    };
    // 클립업 함수
    // 컴포넌트가 언마운티드 되기 전에 실행되는 콜백함수
    // 추가 공부
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
      console.error("Error details:", error);
    }
  };

  const handlerSave = async () => {
    const param = {
      title: title,
      context: context,
      faq_type: faqType,
      loginId: userInfo.loginId,
    };
    console.log("폼제출", param);
    const save = await postFaqApi<IPostResponse>(Faq.postSave, param);
    if (save && save.data.result === "success") {
      console.log("글등록 성동");
      onSuccess(param.faq_type);
    } else {
      console.error("Failed to save faq:", save?.data);
    }
  };

  const handlerUpdate = async () => {
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
                    {/* {" "} 공백추가하는 방식 */}
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
