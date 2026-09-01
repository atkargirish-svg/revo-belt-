
export interface SystemStatus {
  status: 'online' | 'offline';
  deviceId: string;
  lastSeen: number;
  firmwareVersion: string;
  alarm?: boolean;
}

export interface SensorData {
  vibration: number;
  temperature: number;
  speed: number;
  alignment: number;
  sectionId: string;
  sectionName: string;
  timestamp: number;
}

export interface SectionStatus {
  id: string;
  name: string;
  status: 'normal' | 'warning' | 'critical';
  vibration: number;
  temperature: number;
  speed: number;
  alignment: number;
  lastUpdated: number;
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  sensor: 'vibration' | 'temperature' | 'speed' | 'alignment';
  sectionId: string;
  message: string;
  value: number;
  threshold: number;
  timestamp: number;
  acknowledged: boolean;
}

export interface ThresholdConfig {
  vibration: { warning: number; critical: number };
  temperature: { warning: number; critical: number };
  speed: { minWarning: number; maxWarning: number; minCritical: number; maxCritical: number };
  alignment: { warning: number; critical: number };
}

export interface MachineState {
  system: SystemStatus | null;
  current: SensorData | null;
  sections: Record<string, SectionStatus> | null;
  alerts: Record<string, Alert> | null;
  config: { thresholds: ThresholdConfig } | null;
  isConnected: boolean;
}
