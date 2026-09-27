import { NextResponse } from "next/server";
import { GOOGLE_SHEETS_CONFIG, fetchWishesFromSheet } from "@/lib/google-sheets";

export async function GET() {
  try {
    const wishes = await fetchWishesFromSheet();
    return NextResponse.json({ success: true, data: wishes });
  } catch (err) {
    console.error("GET /api/rsvp error:", err);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, attending, guestSide, guestCount, message } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, message: "Họ và tên là bắt buộc" },
        { status: 400 }
      );
    }

    const { apiKey, spreadsheetId, sheetName, scriptUrl } = GOOGLE_SHEETS_CONFIG;
    let savedToSheet = false;

    // 1. Primary Write Method: Google Apps Script Web App (Fastest, zero-auth required for guests)
    if (scriptUrl) {
      try {
        const scriptRes = await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            attending,
            guestSide,
            guestCount,
            message: message?.trim() || "",
            timestamp: new Date().toISOString(),
          }),
        });

        if (scriptRes.ok) {
          savedToSheet = true;
        }
      } catch (scriptErr) {
        console.warn("Apps Script submission error:", scriptErr);
      }
    }

    // 2. Secondary Write Method: Google Sheets API v4 with API Key
    if (!savedToSheet && spreadsheetId && apiKey) {
      try {
        const range = encodeURIComponent(`${sheetName}!A:F`);
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&key=${apiKey}`;

        const appendRes = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            values: [
              [
                new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
                name.trim(),
                attending === "yes" ? "Tham dự" : "Gửi lời chúc",
                guestSide === "bride" ? "Nhà Gái" : guestSide === "groom" ? "Nhà Trai" : "Bạn Cả Hai",
                guestCount,
                message?.trim() || "",
              ],
            ],
          }),
        });

        if (appendRes.ok) {
          savedToSheet = true;
        } else {
          const errData = await appendRes.json().catch(() => ({}));
          console.warn("Google Sheets API Append error:", errData);
        }
      } catch (apiErr) {
        console.warn("Google Sheets API call failed:", apiErr);
      }
    }

    return NextResponse.json({
      success: true,
      savedToSheet,
      message: savedToSheet
        ? "Đã lưu vào Google Sheet thành công"
        : "Đã ghi nhận lời chúc (cần cấu hình thêm Google Sheet ID hoặc Script URL để tự động đồng bộ)",
    });
  } catch (err) {
    console.error("POST /api/rsvp error:", err);
    return NextResponse.json(
      { success: false, message: "Lỗi xử lý yêu cầu" },
      { status: 500 }
    );
  }
}
