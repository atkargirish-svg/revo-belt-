
# BELTGUARD AI - NodeMCU Integration Guide

Bhai, NodeMCU se data bhejne ke liye niche wala format use karo. Dashboard auto-update ho jayega.

## 🚀 API Endpoint
Data ko is path par **PATCH** ya **PUT** karna hai:
`https://<YOUR-FIREBASE-PROJECT-ID>.firebaseio.com/current.json`

## 📊 JSON Format (Hardware Side)
Aapka ESP32/NodeMCU niche wala JSON structure send karega:

```json
{
  "vibration": 3.2,
  "temperature": 42.5,
  "speed": 1450,
  "alignment": 0.8,
  "sectionId": "section_03",
  "sectionName": "Section 03",
  "timestamp": 1716542400000 
}
```

## 🛠 Setup Steps
1. **Firebase Rules**: Console mein jaao, Realtime Database select karo, aur **Rules** tab mein `.read` aur `.write` ko `true` kar do.
2. **Seeding**: App ke **Settings** page par jaake "Fix & Seed" button dabao taaki initial nodes ban jayein.
3. **Check Live**: Data send hote hi Dashboard par green signals active ho jayenge.
