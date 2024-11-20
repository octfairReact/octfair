import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ManagePost } from "../../../../api/api";
import { IPostListResponse } from "../../../../models/interface/IPost";
import { postPostApi } from "../../../../api/postPostApi";

export const PostDetail = () => {
  const location = useLocation();
  const { postIdx, bizIdx } = location.state || {}; // state가 없을 경우 빈 객체로 기본값 설정
  const [param, setParam] = useState<{ postIdx: string | number; bizIdx: string | number } | null>(null); // param 상태 초기값 설정

  // postIdx와 bizIdx가 설정되었을 때 param 상태를 설정
  useEffect(() => {
    if (postIdx && bizIdx) {
      setParam({ postIdx, bizIdx });
    }
  }, [postIdx, bizIdx]);

  // API URL을 동적으로 생성
  const apiUrl = postIdx && bizIdx ? ManagePost.getpostDetail(postIdx, bizIdx) : "";

  const detail = async () => {};

  return (
    <>
      <h1>안녕하세요 여기는 detail페이지입니다</h1>
      {param ? (
        <>
          <div>postIdx: {param.postIdx}</div>
          <div>bizIdx: {param.bizIdx}</div>
        </>
      ) : (
        <div>상세 정보를 로드할 수 없습니다.</div>
      )}
    </>
  );
};
