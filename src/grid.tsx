import { useWindowScroll } from "react-use";
import { useRef } from "react";
import { CSSProperties } from "react";
import styled from "styled-components";

function getColumnCountAndWidth(containerWidth: number, minWidth: number) {
  const columnCount = Math.floor(containerWidth / minWidth);
  const whiteSpace = containerWidth - columnCount * minWidth;
  const spaceToAdd = (whiteSpace - 16) / columnCount;
  return { columnCount, columnWidth: minWidth + spaceToAdd };
}

interface GridProps {
  containerWidth: number;
  containerHeight: number;
  numberOfItems: number;
  minWidth: number;
  gutter: number;
  children: (style: CSSProperties, index: number) => JSX.Element;
}

export function Grid({
  containerWidth,
  minWidth,
  children,
  numberOfItems,
  gutter,
}: GridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { columnCount, columnWidth } = getColumnCountAndWidth(
    containerWidth,
    minWidth
  );
  const { y } = useWindowScroll();

  const columnHeight = columnWidth * 0.75;
  const startPosition = y - window.outerHeight;
  const endPosition = y + window.outerHeight * 2;

  const startingColumnIndex = startPosition / columnHeight;
  const endingColumnIndex = endPosition / columnHeight;
  const startingIndex = Math.max(
    0,
    Math.round(startingColumnIndex * columnCount)
  );
  const endingIndex = Math.min(
    numberOfItems,
    Math.round(endingColumnIndex * columnCount)
  );

  const cells: JSX.Element[] = [];
  for (let index = startingIndex; index < endingIndex; index++) {
    const rowIndex = Math.floor(index / columnCount);
    const columnIndex = Math.floor(index % columnCount);

    cells.push(
      children(
        {
          position: "absolute",
          top: rowIndex * columnHeight,
          left: columnIndex * columnWidth,
          width: columnWidth - gutter,
          height: columnHeight - gutter,
        },
        index
      )
    );
  }

  return (
    <Container
      ref={containerRef}
      style={{ height: numberOfItems * columnHeight }}
    >
      {cells}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
`;
