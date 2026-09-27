// Google Sheets API Service for Wedding RSVP & Wishes
// Supports multiple retrieval strategies with automatic column detection:
// 1. Google Apps Script Web App (doGet)
// 2. Google Sheets Visualization API (GViz json - when shared as viewer)
// 3. Google Sheets CSV Export (when shared as viewer)
// 4. Google Sheets API v4 with API Key

export interface RsvpSubmission {
  name: string;
  attending: "yes" | "no";
  guestSide: "bride" | "groom" | "both";
  guestCount: string;
  message: string;
  date?: string;
}

export interface SheetWish {
  name: string;
  side: string;
  wishes: string;
  date: string;
  attending?: string;
}

export const GOOGLE_SHEETS_CONFIG = {
  apiKey:
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY ||
    "AIzaSyC2bT4OYJ0u5yVeKIfoeQKgBe5kd1Fu6fE",
  spreadsheetId:
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID ||
    "1JsYLeR9cgxbffi-vr560eaAxD9gchj72VBCe9nY5-r0",
  sheetName: process.env.NEXT_PUBLIC_GOOGLE_SHEET_NAME || "Sheet1",
  scriptUrl:
    process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
    "https://script.google.com/macros/s/AKfycbz4GtvYx8ozXrNK7QKl7zMdLnICVIK7VqUEQzCv3GMjBTFtVJ2tv4eN8OhMWzof8IfiAw/exec",
};

/**
 * Simple CSV parser that respects quoted fields with commas and line breaks
 */
function parseCsv(csv: string): string[][] {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
  return lines.map((line) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  });
}

/**
 * Format raw date string into friendly Vietnamese timestamp
 */
function formatTimestamp(raw: string | undefined): string {
  if (!raw) return "Gần đây";
  const str = raw.trim();
  if (!str) return "Gần đây";

  // Check if it's already human-formatted (e.g. 27/09/2026 20:30)
  if (str.includes("/") || str.includes(":")) {
    return str;
  }

  // Parse ISO or standard date
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh",
    });
  }

  return str;
}

/**
 * Normalize guest side label
 */
function normalizeSide(side: string | undefined): string {
  if (!side) return "Bạn Cả Hai";
  const s = side.toLowerCase();
  if (s.includes("gái") || s === "bride") return "Nhà Gái";
  if (s.includes("trai") || s === "groom") return "Nhà Trai";
  return "Bạn Cả Hai";
}

/**
 * Auto-detect columns and extract wishes array from raw table rows
 */
