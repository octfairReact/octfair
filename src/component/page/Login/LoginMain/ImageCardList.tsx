import { useState, useEffect, useContext } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { IDetailResponse, INoitce, INoitceListResponse } from "../../../../models/interface/INotice";
import { postNoticeApi } from "../../../../api/postNoticeApi";
import { Notice } from "../../../../api/api";
import { NoticeContext } from "../../../../api/provider/NoticeProvider";
import { Portal } from "../../../common/portal/Portal";
import { NoticeModal } from "../../Notice/NoticeModal/NoticeModal";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { PageNavigateStyled } from "../../../common/pageNavigation/styled";
import { toast } from "react-toastify";
import styled from "styled-components";
import loading_circle from '../../../../assets/loading_circle.gif';
import logo_img from '../../../../assets/logo_img.png';

const GalleryContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    padding: 16px;
`;

const Card = styled.div`
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.05);
    }
`;

const ImageWrapper = styled.div`
    width: 100%;
    height: 150px;
    background: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const Title = styled.div`
    padding: 8px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
`;

export const ImageCardList = () => {
    const [noticeList, setNoticeList] = useState<INoitce[]>([]);
    const [imageStates, setImageStates] = useState<{ [key: number]: { url?: string; loading: boolean } }>({});
    const [noticeCnt, setNoticeCnt] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(1);
    const [index, setIndex] = useState<number | undefined>();
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const { searchKeyWord } = useContext(NoticeContext);
    const itemPerPage: number = 8;

    useEffect(() => {
        searchNoticeList(cPage);
    }, [cPage, searchKeyWord]);

    const searchNoticeList = async (currentPage: number) => {
        const searchParam = { ...searchKeyWord, currentPage: currentPage.toString(), pageSize: itemPerPage.toString() };
        const searchList = await postNoticeApi<INoitceListResponse>(Notice.getListBody, searchParam);
        if (searchList) {
            setNoticeList(searchList.data.notice);
            setNoticeCnt(searchList.data.noticeCnt);
            
            for (const notice of searchList.data.notice) {
                setImageStates((prev) => ({ ...prev, [notice.noticeIdx]: {                                       loading: true  }, }));
                setImageStates((prev) => ({ ...prev, [notice.noticeIdx]: { url: notice.logicalPath || undefined, loading: false }, }));
            }
        }
    };

    return (
        <>
            <GalleryContainer>
                {noticeList.map((notice) => {
                    const { url, loading } = imageStates[notice.noticeIdx] || {};
                    return (
                        <Card key={notice.noticeIdx} onClick={() => {setModal(true); setIndex(notice.noticeIdx);}}>
                            <ImageWrapper>
                                {loading ? (
                                    <img src={loading_circle} alt="이미지 로딩중" />
                                ) : url ? (
                                    <Image src={url} alt={notice.title} />
                                ) : (
                                    <img src={logo_img} alt="이미지없는 글" />
                                )}
                            </ImageWrapper>
                            <Title>{notice.title}</Title>
                        </Card>
                    );
                })}
            </GalleryContainer>
            <PageNavigateStyled>
                <PageNavigate
                    totalItemsCount={noticeCnt}
                    onChange={(cPage:number) => {setCPage(cPage)}}
                    activePage={cPage}
                    itemsCountPerPage={itemPerPage}
                />
            </PageNavigateStyled>
            {modal && (
                <Portal>
                    <NoticeModal
                        noticeSeq={index}
                        setNoticeSeq={setIndex}
                        onSuccess={() => {setModal(false); searchNoticeList(cPage);}}
                    />
                </Portal>
            )}
        </>
    );
};
