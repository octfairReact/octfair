import { FC } from "react";
import { ContentBoxPostStyled, ContentNamePost } from "./styledPost";

export interface IContentBoxProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const ContentBoxPost: FC<IContentBoxProps> = ({ children }) => {
  return (
    <ContentBoxPostStyled>
      <ContentNamePost>{children}</ContentNamePost>
    </ContentBoxPostStyled>
  );
};
