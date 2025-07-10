# 🏛️ Athena — Your Personal Web Assistant

**Athena** is a browser-based personal assistant that transforms your browser into a living, thinking workspace. Breathe with live wallpapers. Focus with ambient sound. Plan, track, and ship with AI-driven microservices for tasks, time, and AGILE flow.

Not just productivity — presence.
![demo](demo.gif)  
<sub>⚠️ Actual performance is smoother — 
this GIF is limited in frame rate and color depth.</sub>

## 🚀 Features (in development)

- 🌌 **Live animated backgrounds** (video wallpapers directly in your browser)
- 🧭 **Bottom panel** with buttons to launch micro-windows
- 🪟 **Floating draggable windows**:
  - 🎵 Ambient sound & music player
  - ⏳ Pomodoro timer, stopwatch, and countdown timer
- 🎨 Ability to change background dynamically from the interface

---

## 🧱 Tech Stack

### Frontend
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- SCSS for styling
- Modular component structure
- Custom drag-and-drop behavior for window management

### Backend
- [Django](https://www.djangoproject.com/)
- REST API (planned)
- PostgreSQL or similar DB (planned)

> ⚠️ The current backend in the repository is legacy and serves **only as a reference**. It will be fully replaced.

---

## ⚙️ Getting Started

```bash
cd frontend
npm install
npm install vite-plugin-svgr --save-dev
npm install -D sass-embedded
npm install @mui/material @emotion/react @emotion/styled
npm run dev
```

Frontend will be available at http://localhost:5173
