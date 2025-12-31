# DevPulse ⚡

DevPulse is a developer-focused productivity dashboard designed to centralize daily workflow tools in a single interface. The project emphasizes clean backend APIs, modular architecture, and a modern, responsive frontend.

---

## 🚧 Project Status
**Actively in development**  
Core features are implemented, with additional enhancements planned.

---

## 🔥 Key Features

### ✅ Implemented
**Task Manager**
- Create, update, delete tasks  
- Status-based filtering and search  

**Learning Logs**
- Log learning entries by topic and category  
- Search and organize personal learning history  

**GitHub Activity Tracker**
- Displays repositories, top languages, and recent activity  
- Visual representation of weekly commits using GitHub public APIs  

### 🧪 Partially Implemented
**Pomodoro Timer**
- Frontend-based focus timer  
- Backend session persistence planned  

### 🛠️ In Progress
**Dashboard**
- UI structure implemented  
- Currently powered by mock / dummy data  
- Backend-driven analytics planned  

---

## 🧱 Tech Stack

**Backend**
- Python  
- Django  
- Django REST Framework (DRF)  
- JWT Authentication  
- PostgreSQL  

**Frontend**
- Next.js  
- TypeScript  
- Tailwind CSS  
- ShadCN UI  

**Tools & Deployment**
- Git & GitHub  
- Docker (planned)  
- Render / Railway (planned deployment)  

---

## 🧠 Architecture Overview
- Modular REST API design for scalability  
- Separate API modules for tasks, learning logs, and GitHub integration  
- Secure authentication using JWT  
- Frontend consumes APIs via clean service layers  
- Designed with extensibility and performance in mind  

---

## 🚀 Getting Started

### Clone the Repository
```bash
git clone https://github.com/your-username/devpulse.git
cd devpulse
```
### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 👨‍💻 Author
Sumit Santosh Bansode
Full Stack / Backend Developer


