// Google Sheets API Service for Wedding RSVP & Wishes
// Supports multiple retrieval strategies:
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
 * Simple CSV parser that respects quoted fields with commas
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

  // Check if it's already formatted (e.g. 27/09/2026 20:30)
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
            return list.map((item: any) => ({
              date: formatTimestamp(item.date || item.timestamp || item.time),
              name: String(item.name || "").trim(),
              attending: item.attending || "yes",
              side: normalizeSide(item.side || item.guestSide),
              wishes: String(item.wishes || item.message || "").trim(),
            })).filter((w: SheetWish) => w.name.length > 0);
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
        const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
        if (match && match[1]) {
          const json = JSON.parse(match[1]);
          const rows = json?.table?.rows;
          if (Array.isArray(rows) && rows.length > 0) {
            const wishes: SheetWish[] = [];
            for (const r of rows) {
              const c = r.c;
              if (!c || !Array.isArray(c)) continue;
              const rawDate = c[0]?.f || c[0]?.v;
              const rawName = c[1]?.v ? String(c[1].v).trim() : "";
              const rawAttending = c[2]?.v ? String(c[2].v).trim() : "yes";
              const rawSide = c[3]?.v ? String(c[3].v).trim() : "Bạn Cả Hai";
              const rawMsg = c[5]?.v
                ? String(c[5].v).trim()
                : c[4]?.v
                ? String(c[4].v).trim()
                : "";

              if (
                rawName &&
                !["họ và tên", "họ tên", "tên", "name"].includes(rawName.toLowerCase())
              ) {
                wishes.push({
                  date: formatTimestamp(rawDate ? String(rawDate) : undefined),
                  name: rawName,
                  attending: rawAttending,
                  side: normalizeSide(rawSide),
                  wishes: rawMsg,
                });
              }
            }

            if (wishes.length > 0) {
              return wishes.reverse(); // Newest entries first
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
          if (rows.length > 1) {
            const wishes: SheetWish[] = [];
            for (let i = 1; i < rows.length; i++) {
              const row = rows[i];
              const name = (row[1] || "").trim();
              if (
                name &&
                !["họ và tên", "họ tên", "tên", "name"].includes(name.toLowerCase())
              ) {
                wishes.push({
                  date: formatTimestamp(row[0]),
                  name,
                  attending: (row[2] || "").trim() || "yes",
                  side: normalizeSide(row[3]),
                  wishes: (row[5] || row[4] || "").trim(),
                });
              }
            }
            if (wishes.length > 0) {
              return wishes.reverse();
            }
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
      const range = encodeURIComponent(`${sheetName}!A2:F`);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.values) && data.values.length > 0) {
          return data.values
            .map((row: string[]) => ({
              date: formatTimestamp(row[0]),
              name: (row[1] || "").trim(),
              attending: row[2] || "yes",
              side: normalizeSide(row[3]),
              wishes: row[5] || row[4] || "",
            }))
            .filter((item: SheetWish) => item.name.length > 0)
            .reverse();
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
