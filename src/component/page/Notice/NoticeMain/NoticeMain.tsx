import { useLocation } from 'react-router-dom';
import { StyledTable, StyledTd, StyledTh } from '../../../common/styled/StyledTable';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NoticeModal } from '../NoticeModal/NoticeModal';
import { Portal } from '../../../common/portal/Portal';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';

interface INoitce {
    noticeIdx: number;
    title: string;
    content: string;
    author: string;
    createdDate: string;
}

export const NoticeMain = () => {
    const {search} = useLocation();
    const [noticeList, setNoticeList] = useState<INoitce[]>();
    const [noticeCnt, setNoticeCnt] = useState<number>(0);
    //const [modalState, setModalState] = useState(false);  // 컴포넌트에서 만든 것
    const [modal, setModal] = useRecoilState<boolean>(modalState); // recoil에 저장된 state
    
    useEffect(() => {
        searchNoticeList();
    }, [search])
    // 변경을 감지하고 유스이펙트 안에 있는 함수를 실행 시켜주는 것이 의존성 배열
 
    console.log('주소에서 받는 값' , search);

    const searchNoticeList = (currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append('currentPage', currentPage.toString());
        searchParam.append('pageSize', '5');

        axios.post('/board/noticeListJson.do', searchParam).then((res)=> {
            console.log('응답 데이터', res.data);
            setNoticeList(res.data.notice);
            setNoticeCnt(res.data.noticeCnt);
        });
    };

    // const handlerModal = () => { 
    //     setModalState(!modalState); 
    // }
    
    const handlerModal = () => { 
        setModal(!modal);
    }

    return (
        <>
            총 갯수 : {noticeCnt} 현재 페이지 : 0
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh size={5}>번호</StyledTh>
                        <StyledTh size={50}>제목</StyledTh>
                        <StyledTh size={10}>제목</StyledTh>
                        <StyledTh size={20}>등록일</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {noticeList?.length > 0 ? (
                        noticeList?.map((notice) => {
                            return (
                                <tr key={notice.noticeIdx} onClick={handlerModal}>
                                    <StyledTd>{notice.noticeIdx}</StyledTd>
                                    <StyledTd>{notice.title}</StyledTd>
                                    <StyledTd>{notice.author}</StyledTd>
                                    <StyledTd>{notice.createdDate}</StyledTd>
                                </tr>
                            )
                        })
                    ): (
                        <tr>
                        <StyledTd colSpan={3}>데이터가 없습니다.</StyledTd>
                        </tr>
                    )}

                   
                </tbody>
            </StyledTable>
            {/* {modalState &&  (
            <Portal>
                <NoticeModal />
            </Portal>
            )} */}

             {modal && (
                <Portal>
                    <NoticeModal />
                </Portal>
            )}
        </>
    );
};
