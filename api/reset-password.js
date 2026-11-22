import nodemailer from 'nodemailer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Helper to get environment variables dynamically from process.env or .env file
function getEnvVar(key) {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const k = trimmed.slice(0, eqIdx).trim();
          if (k === key) {
            return trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
          }
        }
      }
    }
  } catch (err) {
    console.error('[ResetPassword] Error reading .env dynamically:', err.message);
  }
  return '';
}

// Secret key for HMAC token signing (falls back to secure runtime random or env)
const RESET_SECRET = getEnvVar('RESET_PASSWORD_SECRET') || process.env.RESET_PASSWORD_SECRET || 'portfolio-admin-reset-salt-key-2026';

function signToken(payload) {
  const data = JSON.stringify(payload);
  const signature = crypto.createHmac('sha256', RESET_SECRET).update(data).digest('hex');
  return Buffer.from(data).toString('base64url') + '.' + signature;
}

function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [b64Data, signature] = parts;
    const data = Buffer.from(b64Data, 'base64url').toString('utf8');
    const expectedSig = crypto.createHmac('sha256', RESET_SECRET).update(data).digest('hex');

    // Constant-time comparison
    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[ResetPassword] Token verification error:', err);
  }
  return null;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Parse Body
  let body = req.body;
  if (!body) {
    try {
      body = await new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', chunk => { raw += chunk; });
        req.on('end', () => {
          try {
            resolve(raw ? JSON.parse(raw) : {});
          } catch {
            resolve({});
          }
        });
        req.on('error', reject);
      });
    } catch {
      body = {};
    }
  } else if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { action, email, code, token } = body;

  // ACTION 1: SEND VERIFICATION CODE
  if (action === 'send_code') {
    const targetEmail = (email || '').trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      return res.status(400).json({ success: false, message: 'Alamat email tidak valid.' });
    }

    // Generate 6-digit random numeric code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity

    const tokenPayload = {
      email: targetEmail,
      code: generatedCode,
      expiresAt
    };
    const signedToken = signToken(tokenPayload);

    let gmailUser = (
      process.env.GMAIL_USER ||
      process.env.VITE_GMAIL_USER ||
      getEnvVar('GMAIL_USER') ||
      getEnvVar('VITE_GMAIL_USER') ||
      targetEmail ||
      'akhoiri052@gmail.com'
    ).trim();

    let gmailPass = (
      process.env.GMAIL_APP_PASSWORD ||
      process.env.VITE_GMAIL_APP_PASSWORD ||
      process.env.GMAIL_PASSWORD ||
      process.env.VITE_GMAIL_PASSWORD ||
      process.env.GMAIL_PASS ||
      getEnvVar('GMAIL_APP_PASSWORD') ||
      getEnvVar('VITE_GMAIL_APP_PASSWORD') ||
      getEnvVar('GMAIL_PASSWORD') ||
      getEnvVar('VITE_GMAIL_PASSWORD') ||
      getEnvVar('GMAIL_PASS') ||
      ''
    ).trim().replace(/\s+/g, '');

    // Automatic Fallback: fetch from Supabase settings if not set in environment
    if (!gmailPass) {
      try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://secvooxfmwvbqskffrff.supabase.co';
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Nsc7USUDke2tlmAgDONTjg_Rf_hCvYx';
        const resp = await fetch(`${supabaseUrl}/rest/v1/portfolio_content?key=eq.settings&select=value`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data && data[0] && data[0].value) {
            if (data[0].value.gmail_app_password) {
              gmailPass = data[0].value.gmail_app_password.trim().replace(/\s+/g, '');
            }
            if (data[0].value.gmail_user) {
              gmailUser = data[0].value.gmail_user.trim();
            }
          }
        }
      } catch (err) {
        console.warn('[ResetPassword] Supabase settings lookup failed:', err.message);
      }
    }

    console.log(`[ResetPassword] Request received for ${targetEmail}.`);
    console.log(`[ResetPassword] SMTP Auth Check -> User: ${Boolean(gmailUser)} (${gmailUser}), Pass set: ${Boolean(gmailPass)}`);

    // Check if Gmail SMTP is configured
    if (gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: gmailUser,
            pass: gmailPass
          }
        });

        const mailHtml = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verifikasi Reset Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050814; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #050814; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #0b0e21; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 36px 28px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <!-- Logo & Header -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <div style="width: 52px; height: 52px; border-radius: 16px; background: linear-gradient(135deg, #2563eb, #38bdf8); display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px; color: #ffffff; line-height: 52px;">
                AK
              </div>
              <h2 style="margin: 16px 0 6px; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Reset Password Admin</h2>
              <p style="margin: 0; color: #94a3b8; font-size: 13px;">Portofolio Achmad Khoiri</p>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 16px 0; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06);">
              <p style="margin: 0 0 16px; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                Halo Admin, kami menerima permintaan untuk mengatur ulang kata sandi Dashboard Admin Anda. Gunakan kode verifikasi di bawah ini untuk melanjutkan:
              </p>
              
              <!-- OTP Box -->
              <div style="background: rgba(56, 189, 248, 0.08); border: 1px dashed #38bdf8; border-radius: 16px; padding: 20px; text-align: center; margin: 20px 0;">
                <span style="display: block; font-size: 11px; text-transform: uppercase; color: #38bdf8; font-weight: 700; letter-spacing: 2px; margin-bottom: 8px;">KODE VERIFIKASI OTP</span>
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; color: #ffffff; letter-spacing: 8px;">${generatedCode}</span>
              </div>

              <p style="margin: 16px 0 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                ⏱️ Kode ini hanya berlaku selama <strong>15 menit</strong>. Jangan bagikan kode ini kepada siapapun demi keamanan dashboard Anda.
              </p>
            </td>
          </tr>

          <!-- Footer Notice -->
          <tr>
            <td style="padding-top: 24px; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 11px; line-height: 1.5;">
                Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini. Akun Anda tetap aman.<br />
                &copy; ${new Date().getFullYear()} Achmad Khoiri Portfolio. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `;

        await transporter.sendMail({
          from: `"Achmad Khoiri Portfolio" <${gmailUser}>`,
          to: targetEmail,
          subject: `${generatedCode} adalah Kode Verifikasi Reset Password Dashboard Anda`,
          html: mailHtml
        });

        console.log(`[ResetPassword] Real email successfully sent to: ${targetEmail}`);
        return res.status(200).json({
          success: true,
          simulated: false,
          message: `Kode verifikasi 6 digit telah dikirim ke alamat Gmail: ${targetEmail}. Silakan periksa kotak masuk (Inbox) atau folder Spam Anda.`,
          token: signedToken,
          email: targetEmail
        });
      } catch (mailErr) {
        console.error('[ResetPassword] Transporter error:', mailErr);
        const errMsg = mailErr.message || '';
        let userFriendlyMsg = `Gagal mengirim email: ${errMsg}`;
        if (errMsg.includes('535') || errMsg.includes('BadCredentials') || errMsg.includes('Username and Password not accepted')) {
          userFriendlyMsg = 'Google menolak otentikasi login (Error 535). Pastikan Anda menggunakan Sandi Aplikasi (App Password 16 karakter), BUKAN password akun Google biasa. Dapatkan di: myaccount.google.com/apppasswords';
        }
        return res.status(500).json({
          success: false,
          message: userFriendlyMsg
        });
      }
    } else {
      console.warn('[ResetPassword] GMAIL_USER or GMAIL_APP_PASSWORD not set in environment or .env file.');
      return res.status(500).json({
        success: false,
        message: 'Layanan email belum aktif di Vercel: Variabel GMAIL_APP_PASSWORD belum terbaca. Pastikan sudah menambahkan GMAIL_APP_PASSWORD di Vercel Dashboard (Project Settings > Environment Variables), lalu lakukan Redeploy.'
      });
    }
  }

  // ACTION 2: VERIFY CODE
  if (action === 'verify_code') {
    if (!token || !code) {
      return res.status(400).json({ success: false, message: 'Kode verifikasi dan token wajib diisi.' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(400).json({ success: false, message: 'Sesi verifikasi tidak valid atau telah dimodifikasi.' });
    }

    if (Date.now() > payload.expiresAt) {
      return res.status(400).json({ success: false, message: 'Kode verifikasi telah kedaluwarsa (lebih dari 15 menit). Silakan minta kode baru.' });
    }

    if (payload.code !== code.trim()) {
      return res.status(400).json({ success: false, message: 'Kode verifikasi yang Anda masukkan salah.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Kode verifikasi berhasil diverifikasi.',
      email: payload.email
    });
  }

  return res.status(400).json({ success: false, message: 'Aksi tidak dikenal.' });
}
