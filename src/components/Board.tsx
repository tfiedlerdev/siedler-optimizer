import { useEffect, useMemo, useState } from "react";
import { TileData, TileRow, types } from "./TileRow";
import { getTileCornerY, getTileHeight } from "@/lib/tile_util";
import { TileType } from "./Tile";
import { NodeExpactancy } from "./NodeExpectancy";

const minWidth = 3;
const maxWidth = 5;

const tileWidth = 200;

const allowedKeys = Array(10)
  .fill(0)
  .map((_, i) => `${i}`);

interface TileGraphNode {
  topLeftEdge?: TileData;
  topRightEdge?: TileData;
  leftEdge?: TileData;
  rightEdge?: TileData;
  bottomLeftEdge?: TileData;
  bottomRightEdge?: TileData;
  data: TileData;
}

export function Board({}: {}) {
  const tileHeight = useMemo(() => getTileHeight(tileWidth), []);
  const tileCornerY = useMemo(() => getTileCornerY(tileHeight), [tileHeight]);

  const rowWidths = useMemo(() => {
    const stairs = Array(maxWidth - minWidth).fill(0);
    return [
      ...stairs.map((_, i) => minWidth + i),
      maxWidth,
      ...stairs.map((_, i) => minWidth + (stairs.length - i - 1)),
    ];
  }, []);

  const [tileGrid, setTileGrid] = useState(
    rowWidths.map(
      (w) =>
        Array(w)
          .fill(0)
          .map(() => ({ type: "blank" })) as TileData[],
    ),
  );
  const [tileFocused, setTileFocused] = useState({ row: -1, col: -1 });
  useEffect(() => {
    const getNextTile = (row: number, col: number) => {
      if (col + 1 < rowWidths[row]) return { row, col: col + 1 };
      if (row + 1 < rowWidths.length) return { row: row + 1, col: 0 };
      return { row: -1, col: -1 };
    };
    const getNextNonBlankTile = (currRow: number, currCol: number) => {
      let next = { row: currRow, col: currCol };
      do {
        next = getNextTile(next.row, next.col);
      } while (
        next.col != -1 &&
        next.row != -1 &&
        tileGrid[next.row][next.col].type === "blank"
      );
      return next;
    };
    function handleKeyDown(e: KeyboardEvent) {
      const updateDiceNum = (
        update: (current?: number) => number | undefined,
      ) => {
        const { col, row } = tileFocused;
        if (col != -1 && row != -1) {
          setTileGrid((grid) => {
            const current = grid[row][col].diceNumber;
            if (current == "hide") return grid;
            grid[row][col].diceNumber = update(current);
            return [...grid];
          });
        }
      };
      if (allowedKeys.includes(e.key.toString())) {
        updateDiceNum((current) => (current ?? 0) * 10 + Number(e.key));
      } else if (e.key == "Enter") {
        setTileFocused(({ row, col }) => {
          return getNextNonBlankTile(row, col);
        });
      } else if (e.key == "Backspace") {
        updateDiceNum((curr) =>
          curr != null ? Math.round(curr / 10) : undefined,
        );
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [tileFocused, rowWidths]);
  const findNode = (gridRow: number, gridCol: number) =>
    tileGrid[gridRow]?.[gridCol];
  const graph = useMemo(() => {
    return tileGrid.map((row, rowIdx) => {
      const belowMiddleCeil = rowIdx > tileGrid.length / 2;
      const belowMiddleFloor = rowIdx >= Math.floor(tileGrid.length / 2);
      return [
        ...row.map((tile, colIdx) => {
          return {
            data: tile,
            topLeftEdge: findNode(
              rowIdx - 1,
              colIdx - (belowMiddleCeil ? 0 : 1),
            ),
            topRightEdge: findNode(
              rowIdx - 1,
              colIdx + (belowMiddleCeil ? 1 : 0),
            ),
            bottomLeftEdge: findNode(
              rowIdx + 1,
              colIdx - (belowMiddleFloor ? 1 : 0),
            ),
            bottomRightEdge: findNode(
              rowIdx + 1,
              colIdx + (belowMiddleFloor ? 0 : 1),
            ),
            leftEdge: findNode(rowIdx, colIdx - 1),
            rightEdge: findNode(rowIdx, colIdx + 1),
          } as TileGraphNode;
        }),
        {
          data: { type: "blank" },
          leftEdge: findNode(rowIdx, row.length - 1),
          topLeftEdge: belowMiddleFloor
            ? undefined
            : findNode(rowIdx - 1, row.length),
          bottomLeftEdge: belowMiddleFloor
            ? undefined
            : findNode(rowIdx + 1, row.length),
        } as TileGraphNode,
      ];
    });
  }, [tileGrid]);

  return (
    <div
      style={{
        position: "relative",
        height:
          (tileHeight - tileCornerY) * ((maxWidth - minWidth) * 2 + 1) +
          tileCornerY,
        width: tileWidth * maxWidth,
      }}
    >
      {tileGrid.map((tileRow, row) => (
        <div
          style={{
            position: "absolute",
            top: row * (tileHeight - tileCornerY),
            height: tileHeight,
            width: tileWidth * tileRow.length,
            left: ((maxWidth - tileRow.length) / 2) * tileWidth,
          }}
          key={row}
        >
          <TileRow
            showTileSelectOnBlank
            tileWidth={tileWidth}
            tiles={tileRow}
            onTileTypeChanged={(col, type) => {
              setTileGrid((grid) => {
                grid[row][col].type = type;
                return [...grid];
              });
            }}
            onTileClick={(col) =>
              setTileGrid((grid) => {
                grid[row][col].type = "blank";
                return [...grid];
              })
            }
            focusedTileIndex={tileFocused.row == row ? tileFocused.col : -1}
            onTileFocusRequested={(col) => setTileFocused({ col, row })}
            onDiceNumberChanged={(col, n) =>
              setTileGrid((grid) => {
                grid[row][col].diceNumber = n;
                return [...grid];
              })
            }
          />
          <div style={{ position: "relative" }}></div>
          {row <= (rowWidths.length - 1) / 2 &&
            graph[row]
              .filter((_, i) => i < graph[row].length - 1)
              .map((node, i) => (
                <NodeExpactancy
                  key={i}
                  n1={node.topLeftEdge}
                  n2={node.topRightEdge}
                  n3={node.data}
                  topOffset={0}
                  leftOffset={i * tileWidth + tileWidth / 2}
                />
              ))}
          {graph[row].map((node, i) => (
            <NodeExpactancy
              key={i}
              n1={node.topLeftEdge}
              n2={node.leftEdge}
              n3={node.data}
              topOffset={tileCornerY}
              leftOffset={i * tileWidth}
            />
          ))}

          {row >= (rowWidths.length - 1) / 2 &&
            graph[row].map((node, i) => (
              <NodeExpactancy
                key={i}
                n1={node.bottomLeftEdge}
                n2={node.leftEdge}
                n3={node.data}
                topOffset={tileHeight - tileCornerY}
                leftOffset={i * tileWidth}
              />
            ))}
          {row == rowWidths.length - 1 &&
            tileGrid[row].map((node, i) => (
              <NodeExpactancy
                key={i}
                n1={node}
                topOffset={tileHeight}
                leftOffset={i * tileWidth + tileWidth / 2}
              />
            ))}
        </div>
      ))}
    </div>
  );
}
