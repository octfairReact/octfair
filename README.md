# 📚 채용박람회

## 1️⃣ 프로젝트 소개

- 이 프로젝트는 **리액트**로 구현된 **채용박람회 웹 애플리케이션**입니다. 사용자들은 다양한 채용 정보를 확인하고, 관심 있는 직무에 지원할 수 있습니다. 기존 Spring 기반 백엔드와 연동하여, 채용 공고 리스트와 상세 정보를 제공하며, 사용자 경험을 개선하기 위한 다양한 기능을 제공합니다.

<br>

## 2️⃣ 팀원 구성

<div align="center">
  
| **황윤기** | **이민서** | **손신효** |
| :------: |  :------: | :------: |
| [<img src="https://avatars.githubusercontent.com/u/151594104?v=4" height=250 width=250> <br/> @hykworld](https://github.com/hykworld) | [<img src="https://avatars.githubusercontent.com/u/139543251?v=4" height=250 width=250> <br/> @Dev-miiing](https://github.com/Dev-miiing) | [<img src="https://avatars.githubusercontent.com/u/113576529?v=4" height=250 width=250> <br/> @shinyorrr](https://github.com/shinyorrr) |

| **유성찬** | **우황희** | **김호관** |
| :------: |  :------: | :------: |
| [<img src="https://avatars.githubusercontent.com/u/153047019?v=4" height=250 width=250> <br/> @it-is-wanthefull](https://github.com/it-is-wanthefull) | [<img src="https://avatars.githubusercontent.com/u/157680899?v=4" height=250 width=250> <br/> @skh9301](https://github.com/skh9301) | [<img src="https://avatars.githubusercontent.com/u/153481438?v=4" height=250 width=250> <br/> @KimHoKwan](https://github.com/KimHoKwan) |
  
</div>
<br>

## 3️⃣ 개발 환경

- **Front** : ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![axios badge](https://img.shields.io/badge/axios-%2B-blue?style=flat&logo=axios)
 ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![Context-API](https://img.shields.io/badge/Context--Api-000000?style=for-the-badge&logo=react) ![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)
- React 18, React Router, axios, styled-components
- **Back-end** : Spring Framework (기존 API 연동)
- **버전 관리** : Git, GitHub
  
<br>

## 4️⃣ 기술 스택

- **React**: UI 컴포넌트 및 페이지 구조 구현
- **Axios**: 서버와의 데이터 통신 (API 요청)
- **React Router**: 페이지 간 라우팅
- **Styled Components**: CSS-in-JS 방식으로 스타일링
- **Context API**: 전역 상태 관리 (예: 로그인 상태, 사용자 정보 등)

## 5️⃣ 프로젝트 구조

## 프로젝트 구조

```jsx
├── README.md
├── .eslintrc.js
├── .gitignore
├── .prettierrc.json
├── package-lock.json
├── package.json
│
├── public
│    └── index.html
└── src
     ├── App.jsx
     ├── index.jsx
     ├── api
     │     └── mandarinAPI.js
     ├── asset
     │     ├── fonts
     │     ├── css_sprites.png
     │     ├── logo-404.svg
     │     └── logo-home.svg
     │          .
     │          .
     │          .
     ├── atoms
     │     ├── LoginData.js
     │     └── LoginState.js
     ├── common
     │     ├── alert
     │     │     ├── Alert.jsx
     │     │     └── Alert.Style.jsx
     │     ├── button
     │     ├── comment
     │     ├── inputBox
     │     ├── post
     │     ├── postModal
     │     ├── product
     │     ├── tabMenu
     │     ├── topBanner
     │     └── userBanner
     ├── pages
     │     ├── addProduct
     │     │     ├── AddProduct.jsx
     │     │     └── AddProduct.Style.jsx
     │     ├── chatList
     │     ├── chatRoom
     │     ├── emailLogin
     │     ├── followerList
     │     ├── followingList
     │     ├── home
     │     ├── join
     │     ├── page404
     │     ├── postDetail
     │     ├── postEdit
     │     ├── postUpload
     │     ├── productEdit
     │     ├── profile
     │     ├── profileEdit
     │     ├── profileSetting
     │     ├── search
     │     ├── snsLogin
     │     └── splash
     ├── routes
     │     ├── privateRoutes.jsx
     │     └── privateRoutesRev.jsx  
     └── styles
           └── Globalstyled.jsx
```

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