function extractWishesFromTable(tableRows: any[][]): SheetWish[] {
  if (!tableRows || tableRows.length === 0) return [];

  // Determine if first row is a header
  const firstRow = tableRows[0].map((cell) =>
    String(cell || "").toLowerCase().trim()
  );
  let startIndex = 0;

  let nameCol = -1;
  let msgCol = -1;
  let dateCol = -1;
  let sideCol = -1;

  // Check if first row contains column headers
  firstRow.forEach((colHeader, idx) => {
    if (
      colHeader.includes("tên") ||
      colHeader.includes("name") ||
      colHeader.includes("họ")
    ) {
      nameCol = idx;
    } else if (
      colHeader.includes("chúc") ||
      colHeader.includes("message") ||
      colHeader.includes("wish") ||
      colHeader.includes("lời") ||
      colHeader.includes("nội dung")
    ) {
      msgCol = idx;
    } else if (
      colHeader.includes("thời gian") ||
      colHeader.includes("ngày") ||
      colHeader.includes("time") ||
      colHeader.includes("date") ||
      colHeader.includes("timestamp")
    ) {
      dateCol = idx;
    } else if (
      colHeader.includes("phía") ||
      colHeader.includes("nhà") ||
      colHeader.includes("side")
    ) {
      sideCol = idx;
    }
  });

  if (nameCol !== -1 || msgCol !== -1) {
    // First row was recognized as a header
    startIndex = 1;
  }

  // Fallbacks if not recognized by header text
  if (nameCol === -1) nameCol = 1;
  if (msgCol === -1)
    msgCol = tableRows[0].length >= 6 ? 5 : tableRows[0].length >= 3 ? 2 : 1;
  if (dateCol === -1) dateCol = 0;
  if (sideCol === -1 && tableRows[0].length >= 4) sideCol = 3;

  const wishes: SheetWish[] = [];

  for (let i = startIndex; i < tableRows.length; i++) {
    const row = tableRows[i];
    if (!row || !Array.isArray(row)) continue;

    const rawName = String(row[nameCol] || "").trim();
    if (!rawName) continue;

    // Skip if it looks like a header row
    if (
      [
        "họ và tên",
        "họ tên",
        "tên",
        "name",
        "full name",
        "họ và tên của bạn",
      ].includes(rawName.toLowerCase())
    ) {
      continue;
    }

    const rawDate = row[dateCol] ? String(row[dateCol]).trim() : "";
    const rawSide =
      sideCol !== -1 && row[sideCol]
        ? String(row[sideCol]).trim()
        : "Bạn Cả Hai";
    const rawMsg =
      msgCol !== -1 && row[msgCol] ? String(row[msgCol]).trim() : "";

    wishes.push({
      date: formatTimestamp(rawDate),
      name: rawName,
      side: normalizeSide(rawSide),
      wishes: rawMsg || "Chúc hai bạn trăm năm hạnh phúc, mãi mãi bên nhau!",
      attending: "yes",
    });
  }

  return wishes.reverse(); // Newest entries first
}

/**
 * Fetch wishes list from Google Sheet via multiple fallback strategies
 */
