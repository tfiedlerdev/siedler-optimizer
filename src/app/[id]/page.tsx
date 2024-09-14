"use client";
import { Board } from "@/components/Board";
import { TileData } from "@/components/TileRow";
import { getSession, updateSession } from "@/lib/session";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home({ params: { id } }: { params: { id: string } }) {
  const [state, setState] = useState<TileData[][] | undefined>(undefined);
  const onStateChanged = useCallback((state: TileData[][]) => {
    setState(state);
  }, []);
  const [initialState, setInitialState] = useState<TileData[][] | undefined>(
    undefined,
  );
  const router = useRouter();
  useEffect(() => {
    getSession(id)
      .then(({ state }) => setInitialState(state as TileData[][]))
      .catch((e) => {
        console.error(`Failed to load session with id ${id}: ${e}`);
        router.push("/");
      });
  }, [id, router]);

  const [updateTargetTime, setUpdateTargetTime] = useState<
    { time: number } | undefined
  >();

  useEffect(() => {
    if (updateTargetTime != null) {
      setTimeout(
        () => setUpdateTargetTime((v) => (v == null ? undefined : { ...v })),
        1000,
      );
    }
  }, [updateTargetTime]);

  const updateTimerRef = useRef<number>();
  useEffect(() => {
    if (state != null) {
      console.log("Scheduling update");
      clearTimeout(updateTimerRef.current);
      setUpdateTargetTime({ time: new Date().getTime() + 5000 });
      updateTimerRef.current = window.setTimeout(() => {
        updateSession(id, state);
        setUpdateTargetTime(undefined);
      }, 5000);
    }
  }, [state, id, updateTimerRef]);

  return (
    <div>
      <main>
        <div className="m-10 flex items-center justify-center h-screen flex-col">
          {initialState == null ? (
            <CircularProgress />
          ) : (
            <>
              {updateTargetTime == null && <p>State Uploaded</p>}
              {updateTargetTime != null && (
                <p>
                  Uploading state in{" "}
                  {Math.round(
                    (updateTargetTime.time - new Date().getTime()) / 1000,
                  )}
                  s
                </p>
              )}
              <Board
                onStateChanged={onStateChanged}
                initialState={initialState}
              />
            </>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
