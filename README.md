# Pixenze Booth

Pixenze Booth adalah aplikasi web photobooth interaktif berbasis React yang memungkinkan pengguna untuk mengambil foto dengan berbagai pilihan frame menarik. Proyek ini dirancang dengan antarmuka yang modern dan minimalis, serta terintegrasi dengan Supabase untuk pengelolaan data frame secara dinamis.

## Fitur Utama

* **Pemilihan Frame**: Pengguna dapat memilih berbagai variasi frame (seperti "The 1975", "Perunggu", dll) sebelum mengambil foto.
* **Integrasi Kamera**: Mengambil foto secara langsung melalui kamera perangkat pengguna.
* **Manajemen Admin**: Halaman khusus admin untuk mengelola (tambah, edit, hapus) koleksi frame.
* **Status Frame**: Dukungan untuk status frame seperti 'active', 'coming_soon', atau 'hidden'.
* **Penyimpanan Cloud**: Integrasi dengan Supabase Storage untuk penyimpanan aset gambar frame.
* **Keamanan Turnstile**: Dilengkapi dengan Cloudflare Turnstile untuk verifikasi keamanan.
* **Desain Responsif**: Antarmuka yang bersih dan modern menggunakan Tailwind CSS.

## Teknologi yang Digunakan

* **Frontend**: React 19, Vite.
* **Styling**: Tailwind CSS 4, Framer Motion (untuk animasi).
* **Backend & Database**: Supabase (PostgreSQL & Storage).
* **Routing**: React Router DOM v7.
* **Icons**: Lucide React.
* **Security**: Cloudflare Turnstile.

## Prasyarat Instalasi

Sebelum memulai, pastikan Anda telah menginstal:
* Node.js (versi terbaru direkomendasikan)
* Akun Supabase untuk database dan storage

## Langkah Instalasi

1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/username/pixenze-booth.git](https://github.com/username/pixenze-booth.git)
    cd pixenze-booth
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Buat file `.env` di direktori root dan masukkan kredensial Supabase Anda:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Konfigurasi Database:**
    Salin dan jalankan query SQL dari file `supabase_schema.sql` ke dalam SQL Editor di dashboard Supabase Anda untuk membuat tabel `frames` dan kebijakan keamanan (RLS).

5.  **Setup Storage:**
    Buat bucket baru bernama `frames` di Supabase Storage dan atur aksesnya menjadi **Public**.

6.  **Jalankan aplikasi:**
    ```bash
    npm run dev
    ```

## Struktur Proyek

```text
pixenzebooth/
├── src/
│   ├── components/     # Komponen UI (Camera, Gallery, dsb)
│   ├── hooks/          # Custom hooks (useAuth, useCamera)
│   ├── lib/            # Konfigurasi library (Supabase client)
│   ├── pages/          # Halaman aplikasi (Home, Booth, Admin)
│   ├── services/       # Service API (Frame management)
│   ├── utils/          # Fungsi pembantu (Image processing)
│   └── index.css       # Global styles
├── public/             # Aset statis dan frame lokal
├── supabase_schema.sql # Skema database PostgreSQL
└── package.json        # Konfigurasi project dan dependensi
