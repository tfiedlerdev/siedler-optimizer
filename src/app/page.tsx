"use client";
import { Board } from "@/components/Board";
import { Tile, TileType } from "@/components/Tile";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <main>
        <div className="m-10">
          <Board />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
