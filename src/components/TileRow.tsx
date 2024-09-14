import { Tile, TileType } from "./Tile";

export type TileData = { type: TileType; diceNumber?: number | "hide" };

export function TileRow({
  tiles,
  tileWidth,
  showTileSelectOnBlank,
  hideMiddle,
  elevateOnHover,
  onTileTypeChanged,
  onTileClick,
  focusedTileIndex,
  onTileFocusRequested,
  onDiceNumberChanged,
}: {
  tiles: TileData[];
  tileWidth: number;
  showTileSelectOnBlank?: boolean;
  hideMiddle?: boolean;
  elevateOnHover?: boolean;
  onTileTypeChanged?: (column: number, type: TileType) => void;
  onTileClick?: (index: number) => void;
  focusedTileIndex?: number;
  onTileFocusRequested?: (column: number) => void;
  onDiceNumberChanged?: (tileColumn: number, num: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {tiles.map(({ type, diceNumber }, i) => (
        <div
          key={i}
          style={{
            visibility:
              hideMiddle === true && i === Math.floor(tiles.length / 2)
                ? "hidden"
                : "visible",
          }}
        >
          <Tile
            onClick={() => (type !== "blank" ? onTileClick?.(i) : null)}
            elevateOnHover={elevateOnHover}
            type={type}
            width={tileWidth}
            showTileSelectOnBlank={showTileSelectOnBlank}
            onTypeSelect={(type) => onTileTypeChanged?.(i, type)}
            diceNumber={diceNumber}
            isDiceNumberFocused={focusedTileIndex === i}
            onDiceNumberFocusRequested={() => onTileFocusRequested?.(i)}
            onDiceNumberChanged={(n) => onDiceNumberChanged?.(i, n)}
          />
        </div>
      ))}
    </div>
  );
}
