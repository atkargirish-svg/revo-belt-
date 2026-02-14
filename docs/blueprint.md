# **App Name**: EcoSync AI

## Core Features:

- Real-time CO2 Emission Estimation: Estimate CO2 emissions from indirect signals (Acoustics, Thermal, Energy). The model will use acoustic, thermal and energy data as a tool to provide its CO2 estimates.
- Dashboard with KPI Cards: Display real-time CO2 output, machine acoustic load, and energy usage pattern on the dashboard using KPI cards.
- Multi-Line Chart Visualization: Visualize acoustic noise vs. estimated CO2 emissions using a multi-line chart (Recharts).
- Live Sensor Feed: Provide a live sensor feed displaying real-time machine status (Thermal, Acoustic) with anomaly detection.
- Alert System for Anomalies: Implement a real-time alert system to flag acoustic or thermal anomalies exceeding permissible limits. The LLM will reason whether the anomaly detected exceeds dangerous levels and, as a tool, output the information accordingly.

## Style Guidelines:

- Background: Slate-950 (#0F172A) for a dark mode high-tech terminal look.
- Primary color: Electric blue (#7DF9FF) to represent energy and technology. A bright, saturated color to stand out against the dark background.
- Accent color: Neon green (#39FF14) for secondary highlights and data representation.
- Body and headline font: 'Inter', a grotesque-style sans-serif font, to ensure readability and a modern feel. Note: currently only Google Fonts are supported.
- Use Lucide React icons for all UI elements, ensuring consistency and a modern look.
- Dashboard layout with top header, KPI cards, main chart section, and live sensor feed sidebar, using Tailwind CSS grid system.
- Implement a subtle wave animation for the Machine Acoustic Load KPI card and pulsing animation for the Live Connection dot.