"use client";
import { Board } from "@/components/Board";

export default function Home() {
  return (
    <div>
      <main>
        <div className="m-10 flex items-center justify-center h-screen">
          <Board />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
