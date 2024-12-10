// 일반유저 공통데이터 구조체/멤버변수
export interface IUser {
  loginId: string;
  name: string;
  sex: string;  // 선택박스로 '1'/'2' 중 하나가 입력 됨
  birthday: string;
  phone: string;
  email: string;
  zipCode: string; // 직접입력 또는 우편번호찾기 API로 입력 됨
  address: string;
  detailAddress: string;
}

// 일반유저 공통데이터 기본값
export const defaultUser: IUser = {
  loginId: '',
  name: '',
  sex: '',
  birthday: '',
  phone: '',
  email: '',
  zipCode: '',
  address: '',
  detailAddress: '',
}

// 일반유저 공통데이터 데이터필드 한글명
export const datafieldnameUser: IUser = {
  loginId: '아이디',
  name: '이름',
  sex: '성별',
  birthday: '생년월일',
  phone: '전화번호',
  email: '이메일',
  zipCode: '우편번호',
  address: '주소',
  detailAddress: '상세주소',
}

// ----- ----- ----- ----- ----- ----- ----- ----- ----- -----

// 회원가입 입력데이터 구조체/멤버변수
export interface ISignupInput extends IUser {
  userType: string; // 유저타입 (선택박스로 'M'(관리자)/'A'(개인회원)/'B'(기업회원) 중 하나가 입력 됨)
  password: string;
  passwordOk: string;
  action: string; // 서버 컨트롤러에서 action="I"인지로 정상경로(회원가입 모달창)으로부터 온 데이터인지 보는듯????
};

// 회원가입 입력데이터 기본값
export const defaultSignupInput: ISignupInput = {
  // 위에서 제작한 공통값 defaultUser을 불러오면 코드가 단축되어 하려했지만
  // UX편의상 유효성검사를 입력필드 순서대로 돌아야했고 그 순서는 이 default에 넣어지는 순서대로라서, 후자선택
  userType: '',
  loginId: '',
  password: '',
  passwordOk: '',
  name: '',
  sex: '',
  birthday: '',
  phone: '',
  email: '',
  zipCode: '',
  address: '',
  detailAddress: '',
  action: '',
};

// 회원가입 입력데이터 데이터필드 한글명
export const datafieldnameSignupInput: ISignupInput = {
  ...datafieldnameUser,
  userType: '회원유형',
  password: '비밀번호',
  passwordOk: '비밀번호확인',
  action: 'action',
};

// ----- ----- ----- ----- ----- ----- ----- ----- ----- -----

// 회원수정 입력데이터 구조체/멤버변수
export interface IUpdateInput extends IUser {
  
};

// 회원수정 입력데이터 기본값
export const defaultUpdateInput: IUpdateInput = {
  ...defaultUser,
};

// 회원수정 입력데이터 데이터필드 한글명
export const datafieldnameUpdateInput: IUpdateInput = {
  ...datafieldnameUser,
};

// ----- ----- ----- ----- ----- ----- ----- ----- ----- -----

// 회원수정 비번변경 구조체/멤버변수
export interface IPasswordInput {
  passwd: string;
  newPasswd: string;
  newPasswdConfirm: string;
};

// 회원수정 비번변경 기본값
export const defaultPasswordInput: IPasswordInput = {
  passwd: '',
  newPasswd: '',
  newPasswdConfirm: '',
};

// 회원수정 비번변경 데이터필드 한글명
export const datafieldnamePasswordInput: IPasswordInput = {
  passwd: '기존 비밀번호',
  newPasswd: '새 비밀번호',
  newPasswdConfirm: '새 비밀번호 재입력',
};

// ----- ----- ----- ----- ----- ----- ----- ----- ----- -----

// 개인회원관리 입력데이터 구조체/멤버변수
export interface IApplicationData extends IUser {
  userType: string; // 유저타입 (선택박스로 'M'(관리자)/'A'(개인회원)/'B'(기업회원) 중 하나가 입력 됨)
  regdate: string; // 가입일자 (날짜형 string)
  statusYn: string; // 활성화여부 (값이 '2'이면 탈퇴, '1'이면 활동가능회원)
};

// 개인회원관리 입력데이터 기본값
export const defaultApplicationData : IApplicationData = {
  // 위에서 제작한 공통값 defaultUser을 불러오면 코드가 단축되어 하려했지만
  // UX편의상 유효성검사를 입력필드 순서대로 돌아야했고 그 순서는 이 default에 넣어지는 순서대로라서, 후자선택
  userType: '',
  loginId: '',
  name: '',
  sex: '',
  birthday: '',
  phone: '',
  email: '',
  regdate: '',
  statusYn: '',
  zipCode: '',
  address: '',
  detailAddress: '',
};

// 개인회원관리 입력데이터 데이터필드한글명
export const datafieldnameApplicationData : IApplicationData = {
  ...datafieldnameUser,
  userType: '유저타입',
  regdate: '가입일자',
  statusYn: '가입탈퇴여부',
};

// ----- ----- ----- ----- ----- ----- ----- ----- ----- -----

// 기업회원관리 입력데이터 구조체/멤버변수
export interface IBizData {
  bizIdx: number; // 사업자번호 (string 아님)
  bizName: string; // 사업자명
  bizCeoName: string; // 대표자
  bizEmpCount: string; // 사원수
  bizRevenue: string; // 매출액
  bizContact: string; // 연락처
  bizAddr: string; // 사업자 주소
  bizWebUrl: string;  // 홈페이지 주소
  bizFoundDate: string; // 설립일 (날짜형 string)
  bizIntro: string; // 회사소개
};

// 기업회원관리 입력데이터 기본값
export const defaultBizData: IBizData = {
  bizIdx: 0,
  bizName: '',
  bizCeoName: '',
  bizEmpCount: '',
  bizRevenue: '',
  bizContact: '',
  bizAddr: '',
  bizWebUrl: '',
  bizFoundDate: '',
  bizIntro: '',
};

// 기업회원관리 입력데이터 데이터필드 한글명
export const datafieldnameBizData = {
  bizIdx: '사업자번호',
  bizName: '사업자명',
  bizCeoName: '대표자',
  bizEmpCount: '사원수',
  bizRevenue: '매출액',
  bizContact: '연락처',
  bizAddr: '사업자 주소',
  bizWebUrl: '홈페이지 주소',
  bizFoundDate: '설립일',
  bizIntro: '회사소개',
};