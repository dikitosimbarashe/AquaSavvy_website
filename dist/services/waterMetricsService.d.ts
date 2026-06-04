import { WaterMetrics } from '../types/waterMetrics';
export declare const waterMetricsService: {
    /**
     * Subscribe to realtime water metrics updates
     */
    subscribeToMetrics: (callback: (metrics: WaterMetrics | null) => void) => import("@firebase/firestore").Unsubscribe;
    /**
     * Get current water metrics once
     */
    getMetrics: () => Promise<WaterMetrics | null>;
    /**
     * Update water metrics with audit logging in a transaction
     */
    updateMetrics: (newMetrics: Partial<WaterMetrics>) => Promise<void>;
    /**
     * Initialize metrics if they don't exist
     */
    initializeDefaultMetrics: () => Promise<void>;
};
//# sourceMappingURL=waterMetricsService.d.ts.map