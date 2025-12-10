"use server";

import { get, getAll } from "@vercel/edge-config";

type ScoreEntry = {
  username: string;
  displayName: string;
  clicks: number;
  timestamp: number;
};

const EDGE_CONFIG_API_URL = "https://api.vercel.com/v1/edge-config";
const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID;
const EDGE_CONFIG_TOKEN = process.env.EDGE_CONFIG_TOKEN;

async function readScores(): Promise<ScoreEntry[]> {
  // Try to read the "scores" key; fallback to empty array
  const existing = (await get<ScoreEntry[]>("scores")) ?? [];
  return Array.isArray(existing) ? existing : [];
}

async function writeScores(scores: ScoreEntry[]) {
  if (!EDGE_CONFIG_ID || !EDGE_CONFIG_TOKEN) {
    throw new Error("EDGE_CONFIG_ID or EDGE_CONFIG_TOKEN not set");
  }
  const res = await fetch(`${EDGE_CONFIG_API_URL}/${EDGE_CONFIG_ID}/items`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${EDGE_CONFIG_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          operation: "upsert",
          key: "scores",
          value: scores,
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Edge Config write failed: ${res.status} ${text}`);
  }
}

export async function GET() {
  try {
    const scores = await readScores();
    return new Response(JSON.stringify({ scores }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message ?? "Failed to read scores" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = typeof body?.username === "string" ? body.username : "";
    const displayName =
      typeof body?.displayName === "string" ? body.displayName : "";
    const clicks = Number(body?.clicks ?? 0);

    if (!username || clicks <= 0) {
      return new Response(
        JSON.stringify({ error: "username and clicks are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const scores = await readScores();
    scores.push({
      username,
      displayName: displayName || username,
      clicks,
      timestamp: Date.now(),
    });

    // sort desc, keep top 100
    scores.sort((a, b) => b.clicks - a.clicks);
    const trimmed = scores.slice(0, 100);

    await writeScores(trimmed);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message ?? "Failed to save score" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

