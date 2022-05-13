import { faker } from "@faker-js/faker";
import { useRect } from "@reach/rect";
import { useRef } from "react";
import styled from "styled-components";
import { Card } from "./card";
import { Grid } from "./grid";

function createItem() {
  return {
    id: crypto.randomUUID(),
    image: "https://picsum.photos/400",
    title: faker.word.adjective(),
    subTitle: faker.date.recent().toLocaleDateString(),
  };
}

const items = Array(1000000).fill(null).map(createItem);

export function CustomApp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = useRect(containerRef, { observe: true });

  return (
    <div ref={containerRef}>
      <Header>My virtualized grid</Header>
      <SubHeader>Scroll to see the magic</SubHeader>

      <Grid
        gutter={16}
        minWidth={224}
        containerWidth={containerRect?.width || 0}
        containerHeight={containerRect?.height || 0}
        numberOfItems={items.length}
      >
        {(style, index) => {
          const item = items[index];
          if (!item) return null;

          return <Card style={style} {...item} />;
        }}
      </Grid>
    </div>
  );
}

const Header = styled.h1`
  font-size: 32px;
`;

const SubHeader = styled.p`
  font-size: 24px;
`;
