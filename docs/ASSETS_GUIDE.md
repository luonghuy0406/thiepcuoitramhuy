# Hướng Dẫn Quản Lý & Thay Thế Assets (Ảnh / Video / Âm Thanh)

Tất cả các tài nguyên đa phương tiện của website được đặt trong thư mục `public/`.
Tên file đã được chuẩn hóa theo mục đích sử dụng rõ ràng, dễ dàng thay thế chỉ bằng cách ghi đè file có cùng tên và định dạng.

---

## 1. Danh Sách & Vị Trí Assets Trong `public/assets/`

### 💍 Cô Dâu & Chú Rể
| Tên file | Mô tả | Kích thước / Tỉ lệ khuyến nghị |
| :--- | :--- | :--- |
| `groom-avatar.jpg` | Ảnh đại diện chú rể | Vuông `1:1` (khuyến nghị 400x400 trở lên) |
| `bride-avatar.jpg` | Ảnh đại diện cô dâu | Vuông `1:1` (khuyến nghị 400x400 trở lên) |
| `groom-qr.png` | Mã VietQR tài khoản ngân hàng chú rể | Chuẩn VietQR `540x660` |
| `bride-qr.png` | Mã VietQR tài khoản ngân hàng cô dâu | Chuẩn VietQR `540x660` |

### ✉️ Bìa Phong Bì & Mở Thiệp (Envelope Modal)
| Tên file | Mô tả | Kích thước / Ghi chú |
| :--- | :--- | :--- |
| `envelope-poster.jpg` | Poster hiển thị tức thì lúc tải trang | Tỉ lệ 9:16 (dọc điện thoại) |
| `envelope-video.mp4` | Video mở cánh cửa phong bì có kênh Alpha | Định dạng MP4 H.264 (side-by-side alpha mask) |
| `envelope-wax-seal.png` | Dấu sáp niêm phong đỏ (phiên bản V1) | PNG trong suốt (khuyến nghị 200x200) |
| `envelope-card-photo.jpg` | Ảnh thiệp cưới nhô lên từ bao thư (phiên bản V1) | Tỉ lệ ngang `16:9` hoặc `3:2` |

### 🌟 Trang Chủ / Phần Đầu (Hero Section)
| Tên file | Mô tả | Kích thước / Tỉ lệ khuyến nghị |
| :--- | :--- | :--- |
| `hero-couple.png` | Ảnh cưới chính đôi uyên ương trong khung vòm | Tỉ lệ `4:5` (khuyến nghị 800x1000) |
| `hero-floral-bg.jpg` | Họa tiết hoa pastel mờ phía trên cùng | Khổ rộng chất lượng cao |
| `song-hy-emblem.png` | Biểu tượng Song Hỷ hoa mẫu đơn | PNG trong suốt `1:1` |

### 🖼️ Album Ảnh Cưới (Gallery - 9 Ảnh)
Các ảnh hiển thị trong lưới trình chiếu album ảnh kỷ niệm:
| Tên file | Vị trí | Tỉ lệ khuyến nghị |
| :--- | :--- | :--- |
| `gallery-01.jpg` | Ảnh album 1 | Dọc `3:4` hoặc `4:5` |
| `gallery-02.png` | Ảnh album 2 | Dọc `3:4` hoặc `4:5` |
| `gallery-03.jpg` | Ảnh album 3 | Dọc `3:4` hoặc `4:5` |
| `gallery-04.jpg` | Ảnh album 4 | Dọc `3:4` hoặc `4:5` |
| `gallery-05.jpg` | Ảnh album 5 | Dọc `3:4` hoặc `4:5` |
| `gallery-06.jpg` | Ảnh album 6 | Dọc `3:4` hoặc `4:5` |
| `gallery-07.jpg` | Ảnh album 7 | Dọc `3:4` hoặc `4:5` |
| `gallery-08.jpg` | Ảnh album 8 | Dọc `3:4` hoặc `4:5` |
| `gallery-09.jpg` | Ảnh album 9 | Dọc `3:4` hoặc `4:5` |

### 🌐 Chia Sẻ Mạng Xã Hội (Facebook, Zalo, iMessage)
| Tên file | Mô tả | Kích thước khuyến nghị |
| :--- | :--- | :--- |
| `wedding-og-share.jpg` | Ảnh thumbnail khi chia sẻ link thiệp | Chuẩn OpenGraph `1200x630` |

### 🌸 Nền Trang Trí Các Section (Tùy chọn)
| Tên file | Mô tả |
| :--- | :--- |
| `program-bg.jpg` | Ảnh nền nhẹ cho khung lịch trình tiệc cưới |
| `venue-bg.png` | Ảnh nền nhẹ cho khung địa điểm bản đồ |

---

## 2. Nhạc Nền Trong `public/audio/`

| Tên file | Mô tả | Ghi chú |
| :--- | :--- | :--- |
| `wedding-music.mp3` | Nhạc nền phát tự động khi mở thiệp | Định dạng MP3 (được nén chuẩn web, dung lượng nhẹ) |

---

## 3. Cách Thay Thế Ảnh / Nhạc Rất Đơn Giản

1. **Chuẩn bị file mới** có nội dung bạn muốn thay thế.
2. **Đổi tên file mới** trùng với tên file trong bảng trên (ví dụ: `hero-couple.png`, `wedding-music.mp3`, `groom-qr.png`...).
3. **Copy đè file mới** vào đúng thư mục `public/assets/` hoặc `public/audio/`.
4. Không cần phải sửa code! Hệ thống sẽ tự động cập nhật ngay lập tức.
