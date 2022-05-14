import { faker } from "@faker-js/faker";
import { useRect } from "@reach/rect";
import { useRef, useState } from "react";
import styled from "styled-components";
import { Card } from "./card";
import { Grid } from "./grid";

type Item = ReturnType<typeof createItem>;

function createItem() {
  return {
    id: crypto.randomUUID(),
    image: "https://picsum.photos/400",
    title: faker.word.adjective(),
    subTitle: faker.date.recent().toLocaleDateString(),
  };
}

const itemsCache: Record<number, Item> = {};

function getItem(index: number) {
  if (itemsCache[index]) {
    return itemsCache[index];
  }

  const item = createItem();
  itemsCache[index] = item;
  return item;
}

export function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = useRect(containerRef, { observe: true });
  const [numberOfItems, setNumberOfItems] = useState(10_000);

  return (
    <div ref={containerRef} style={{ padding: "16px", overflow: "scroll" }}>
      <Header>A virtualized grid</Header>
      <InputContainer>
        <label>Number of items to render:</label>
        <input
          type="number"
          value={numberOfItems}
          onChange={(evt) => setNumberOfItems(parseInt(evt.target.value, 10))}
        />
      </InputContainer>

      <Grid
        gutter={16}
        minWidth={224}
        containerWidth={containerRect?.width || 0}
        containerHeight={window.innerHeight}
        numberOfItems={numberOfItems}
      >
        {(style, index) => {
          const item = getItem(index);
          return (
            <Card key={index} data-index={index} style={style} {...item} />
          );
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
