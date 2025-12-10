"use server";

import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

type ScorePayload = {
  username: string;
  displayName: string;
  clicks: number;
};

const ZSET_KEY = "scores:zset";
const HASH_PREFIX = "scores:hash:";
const MAX_ENTRIES = 100;

function envReady() {
  return (
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN &&
    process.env.KV_URL
  );
}

export async function POST(request: Request) {
  if (!envReady()) {
    return NextResponse.json(
      { error: "KV is not configured (set KV_REST_API_URL, KV_REST_API_TOKEN, KV_URL)" },
      { status: 500 }
    );
  }

  let body: ScorePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const username = (body.username || "").trim();
  const displayName = (body.displayName || "").trim();
  const clicks = Number(body.clicks);

  if (!username || !displayName || !Number.isFinite(clicks) || clicks < 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const timestamp = Date.now();

  // Store the score and keep zset sorted by clicks
  await kv.hset(HASH_PREFIX + id, {
    id,
    username,
    displayName,
    clicks,
    timestamp,
  });
  await kv.zadd(ZSET_KEY, { score: clicks, member: id });

  // Trim leaderboard to top MAX_ENTRIES
  await kv.zremrangebyrank(ZSET_KEY, 0, -(MAX_ENTRIES + 1));

  return NextResponse.json({ ok: true, id });
}

export async function GET() {
  if (!envReady()) {
    return NextResponse.json(
      { error: "KV is not configured (set KV_REST_API_URL, KV_REST_API_TOKEN, KV_URL)" },
      { status: 500 }
    );
  }

  // Get top scores (highest first)
  const ids = await kv.zrange<string[]>(ZSET_KEY, 0, MAX_ENTRIES - 1, {
    rev: true,
  });

  const rows = await Promise.all(
    ids.map(async (id) => {
      const data = (await kv.hgetall<{
        id: string;
        username: string;
        displayName: string;
        clicks: number;
        timestamp: number;
      }>(HASH_PREFIX + id)) || {};
      return data;
    })
  );

  // Filter out empty entries in case of missing hashes
  const leaderboard = rows.filter(
    (r): r is {
      id: string;
      username: string;
      displayName: string;
      clicks: number;
      timestamp: number;
    } => Boolean(r && (r as any).username)
  );

  return NextResponse.json({ leaderboard });
}

