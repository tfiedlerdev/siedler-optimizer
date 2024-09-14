import { getTileCornerY, getTileHeight } from "@/lib/tile_util";
import { TileType } from "./Tile";
import { TileData, TileRow } from "./TileRow";

const maxWidth = 3;

const rows: TileData[][] = [
  [
    { type: "stone", diceNumber: "hide" },
    { type: "wood", diceNumber: "hide" },
  ],
  [
    { type: "sheep", diceNumber: "hide" },
    { type: "blank", diceNumber: "hide" },
    { type: "weed", diceNumber: "hide" },
  ],
  [
    { type: "desert", diceNumber: "hide" },
    { type: "clay", diceNumber: "hide" },
  ],
];

const tileWidth = 60;
const tileHeight = getTileHeight(tileWidth);
const tileCornerY = getTileCornerY(tileHeight);
export function TileSelect({
  onSelect,
}: {
  onSelect: (type: TileType) => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: tileWidth * maxWidth,
        height: tileHeight * 3 - tileCornerY * 2,
      }}
    >
      {rows.map((types, i) => (
        <div
          style={{
            position: "absolute",
            top: i * (tileHeight - tileCornerY),
            height: tileHeight,
            width: tileWidth * types.length,
            left: ((maxWidth - types.length) / 2) * tileWidth,
          }}
          key={i}
        >
          <TileRow
            tiles={types}
            tileWidth={tileWidth}
            hideMiddle={i === 1}
            elevateOnHover
            onTileClick={(i) => onSelect(types[i].type)}
          />
        </div>
      ))}
    </div>
  );
}
