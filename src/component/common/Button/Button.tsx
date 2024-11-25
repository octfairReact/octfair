import { FC } from "react";
import { ButtonContainer, ButtonStyled } from "./styled";

export interface IButtonProps {
  children?: React.ReactNode | React.ReactNode[];
  onClick?: () => void;
  width?: number;
  height?: number;
  padding?: number;
  paddingtop?: number;
  paddingbottom?: number;
  paddingleft?: number;
  paddingright?: number;
  fontSize?: number;
  style?: React.CSSProperties;
  className?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button: FC<IButtonProps> = ({
  children,
  onClick,
  width,
  height,
  fontSize,
  padding,
  paddingtop,
  paddingbottom,
  paddingleft,
  paddingright,
  style,
  className,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <ButtonContainer>
      <ButtonStyled
        width={width}
        height={height}
        onClick={() => onClick?.()}
        padding={padding}
        paddingtop={paddingtop}
        paddingbottom={paddingbottom}
        paddingleft={paddingleft}
        paddingright={paddingright}
        fontSize={fontSize}
        style={style}
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </ButtonStyled>
    </ButtonContainer>
  );
};
