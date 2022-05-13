import styled from "styled-components";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { CSSProperties } from "react";

interface CardProps {
  style: CSSProperties;
  image: string;
  title: string;
  subTitle: string;
}

export function Card({ style, image, title, subTitle }: CardProps) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <Container style={style}>
          <ImageContainer>
            <Image src={image} />
          </ImageContainer>
          <InfoContainer>
            <Title>{title}</Title>
            <SubTitle>{subTitle}</SubTitle>
          </InfoContainer>
        </Container>
      </ContextMenu.Trigger>
      <ContextMenuContent>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu.Root>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #3f3f46;
  border-radius: 4px;
  padding: 8px;
`;

const ImageContainer = styled.div`
  height: 100%;
  flex-shrink: 1;
  flex-grow: 1;
  overflow: hidden;
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
  overflow: hidden;
  object-fit: cover;
`;

const InfoContainer = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.span`
  font-size: 14px;
  color: #fff;
`;

const SubTitle = styled.span`
  font-size: 12px;
  color: rgb(160, 174, 192);
`;

const ContextMenuContent = styled(ContextMenu.Content)`
  padding: 8px 8px;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ContextMenuItem = styled(ContextMenu.Item)`
  cursor: pointer;
  font-size: 12px;
  padding: 8px;
`;
