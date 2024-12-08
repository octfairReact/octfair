import { useEffect, useState } from 'react';
import { Container, ImageWrapper, StyledImage, LoadingMessage, ErrorMessage } from './styled';
import axios from 'axios';

export const MenuMain = () => {
  const [imageUrl, setImageUrl] = useState<string | 'loading' | 'error'>('loading');

  useEffect(() => {
    axios.get("/dashboard/menu.do")
          .then(response => { setImageUrl(response.data.imageUrl); })
          .catch(error => { setImageUrl('error'); });
  }, []);

  return (
    <Container>
      <h1>오늘의 메뉴판</h1>
      {
        imageUrl === 'loading' ? ( <LoadingMessage>이미지 로딩중 ...</LoadingMessage>
        ) : (imageUrl === 'error' ? ( <ErrorMessage>이미지 로딩에 실패했습니다.</ErrorMessage>
        ) : ( <ImageWrapper> <StyledImage src={imageUrl} alt="Scraped" /> </ImageWrapper> 
        ))
      }
    </Container>
  );
};