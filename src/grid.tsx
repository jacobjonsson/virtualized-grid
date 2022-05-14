import { useWindowScroll } from "react-use";
import { CSSProperties } from "react";
import styled from "styled-components";

function getColumnCount({
  containerWidth,
  minWidth,
  gutter,
}: {
  minWidth: number;
  gutter: number;
  containerWidth: number;
}) {
  return Math.floor(containerWidth / (minWidth + gutter));
}

function getCellSize({
  columnCount,
  minWidth,
  gutter,
  containerWidth,
}: {
  columnCount: number;
  minWidth: number;
  gutter: number;
  containerWidth: number;
}) {
  const whiteSpace = containerWidth - columnCount * minWidth;
  const spaceToAdd = (whiteSpace - gutter) / columnCount;
  const cellWidth = minWidth + spaceToAdd;
  const cellHeight = cellWidth * 0.75;
  return { cellWidth, cellHeight };
}

const styleCache: Record<string, CSSProperties> = {};

function getCellStyles({
  rowIndex,
  columnIndex,
  cellHeight,
  cellWidth,
  gutter,
}: {
  rowIndex: number;
  columnIndex: number;
  cellHeight: number;
  cellWidth: number;
  gutter: number;
}): CSSProperties {
  const cacheKey = `${rowIndex}-${columnIndex}-${cellHeight}-${cellWidth}`;
  if (styleCache[cacheKey]) {
    return styleCache[cacheKey];
  }

  const style: CSSProperties = {
    position: "absolute",
    top: rowIndex * cellHeight,
    left: columnIndex * cellWidth,
    height: cellHeight - gutter,
    width: cellWidth - gutter,
  };

  styleCache[cacheKey] = style;
  return style;
}

function getRowStartIndexForOffset({
  rowHeight,
  rowCount,
  scrollTop,
}: {
  rowHeight: number;
  rowCount: number;
  scrollTop: number;
}) {
  return Math.max(0, Math.min(rowCount - 1, Math.floor(scrollTop / rowHeight)));
}

function getRowStopIndexForStartIndex({
  rowHeight,
  rowCount,
  scrollTop,
  startIndex,
  containerHeight,
}: {
  rowHeight: number;
  rowCount: number;
  containerHeight: number;
  startIndex: number;
  scrollTop: number;
}) {
  const top = startIndex * rowHeight;
  const numVisibleRows = Math.ceil(
    (containerHeight + scrollTop - top) / rowHeight
  );
  return Math.max(
    0,
    Math.min(
      rowCount - 1,
      startIndex + numVisibleRows - 1 // -1 is because stop index is inclusive
    )
  );
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
  containerHeight,
  minWidth,
  children,
  numberOfItems,
  gutter,
}: GridProps) {
  const columnCount = getColumnCount({ containerWidth, minWidth, gutter });
  const { cellHeight, cellWidth } = getCellSize({
    columnCount,
    minWidth,
    gutter,
    containerWidth,
  });

  const { y: scrollTop } = useWindowScroll();

  const startingRowIndex = getRowStartIndexForOffset({
    rowHeight: cellHeight,
    rowCount: numberOfItems / columnCount,
    scrollTop,
  });
  const endingRowIndex = getRowStopIndexForStartIndex({
    rowHeight: cellHeight,
    rowCount: numberOfItems / columnCount,
    containerHeight: containerHeight,
    startIndex: startingRowIndex,
    scrollTop,
  });

  const startingIndex = Math.max(
    0,
    startingRowIndex * columnCount - columnCount * 2
  );
  const endingIndex = Math.min(
    numberOfItems,
    endingRowIndex * columnCount + columnCount * 2
  );

  if (containerWidth === 0 || containerHeight === 0) {
    return null;
  }

  const cells: JSX.Element[] = [];
  for (let index = startingIndex; index < endingIndex; index++) {
    const rowIndex = Math.floor(index / columnCount);
    const columnIndex = Math.floor(index % columnCount);

    const style = getCellStyles({
      rowIndex,
      columnIndex,
      cellHeight,
      cellWidth,
      gutter,
    });

    cells.push(children(style, index));
  }

  return (
    <Container style={{ height: (numberOfItems / columnCount) * cellHeight }}>
      {cells}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
`;
