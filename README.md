
# BELTGUARD AI - NodeMCU Integration & Deployment Guide

Bhai, NodeMCU se data bhejne, Buzzer control karne aur code ko GitHub par push karne ke liye niche wala format use karo.

## 🚀 GitHub Deployment (Push to Repo)
Apne code ko GitHub par push karne ke liye terminal mein ye commands run karein:
1. `git init`
2. `git remote add origin https://github.com/atkargirish-svg/revo-belt-.git`
3. `git add .`
4. `git commit -m "Initial commit: BeltGuard AI System"`
5. `git branch -M main`
6. `git push -u origin main`

## 🚀 Fix Compilation Error (NodeMCU)
Agar aapko `FirebaseESP8266.h: No such file or directory` error aa rahi hai:
1. Arduino IDE mein jao.
2. `Sketch` -> `Include Library` -> `Manage Libraries` click karo.
3. Search karo: **Firebase-ESP8266**.
4. **Mobizt** ki library install karo.

## 📟 NodeMCU (Arduino) Library Requirements
- `Firebase-ESP8266` (by Mobizt)
- `ESP8266WiFi` (Built-in for ESP8266)

## 🚨 Hardware Connections (NodeMCU)
1. **Buzzer (+) / Signal**: NodeMCU **Pin D1** (GPIO 5)
2. **Buzzer (-)**: NodeMCU **GND**

## 📊 Firebase Structure (RTDB)
Data ko is path par update/read karna hai:
`https://studio-8891714996-ea348-default-rtdb.firebaseio.com/`

```json
{
  "current": {
    "vibration": 3.2,
    "temperature": 42.5,
    "speed": 1450,
    "alignment": 0.8,
    "health": 76
  },
  "system": {
    "alarm": false
  }
}
```

## 🛠 Setup Steps
1. **Firebase Rules**: Console mein jaake Realtime Database mein Rules ko `.read: true` aur `.write: true` set karo.
2. **Seeding**: Dashboard load hote hi structure auto-create ho jayega.
3. **Connect Hardware**: D1 pin par buzzer lagao aur enjoy karo!
