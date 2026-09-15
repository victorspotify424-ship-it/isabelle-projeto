import { Redis } from "@upstash/redis";
import { existsSync, mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type Order = {
  id: string;
  createdAt: string;
  product: string;
  theme: string;
  name: string;
  age: string;
  quantity: string;
  colors: string;
  eventDate: string;
  city: string;
  pickupDate: string;
  notes: string;
  status: "novo" | "em_andamento" | "concluido" | "cancelado";
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  active: boolean;
  order: number;
};

export type SiteContent = {
  heroTagline: string;
  heroParagraph: string;
  aboutText: string;
  testimonials: string[];
};

export const ORDER_STATUS_LABELS: Record<Order["status"], string> = {
  novo: "Novo",
  em_andamento: "Em andamento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const PREFIX = "labelle:";

const redis =
  process.env["KV_REST_API_URL"] && process.env["KV_REST_API_TOKEN"]
    ? new Redis({
        url: process.env["KV_REST_API_URL"],
        token: process.env["KV_REST_API_TOKEN"],
      })
    : null;

const DATA_DIR = path.join(process.cwd(), ".data");

function localFile(key: string): string {
  return path.join(DATA_DIR, `${key.replace(/[^a-z0-9-_]/gi, "_")}.json`);
}

async function readLocal<T>(file: string, fallback: T): Promise<T> {
  try {
    if (!existsSync(file)) return fallback;
    return JSON.parse(await readFile(file, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

async function writeLocal(file: string, value: string): Promise<void> {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  await writeFile(file, value, "utf-8");
}

export async function readJson<T>(key: string, fallback: T): Promise<T> {
  if (redis) {
    const value = await redis.get<T>(PREFIX + key);
    return value ?? fallback;
  }
  return readLocal(localFile(key), fallback);
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  if (redis) {
    await redis.set(PREFIX + key, value);
    return;
  }
  await writeLocal(localFile(key), JSON.stringify(value, null, 2));
}