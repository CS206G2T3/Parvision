# ParVision AI Golf Coach

ParVision is a full-stack, AI-powered golf coaching application. Designed to integrate artificial intelligence and secure systems architecture, it allows users to upload videos of their golf swings for automated AI analysis and coaching feedback.

## 🗂 Project Architecture

This repository is structured into distinct microservices:

* **`/parvision-mobile` (Mobile App):** The React Native (Expo) frontend for mobile devices. Handles the primary user interface, device media access, and user interaction.
* **`/frontend` (Web UI):** The lightweight web-based user interface for browser access, powered by Vite.
* **`/golf_ai_coach` (AI Service):** The core machine learning and computer vision engine that processes and analyzes uploaded golf swings.
* **`/auth-server` (Security):** Handles secure user authentication, token management, and ensures data privacy across the platform.

## 🛠 Tech Stack

* **Frontend (Web):** React, Vite
* **Frontend (Mobile):** React Native, Expo
* **Backend & Storage:** Firebase (Cloud Storage & Authentication)
* **AI/ML Engine:** Python (Computer Vision/Machine Learning frameworks)
* **Environment:** Node.js / npm

## 💻 Local Development Setup (macOS)

### Prerequisites
1. **Node.js & npm:** Install via [Node.js](https://nodejs.org/) or Homebrew (`brew install node`).
2. **Android Studio:** Required to run the Android Emulator to test the mobile application.

### Environment Configuration
Ensure your macOS terminal (Zsh) is configured to locate the Android SDK. Add the following paths to your `~/.zshrc` file:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## Running the Application
To run the full stack locally, you will need to open two separate terminal windows.

### Start the Emulator: Open Android Studio, navigate to the Virtual Device Manager, and launch your Android emulator.

### Start the Web Frontend (Terminal 1):
Navigate to the frontend directory and start the Vite development server:
cd ../frontend
npx vite --host

### Start the Mobile App (Terminal 2):
Navigate to the mobile app directory and launch the Expo server for Android:
cd Parvision/parvision-mobile
npx expo run:android

## Key Features
Seamless Media Uploads: Users can select and safely upload high-resolution swing videos directly from their device's media library to Firebase Cloud Storage.

Automated AI Analysis: The dedicated AI coach module evaluates swing mechanics to provide actionable feedback.

Secure Access: Industry-standard authentication flow to protect user data and ensure secure access to personal coaching metrics.