# Website CÔNG TY CỔ PHẦN MAY ĐÔNG THÀNH (DOTHEGAMEX)

Website giới thiệu doanh nghiệp **song ngữ Việt / Anh** cho Công ty Cổ phần May Đông Thành — hơn 25 năm kinh nghiệm sản xuất, gia công may mặc OEM/CMT tại Quảng Ngãi.

- **Phong cách thiết kế:** Trust & Authority (navy `#0F172A` + xanh CTA `#0369A1`), font Poppins / Open Sans.
- **Công nghệ:** Node.js + Express (server + API liên hệ) · HTML/CSS/JS thuần (không cần framework, không cần build phức tạp).
- **Đặc điểm:** Song ngữ VI/EN (lưu lựa chọn), responsive (375 → 1440px), SEO cơ bản (meta, Open Graph, schema.org, sitemap, robots), form liên hệ gửi email thật + nút gọi/Zalo, hiệu ứng cuộn mượt, tôn trọng `prefers-reduced-motion`.

> ⚠️ **Máy hiện tại chưa cài Node.js.** Toàn bộ mã nguồn đã sẵn sàng. Website **xem/deploy được ngay ở dạng tĩnh** (không bắt buộc chạy Node). Lớp Node.js chỉ cần khi bạn muốn form liên hệ **gửi email thật**. Xem mục [Cài đặt Node.js](#1-cài-đặt-nodejs-một-lần).

---

## 📁 Cấu trúc dự án

```
đông thành/
├── public/                 ← TOÀN BỘ WEBSITE (deploy thư mục này)
│   ├── index.html          Trang chủ
│   ├── about.html          Giới thiệu / lịch sử
│   ├── capabilities.html   Năng lực sản xuất (B2B)
│   ├── careers.html        Tuyển dụng
│   ├── contact.html        Liên hệ (form + bản đồ)
│   ├── 404.html            Trang lỗi
│   ├── robots.txt · sitemap.xml
│   ├── css/styles.css      Hệ thống thiết kế
│   ├── js/app.js           Song ngữ + header/footer + tương tác + form
│   └── assets/             Logo (SVG) + ảnh minh họa
├── server.js               Express server + API /api/contact (Nodemailer)
├── package.json
├── .env.example            Mẫu cấu hình email (sao chép thành .env)
├── .gitignore
└── README.md
```

Header, footer và nút liên hệ nổi được sinh **một nơi duy nhất** trong `public/js/app.js` (biến `CO` và `NAV`) → sửa 1 lần, áp dụng mọi trang.

---

## ✏️ Chỉnh sửa nội dung (không cần lập trình)

| Muốn đổi | Sửa ở đâu |
|---|---|
| **Logo** | Thay `public/assets/favicon.svg` bằng logo thật (SVG/PNG). Đổi biến `LOGO_SVG` trong `public/js/app.js` nếu dùng ảnh: `<img class="brand__logo" src="assets/logo.png">`. |
| **Số điện thoại, email, địa chỉ, MST** | Biến `CO` ở đầu `public/js/app.js`. |
| **Ảnh nhà máy / sản phẩm** | Thay các file trong `public/assets/img/` (giữ nguyên tên, hoặc đổi `src` trong file HTML tương ứng). Nên dùng ảnh thật `.webp`/`.jpg` kích thước ~1600px. |
| **Chữ trên trang** | Sửa trực tiếp trong các file `.html`. Mỗi phần tử song ngữ có: nội dung tiếng Việt hiển thị + thuộc tính `data-en="..."` chứa bản tiếng Anh. Sửa cả hai. |
| **Màu sắc / font** | Các biến `--color-*`, `--font-*` ở đầu `public/css/styles.css`. |
| **Menu** | Mảng `NAV` trong `public/js/app.js`. |

---

## 💻 Chạy website tại máy

### Cách A — Xem tĩnh nhanh (không cần Node)
Mở trực tiếp `public/index.html` bằng trình duyệt, hoặc chạy một server tĩnh bất kỳ. Ví dụ dùng Python (có sẵn trên macOS):

```bash
cd public
python3 -m http.server 8123
```
Mở http://localhost:8123 . *(Ở chế độ này form liên hệ tự chuyển sang mở email/Zalo cho khách.)*

### Cách B — Chạy đầy đủ với Node (form gửi email thật)

#### 1. Cài đặt Node.js (một lần)
Tải bản **LTS** tại https://nodejs.org (macOS: có thể dùng `brew install node`). Kiểm tra:
```bash
node -v && npm -v
```

#### 2. Cài thư viện & chạy
```bash
npm install
npm start
```
Mở http://localhost:3000 .

#### 3. Bật gửi email cho form liên hệ
```bash
cp .env.example .env
```
Mở `.env` và điền thông tin SMTP (email doanh nghiệp, hoặc Gmail + *App Password*). Chạy lại `npm start`.
> Nếu **không** cấu hình `.env`, API vẫn hoạt động ở *chế độ demo* (ghi log, không gửi mail), và giao diện tự động fallback sang mở email/Zalo.

---

## 🚀 Đưa mã nguồn lên GitHub

```bash
git init
git add .
git commit -m "Khởi tạo website May Đông Thành (DOTHEGAMEX)"
git branch -M main
git remote add origin https://github.com/<tài-khoản>/dongthanh-website.git
git push -u origin main
```
> `.gitignore` đã loại `node_modules` và `.env` (không đẩy mật khẩu email lên GitHub).

---

## 🌐 Deploy lên Hostinger

Có 2 cách tùy gói dịch vụ của bạn.

### Cách 1 — Shared Hosting (khuyến nghị, đơn giản & rẻ nhất) — chạy dạng tĩnh
Website hoạt động hoàn hảo dạng tĩnh; chỉ cần tải nội dung thư mục `public/` lên.

1. Đăng nhập **hPanel** → **Websites** → **File Manager** (hoặc dùng FTP).
2. Vào thư mục `public_html/`.
3. Tải **toàn bộ nội dung bên trong** `public/` lên `public_html/` (không tải cả thư mục `public`, mà tải các file/thư mục *bên trong* nó: `index.html`, `css/`, `js/`, `assets/`, ...).
4. Trỏ tên miền của bạn về hosting (mua domain rồi cập nhật `canonical`, `og:url` trong các file HTML và `sitemap.xml`/`robots.txt` từ `dongthanh.example.com` sang domain thật).
5. Bật **SSL miễn phí** trong hPanel (Security → SSL).

*Kết nối GitHub (tùy chọn):* hPanel → **Git** → thêm repository → deploy vào `public_html`. Mỗi lần push chỉ cần bấm cập nhật.

> Ở cách này, form liên hệ dùng cơ chế fallback (mở email/Zalo). Muốn gửi email tự động từ server, dùng Cách 2.

### Cách 2 — Node.js Hosting / VPS — chạy Express (form gửi email thật)
Yêu cầu gói **VPS** hoặc hosting hỗ trợ Node.js.

1. Đẩy mã nguồn lên (Git hoặc SSH/SFTP).
2. Trên server:
   ```bash
   npm install --omit=dev
   cp .env.example .env   # rồi điền SMTP
   ```
3. Chạy nền bằng PM2 (khuyến nghị):
   ```bash
   npm install -g pm2
   pm2 start server.js --name dothegamex
   pm2 save && pm2 startup
   ```
4. Cấu hình domain/reverse proxy (Nginx) trỏ về `http://localhost:3000`, bật SSL.

---

## ✅ Việc cần làm trước khi chạy chính thức (production)

- [ ] Thay logo thật (`favicon.svg` + `LOGO_SVG`).
- [ ] Thay ảnh minh họa bằng ảnh nhà máy / sản phẩm / đội ngũ thật.
- [ ] Kiểm tra lại số điện thoại, email, địa chỉ (biến `CO`).
- [ ] Cập nhật domain thật trong: `canonical`, `og:url` (mọi file HTML), `sitemap.xml`, `robots.txt`.
- [ ] (Nếu chạy Node) cấu hình `.env` SMTP và thử gửi form.
- [ ] Kiểm tra vị trí bản đồ tại `contact.html` (sửa toạ độ/địa chỉ trong `src` của iframe nếu cần).
- [ ] Bật SSL (https) trên Hostinger.
- [ ] Đăng ký Google Search Console + gửi `sitemap.xml`.

---

## 📞 Thông tin công ty
- **CÔNG TY CỔ PHẦN MAY ĐÔNG THÀNH (DOTHEGAMEX)**
- Thành lập: 07/04/1999 · MST: 4300269721
- 32 Lê Văn Sỹ, Phường Trần Phú, TP. Quảng Ngãi, Tỉnh Quảng Ngãi
- Hotline: 0255.3829.714
