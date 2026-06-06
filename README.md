# GradeOps – AI-Powered Answer Sheet Evaluation System

GradeOps is an end-to-end AI system that automates the evaluation of scanned or handwritten answer sheets using OCR and machine learning. It provides a seamless interface for uploading answer sheets, processing them, and viewing evaluation results in an interactive dashboard.

---

## Features

* **PDF/Image Upload** – Upload scanned answer sheets
* **OCR Extraction** – Extract text using OCR (Tesseract/EasyOCR)
* **AI-Based Evaluation** – Automatically grade answers
* **Interactive Dashboard** – View sessions, answers, and scores
* **Session Tracking** – Manage multiple evaluation sessions
* **FastAPI Backend** – High-performance async API
* **Modern React Frontend**

---

## Tech Stack

### Backend

* FastAPI
* Uvicorn
* Python
* OCR: Tesseract / EasyOCR
* Machine Learning / NLP models

### Frontend

* React
* Axios
* CSS / Tailwind
  
---

## 📂 Project Structure

```bash
gradeops/
│
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── routes/          # API routes
│   │   ├── services/        # OCR + grading logic
│   │   ├── models/          # ML models / schemas
│   │   └── utils/           # helper functions
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json
│   └── public/
│
├── .gitignore
└── README.md
```

---

## Local Setup

### Clone the Repository

```bash
git clone https://github.com/your-username/gradeops.git
cd gradeops
```

---

## Backend Setup (FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

### Run Backend Server

```bash
uvicorn app.main:app --reload
```

Server will run at:
http://127.0.0.1:8000

API Docs available at:
http://127.0.0.1:8000/docs

---

## Frontend Setup (React)

```bash
cd frontend

npm install
npm start
```

Frontend will run at:
http://localhost:3000

---

## Environment Variables

Create a `.env` file inside `backend/`:

```env
API_KEY=your_api_key_here
```

---

## How the System Works

1. User uploads answer sheet (PDF/Image)
2. Backend extracts text using OCR
3. Extracted text is processed by AI model
4. Scores are generated
5. Results are sent to frontend dashboard

---

## Deployment Guide

### Backend (Render)

* Connect GitHub repo
* Set build command:

  ```bash
  pip install -r requirements.txt
  ```
* Start command:

  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port 10000
  ```

---

### Frontend (Vercel / Netlify)

* Connect GitHub repo
* Set build command:

  ```bash
  npm run build
  ```
* Set API base URL to deployed backend

---

## Future Enhancements

* Advanced handwriting recognition
* Analytics dashboard for teachers
* Mobile-friendly UI

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push and open a PR

---

## License

MIT License

---

## Author

Built as part of an AI-powered automation project to simplify grading workflows.

---

