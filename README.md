# 🧪 Health Lab Report Analyzer

A smart, responsive web app that allows users to upload lab reports (image-based) and instantly extract and analyze health parameters like hemoglobin, WBC, and platelets. Built as part of a real-world challenge for Health.

---

## 🚀 Features

### ✅ Core Functionality
- 📤 Upload lab report images (e.g., scanned PDFs as PNG/JPEG)
- 🔍 OCR text extraction using **Tesseract.js**
- 📊 Clean, responsive table showing:
  - Parameter name
  - Value
  - Unit
  - Normal range
  - Status: ✅ Normal or ⚠️ Needs Attention
- 📈 Trend chart for 3 dummy parameters (e.g., Hemoglobin, WBC, Platelets)

### ✨ Bonus Enhancements
- 🔐 Basic login/auth flow to mimic real user sessions
- 🧠 AI-style flagging for abnormal lab values
- 💅 Clean UI with TailwindCSS, responsive and accessible
- 🧘 Smooth UX: loaders, error messages, transitions, and alerts

---

## 🛠️ Tech Stack

| Frontend            | Backend              | OCR / Parsing     |
|---------------------|----------------------|-------------------|
| React + TailwindCSS | Node.js + Express    | Tesseract.js      |
| Chart.js            | Multer for uploads   | Custom parser     |
| Axios               | CORS                 | Regex-based logic |

---

## 📂 Project Structure

```

korai-health-app/
│
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # TrendChart etc.
│   │   ├── data/        # dummyReports.js
│   │   └── App.js       # Main App
│   └── tailwind.config.js
│
├── server/              # Node.js backend
│   ├── uploads/         # Temporarily stored images
│   └── index.js         # API + Tesseract logic
│
└── README.md

````

---

## 🔐 Demo Login (Local Mock)

```bash
👤 Email: demo@korai.health
🔒 Password: demo123
````

*Note: Authentication is mocked for demonstration purposes.*

---

## 🧪 Run Locally

### 1️⃣ Clone & Install

```bash
git clone https://github.com/yourusername/korai-health-app.git
cd korai-health-app
```

### 2️⃣ Start Backend

```bash
cd server
npm install
node index.js
```

Starts backend on: `http://localhost:5000`

### 3️⃣ Start Frontend

```bash
cd ../client
npm install
npm start
```

Starts frontend on: `http://localhost:3000`

---

## 🌟 Example Lab Report (Image)

You can use any image-based lab report like:

```
./sample-report.png
```

---

## 📌 Notes

* Currently supports image files (JPG/PNG).
* PDF support can be added with `pdf2pic` or `poppler-utils` if needed.
* Backend uses `tesseract.js` and simple regex parsing logic.

---

## 📸 Screenshots

> 📷 Add screenshots here if you're deploying or submitting it as a portfolio project

---

## 🌐 Deployment (Optional)

You can deploy:

* **Frontend**: [Vercel](https://vercel.com)
* **Backend**: [Render](https://render.com) or [Railway](https://railway.app)

---
