# Bro Pay Application Suite

Welcome to the **Bro Pay** digital e-wallet suite. This project is divided into three main components:

1. **`backend/`**: A NestJS server backend that serves as the core API framework.
2. **`frontend/`**: A React + TypeScript + Vite web application built with a responsive dashboard layout and glassmorphism themes.
3. **`mobile/`**: A Flutter mobile application built with a high-fidelity dark neon visual design, custom-painted Bezier line graphs, e-wallet cards, and quick actions.

---

## 🛠️ Project Structure & Setup

### 1. React Web Application (`frontend/`)
To run the web app locally:
```bash
cd frontend
npm install
npm run dev
```

To compile production bundles:
```bash
npm run build
```

### 2. Flutter Mobile Application (`mobile/`)
The mobile app is optimized for zero-dependency execution.
To run the mobile app locally:
```bash
cd mobile
flutter pub get
flutter run
```

To build the web version of the mobile app:
```bash
flutter build web
```

---

## 📸 Screenshots & Mockups
You can find the mobile UI screenshots in the `/screenshots` directory:
- [Login Screen](screenshots/login_screen.png)
- [Dashboard Screen](screenshots/dashboard_screen.png)
