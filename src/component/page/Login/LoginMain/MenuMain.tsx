import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ScrapingComponent = () => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get("/dashboard/menu.do");
                setImageUrl(response.data.imageUrl);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();
    }, []);

    return (
        <div>
            <h1>오늘의 메뉴판</h1>
            {imageUrl ? <img src={imageUrl} alt="Scraped" /> : <p>Loading...</p>}
        </div>
    );
};

export default ScrapingComponent;
