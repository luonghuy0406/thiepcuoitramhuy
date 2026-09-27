// Google Sheets API Service for Wedding RSVP & Wishes
// Uses Google Sheets API v4 with API Key & Spreadsheet ID, with Apps Script fallback for frictionless writes

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
 * Fetch wishes list from Google Sheet via Google Sheets API v4
 */
export async function fetchWishesFromSheet(): Promise<SheetWish[]> {
  const { apiKey, spreadsheetId, sheetName, scriptUrl } = GOOGLE_SHEETS_CONFIG;

  // 1. Try Apps Script Web App GET if configured
  if (scriptUrl) {
    try {
      const res = await fetch(scriptUrl, { method: "GET" });
      const json = await res.json();
      if (json && Array.isArray(json.data)) {
        return json.data;
      }
    } catch (err) {
      console.warn("Apps script fetch error:", err);
    }
  }

  // 2. Try Google Sheets API v4
  if (!spreadsheetId || !apiKey) {
    return [];
  }

  try {
    const range = encodeURIComponent(`${sheetName}!A2:F`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      console.warn("Google Sheets API error:", errJson);
      return [];
    }

    const data = await res.json();
    if (!data.values || !Array.isArray(data.values)) {
      return [];
    }

    // Map rows: [Timestamp, Name, Attending, Side, GuestCount, Message]
    return data.values
      .map((row: string[]) => ({
        date: row[0] || "Vừa xong",
        name: row[1] || "",
        attending: row[2] || "yes",
        side:
          row[3] === "Nhà Gái" || row[3] === "bride"
            ? "Nhà Gái"
            : row[3] === "Nhà Trai" || row[3] === "groom"
            ? "Nhà Trai"
            : "Bạn Cả Hai",
        wishes: row[5] || "",
      }))
      .filter((item: SheetWish) => item.name.trim().length > 0)
      .reverse(); // Latest wishes first
  } catch (err) {
    console.warn("Failed to fetch from Google Sheets API:", err);
    return [];
  }
}

/**
 * Save an RSVP submission
 */
export async function submitRsvp(data: RsvpSubmission): Promise<{ success: boolean; message?: string }> {
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
