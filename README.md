# Smart-Assist AI: A Multimodal Full-Stack Assistant

Smart-Assist AI is a high-performance, full-stack application built to showcase a secure, modern AI architecture. It integrates Google's **Gemini Pro** (Multimodal) with a robust Node.js backend and a sleek, ChatGPT-inspired React frontend.

The entire ecosystem is fully containerized using **Docker**, ensuring consistency across any development or production environment.

---

## 🚀 Key Features

*   **Multimodal AI Support**: Send both text prompts and images for Gemini to analyze simultaneously.
*   **Enterprise-Grade Security**: Strictly protected by **JWT (JSON Web Tokens)** and **Bcrypt** password hashing.
*   **Persistent Memory**: Every conversation is securely logged in a **Dockerized MySQL** database.
*   **Real-time Interaction**: A professional React dashboard featuring smooth animations and "thinking" indicators.
*   **Identity Management**: Functional Signup, Login, and Logout flows to keep user data private.

---

## 🛠️ The Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19 + Vite (JavaScript), CSS3 Grids & Flexbox |
| **Backend** | Node.js (Express), Multer (Image Handling) |
| **AI Model** | Google Generative AI (Gemini Flash 2.0) |
| **Database** | MySQL 8.0 (Containerized) |
| **DevOps** | Docker, Docker Compose |
| **Security** | JWT, Authentication Middleware, Bcrypt |

---

## 📦 Getting Started (The Docker Way)

You don't need to manually install Node or MySQL on your system. Docker handles the entire orchestration for you.

### 1. Requirements
*   **Docker Desktop** installed on your Mac/PC.
*   A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).

### 2. Configure Environment Secrets
Create a `.env` file inside the `server/` directory and paste your configuration:
```env
GEMINI_API_KEY=YOUR_API_KEY_HERE
JWT_SECRET=any_strong_secret_string
PORT=5001
DB_HOST=mysql-db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword123
DB_NAME=smartassist_db
```

### 3. Launch the Application
In your root terminal, simply run the master command:
```bash
docker-compose up --build
```
Once the containers boot up:
*   **Frontend**: `http://localhost:5173`
*   **Backend API**: `http://localhost:5001`
*   **MySQL**: Running on port `3307` (host)

---

## 🛡️ Security Implementation
This project uses a layered security model:
1.  **Password Hashing**: We never store plain passwords. **Bcrypt** transforms them into mathematical hashes before saving to MySQL.
2.  **Middleware Protection**: A custom `protect.js` script intercepts every AI request. If a valid JWT isn't present in the headers, the request is instantly rejected (401 Unauthorized).
3.  **Owner-Specific Data**: The `getHistory` endpoint uses the decoded token ID to fetch **only** the conversations belonging to the logged-in user.

---

## 📂 Project Structure
*   `/server`: Express API, Controllers, and AI Services.
*   `/smart-assist-web`: React frontend components and styling.
*   `/docker-compose.yml`: The blueprint for the unified environment.
