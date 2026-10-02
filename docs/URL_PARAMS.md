# Hướng Dẫn Sử Dụng URL Parameters - Thiệp Cưới Online

Tài liệu này hướng dẫn cách truyền tham số tên khách mời vào URL để thiệp cưới tự động hiển thị tên khách mời trang trọng.

---

## 1. Tham Số Được Hỗ Trợ

| Tham số | Tham số tương đương | Mục đích | Ví dụ | Mặc định khi bỏ trống |
| :--- | :--- | :--- | :--- | :--- |
| **`name`** | `to`, `guest`, `ten`, `u` | Tên khách mời cần mời đích danh | `Anh Huy`, `Bạn Nhật`, `Bác Hùng`, `Gia đình Bác Hùng` | `QUÝ KHÁCH` |
| **`opened`** | — | Bỏ qua phong bì, vào thẳng nội dung thiệp | `1` hoặc `true` | Cần ấn mở phong bì |

---

## 2. Vị Trí & Cách Hiển Thị Trên Thiệp

Dòng đầu tiên trên thiệp chính:
```
TRÂN TRỌNG KÍNH MỜI [TÊN KHÁCH MỜI] ĐẾN
CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI
```

- **Khi không có param**:
  ```
  TRÂN TRỌNG KÍNH MỜI QUÝ KHÁCH ĐẾN
  CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI
  ```
- **Khi có param `name=Anh Huy`**:
  ```
  TRÂN TRỌNG KÍNH MỜI ANH HUY ĐẾN
  CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI
  ```
- **Khi có param `name=Bác Hùng`**:
  ```
  TRÂN TRỌNG KÍNH MỜI BÁC HÙNG ĐẾN
  CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI
  ```
- **Khi có param `name=Gia đình Bác Hùng`**:
  ```
  TRÂN TRỌNG KÍNH MỜI GIA ĐÌNH BÁC HÙNG ĐẾN
  CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI
  ```

---

## 3. Các Ví Dụ Link Mẫu

- **Mặc định (chung)**:  
  `https://cinelove.me/?opened=1`
- **Mời bạn bè**:  
  `https://cinelove.me/?opened=1&name=Bạn+Nhật`
- **Mời anh / chị**:  
  `https://cinelove.me/?opened=1&name=Anh+Huy`  
  `https://cinelove.me/?opened=1&name=Chị+Mai`
- **Mời người lớn tuổi / gia đình**:  
  `https://cinelove.me/?opened=1&name=Bác+Hùng`  
  `https://cinelove.me/?opened=1&name=Gia+đình+Bác+Hùng`

---

## 4. Lưu Ý Dấu Cách
- Có thể dùng dấu `+` hoặc `%20` thay cho khoảng trắng giữa các chữ (ví dụ: `name=Anh+Huy` hoặc `name=Gia+đình+Bác+Hùng`).
- Trình duyệt và ứng dụng chat (Zalo, Messenger) đều tự động nhận diện tiếng Việt có dấu.
