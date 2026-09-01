
import { SensorData, ThresholdConfig } from '../types/sensor';

export function calculateHealthScore(data: SensorData, config: ThresholdConfig): number {
  let score = 100;

  // Vibration Penalty
  if (data.vibration > config.vibration.critical) score -= 40;
  else if (data.vibration > config.vibration.warning) score -= 15;

  // Temperature Penalty
  if (data.temperature > config.temperature.critical) score -= 40;
  else if (data.temperature > config.temperature.warning) score -= 15;

  // Speed Penalty
  if (data.speed < config.speed.minCritical || data.speed > config.speed.maxCritical) score -= 30;
  else if (data.speed < config.speed.minWarning || data.speed > config.speed.maxWarning) score -= 10;

  // Alignment Penalty
  const absOffset = Math.abs(data.alignment);
  if (absOffset > config.alignment.critical) score -= 25;
  else if (absOffset > config.alignment.warning) score -= 10;

  return Math.max(0, score);
}

export function getStatusLabel(score: number): 'NORMAL' | 'WARNING' | 'CRITICAL' {
  if (score >= 75) return 'NORMAL';
  if (score >= 50) return 'WARNING';
  return 'CRITICAL';
}
