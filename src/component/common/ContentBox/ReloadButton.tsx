import { ReloadButtonStyled } from "./styledre";

export const ReloadButton = () => {
  // 새로고침 함수
  const handleReload = () => {
    window.location.reload(); // 페이지 새로고침
  };

  return (
    <ReloadButtonStyled>
      <button onClick={handleReload} className="reload-button">
        <div className="reload-icon">&#8635;</div>
      </button>
    </ReloadButtonStyled>
  );
};
