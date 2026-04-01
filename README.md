<<<<<<< HEAD
=======
<div align="center">
  <img src="https://img.icons8.com/color/96/000000/learning.png" alt="Logo">
  <h1>🚀 Advanced Quiz & Gamification Platform</h1>
  <p><strong>A Full-Stack Interactive Learning Arena by Harsha Adapa</strong></p>
  <p>
    <strong>Internship Project Submission</strong><br/>
    Developed independently by <b>Harsha Adapa</b>. Built focusing on Real-Time Multiplayer, Advanced Analytics, and Premium UI/UX.
  </p>
</div>

<hr />

## 📖 Overview
>>>>>>> 9b582cf ( updated some code)

The **Advanced Quiz Platform**, engineered by **Harsha Adapa**, is a robust, full-stack web application designed to gamify learning and facilitate interactive assessments. Built with **React** on the frontend and **Spring Boot** on the backend, this platform provides an enterprise-ready experience for both **Educators** and **Students**.

With a premium "glassmorphism" aesthetic, the application goes beyond basic quizzes by incorporating real-time multiplayer arenas via WebSockets, an intricate gamification system (XP, Levels, Streaks, dynamic Badges, Profile Avatars), and actionable visual analytics for educators using modern charting technologies.

---

## ✨ Core Functionalities & Features Developed by Harsha Adapa

<<<<<<< HEAD
### Dual-Role Architecture
- ** Teacher Portal**: 
  - Effortless quiz builder with timed limits.
  - Comprehensive dashboard offering deep insights into student performance.
  - Category-wise accuracy tracking and system-wide metrics.
  - Manage existing students and track platform traffic.
- ** Student Portal**:
  - Personalized dashboard tracking XP, current streaks, accuracy, and leveling.
  - Beautiful visual charts (powered by Recharts) showing performance trends over time.

### Gamification & Engagement
- **Dynamic Leaderboard**: An advanced podium-style global leaderboard highlighting Top 3 players in gold/silver/bronze, alongside a fully ranked list.
=======
### 🎓 Dual-Role Architecture
- **👨‍🏫 Teacher Portal**: 
  - Effortless quiz builder with timed limits, automated category mapping, and difficulty scaling.
  - Comprehensive dashboard offering deep insights into student performance.
  - Live category-wise accuracy tracking and system-wide metrics (powered by Recharts).
  - Manage existing students, track platform traffic, and review historical data.
- **👩‍🎓 Student Portal**:
  - Personalized dashboard tracking Total XP, current streaks, exact accuracy percentages, and dynamic leveling.
  - Beautiful visual charts showing performance trends over time.
  - Interactive Profile Settings with dynamic 3D Avatars (powered by Dicebear) and secure password resets.

### 🎮 Gamification & Engagement
- **Dynamic Leaderboard**: An advanced podium-style global leaderboard highlighting Top 3 players in gold/silver/bronze, alongside a fully ranked chronological list.
>>>>>>> 9b582cf ( updated some code)
- **Experience & Leveling**: Earn XP for every correct answer, leveling up as you conquer more content.
- **Streaks & Badges**: Daily login & completion streaks to encourage consistent learning habits, with visually stunning CSS badges.
- **Dynamic Confetti Feedback**: "Wow factor" responsive confetti drops when achieving 100% on a quiz assessment.

<<<<<<< HEAD
###  Real-Time Multiplayer Arena
- Built with **Spring Boot WebSockets (STOMP)**.
=======
### 🌐 Real-Time Multiplayer Arena
- Built with **Spring Boot WebSockets (STOMP)** for full-duplex communication.
>>>>>>> 9b582cf ( updated some code)
- Teachers can initiate a "Live Quiz Event", generating a unique 4-digit room code.
- Students join the lobby, wait for the host, and compete synchronously.
- Live, real-time scoreboard updates broadcasted to all participants over WebSockets, complete with auto-scrolling live web-chat.

<<<<<<< HEAD

## Technology Stack
=======
### 🎨 Premium UI/UX Aesthetic
- **Glassmorphism**: Sleek, semi-transparent frosted-glass panels on deep, dark-mode backgrounds.
- **Custom Split-Screen Authentication**: A stunning elite responsive split-screen Login & Registration portal featuring 3D artwork.
- **Responsive Layouts**: 100% Mobile-first responsive grids and `@media` flexboxes to ensure beautifully scaling dashboards on iOS and Android viewports.

---

## 🛠️ Technology Stack & Architecture
>>>>>>> 9b582cf ( updated some code)

### Backend (Developed by Harsha Adapa)
- **Java 17 & Spring Boot 3**: Core backend architecture for secure REST APIs.
- **Spring Security & JWT**: Fully stateless authentication and protected role-based web routes (`@PreAuthorize`).
- **Spring Data JPA & Hibernate**: Object-Relational Mapping (ORM) handling complex database relationships between Quizzes, Questions, Attempts, and Users.
- **Spring WebSockets / STOMP**: Dedicated `WebSocketConfig` mapping for real-time multiplayer connections over `/live-quiz-ws`.
- **MySQL**: Relational database managing persistence schemas.

### Frontend (Developed by Harsha Adapa)
- **React 18 & Vite**: Lightning-fast build tooling and component-based UI.
- **React Router v6**: Protected routing with intelligent `RequireAuth` boundary logic.
- **Recharts**: High-performance, declarative visualization charting for analytics.
- **Lucide React**: Beautifully crafted SVG UI iconography.
- **Axios**: Promised-based HTTP client managing persistent JWT Interceptor tokens.
- **canvas-confetti**: Interactive visual reward systems.
- **Vanilla CSS**: Advanced modern layout techniques achieving responsive glassmorphism securely.

---

## 🚀 Deployment & Setup Instructions

### Prerequisites
- JDK 17+ installed.
- Node.js (v16+) and npm installed.
- MySQL server running locally (or hosted equivalent).

### 1. Database Configuration
Ensure you have a local MySQL instance running. Create a schema matching your credentials in `backend/src/main/resources/application.properties`. Wait for Hibernate to automatically scaffold (`update`) the required tables upon boot.

### 2. Run the Backend Server (Spring Boot)
Open a terminal in the `backend` directory:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
*The REST server and WebSocket broker will initialize on `http://localhost:8080/`.*

### 3. Run the Frontend Client (React / Vite)
Open a new terminal in the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
*The web client will compile and launch instantly at `http://localhost:5173/`.*

**Submitted by:** Harsha Adapa
**Project Type:** Full-Stack Web Development 

This complete repository source code proves mastery over:
1. **Full-Stack Application Architecture** from database schema to UI delivery.
2. Complete implementation of **Secure JWT Authentication & Password Encoding**.
3. Utilization of **Real-Time Data Streams** via native WebSockets.
4. Competence in writing **Complex Data Models and DTOs**.
5. Empathy for modern, industry-standard **Responsive Frontend Experience**.

