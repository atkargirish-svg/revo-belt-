
# BELTGUARD AI - NodeMCU Integration Guide

Bhai, NodeMCU se data bhejne ke liye niche wala format use karo. Dashboard auto-update ho jayega.

## 🚀 API Endpoint
Data ko is path par **PATCH** ya **PUT** karna hai:
`https://<YOUR-FIREBASE-PROJECT-ID>.firebaseio.com/current.json`

## 📊 JSON Format (Hardware Side)
Aapka ESP32/NodeMCU niche wala JSON structure send karega:

```json
{
  "vibration": 3.4,      // Value in mm/s
  "temperature": 45.2,    // Value in Celsius
  "speed": 1.45,          // Value in m/s
  "alignment": 0.5,       // Lateral offset in mm
  "sectionId": "section_03", 
  "sectionName": "Processing Zone",
  "timestamp": 1716542400000 
}
```

## 🛠 Setup Steps
1. **Firebase Rules**: Console mein jaao, Realtime Database select karo, aur **Rules** tab mein `.read` aur `.write` ko `true` kar do.
2. **Seeding**: App ke **Settings** page par jaake "Fix & Seed" button dabao taaki initial nodes ban jayein.
3. **Check Live**: Data send hote hi Dashboard par green signals active ho jayenge.
