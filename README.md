
# BELTGUARD AI - Industrial IoT Dashboard

Professional predictive monitoring system for industrial conveyor belts.

## 🚀 Setup Instructions

1. **Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/).
   - Enable **Realtime Database** and choose a region.
   - **Rules**: In the Rules tab, set `.read` and `.write` to `true` (Test Mode).

2. **Environment Variables**:
   - Your `.env.local` must have:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=your_key
     NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com/
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     ...
     ```

3. **Initialize Data**:
   - Open the app, go to **Settings** page.
   - Click **"Seed Initial Database Structure"**. This creates the necessary nodes.

## 📊 NodeMCU / ESP32 Integration

Send data to the `/current` path using a HTTP PATCH or POST request.

**Endpoint**: `https://<YOUR-PROJECT-ID>.firebaseio.com/current.json`
**JSON Format**:
```json
{
  "vibration": 3.4,     // mm/s
  "temperature": 45.2,   // Celsius
  "speed": 1.45,         // m/s
  "alignment": 0.5,      // mm offset
  "sectionId": "section_03", 
  "sectionName": "Processing Zone",
  "timestamp": 1716542400000 
}
```

## 🛠 Features
- **Real-time Sync**: Firebase Realtime Database integration.
- **Z01-Z06 Mapping**: Segmented industrial visualization.
- **Predictive Analytics**: Genkit-powered maintenance insights.
```