# Belajar Yuk! — Kids Learning App

Aplikasi belajar untuk anak TK B dengan fokus awal pada:
- 📖 Membaca
- 🔢 Matematika
- 🧩 Logika

Aplikasi dibuat agar aktivitas utama bisa dilakukan tanpa anak harus membaca instruksi. Soal menggunakan visual, tombol besar, dan audio browser.

## 1. Yang dibutuhkan

Install terlebih dahulu:

1. **Node.js LTS** (disarankan versi LTS terbaru)
2. **npm** (sudah ikut terpasang bersama Node.js)
3. Browser modern seperti Chrome, Edge, Safari, atau Firefox.

Untuk mengecek:

```bash
node --version
npm --version
```

Jika kedua command menghasilkan nomor versi, lanjut ke langkah berikutnya.

> Tidak perlu install MySQL/PostgreSQL. Database menggunakan SQLite dan dibuat otomatis di project.

## 2. Install project

Extract ZIP project ini ke folder pilihan.

Buka Terminal/Command Prompt pada folder project:

```bash
cd kids-learning-app
```

Install dependency:

```bash
npm install
```

## 3. Siapkan database

Jalankan:

```bash
npm run db:setup
```

Command tersebut menjalankan:
1. `prisma db push` untuk membuat database SQLite.
2. `npm run db:seed` untuk mengisi contoh aktivitas belajar.

Database akan berada di:

```text
prisma/dev.db
```

## 4. Jalankan aplikasi di komputer

```bash
npm run dev
```

Setelah muncul alamat server, buka:

```text
http://localhost:3000
```

## 5. Membuka dari tablet anak

Komputer dan tablet harus berada pada **Wi-Fi/LAN yang sama**.

### macOS

Buka Terminal dan cari IP lokal:

```bash
ipconfig getifaddr en0
```

Jika tidak menghasilkan IP, coba:

```bash
ipconfig getifaddr en1
```

Contoh hasil:

```text
192.168.1.20
```

Kemudian di tablet buka:

```text
http://192.168.1.20:3000
```

### Windows

Buka Command Prompt:

```cmd
ipconfig
```

Cari **IPv4 Address** pada adapter Wi-Fi, misalnya:

```text
192.168.1.20
```

Kemudian di tablet buka:

```text
http://192.168.1.20:3000
```

### Linux

Bisa gunakan:

```bash
hostname -I
```

Gunakan IP lokal yang sesuai, kemudian buka:

```text
http://IP-KOMPUTER:3000
```

## 6. Jika tablet tidak bisa membuka aplikasi

Periksa berurutan:

1. Pastikan komputer dan tablet menggunakan jaringan Wi-Fi/LAN yang sama.
2. Pastikan `npm run dev` masih berjalan di komputer.
3. Pastikan URL menggunakan IP komputer, bukan `localhost`.
4. Pastikan port `3000` tidak diblokir firewall.
5. Coba dari komputer sendiri:
   ```text
   http://localhost:3000
   ```
6. Jika komputer menggunakan VPN, matikan sementara atau pastikan VPN tidak memblokir local network.
7. Pada jaringan kantor/public Wi-Fi, perangkat sering diisolasi sehingga tablet tidak bisa mengakses komputer. Gunakan jaringan rumah/LAN yang mengizinkan device-to-device communication.

## 7. Menghentikan aplikasi

Di Terminal tempat `npm run dev` berjalan:

```text
Ctrl + C
```

Untuk menjalankannya lagi:

```bash
npm run dev
```

## 8. Reset database dan seed ulang

Jika ingin mengembalikan database ke kondisi awal:

```bash
npx prisma db push --force-reset
npm run db:seed
```

> Perintah ini menghapus data progress/attempt yang sudah tersimpan.

## 9. Build untuk production

Untuk memastikan project bisa dibuat menjadi production build:

```bash
npm run build
```

Kemudian:

```bash
npm start
```

## 10. Struktur project

```text
kids-learning-app/
├── app/
│   ├── api/
│   │   └── attempts/
│   ├── learn/
│   │   └── [subject]/
│   ├── parent/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── LearningClient.tsx
├── lib/
│   └── prisma.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 11. Catatan audio

Audio instruksi menggunakan **Web Speech API** browser sehingga project tidak membutuhkan file audio eksternal.

Jika suara tidak keluar:
- pastikan volume perangkat aktif;
- pastikan browser mengizinkan speech/audio;
- coba tombol `🔊 Dengarkan`.

## 12. Catatan content

Data di `prisma/seed.ts` berisi **60 starter activities**, termasuk **54 soal matematika original** yang disusun bertahap dari number sense sampai visual olympiad-style reasoning. Materi ini bukan kurikulum resmi dan tidak menyalin bank soal kompetisi/worksheet tertentu.

Untuk menambah aktivitas:
1. Edit `prisma/seed.ts`.
2. Jalankan reset database jika ingin mengganti seluruh data:
   ```bash
   npx prisma db push --force-reset
   npm run db:seed
   ```

## 13. Prinsip project

- Tidak membutuhkan internet setelah dependency ter-install, kecuali browser/OS membutuhkan resource tertentu.
- Tidak membutuhkan cloud database.
- Progress tersimpan di SQLite lokal.
- UI dibuat touch-friendly untuk tablet.
- Konten dipisahkan dari UI melalui database seed.
- API hanya menyimpan attempt; logic aktivitas tetap berada di data aktivitas.
- Project dapat dikembangkan kemudian menjadi lebih besar tanpa harus mengganti database terlebih dahulu.

## 14. Curriculum dan question bank

Question bank matematika saat ini mencakup:

- Level 1–2: counting dan comparison
- Level 3–4: visual addition dan subtraction
- Level 5–6: missing number dan visual patterns
- Level 7–8: number sequence, comparison, dan shape counting
- Level 9–10: balance, number composition, dan multi-step visual reasoning

Untuk prinsip content generation, gunakan referensi kompetisi/worksheet hanya untuk mempelajari **skill, pola, struktur, dan progression**. Jangan menyalin wording, ilustrasi, atau question set berhak cipta. Generate pertanyaan original yang sesuai dengan template aplikasi.

## 15. Troubleshooting cepat

### `npm: command not found`

Node.js belum ter-install atau PATH belum tersedia. Install Node.js LTS lalu buka Terminal baru.

### `prisma: command not found`

Jalankan:

```bash
npm install
```

Lalu gunakan script:

```bash
npm run db:setup
```

### `Can't reach database`

Pastikan sudah menjalankan:

```bash
npm run db:setup
```

### Port 3000 sudah digunakan

Jalankan:

```bash
npm run dev -- -p 3001
```

Kemudian gunakan:

```text
http://localhost:3001
```

Untuk tablet:

```text
http://IP-KOMPUTER:3001
```

## 16. Status

Versi ini adalah **MVP runnable** untuk memvalidasi flow aplikasi dan penggunaan di tablet.

Fitur yang belum menjadi bagian dari MVP:
- akun/login anak;
- multi-anak;
- sinkronisasi cloud;
- generator soal AI;
- analytics per skill yang mendalam;
- content management UI;
- PWA install prompt/offline caching penuh;
- sistem achievement yang kompleks.
## Audio

The child experience uses the browser Web Speech API for Indonesian voice instructions and feedback.
When a learning session starts, the app speaks the first question directly from the **Mulai** button interaction.
The **Dengarkan** button remains available to repeat the question, and the **Lanjut** button speaks the next question.
This interaction-based flow is designed to avoid browser autoplay restrictions.
If the browser/device does not provide `speechSynthesis`, the app continues to work without voice playback.
