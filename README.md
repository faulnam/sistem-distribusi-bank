# 🏦 BankKrut — Mini Internet Banking

Aplikasi **simulasi Internet Banking** sederhana untuk pembelajaran, dibangun menggunakan **Apache Cordova** sebagai frontend dan **Node.js + MySQL** sebagai backend.

> Cocok buat belajar alur perbankan digital tanpa risiko saldo minus sungguhan 😄

---

## ✨ Fitur Utama

* 🔐 **Autentikasi** — Register & Login menggunakan JWT
* 💰 **Cek Saldo** — Saldo rekening real‑time
* 🔄 **Transfer Sesama Bank** — Antar rekening BankKrut (Gratis)
* 🌐 **Transfer Antar Bank** — Ke bank lain (Biaya admin Rp 6.500)
* 🧾 **Histori Transaksi** — Riwayat transaksi + filter
* 📊 **Mutasi Rekening** — Laporan debit & kredit
* 📱 **Responsive Design** — Nyaman di desktop & mobile

---

## 🧰 Tech Stack

### Frontend

* Apache Cordova — Framework mobile hybrid
* HTML5, CSS3, JavaScript (Vanilla JS)
* Font Awesome — Icon library
* Google Fonts (Poppins) — Typography

### Backend

* Node.js — JavaScript runtime
* Express.js — Backend framework
* MySQL — Database relasional
* JWT — Autentikasi token
* bcrypt — Enkripsi password

---

## 📦 Prerequisites

Pastikan tools berikut sudah terpasang:

* Node.js ≥ 18.0.0
* npm ≥ 9.0.0
* MySQL ≥ 8.0
* Apache Cordova ≥ 12.0.0

---

## 🚀 Instalasi

### 1️⃣ Clone Repository

```bash
git clone https://github.com/username/bankkrut.git
cd bankkrut
```

### 2️⃣ Install Dependencies (Frontend)

```bash
npm install
```

### 3️⃣ Install Dependencies (Backend)

```bash
cd server
npm install
cd ..
```

### 4️⃣ Setup Database

Buat database MySQL:

```sql
CREATE DATABASE db_mbanking;
```

Import schema:

```bash
mysql -u root -p db_mbanking < server/database/schema.sql
```

### 5️⃣ Konfigurasi Environment

Salin file konfigurasi:

```bash
copy server\.env.example server\.env
```

Edit file `.env` sesuai konfigurasi Anda.

---

## ⚙️ Konfigurasi Environment (`server/.env`)

```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=db_mbanking
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=24h
```

---

## ▶️ Menjalankan Aplikasi

### Terminal 1 — Jalankan Backend

```bash
cd server; node index.js
```

### Terminal 2 — Jalankan Cordova

```bash
cordova run browser
```

### Akses Aplikasi

```
http://localhost:8000
```

---

## 👤 Akun Demo

| Email                                         | Password | Saldo        | No. Rekening |
| --------------------------------------------- | -------- | ------------ | ------------ |
| [syifaul@email.com](mailto:syifaul@email.com) | 123456   | Rp 5.000.000 | 1001         |
| [ahmad@email.com](mailto:ahmad@email.com)     | 123456   | Rp 3.500.000 | 1002         |
| [budi@email.com](mailto:budi@email.com)       | 123456   | Rp 2.000.000 | 1003         |
| [dewi@email.com](mailto:dewi@email.com)       | 123456   | Rp 7.500.000 | 1004         |
| [eko@email.com](mailto:eko@email.com)         | 123456   | Rp 1.500.000 | 1005         |

---

## 🔗 API Endpoints

| Method | Endpoint                | Deskripsi          |
| -----: | ----------------------- | ------------------ |
|   POST | `/api/auth/register`    | Registrasi user    |
|   POST | `/api/auth/login`       | Login user         |
|    GET | `/api/saldo/:account`   | Cek saldo rekening |
|   POST | `/api/transfer`         | Transfer dana      |
|    GET | `/api/histori/:account` | Histori transaksi  |
|    GET | `/api/mutasi/:account`  | Mutasi rekening    |

---

## 🛠️ Troubleshooting

### ❌ Email atau Password Salah

Reset password user demo:

```bash
cd server
node -e "const mysql=require('mysql2/promise');const bcrypt=require('bcrypt');(async()=>{const conn=await mysql.createConnection({host:'localhost',user:'root',password:'',database:'db_mbanking'});const hash=await bcrypt.hash('123456',10);await conn.query('UPDATE users SET password=?',[hash]);console.log('Password reset berhasil');await conn.end();})();"
```

### ❌ Port 3001 Sudah Digunakan

```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

---

## 📄 License

MIT License

---

> Dibuat untuk pembelajaran sistem distribusi bank & simulasi internet banking 🚀
> 
