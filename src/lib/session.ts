"use server";

import { TileData } from "@/components/TileRow";
import prisma from "./prisma";

export async function createSession() {
  return await prisma.session.create({ data: { state: [] } });
}

export async function getSession(id: string) {
  return await prisma.session.findUniqueOrThrow({ where: { id } });
}

export async function updateSession(id: string, state: TileData[][]) {
  return await prisma.session.update({ where: { id }, data: { state } });
}
