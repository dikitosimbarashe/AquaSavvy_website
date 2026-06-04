import { Timestamp } from 'firebase/firestore';
export interface DifficultyMultipliers {
    easy: number;
    medium: number;
    hard: number;
    elite: number;
}
export interface EfficiencyThresholds {
    ecoElite: number;
    ecoSmart: number;
    average: number;
}
export interface WaterMetrics {
    dailyPerPersonLiters: number;
    weeklyPerPersonLiters: number;
    monthlyPerPersonLiters: number;
    difficultyMultipliers: DifficultyMultipliers;
    efficiencyThresholds: EfficiencyThresholds;
    updatedBy: string;
    updatedAt: Timestamp;
}
export type AdminAction = 'UPDATED_WATER_METRICS' | 'RECALCULATED_DERIVED_VALUES' | 'SYSTEM_CONFIG_CHANGED';
export interface AdminLog {
    id?: string;
    adminId: string;
    adminEmail: string;
    action: AdminAction;
    previousValues?: Partial<WaterMetrics>;
    newValues: Partial<WaterMetrics>;
    timestamp: Timestamp;
    affectedSettings: string[];
}
//# sourceMappingURL=waterMetrics.d.ts.map