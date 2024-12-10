# 📚 채용박람회

## 1️⃣ 프로젝트 소개

이 프로젝트는 **리액트**로 구현된 **채용박람회 웹 애플리케이션**입니다. 사용자들은 다양한 채용 정보를 확인하고, 관심 있는 직무에 지원할 수 있습니다. 기존 Spring 기반 백엔드와 연동하여, 채용 공고 리스트와 상세 정보를 제공하며, 사용자 경험을 개선하기 위한 다양한 기능을 제공합니다.

## 2️⃣ 팀원 구성

| 황윤기 | 이민서 | 손신효 |
|--------|--------|--------|
| 데이터 1 | 데이터 2 | 데이터 3 |

| 유성찬 | 우황희 | 김호관 |
|--------|--------|--------|
| 데이터 1 | 데이터 2 | 데이터 3 |

| 황윤기     | 이민서     | 손신효 |
|----------|----------|----------------|
| <div align="center"><a href="https://github.com/hykworld"><img src="https://avatars.githubusercontent.com/u/70290522" width="250" height="250" /></a><br><a href="https://github.com/hykworld">hykworld</a></div> | <div align="center"><a href="https://github.com/Dev-miiing"><img src="https://avatars.githubusercontent.com/u/74334443" width="250" height="250" /></a><br><a href="https://github.com/Dev-miiing">Dev-miiing</a></div> | <div align="center"><a href="https://github.com/shinyorrr"><img src="https://avatars.githubusercontent.com/u/71862647" width="250" height="250" /></a><br><a href="https://github.com/shinyorrr">shinyorrr</a></div> |

| 유성찬 | 우황희 | 김호관 |
|--------|--------|--------|
| <div align="center"><a href="https://github.com/it-is-wanthefull"><img src="https://avatars.githubusercontent.com/u/it-is-wanthefull_id" width="250" height="250" /></a><br><a href="https://github.com/it-is-wanthefull">it-is-wanthefull</a></div> | <div align="center"><a href="https://github.com/skh9301"><img src="https://avatars.githubusercontent.com/u/skh9301_id" width="250" height="250" /></a><br><a href="https://github.com/skh9301">skh9301</a></div> | <div align="center"><a href="https://github.com/KimHoKwan"><img src="https://avatars.githubusercontent.com/u/KimHoKwan_id" width="250" height="250" /></a><br><a href="https://github.com/KimHoKwan">KimHoKwan</a></div> |
| 황윤기     | 이민서     | 손신효 |
|----------|----------|----------------|
| <div align="center"><a href="https://github.com/hykworld"><img src="https://avatars.githubusercontent.com/u/70290522" width="250" height="250" /></a><br><a href="https://github.com/hykworld">hykworld</a></div> | <div align="center"><a href="https://github.com/Dev-miiing"><img src="https://avatars.githubusercontent.com/u/74334443" width="250" height="250" /></a><br><a href="https://github.com/Dev-miiing">Dev-miiing</a></div> | <div align="center"><a href="https://github.com/shinyorrr"><img src="https://avatars.githubusercontent.com/u/71862647" width="250" height="250" /></a><br><a href="https://github.com/shinyorrr">shinyorrr</a></div> |

| 유성찬          | 우황희         | 김호관           |
|-----------------|----------------|------------------|
| <div align="center"><a href="https://github.com/it-is-wanthefull"><img src="https://avatars.githubusercontent.com/u/it-is-wanthefull" width="250" height="250" /></a><br><a href="https://github.com/it-is-wanthefull">it-is-wanthefull</a></div> | <div align="center"><a href="https://github.com/skh9301"><img src="https://avatars.githubusercontent.com/u/skh9301" width="250" height="250" /></a><br><a href="https://github.com/skh9301">skh9301</a></div> | <div align="center"


## 3️⃣ 개발 환경

- **프론트엔드**: React 18, React Router, axios, styled-components
- **백엔드**: Spring Framework (기존 API 연동)
- **버전 관리**: Git, GitHub
- **배포**: Netlify / Vercel

## 4️⃣ 기술 스택

- **React**: UI 컴포넌트 및 페이지 구조 구현
- **Axios**: 서버와의 데이터 통신 (API 요청)
- **React Router**: 페이지 간 라우팅
- **Styled Components**: CSS-in-JS 방식으로 스타일링
- **Context API**: 전역 상태 관리 (예: 로그인 상태, 사용자 정보 등)

## 5️⃣ 프로젝트 구조

/채용박람회 |-- /public | |-- index.html |-- /src | |-- /assets | |-- /components | | |-- Header.js | | |-- Footer.js | | |-- JobList.js | | |-- JobDetail.js | |-- /pages | | |-- Home.js | | |-- JobFair.js | | |-- About.js | |-- /services | | |-- api.js | |-- App.js | |-- index.js |-- package.json |-- README.md

## 6️⃣ 역할분담

- **프론트엔드**
  - **홈페이지**: 채용박람회에 대한 간략한 설명과 최신 채용 정보를 제공
  - **채용 공고 목록**: 각 기업의 채용 공고를 리스트 형태로 출력
  - **채용 공고 상세**: 특정 채용 공고의 세부 정보를 제공

- **백엔드**
  - Spring 기반 RESTful API 서버 구축
  - 채용 공고 데이터 제공 (GET 요청)
  - 사용자 정보와 채용 공고 연동 (POST 요청)

## 7️⃣ 페이지별 기능

### 홈 페이지 (`Home.js`)
홈 페이지는 채용박람회의 개요와 최신 채용 정보를 보여주며, 사용자가 관심 있는 채용 공고로 쉽게 이동할 수 있도록 합니다.

```jsx
import React from 'react';
import JobList from '../components/JobList';

function Home() {
  return (
    <div>
      <h1>채용박람회에 오신 것을 환영합니다!</h1>
      <p>다양한 직무에 대한 채용 공고를 확인하세요.</p>
      <JobList />
    </div>
  );
}
