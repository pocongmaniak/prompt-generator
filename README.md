# Prompt Generator

Aplikasi React + Vite untuk membuat prompt video menggunakan Gemini API.

## Kebutuhan

- Node.js sudah terpasang
- Gemini API key dari Google AI Studio

## Cara Menjalankan di Lokal

1. Masuk ke folder project:

```powershell
cd prompt-generator
```

2. Install dependency:

```powershell
npm.cmd install
```

3. Buat file `.env.local` di root project.

Contoh isi file:

```env
GEMINI_API_KEY="ISI_API_KEY_GEMINI_KAMU_DI_SINI"
```

4. Jalankan server development:

```powershell
npm.cmd run dev
```

5. Buka aplikasi:

```text
http://localhost:3000
```

Jika ingin dibuka dari HP atau perangkat lain yang satu jaringan WiFi, gunakan IP lokal yang muncul di terminal, misalnya:

```text
http://192.168.10.3:3000
```

## Cara Mendapatkan Gemini API Key

1. Buka Google AI Studio:

```text
https://aistudio.google.com/
```

2. Login memakai akun Google.
3. Buka halaman API key:

```text
https://aistudio.google.com/app/apikey
```

4. Klik tombol untuk membuat API key.
5. Pilih atau buat Google Cloud project jika diminta.
6. Salin API key yang muncul.
7. Tempel API key ke file `.env.local`:

```env
GEMINI_API_KEY="PASTE_API_KEY_DI_SINI"
```

Dokumentasi resmi Google: https://ai.google.dev/gemini-api/docs/api-key

## Penting: Jangan Upload API Key ke GitHub

File `.env.local` berisi rahasia pribadi. Jangan pernah upload API key ke GitHub.

Project ini sudah memakai `.gitignore` dengan aturan:

```gitignore
.env*
!.env.example
```

Artinya file seperti `.env.local` akan diabaikan oleh Git, sedangkan `.env.example` tetap boleh diupload sebagai contoh.

Sebelum upload ulang ke GitHub, cek dulu:

```powershell
git status
```

Pastikan `.env.local` tidak muncul di daftar file yang akan di-commit.

## Jika API Key Pernah Terlanjur Terupload

Jika API key pernah masuk ke GitHub, jangan hanya menghapus file dari repo. Anggap key tersebut sudah bocor.

Langkah aman:

1. Buka Google AI Studio API keys.
2. Hapus atau revoke API key lama.
3. Buat API key baru.
4. Simpan key baru hanya di `.env.local`.
5. Upload ulang project tanpa `.env.local`.

## Build Production

Untuk membuat versi production:

```powershell
npm.cmd run build
```

Hasil build akan masuk ke folder:

```text
dist
```

## Catatan Keamanan

Project ini masih memakai API key dari sisi frontend untuk kebutuhan lokal/development. Untuk aplikasi production yang dipakai publik, API key sebaiknya dipindahkan ke backend/server agar tidak terbaca dari browser.
