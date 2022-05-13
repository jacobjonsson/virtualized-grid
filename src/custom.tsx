import { faker } from "@faker-js/faker";
import { useRect } from "@reach/rect";
import { useRef, useState } from "react";
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

const itemCache: Record<string, ReturnType<typeof createItem>> = {};

export function CustomApp() {
  const [numberOfItems, setNumberOfItems] = useState(10000);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = useRect(containerRef, { observe: true });

  return (
    <div ref={containerRef} style={{ padding: "16px" }}>
      <Header>A virtualized grid</Header>
      <InputContainer>
        <label>Number of items to render:</label>
        <input
          type="number"
          value={numberOfItems}
          onChange={(evt) => setNumberOfItems(parseInt(evt.target.value))}
        />
      </InputContainer>

      <Grid
        gutter={16}
        minWidth={224}
        containerWidth={containerRect?.width || 0}
        containerHeight={containerRect?.height || 0}
        numberOfItems={numberOfItems}
      >
        {(style, index) => {
          const item = itemCache[index] || (itemCache[index] = createItem());
          return <Card style={style} {...item} />;
        }}
      </Grid>
    </div>
  );
}

const Header = styled.h1`
  font-size: 32px;
  margin-bottom: 12px;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;
