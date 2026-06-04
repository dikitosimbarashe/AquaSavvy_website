"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waterMetricsService = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../firebase");
const METRICS_DOC_PATH = 'system_settings/water_metrics';
exports.waterMetricsService = {
    /**
     * Subscribe to realtime water metrics updates
     */
    subscribeToMetrics: (callback) => {
        const metricsRef = (0, firestore_1.doc)(firebase_1.db, METRICS_DOC_PATH);
        return (0, firestore_1.onSnapshot)(metricsRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data());
            }
            else {
                callback(null);
            }
        }, (error) => {
            console.error("Error subscribing to water metrics:", error);
            callback(null);
        });
    },
    /**
     * Get current water metrics once
     */
    getMetrics: async () => {
        const metricsRef = (0, firestore_1.doc)(firebase_1.db, METRICS_DOC_PATH);
        const snapshot = await (0, firestore_1.getDoc)(metricsRef);
        return snapshot.exists() ? snapshot.data() : null;
    },
    /**
     * Update water metrics with audit logging in a transaction
     */
    updateMetrics: async (newMetrics) => {
        const user = firebase_1.auth.currentUser;
        if (!user)
            throw new Error("Authentication required");
        const metricsRef = (0, firestore_1.doc)(firebase_1.db, METRICS_DOC_PATH);
        return (0, firestore_1.runTransaction)(firebase_1.db, async (transaction) => {
            const metricsDoc = await transaction.get(metricsRef);
            const previousValues = metricsDoc.exists() ? metricsDoc.data() : null;
            const updatedMetrics = {
                ...previousValues,
                ...newMetrics,
                updatedBy: user.email || user.uid,
                updatedAt: (0, firestore_1.serverTimestamp)()
            };
            if (!metricsDoc.exists()) {
                transaction.set(metricsRef, updatedMetrics);
            }
            else {
                transaction.update(metricsRef, updatedMetrics);
            }
            // Create audit log
            const logRef = (0, firestore_1.doc)((0, firestore_1.collection)(firebase_1.db, 'admin_logs'));
            const logEntry = {
                adminId: user.uid,
                adminEmail: user.email || 'unknown',
                action: 'UPDATED_WATER_METRICS',
                previousValues: previousValues || {},
                newValues: newMetrics,
                timestamp: firestore_1.Timestamp.now(), // Transactional serverTimestamp() doesn't work for data being used in same tx sometimes, using Timestamp.now() for log
                affectedSettings: Object.keys(newMetrics)
            };
            transaction.set(logRef, logEntry);
        });
    },
    /**
     * Initialize metrics if they don't exist
     */
    initializeDefaultMetrics: async () => {
        const metricsRef = (0, firestore_1.doc)(firebase_1.db, METRICS_DOC_PATH);
        const snapshot = await (0, firestore_1.getDoc)(metricsRef);
        if (!snapshot.exists()) {
            const defaultMetrics = {
                dailyPerPersonLiters: 150,
                weeklyPerPersonLiters: 1050,
                monthlyPerPersonLiters: 4500,
                difficultyMultipliers: {
                    easy: 1,
                    medium: 1.5,
                    hard: 2,
                    elite: 3
                },
                efficiencyThresholds: {
                    ecoElite: 90,
                    ecoSmart: 70,
                    average: 50
                },
                updatedBy: 'system',
                updatedAt: firestore_1.Timestamp.now()
            };
            await (0, firestore_1.setDoc)(metricsRef, defaultMetrics);
        }
    }
};
//# sourceMappingURL=waterMetricsService.js.map