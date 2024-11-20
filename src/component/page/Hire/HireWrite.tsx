import { useContext, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { ILoginInfo } from "../../../models/interface/store/userInfo";
import { loginInfoState } from "../../../stores/userInfo";
import { Hire } from "../../../api/api";
import { IPostResponse } from "../../../models/interface/INotice";
import { postHireApi } from "../../../api/postHireApi";
import { IHireWrite } from "../../../models/interface/IHire";
import { StyledTable } from "../../common/styled/StyledTable";


export const HireWrite = () => {
    const title = useRef<HTMLInputElement>();
    const context = useRef<HTMLInputElement>();
    const [hireWrite, setHireWrite] = useState<IHireWrite>();
    const [userInfo] = useRecoilState<ILoginInfo>(loginInfoState);
    const [fileData, setFileData] = useState<File>();

   
    const handlerSaveFile = async () => {
        const fileForm = new FormData();
        const textData = {
          title: title.current.value,
          context: context.current.value,
          loginId: userInfo.loginId,
        };
        fileData && fileForm.append("file", fileData);
        fileForm.append("text", new Blob([JSON.stringify(textData)], { type: "application/json" }));
    
        const save = await postHireApi<IPostResponse>(Hire.postSave, fileForm);
    
        if (save && save.data.result === "success") {
          onSuccess();
        } else {
          console.error("Failed to save notice:", save?.data);
        }
        // axios.post(`/board/noticeSaveBody.do`, param).then((res: AxiosResponse<IPostResponse>) => {
        //   res.data.result === "success" && onSuccess();
        // });
      };





    return(
        <div className="container">
            <table>
                <thead>
                    <tr>
                        <th>채용제목</th>
                        <td><input type="text" ref={title} defaultValue={hireWrite?.title}></input></td>
                    </tr>


                </thead>

            </table>
         
            {/* <label>
                제목 :<input type="text" ref={title} defaultValue={hireWrite?.title}></input>
            </label>
            <label>
                급여 : <input type="text" ref={context} defaultValue={hireWrite?.salary}></input>
            </label> */}
             
        </div>

    );


    



};

function onSuccess() {
    throw new Error("Function not implemented.");
}
