# 📚 채용박람회

## 1️⃣ 프로젝트 소개

- 이 프로젝트는 **리액트**로 구현된 **채용박람회 웹 애플리케이션**입니다.
- 사용자들은 다양한 채용 정보를 확인하고, 관심 있는 직무에 지원할 수 있습니다.
- 기존 Spring 기반 백엔드와 연동하여, 채용 공고 리스트와 상세 정보를 제공하며, 사용자 경험을 개선하기 위한 다양한 기능을 제공합니다.

<br>

## 2️⃣ 팀원 구성

<div align="center">
  
| **황윤기** | **이민서** | **손신효** |
| :------: |  :------: | :------: |
| [<img src="https://avatars.githubusercontent.com/u/151594104?v=4" height=250 width=250> <br/> @hykworld](https://github.com/hykworld) | [<img src="https://avatars.githubusercontent.com/u/139543251?v=4" height=250 width=250> <br/> @Dev-miiing](https://github.com/Dev-miiing) | [<img src="https://avatars.githubusercontent.com/u/113576529?v=4" height=250 width=250> <br/> @shinyorrr](https://github.com/shinyorrr) |

<br>

| **유성찬** | **우황희** | **김호관** |
| :------: |  :------: | :------: |
| [<img src="https://avatars.githubusercontent.com/u/153047019?v=4" height=250 width=250> <br/> @it-is-wanthefull](https://github.com/it-is-wanthefull) | [<img src="https://avatars.githubusercontent.com/u/157680899?v=4" height=250 width=250> <br/> @skh9301](https://github.com/skh9301) | [<img src="https://avatars.githubusercontent.com/u/153481438?v=4" height=250 width=250> <br/> @KimHoKwan](https://github.com/KimHoKwan) |
  
</div>
<br>

## 3️⃣ 개발환경 및 기술 스택

- **Front** : ![React badge](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react) ![TypeScript badge](https://img.shields.io/badge/TypeScript-4.5-3178C6?style=flat&logo=typescript) ![Recoil](https://img.shields.io/badge/Recoil-000000?style=flat&logo=react&logoColor=white) ![Recoil-persist](https://img.shields.io/badge/Recoil--persist-000000?style=flat&logo=react&logoColor=white) ![React Router badge](https://img.shields.io/badge/React_Router-v6-CA4245?style=flat&logo=react-router) ![Axios badge](https://img.shields.io/badge/axios-0.27.2-5A29E8?style=flat&logo=axios) ![Styled-components badge](https://img.shields.io/badge/styled--components-5.3.0-DB7093?style=flat&logo=styled-components)
- **Back-end** : ![Node.js badge](https://img.shields.io/badge/Node.js-16.x-339933?style=flat&logo=node.js) ![Spring badge](https://img.shields.io/badge/Spring_Framework-5.x-brightgreen?style=flat&logo=spring) ![Java badge](https://img.shields.io/badge/Java-18-red?style=flat&logo=java)
- **Database** : ![MySQL badge](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql)
- **Version Control** : ![GitHub badge](https://img.shields.io/badge/GitHub-black?style=flat&logo=github) ![GitHub badge](https://img.shields.io/badge/GitHub-2.x-lightgray?style=flat&logo=github) ![SVN](https://img.shields.io/badge/SVN-%23FF4500?style=flat&logo=subversion&logoColor=%23fff)
- **Build Tools** : ![npm badge](https://img.shields.io/badge/npm-8.19.0-CB3837?style=flat&logo=npm)
- **IDE/Editor** : ![VS Code badge](https://img.shields.io/badge/VS_Code-1.78-0078D4?style=flat&logo=visual-studio-code) ![Eclipse badge](https://img.shields.io/badge/Eclipse-2023-2C2255?style=flat&logo=eclipse)

<br>

## 4️⃣ 프로젝트 구조

```jsx
├── README.md
├── .eslintrc.js
├── .gitignore
├── .prettierrc.json
├── package-lock.json
├── package.json
│
├─public
│  └─images
│      └─admin
│          └─comm
└─src
    ├─api
    │  └─provider
    ├─assets
    ├─common
    │  └─css
    ├─component
    │  ├─common
    │  │  ├─Button
    │  │  ├─ContentBox
    │  │  ├─CustomHook
    │  │  ├─NotFound
    │  │  ├─pageNavigation
    │  │  ├─portal
    │  │  └─styled
    │  ├─layout
    │  │  ├─DashBoard
    │  │  └─LeftMenuBar
    │  └─page
    │      ├─Applicant
    │      ├─apply
    │      │  ├─ReseumeMain
    │      │  └─ResumeDetail
    │      ├─company
    │      │  ├─CompanyDetail
    │      │  ├─CompanyUpdatePage
    │      │  └─CompanyWritePage
    │      ├─Faq
    │      │  ├─FaqMain
    │      │  ├─FaqModal
    │      │  └─FaqSearch
    │      ├─Hire
    │      ├─History
    │      │  ├─CancelModal
    │      │  ├─HistoryMain
    │      │  ├─HistoryModal
    │      │  └─HistorySearch
    │      ├─Login
    │      │  ├─LoginMain
    │      │  └─LoginModal
    │      ├─manage-posts
    │      │  ├─applyModal
    │      │  ├─PostDetail
    │      │  ├─PostMain
    │      │  ├─PostSearch
    │      │  └─ScrapList
    │      ├─manage-user
    │      │  ├─ManageUserMain
    │      │  ├─ManageUserModal
    │      │  └─ManageUserSearch
    │      ├─MyPage
    │      │  ├─MyPageMain
    │      │  └─MyPageModal
    │      ├─Notice
    │      │  ├─NoticeMain
    │      │  ├─NoticeModal
    │      │  └─NoticeSearch
    │      └─Qna
    │          ├─QnaMain
    │          ├─QnaModal
    │          └─QnaSearch
    ├─css
    ├─hook
    ├─models
    │  └─interface
    │      └─store
    ├─pages
    ├─proxy
    ├─routers
    └─stores
```

<br>

## 5️⃣ 역할분담
![역할분담 이미지](./src/assets/gitReadMe/역할분담.png)

<br>


## 6️⃣ 페이지별 기능

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
