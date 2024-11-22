import { useEffect, useState } from "react";
import { ILoginInfo } from "../../../models/interface/store/userInfo";
import { useRecoilState } from "recoil";
import { loginInfoState } from "../../../stores/userInfo";
import { useNavigate } from "react-router-dom";

export const MyPageUpdate = () => {
  const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);

  const [formData, setFormData] = useState({
    userId: "",
    userType: "",
    bizIdx: "",
    userName: "",
    userSex: "",
    userBirthday: "",
    userPhone: "",
    userEmail: "",
    userZipCode: "",
    userAddress: "",
    userDetailAddress: "",
    passwd: "",
    newPasswd: "",
    newPasswdConfirm: "",
  });
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const handlerCreate = async () => {
    navigate(`/react/company/companyWritePage.do`);
  };

  const handlerUpdate = async () => {
    navigate("/react/company/companyUpdatePage.do");
  };

  return (
    <>
      기업정보 :
      {formData.bizIdx ? <button onClick={handlerUpdate}>수정</button> : <button onClick={handlerCreate}>등록</button>}
    </>
  );
};