export async function fetchWishesFromSheet(): Promise<SheetWish[]> {
  const { apiKey, spreadsheetId, sheetName, scriptUrl } = GOOGLE_SHEETS_CONFIG;

  // Strategy 1: Google Apps Script Web App (doGet)
  if (scriptUrl) {
    try {
      const res = await fetch(scriptUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
        redirect: "follow",
        cache: "no-store",
      });

      if (res.ok) {
        const text = await res.text();
        if (text && !text.includes("<!DOCTYPE html>")) {
          const json = JSON.parse(text);
          const list = Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json)
            ? json
            : null;

          if (list && list.length > 0) {
            return list
              .map((item: any) => ({
                date: formatTimestamp(item.date || item.timestamp || item.time),
                name: String(item.name || "").trim(),
                attending: item.attending || "yes",
                side: normalizeSide(item.side || item.guestSide),
                wishes: String(item.wishes || item.message || "").trim(),
              }))
              .filter((w: SheetWish) => w.name.length > 0);
          }
        }
      }
    } catch (err) {
      console.warn("Apps Script GET error:", err);
    }
  }

  // Strategy 2: Google Visualization API (GViz JSON)
  // Works when Google Sheet link is shared as "Anyone with the link can view"
  if (spreadsheetId) {
    try {
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`;
      const res = await fetch(gvizUrl, {
        redirect: "follow",
        cache: "no-store",
      });

      if (res.ok) {
        const text = await res.text();
        const match = text.match(
          /google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/
        );
        if (match && match[1]) {
          const json = JSON.parse(match[1]);
          const rows = json?.table?.rows;
          if (Array.isArray(rows) && rows.length > 0) {
            // Flatten GViz cells: cell.f (formatted) or cell.v (value)
            const rawTable: any[][] = rows.map((r) =>
              Array.isArray(r.c)
                ? r.c.map((cell: any) =>
                    cell ? cell.f !== undefined ? cell.f : cell.v : ""
                  )
                : []
            );

            const wishes = extractWishesFromTable(rawTable);
            if (wishes.length > 0) {
              return wishes;
            }
          }
        }
      }
    } catch (gvizErr) {
      console.warn("GViz fetch error:", gvizErr);
    }
  }

  // Strategy 3: Google Sheets CSV Export
  if (spreadsheetId) {
    try {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
      const res = await fetch(csvUrl, {
        redirect: "follow",
        cache: "no-store",
      });

      if (res.ok) {
        const csvText = await res.text();
        if (!csvText.includes("<!DOCTYPE html>") && !csvText.includes("<html")) {
          const rows = parseCsv(csvText);
          const wishes = extractWishesFromTable(rows);
          if (wishes.length > 0) {
            return wishes;
          }
        }
      }
    } catch (csvErr) {
      console.warn("CSV fetch error:", csvErr);
    }
  }

  // Strategy 4: Google Sheets API v4 with API Key
  if (spreadsheetId && apiKey) {
    try {
      const range = encodeURIComponent(`${sheetName}!A1:F`);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.values) && data.values.length > 0) {
          const wishes = extractWishesFromTable(data.values);
          if (wishes.length > 0) {
            return wishes;
          }
        }
      }
    } catch (apiErr) {
      console.warn("Google Sheets API error:", apiErr);
    }
  }

  return [];
}

/**
 * Save an RSVP submission
 */
export async function submitRsvp(
  data: RsvpSubmission
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error("Submit RSVP error:", err);
    return { success: false, message: "Lỗi kết nối máy chủ" };
  }
}

/**
 * Fetch total likes from Google Sheet (tab Likes)
 */
export async function fetchLikesFromSheet(): Promise<number> {
  const { spreadsheetId, scriptUrl } = GOOGLE_SHEETS_CONFIG;
  const likesTab = "Likes";

  // 1. Try Apps Script GET with ?action=getLikes
  if (scriptUrl) {
    try {
      const res = await fetch(`${scriptUrl}?action=getLikes`, {
        method: "GET",
        headers: { Accept: "application/json" },
        redirect: "follow",
        cache: "no-store",
      });

      if (res.ok) {
        const text = await res.text();
        if (text && !text.includes("<!DOCTYPE html>")) {
          const json = JSON.parse(text);
          if (typeof json?.likes === "number") {
            return json.likes;
          }
        }
      }
    } catch (err) {
      console.warn("Apps Script getLikes error:", err);
    }
  }

  // 2. Try Google Sheets GViz with &sheet=Likes
  if (spreadsheetId) {
    try {
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${likesTab}`;
      const res = await fetch(gvizUrl, { redirect: "follow", cache: "no-store" });
      if (res.ok) {
        const text = await res.text();
        const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
        if (match && match[1]) {
          const json = JSON.parse(match[1]);
          const rows = json?.table?.rows;
          if (Array.isArray(rows) && rows.length > 0) {
            // Check cell values for counter
            const firstCell = rows[0]?.c?.[1]?.v ?? rows[0]?.c?.[0]?.v;
            if (typeof firstCell === "number") {
              return firstCell;
            }
            return 1024 + rows.length;
          }
        }
      }
    } catch (gvizErr) {
      console.warn("GViz likes fetch error:", gvizErr);
    }
  }

  return 1024;
}

/**
 * Submit like count to Google Sheet (tab Likes)
 */
export async function submitLikeToSheet(
  count: number = 1
): Promise<{ success: boolean; likes: number }> {
  const { scriptUrl } = GOOGLE_SHEETS_CONFIG;

  if (scriptUrl) {
    try {
      const res = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "like",
          count,
          timestamp: new Date().toISOString(),
        }),
        redirect: "follow",
      });

      if (res.ok) {
        const text = await res.text();
        if (text && !text.includes("<!DOCTYPE html>")) {
          const json = JSON.parse(text);
          if (typeof json?.likes === "number") {
            return { success: true, likes: json.likes };
          }
        }
      }
    } catch (err) {
      console.warn("Apps Script submitLike error:", err);
    }
  }

  return { success: true, likes: 1024 + count };
}

