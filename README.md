
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
   - For prototype testing (Realtime Database Rules):
     ```json
     {
       "rules": {
         ".read": true,
         ".write": true
       }
     }
     ```

4. **Initialize Data**:
   - Go to the **Settings** page in the application.
   - Click **"Seed Initial Database Structure"** to populate the system nodes. This is mandatory for the dashboard to function correctly.

## 📊 Hardware Integration (NodeMCU/ESP32)

Your NodeMCU should push data to the `/current` path in JSON format. 

**API Endpoint Path**: `/current`
**Data Schema (JSON)**:
```json
{
  "vibration": 3.4,     // Value in mm/s
  "temperature": 45.2,   // Value in °C
  "speed": 1.45,         // Value in m/s
  "alignment": 0.5,      // Offset in mm
  "sectionId": "section_01", // The active belt section ID
  "sectionName": "Main Belt",
  "timestamp": 1716542400000 // UNIX Epoch in milliseconds
}
```

To update overall section health, write to `/sections/<id>`:
```json
{
  "status": "normal",
  "vibration": 2.5,
  "temperature": 40.0,
  "lastUpdated": 1716542400000
}
```

## 🛠 Features
- **Real-time Synchronization**: Powered by Firebase Realtime Database.
- **Predictive Analytics**: Genkit-powered operational insights.
- **Industrial UI**: High-fidelity dashboard optimized for factory floors.
