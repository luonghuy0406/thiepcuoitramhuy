import { NextResponse } from "next/server";
import { fetchLikesFromSheet, submitLikeToSheet } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// In-memory counter baseline
let serverLikesCache = 1024;
let lastSyncedAt = 0;

export async function GET() {
  try {
    const now = Date.now();
    // Cache for 5 seconds to prevent hammering sheet on rapid reloads
    if (now - lastSyncedAt > 5000) {
      const sheetLikes = await fetchLikesFromSheet();
      if (sheetLikes && sheetLikes >= 1024) {
        serverLikesCache = Math.max(serverLikesCache, sheetLikes);
        lastSyncedAt = now;
      }
    }

    return NextResponse.json({
      success: true,
      likes: serverLikesCache,
    });
  } catch (err) {
    console.error("GET /api/likes error:", err);
    return NextResponse.json({
      success: true,
      likes: serverLikesCache,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const count = typeof body.count === "number" && body.count > 0 ? body.count : 1;

    // Immediately increment server cache
    serverLikesCache += count;

    // Submit to Google Sheet (tab 'Likes') in background / sync
    submitLikeToSheet(count)
      .then((res) => {
        if (res.success && res.likes && res.likes >= serverLikesCache) {
          serverLikesCache = res.likes;
        }
      })
      .catch((err) => {
        console.warn("Failed to persist like to Google Sheet:", err);
      });

    return NextResponse.json({
      success: true,
      likes: serverLikesCache,
    });
  } catch (err) {
    console.error("POST /api/likes error:", err);
    return NextResponse.json(
      { success: false, likes: serverLikesCache },
      { status: 500 }
    );
  }
}
