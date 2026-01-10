# 🎓 Exam Seating Arrangement Generator

<div align="center">

![C++](https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**A high-performance, automated system to generate optimized and cheat-proof exam seating plans.**  
*Built with C++ DSA logic and a premium React-based cyberpunk interface.*



</div>

---

## 📖 Table of Contents
- [✨ Key Features](#-key-features)
- [🚀 Tech Stack](#-tech-stack)
- [🛠️ Installation](#️-installation)
- [💻 Usage](#-usage)
- [🏗️ Project Structure](#️-project-structure)
- [🔧 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📧 Contact](#-contact)

---

## ✨ Key Features

This application combines robust Data Structures & Algorithms with a **premium, interactive UI**.

- **🎲 Smart Randomized Allocation**: Uses Fisher-Yates shuffle algorithms in C++ to ensure completely unbiased seating.
- **🛡️ Anti-Cheating Logic**: Automated gap calculations to minimize proximity between students.
- **🔄 Stable Reshuffling**: Modify a specific student's seat without disturbing others. Replays allocation history for perfect layout stability.
- **📊 Interactive Visualization**: Modern grid-based seating plan with real-time status (Occupied vs. Vacant).
- **🎨 Premium Cyberpunk UI**:
  - 🕸️ Matrix Digital Rain Background
  - 💡 Interactive Neon Spotlight Effects
  - 🍱 Glassmorphic Bento-style Panels
  - 💫 Fluid Framer Motion Transitions

---

## 🚀 Tech Stack

### Core Logic (DSA)
![C++](https://img.shields.io/badge/C++-00599C?style=flat-square&logo=c%2B%2B&logoColor=white)
- **Data Structures**: Queue (Student Management), Stack (Assignment History).
- **Algorithms**: Randomized Shuffling, Deterministic Seed Replay.

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-FF6000?style=flat-square)

### Backend (Bridge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
- **Process Spawning**: Integrates Node.js with Compiled C++ via `child_process`.

---

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/exam-seating-generator.git
   cd exam-seating-generator
   ```

2. **Compile the C++ Engine**:
   Ensure you have a C++ compiler (like MinGW/g++) installed.
   ```bash
   g++ project.cpp -o project.exe
   ```

3. **Setup Backend Server**:
   ```bash
   cd web-interface/server
   npm install
   ```

4. **Setup Frontend Client**:
   ```bash
   cd ../client
   npm install
   ```

---

## 💻 Usage

### 1. Start the Backend
Handles the communication between the UI and the C++ logic (Port 3001).
```bash
# Inside web-interface/server
node index.js
```

### 2. Start the Frontend
The interactive user interface.
```bash
# Inside web-interface/client
npm run dev
```

### 3. Generate Arrangement
- Open `http://localhost:5173` in your browser.
- Enter the **Number of Students** and **Total Seats**.
- Input the **Roll Numbers** for the registry.
- Hit **Process Allocation** to see the magic happen!
- Use **Modify Allocation** to reshuffle a specific student's seat while keeping others locked.

---

## 🏗️ Project Structure

```text
├── project.cpp           # Core C++ DSA Logic (Queue, Stack, Shuffling)
├── project.exe           # Compiled Seating Engine
├── web-interface/                 
│   ├── client/           # React + Vite Frontend
│   │   ├── src/
│   │   │   ├── App.jsx   # Main UI & Simulation Logic
│   │   │   └── index.css # Premium Cyberpunk Styles
│   └── server/           # Express.js Proxy Server
│       └── index.js      # C++ Process Spawner & API
└── README.md
```

---

## 🔧 Troubleshooting

**Common Issues:**

1. **C++ Compilation Error**:
   - Ensure `g++` is added to your system PATH.
   - If on Linux/macOS, modify the backend `spawn` command to call `./project` instead of `project.exe`.

2. **Backend Connection Failed**:
   - Ensure the server is running on port 3001.
   - Check if your firewall is blocking internal process spawning.

3. **Seating Arrangement "Jumping" during Modify**:
   - The system uses persistent seeds. Ensure the `BaseSeed` logged in the console stays consistent during "Modify" actions.

---

## 🤝 Contributing

1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📧 Contact

<div align="center">

<a href="https://salikahmad.vercel.app/">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=FF1F1F&center=true&vCenter=true&width=435&lines=Engineered+By+Salik+Ahmad;Optimizing+Academic+Logistics;Copyright+(c)+2026" alt="Typing SVG" />
</a>

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit%20Site-red?style=for-the-badge&logo=google-chrome)](https://salikahmad.vercel.app/)
[![Email](https://img.shields.io/badge/Email-salikahmad702%40gmail.com-red?style=for-the-badge&logo=gmail)](mailto:salikahmad702@gmail.com)

</div>
