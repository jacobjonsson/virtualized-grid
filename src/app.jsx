import { faker } from "@faker-js/faker";
import { FixedSizeGrid } from "react-window";
import { useRect } from "@reach/rect";
import { Card } from "./card";
import { forwardRef } from "react";
import { useRef } from "react";
import styled from "styled-components";

function createItem() {
  return {
    id: Math.random().toString(),
    image: "https://picsum.photos/400",
    title: faker.word.adjective(),
    subTitle: faker.date.recent().toLocaleDateString(),
  };
}

const items = Array(1000).fill(null).map(createItem);

const GUTTER_SIZE = 16;
const MIN_WIDTH = 224;

export function App() {
  const containerRef = useRef(null);
  const rect = useRect(containerRef, { observe: true });

  function getColumnCount(width) {
    const columnCount = Math.floor(width / (GUTTER_SIZE + MIN_WIDTH));
    const whiteSpace = width - columnCount * (GUTTER_SIZE + MIN_WIDTH);
    const spaceToAdd = (whiteSpace - 16) / columnCount;
    return { columnCount, columnWidth: MIN_WIDTH + spaceToAdd };
  }

  const width = rect?.width || 0;
  const height = rect?.height || 0;
  const { columnCount, columnWidth } = getColumnCount(width);
  const rowCount = Math.ceil(items.length / columnCount);
  const rowHeight = columnWidth * 0.75;

  return (
    <>
      <Header>Welcome!</Header>

      <div style={{ height: "100%", width: "100%" }} ref={containerRef}>
        <FixedSizeGrid
          width={width}
          height={height}
          columnCount={columnCount}
          columnWidth={columnWidth + GUTTER_SIZE}
          rowCount={rowCount}
          rowHeight={rowHeight + GUTTER_SIZE}
          innerElementType={InnerElementType}
        >
          {({ columnIndex, rowIndex, style }) => {
            const item = items[rowIndex * columnCount + columnIndex];
            if (!item) {
              return null;
            }

            return (
              <Card
                style={{
                  ...style,
                  left: style.left + GUTTER_SIZE,
                  top: style.top + GUTTER_SIZE,
                  width: style.width - GUTTER_SIZE,
                  height: style.height - GUTTER_SIZE,
                }}
                {...item}
              />
            );
          }}
        </FixedSizeGrid>
      </div>
    </>
  );
}

const Header = styled.h1`
  font-size: 32px;
`;

const InnerElementType = forwardRef(({ style, ...rest }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        ...style,
        paddingLeft: GUTTER_SIZE,
        paddingTop: GUTTER_SIZE,
        paddingRight: GUTTER_SIZE,
        paddingBottom: GUTTER_SIZE,
      }}
      {...rest}
    />
  );
});
