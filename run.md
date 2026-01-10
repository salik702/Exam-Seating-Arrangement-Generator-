# How to Run the Project

Follow these steps to start the application:

### 1. Compile the C++ Backend (Optional)
Ensure you have the latest version of the C++ logic compiled:
```powershell
g++ project.cpp -o project.exe
```

### 2. Start the Backend Server
Open a terminal in the project root and run:
```powershell
cd web-interface/server
node index.js
```

### 3. Start the Frontend Application
Open a **new** terminal in the project root and run:
```powershell
cd web-interface/client
npm run dev
```

### 4. Access the App
Once both are running:
- The backend will be listening on `http://localhost:3001`
- The frontend will be available at the URL shown in the terminal (usually `http://localhost:5173`)
