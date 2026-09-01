
# BELTGUARD AI - Industrial IoT Dashboard

Professional predictive monitoring system for industrial conveyor belts.

## 🚀 Setup Instructions

1. **Firebase Project**:
   - Create a new project in the [Firebase Console](https://console.firebase.google.com/).
   - Add a **Web App** and copy the configuration.
   - Enable **Realtime Database** and choose your region.

2. **Environment Variables**:
   - Create a `.env.local` file in the root directory.
   - Paste your configuration:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=...
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
     NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
     NEXT_PUBLIC_FIREBASE_APP_ID=...
     ```

3. **Database Rules**:
   - For prototype testing:
     ```json
     {
       "rules": {
         ".read": "true",
         ".write": "true"
       }
     }
     ```

4. **Initialize Data**:
   - Go to the **Settings** page in the application.
   - Click **"Seed Initial Database Structure"** to populate the system nodes.

## 📊 Database Schema

- `/system`: Device health & heartbeat.
- `/current`: Live sensor telemetry.
- `/sections`: Section-specific diagnostics.
- `/config/thresholds`: User-defined safety limits.
- `/alerts`: Log of fault events.

## 🛠 Hardware Connection
Your ESP32/NodeMCU should write to the `/current` node using the Firebase Arduino library. The dashboard will automatically reflect changes via real-time listeners.
