import Image from "next/image";
import { TileSelect } from "./TileSelect";
import { getNumCombinations, getTileHeight } from "@/lib/tile_util";
import { Tooltip } from "@mui/material";

export type TileType =
  | "wood"
  | "weed"
  | "sheep"
  | "clay"
  | "stone"
  | "desert"
  | "blank";

export function Tile({
  type,
  diceNumber,
  width,
  showTileSelectOnBlank,
  elevateOnHover,
  onTypeSelect,
  onClick,
  isDiceNumberFocused,
  onDiceNumberFocusRequested,
}: {
  type: TileType;
  diceNumber?: number | "hide";
  width: number;
  showTileSelectOnBlank?: boolean;
  elevateOnHover?: boolean;
  onTypeSelect?: (type: TileType) => void;
  onClick?: () => void;
  isDiceNumberFocused?: boolean;
  onDiceNumberFocusRequested?: () => void;
  onDiceNumberChanged?: (num: number) => void;
}) {
  const isDiceNumberValid =
    diceNumber == null ||
    (diceNumber != "hide" && diceNumber <= 12 && diceNumber >= 2);
  return (
    <div
      style={{ position: "relative" }}
      className={
        elevateOnHover
          ? "transition-transform duration-300 hover:scale-150"
          : ""
      }
      onClick={onClick}
    >
      <Image
        src={`/assets/${type}.png`}
        alt={type}
        width={width}
        height={getTileHeight(width)}
      />
      {diceNumber != "hide" && type != "blank" && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Tooltip
            title={
              isDiceNumberValid && diceNumber != null
                ? `${getNumCombinations(diceNumber)}/36`
                : ""
            }
          >
            <div
              style={{
                fontWeight: "bolder",
                width: "3rem",
                height: "3rem",
                backgroundColor: "#ffc16b",
                borderRadius: "1.5rem",
                color: "black",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 4,
                borderStyle: isDiceNumberValid ? "solid" : "dashed",
                borderColor: isDiceNumberFocused
                  ? "blue"
                  : !isDiceNumberValid
                    ? "red"
                    : "transparent",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onDiceNumberFocusRequested?.();
              }}
            >
              {diceNumber ?? "?"}
            </div>
          </Tooltip>
        </div>
      )}
      {onTypeSelect != null && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          {showTileSelectOnBlank === true && type === "blank" && (
            <TileSelect
              onSelect={(type) => {
                onTypeSelect(type);
                onDiceNumberFocusRequested?.();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
