
# BELTGUARD AI - NodeMCU Integration Guide

Bhai, NodeMCU se data bhejne aur Buzzer control karne ke liye niche wala format use karo.

## 🚀 API Endpoint (RTDB)
Data ko is path par update karna hai:
`https://studio-8891714996-ea348-default-rtdb.firebaseio.com/`

## 📊 Firebase Structure
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

## 🛠 Hardware Connections (NodeMCU)
1. **Buzzer (+) / Signal**: NodeMCU **Pin D1** (GPIO 5)
2. **Buzzer (-)**: NodeMCU **GND**

## 📟 NodeMCU (Arduino) Library Requirements
- Install `Firebase-ESP8266` by Mobizt.
- Install `ESP8266WiFi`.

## 🚨 Alarm Handling
Dashboard par "Trigger Alarm" button dabane se Firebase mein `/system/alarm` node `true` ho jata hai. NodeMCU is path ko har 1 second mein read karta hai aur `true` hone par D1 pin ko high kar deta hai (Buzzer ON).

## 🛠 Setup Steps
1. **Firebase Rules**: Console mein jaake Realtime Database mein Rules ko `.read: true` aur `.write: true` set karo.
2. **Seeding**: Dashboard load hote hi structure auto-create ho jayega.
3. **Connect Hardware**: D1 pin par buzzer lagao aur enjoy karo!
