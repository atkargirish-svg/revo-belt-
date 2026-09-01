
# BELTGUARD AI - Industrial IoT Dashboard

Predictive monitoring system for industrial conveyor belts using Firebase Realtime Database.

## Setup Instructions

1. **Firebase Project**:
   - Create a new project in the [Firebase Console](https://console.firebase.google.com/).
   - Add a **Web App** to the project.
   - Copy the configuration object.
   - Enable **Realtime Database** and choose a region.

2. **Environment Variables**:
   - Create a `.env.local` file in the root directory.
   - Add the following keys with your Firebase configuration values:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=your_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

3. **Database Rules**:
   - In the Firebase Console, go to **Realtime Database > Rules**.
   - For prototype development (Test Mode):
     ```json
     {
       "rules": {
         ".read": "true",
         ".write": "true"
       }
     }
     ```
   - *Note: In production, strictly restrict these rules to authorized users.*

4. **Initialize Data**:
   - Go to the **Settings** page in the application.
   - Click **"Seed Initial Database Structure"** to populate Firebase with sample industrial data.

5. **Hardware Integration**:
   - Connect your ESP32/NodeMCU to the same Firebase Realtime Database.
   - Update the `/current` and `/system` paths to reflect real sensor data.

## Features
- **Live Monitoring**: Real-time updates for vibration, temperature, speed, and alignment.
- **Conveyor Visualization**: Section-by-section health mapping.
- **Predictive Alerts**: Automatic fault detection based on dynamic thresholds.
- **Health Engine**: Weighted health scoring for preventative maintenance.
