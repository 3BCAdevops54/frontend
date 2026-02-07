# JobTracker | Full-Stack Career Management

**JobTracker** is a high-performance web application designed to help job seekers organize their career journey. From the first "Apply" button to the final "Offer," this tool tracks every step of the process with a clean, intuitive interface.

---
## Overview

This project provides a RESTful API for tracking the job application.
## TECHNOLOGY USED

 - **java**:17
 - **Spring Boot**:3.3.4
 - **Docker**:Containerization support
 - **Maven**:To build the dependencies
   
## Features

## Key Features
-**Dynamic Dashboard**: View all job applications in a structured, easy-to-read table format.

-**CRUD Integration**: Seamlessly Add, Edit, and Delete job applications through interactive modals.

-**Status Management**: Real-time tracking with color-coded labels (e.g., INTERVIEW, OFFERED, REJECTED).

-**Live Search & Filter**: Instantly filter applications by Company name, Job Title, or Location.

## Built With

### **Frontend (The Face)**
* **React.js & Vite:** For a lightning-fast User Experience.
* **Tailwind CSS:** Modern, responsive styling.
* **Vercel:** Globally distributed hosting.

### **Backend (The Brain)**
* **Spring Boot:** Robust Java-based REST API.
* **Docker:** Containerized environment for consistent deployment anywhere.
* **Maven:** Dependency management and build automation.



## Project Structure
```

FRONTEND/
├── .github/workflows/    # CI/CD pipelines (build.yml)
├── src/                  # Core React components & logic
│   ├── App.jsx           # Main application routing and UI logic
│   └── main.jsx          # Application entry point
├── public/               # Static assets
├── index.html            # Main HTML template
├── sonar-project.properties # SonarQube quality gate configuration
├── tailwind.config.cjs   # Custom UI styling configurations
└── vite.config.js        # Optimized build tool configuration
```
---

##  Installation
## Install Dependencies:
  ```bash
  npm install
   ```
### Developement server
```start the server
  npm run dev
```

Access the app at http://localhost:5173.


[!page](<img width="1920" height="1080" alt="api working" src="https://github.com/user-attachments/assets/40083a37-411a-4053-a794-ff990d26cbb9" />


### SonarQube Configuration
To maintain high code quality, the frontend is integrated with SonarQube. Below is the configuration found in the sonar-project.properties file:
sonar.projectKey=jobtracker-frontend
sonar.projectName=JobTracker-Frontend
sonar.projectVersion=1.0
sonar.sources=src
sonar.exclusions=node_modules/**, dist/**
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.sourceEncoding=UTF-8
![SONAR Preview<Proof/ <img width="1920" height="1080" alt="SONAR" src="https://github.com/user-attachments/assets/60fc9311-719b-4c88-945d-cd09a23d4ab2" />
/>

## Versal DEPLOYMENT
  This application is deployed in the vercel for optimal performance.
  ![vercel deployment](<img width="1920" height="1080" alt="vercel deployment frontend" src="https://github.com/user-attachments/assets/a0e9db93-e085-401b-b7af-956e0390982a" />
  The frontend is live and automatically deployed via Vercel:

    Production URL:
    **[https://frontend-nwsg.vercel.app/]
    
## challenges faced##
 - **issue**: Establising reliable communication between frontend and backend.
 - **Bild Optimization issue**: Optimizing build size for vercel deployement.
 - **faced issue in vercel deployment**: i am not able to deploy my frontend from git with node_modules.


    ---
