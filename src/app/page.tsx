"use client";
import { createSession } from "@/lib/session";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    createSession().then(({ id }) => {
      router.push(`/${id}`);
    });
  }, [router]);
  return (
    <div>
      <main>
        <div className="m-10 flex items-center justify-center h-screen">
          <CircularProgress />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
