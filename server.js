/**
 * MAY ĐÔNG THÀNH (DOTHEGAMEX) — Express server
 * -------------------------------------------------------------
 * - Phục vụ website tĩnh trong thư mục /public
 * - Xử lý form liên hệ qua POST /api/contact (Nodemailer)
 *
 * Chạy:  npm install  &&  npm start
 * Cấu hình email: sao chép .env.example -> .env và điền thông tin SMTP.
 * Nếu KHÔNG cấu hình SMTP, API vẫn nhận dữ liệu và ghi log (chế độ demo),
 * còn giao diện sẽ tự động chuyển sang mở email/Zalo cho khách.
 */

require('dotenv').config();

const path = require('path');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

/* ----------------------------- Middleware ----------------------------- */
app.use(compression());
app.use(
  helmet({
    // Cho phép tài nguyên nội bộ + Google Fonts; tắt CSP quá chặt để đơn giản khi deploy.
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));

/* --------------------------- Email transport -------------------------- */
function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/* --------------------------- Contact endpoint ------------------------- */
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 phút
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.' },
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim();
    const phone = String(req.body.phone || '').trim();
    const company = String(req.body.company || '').trim();
    const subject = String(req.body.subject || '').trim();
    const message = String(req.body.message || '').trim();

    // Honeypot chống spam bot (trường ẩn 'website')
    if (String(req.body.website || '').trim() !== '') {
      return res.json({ ok: true }); // im lặng với bot
    }

    if (!name || !message || (!email && !phone)) {
      return res
        .status(400)
        .json({ ok: false, error: 'Vui lòng nhập họ tên, nội dung và ít nhất email hoặc số điện thoại.' });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Email không hợp lệ.' });
    }

    const transport = createTransport();
    const to = process.env.CONTACT_TO || process.env.SMTP_USER;

    const html = `
      <h2>Liên hệ mới từ website DOTHEGAMEX</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
        <tr><td><b>Họ tên</b></td><td>${escapeHtml(name)}</td></tr>
        <tr><td><b>Email</b></td><td>${escapeHtml(email) || '-'}</td></tr>
        <tr><td><b>Điện thoại</b></td><td>${escapeHtml(phone) || '-'}</td></tr>
        <tr><td><b>Công ty</b></td><td>${escapeHtml(company) || '-'}</td></tr>
        <tr><td><b>Chủ đề</b></td><td>${escapeHtml(subject) || '-'}</td></tr>
        <tr><td valign="top"><b>Nội dung</b></td><td>${escapeHtml(message).replace(/\n/g, '<br>')}</td></tr>
      </table>`;

    if (!transport || !to) {
      // Chế độ demo: chưa cấu hình SMTP.
      console.log('[contact] (demo, chưa cấu hình SMTP):', { name, email, phone, company, subject });
      return res.json({
        ok: true,
        demo: true,
        message: 'Đã nhận thông tin (chế độ demo — cấu hình SMTP trong .env để gửi email thật).',
      });
    }

    await transport.sendMail({
      from: `"Website DOTHEGAMEX" <${process.env.SMTP_USER}>`,
      to,
      replyTo: email || undefined,
      subject: `[Liên hệ website] ${subject || 'Yêu cầu mới'} — ${name}`,
      html,
    });

    return res.json({ ok: true, message: 'Đã gửi thành công. Chúng tôi sẽ phản hồi sớm.' });
  } catch (err) {
    console.error('[contact] error:', err);
    return res.status(500).json({ ok: false, error: 'Có lỗi khi gửi. Vui lòng thử lại hoặc gọi hotline.' });
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ----------------------------- Static site ---------------------------- */
app.use(
  express.static(PUBLIC_DIR, {
    extensions: ['html'],
    maxAge: '1h',
  })
);

// Health check (hữu ích khi deploy)
app.get('/healthz', (_req, res) => res.json({ ok: true, service: 'dothegamex-web' }));

// 404 -> trang lỗi thân thiện (fallback về trang chủ nếu không có 404.html)
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'), (err) => {
    if (err) res.status(404).sendFile(path.join(PUBLIC_DIR, 'index.html'));
  });
});

app.listen(PORT, () => {
  console.log(`\n  ✔ DOTHEGAMEX website đang chạy: http://localhost:${PORT}\n`);
});
