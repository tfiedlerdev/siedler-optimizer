import { getNumCombinations } from "@/lib/tile_util";
import { TileData } from "./TileRow";
import { Tooltip } from "@mui/material";
import Image from "next/image";
import { useMemo } from "react";
import { TileType } from "./Tile";

function SingleResourceExpectancy({
  resource,
  expectancy,
}: {
  resource: string;
  expectancy: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        margin: "0.5rem",
        fontWeight: "bold",
        fontSize: 15,
      }}
    >
      <Image
        alt="resource"
        src={`/assets/icons/${resource}.png`}
        width={20}
        height={30}
        style={{ marginRight: "1rem" }}
      />
      {expectancy.toFixed(2)}
    </div>
  );
}

function ResourceExpectancy({
  n1,
  n2,
  n3,
}: {
  n1?: TileData;
  n2?: TileData;
  n3?: TileData;
}) {
  const expectancy = useMemo(() => {
    const combinations: Map<TileType, number> = new Map();
    [n1, n2, n3]
      .filter((n) => n != null)
      .forEach((n: TileData) => {
        const { type, diceNumber } = n;
        if (diceNumber == "hide" || diceNumber == null || type === "desert")
          return;
        combinations.set(
          type,
          (combinations.get(type) ?? 0) + getNumCombinations(diceNumber),
        );
      });
    return Array.from(combinations.entries());
  }, [n1, n2, n3]);

  return (
    <div>
      {expectancy.map(([type, combis]) => (
        <SingleResourceExpectancy
          key={type}
          expectancy={combis / 36}
          resource={type}
        />
      ))}
    </div>
  );
}

const minWidth = 50;
const maxWidth = 200;
export function NodeExpactancy({
  n1,
  n2,
  n3,
  leftOffset: leftOffset,
  topOffset: topOffset,
}: {
  n1?: TileData;
  n2?: TileData;
  n3?: TileData;
  leftOffset?: number;
  topOffset?: number;
}) {
  const d1 = n1?.diceNumber == "hide" ? 0 : (n1?.diceNumber ?? 0);
  const d2 = n2?.diceNumber == "hide" ? 0 : (n2?.diceNumber ?? 0);
  const d3 = n3?.diceNumber == "hide" ? 0 : (n3?.diceNumber ?? 0);

  const expectedValue =
    (getNumCombinations(d1) + getNumCombinations(d2) + getNumCombinations(d3)) /
    36;

  const width = minWidth + (maxWidth - minWidth) * expectedValue;

  return (
    <div
      style={{
        position: "absolute",
        width,
        height: width,
        top: -width / 2 + (topOffset ?? 0),
        backgroundColor: `rgba(${Math.round(125 + 255 * expectedValue)},125,125,0.5)`,
        left: -width / 2 + (leftOffset ?? 0),
        zIndex: 4,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        visibility: expectedValue > 0 ? "visible" : "hidden",
      }}
    >
      <Tooltip title={<ResourceExpectancy n1={n1} n2={n2} n3={n3} />}>
        <div
          style={{
            color: "white",
            fontSize: Math.round(10 + expectedValue * 100),
          }}
        >
          {expectedValue.toFixed(2)}
        </div>
      </Tooltip>
    </div>
  );
}
