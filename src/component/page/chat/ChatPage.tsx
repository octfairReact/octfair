import React, { useState } from 'react';
import { MainPageStyled } from './styled';  // 스타일링 컴포넌트
import logoImage from '../../../assets/logo.png';  // 로고 이미지

export const MainPage = () => {
    // 모달의 열림/닫힘 상태를 관리하는 상태 변수
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    // 사용자 입력 메시지 값을 관리하는 상태 변수
    const [message, setMessage] = useState<string>('');
    // 채팅 메시지 리스트를 관리하는 상태 변수
    const [chatMessages, setChatMessages] = useState<string[]>([]);

    // 모달을 열거나 닫을 때 호출되는 함수
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen); // 모달 상태를 토글(열림/닫힘)
    };

    // 메시지 입력창에서 내용이 변경될 때 호출되는 함수
    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);  // 입력된 메시지를 상태에 반영
    };

    // 메시지를 전송할 때 호출되는 함수
    const handleSendMessage = () => {
        if (message.trim()) {  // 공백이 아닌 메시지일 경우
            setChatMessages([...chatMessages, message]);  // 메시지 리스트에 새로운 메시지 추가
            setMessage('');  // 메시지 입력란 초기화
        }
    };

    return (
        <MainPageStyled>
            {/* 로고 이미지 클릭 시 모달 열림/닫힘 */}
            <img 
                src={logoImage} 
                className={`chat_btn ${isModalOpen ? 'active' : ''}`}  // 모달 열림 상태에 따라 클래스 변경
                alt="Logo" 
                onClick={toggleModal}  // 이미지 클릭 시 모달 열기/닫기
            />

            {/* 모달이 열릴 때만 채팅 모달 표시 */}
            {isModalOpen && (
                <div className="chat_modal" onClick={toggleModal}> 
                    {/* 모달 배경 클릭 시 모달 닫기 */}
                    <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                        {/* 채팅 헤더 */}
                        <div className="chat_header">
                            {/* 여기에 채팅방 이름, 타이틀 등을 추가할 수 있습니다 */}
                        </div>

                        {/* 채팅 메시지 본문 */}
                        <div className="chat_body">
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`message ${idx % 2 === 0 ? 'self' : ''}`}>
                                    {/* 짝수 인덱스는 자신이 보낸 메시지로 스타일 적용 */}
                                    <p>{msg}</p>
                                </div>
                            ))}
                        </div>

                        {/* 채팅 입력창 및 전송 버튼 */}
                        <div className="chat_footer">
                            <input 
                                type="text" 
                                value={message}  // 현재 입력된 메시지
                                onChange={handleMessageChange}  // 메시지 입력 변경 시 호출되는 함수
                                placeholder="메시지를 입력하세요..."  // 입력창 placeholder
                            />
                            <button onClick={handleSendMessage}>전송</button>  {/* 메시지 전송 버튼 */}
                        </div>
                    </div>
                </div>
            )}
        </MainPageStyled>
    );
};
