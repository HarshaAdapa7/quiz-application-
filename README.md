<div align="center">
  <img src="https://img.icons8.com/color/96/000000/learning.png" alt="Logo">
  <h1>🚀 Advanced Quiz & Gamification Platform</h1>
  <p><strong>A Full-Stack Interactive Learning Arena</strong></p>
  <p>
    Built for an internship project focusing on Real-Time Multiplayer, Advanced Analytics, and Premium Glassmorphic UI.
  </p>
</div>

<hr />

## 📖 Overview

The **Advanced Quiz Platform** is a robust, full-stack web application designed to gamify learning and facilitate interactive assessments. Built with **React** on the frontend and **Spring Boot** on the backend, this platform provides a seamless experience for both **Teachers** and **Students**.

With a beautiful "glassmorphism" aesthetic, the application goes beyond basic quizzes by incorporating real-time multiplayer arenas, an intricate gamification system (XP, Levels, Streaks), and actionable visual analytics for educators.

---

## ✨ Core Features

### 🎓 Dual-Role Architecture
- **👨‍🏫 Teacher Portal**: 
  - Effortless quiz builder with timed limits.
  - Comprehensive dashboard offering deep insights into student performance.
  - Category-wise accuracy tracking and system-wide metrics.
  - Manage existing students and track platform traffic.
- **👩‍🎓 Student Portal**:
  - Personalized dashboard tracking XP, current streaks, accuracy, and leveling.
  - Beautiful visual charts (powered by Recharts) showing performance trends over time.

### 🎮 Gamification & Engagement
- **Dynamic Leaderboard**: An advanced podium-style global leaderboard highlighting Top 3 players in gold/silver/bronze, alongside a fully ranked list.
- **Experience & Leveling**: Earn XP for every correct answer, leveling up as you conquer more content.
- **Streaks**: Daily login & completion streaks to encourage consistent learning habits.

### 🌐 Real-Time Multiplayer Arena
- Built with **Spring Boot WebSockets (STOMP)**.
- Teachers can initiate a "Live Quiz Event", generating a unique 4-digit room code.
- Students join the lobby, wait for the host, and compete synchronously.
- Live, real-time scoreboard updates broadcasted to all participants over WebSockets.

### 🎨 Premium UI/UX Aesthetic
- **Glassmorphism**: Sleek, semi-transparent frosted-glass panels on deep, dark-mode backgrounds.
- **Smooth Animations**: Carefully tuned CSS keyframe micro-animations for interactions, entering leaderboards, and page transitions.
- **Responsive Layouts**: Flexible grid and flexbox implementations ensuring beautiful scaling.

---

## 🛠️ Technology Stack

### Backend
- **Java 17 & Spring Boot 3**: Core framework for robust REST APIs.
- **Spring Security & JWT**: Stateless authentication and protected role-based routes.
- **Spring Data JPA & Hibernate**: ORM for complex database relationships.
- **WebSockets / STOMP**: Full-duplex communication channels for the Live Arena.
- **MySQL**: Relational database managing users, quizzes, tracking, and analytics.

### Frontend
- **React 18 & Vite**: Lightning-fast build tooling and component-based UI.
- **React Router v6**: Protected routing with role-based component rendering.
- **Recharts**: High-performance, declarative charting for student and teacher analytics.
- **Lucide React**: Beautifully crafted SVG icons.
- **Axios**: Promised-based HTTP client for API communication.
- **Vanilla CSS**: Advanced modern layout techniques (Grid/Flexbox) and glassmorphic aesthetics.

---

## 🚀 Getting Started

### Prerequisites
- JDK 17+ installed.
- Node.js (v16+) and npm installed.
- MySQL server running locally.

### 1. Database Setup
Ensure you have a local MySQL instance running. The Spring Boot application properties (`application.properties`) should reflect your credentials. The database schema (hibernate) will auto-generate upon the first boot.

### 2. Run the Backend (Spring Boot)
Open a terminal in the `backend` directory:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
*The server will start on `http://localhost:8080/`.*

### 3. Run the Frontend (React / Vite)
Open a new terminal in the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
*The application should launch at `http://localhost:5173/`.*

---

## 📸 Platform Previews

**(Note: Add screenshots here before submission)**

- `![Teacher Dashboard](./screenshots/teacher.png)`
- `![Student Analytics](./screenshots/student.png)`
- `![Live Arena](./screenshots/arena.png)`
- `![Podium Leaderboard](./screenshots/leaderboard.png)`

---

## 🤝 Project Submission Notes

This project was developed to demonstrate:
1. Understanding of **Full-Stack Application Architecture**.
2. Ability to implement **Secure JWT Authentication**.
3. Knowledge of **Real-Time Data Streams** via WebSockets.
4. Competence in **Complex Data Modeling** (Quizzes, Attempts, Gamification state).
5. Proficiency in delivering a **Premium, Accessible Frontend Experience**.

Developed as an Intern Project. Designed with ❤️ for modern learning.
