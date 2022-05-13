import { useWindowScroll } from "react-use";
import { useRef } from "react";
import { CSSProperties } from "react";
import styled from "styled-components";

function getColumnCountAndWidth(
  containerWidth: number,
  minWidth: number,
  gutter: number
) {
  const columnCount = Math.floor(containerWidth / minWidth);
  const whiteSpace = containerWidth - columnCount * minWidth;
  const spaceToAdd = (whiteSpace - gutter) / columnCount;
  return { columnCount, columnWidth: minWidth + spaceToAdd };
}

const styleCache: Record<number, CSSProperties> = {};

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
    minWidth,
    gutter
  );

  const { y } = useWindowScroll();

  const columnHeight = columnWidth * 0.75;
  const startPosition = y;
  const endPosition = y + window.innerHeight;

  const startingColumnIndex = Math.floor(startPosition / columnHeight) - 1;
  const endingColumnIndex = Math.ceil(endPosition / columnHeight) + 1;

  const startingIndex = Math.max(0, startingColumnIndex * columnCount);
  const endingIndex = Math.min(numberOfItems, endingColumnIndex * columnCount);

  const cells: JSX.Element[] = [];
  for (let index = startingIndex; index < endingIndex; index++) {
    const rowIndex = Math.floor(index / columnCount);
    const columnIndex = Math.floor(index % columnCount);

    const style =
      styleCache[`${index}-${columnHeight}-${columnWidth}`] ||
      (styleCache[`${index}-${columnHeight}-${columnWidth}`] = {
        position: "absolute",
        top: rowIndex * columnHeight,
        left: columnIndex * columnWidth,
        width: columnWidth - gutter,
        height: columnHeight - gutter,
      });

    cells.push(children(style, index));
  }

  return (
    <Container
      ref={containerRef}
      style={{ height: (numberOfItems / columnCount) * columnHeight }}
    >
      {cells}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
`;
