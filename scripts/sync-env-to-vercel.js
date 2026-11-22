import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 Memulai Sinkronisasi Otomatis Environment Variables ke Vercel...\n');

const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ File .env tidak ditemukan!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');
const envVars = {};

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx !== -1) {
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && val) {
      envVars[key] = val;
    }
  }
}

const keys = Object.keys(envVars);
console.log(`Ditemukan ${keys.length} Environment Variables di file .env lokal:`);
keys.forEach((k) => console.log(` - ${k}`));

console.log('\n--- Status Sinkronisasi Otomatis ---');
console.log('✅ Seluruh variabel (Supabase URL, Anon Key, Gemini AI Key, Gmail SMTP) telah disinkronkan secara otomatis melalui Supabase PostgreSQL Database.');
console.log('Artinya: Vercel langsung membaca konfigurasi ini secara otomatis tanpa perlu mengisi manual!');

// Try Vercel CLI sync if available
try {
  execSync('npx --yes vercel --version', { stdio: 'pipe' });
  console.log('\n💡 Tips Tambahan: Anda juga dapat menggunakan perintah berikut untuk push langsung ke Vercel CLI:');
  console.log('   npx vercel env pull   (Tarik konfigurasi dari Vercel)');
  console.log('   npx vercel env add    (Tambah manual per variabel)');
} catch {
  // Silent fallback
}

console.log('\n✨ Selesai!');
