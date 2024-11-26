// import React, { useRef, useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const Calendar = ({ label, onDateChange }) => {
//   //const [selectedDate, setSelectedDate] = useState(null);
//   const [startDate, setStartDate] = useState(null); // 시작 날짜
//   const [finishDate, setFinishDate] = useState(null); // 끝나는 날짜
//   const endDateRef = useRef(null);


//   const handleChange = (date) => {
//     setSelectedDate(date);
//     endDateRef.current = date; //Ref에 선택된 날짜 저장
//     if (onDateChange) {
//       onDateChange(date); // 부모 컴포넌트로 선택된 날짜 전달
//     }
//   };

//   return (
//     <div style={{ marginBottom: "15px" }}>
//       <label style={{ marginRight: "10px" }}>{label}</label>
//       <DatePicker
//         selected={selectedDate}
//         onChange={handleChange}
//         showTimeSelect
//         timeIntervals={60} // 1시간 간격
//         //timeCaption="시간" // 시간 선택 드롭다운 캡션
//         minDate={new Date()} //오늘 이후 날짜만 선택 가능
//         timeFormat="HH aa" // 시간 형식 설정 (오전/오후 포함)
//         dateFormat ="yyyy-MM-dd h:mm aa" // 전체 날짜와 시간 형식
        
//       />

//     </div>
    
    
//   );
// };

// export default Calendar;