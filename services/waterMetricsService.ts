import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  addDoc, 
  serverTimestamp,
  Timestamp,
  runTransaction
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { WaterMetrics, AdminLog } from '../types/waterMetrics';

const METRICS_DOC_PATH = 'system_settings/water_metrics';

export const waterMetricsService = {
  /**
   * Subscribe to realtime water metrics updates
   */
  subscribeToMetrics: (callback: (metrics: WaterMetrics | null) => void) => {
    const metricsRef = doc(db, METRICS_DOC_PATH);
    return onSnapshot(metricsRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as WaterMetrics);
      } else {
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
  getMetrics: async (): Promise<WaterMetrics | null> => {
    const metricsRef = doc(db, METRICS_DOC_PATH);
    const snapshot = await getDoc(metricsRef);
    return snapshot.exists() ? (snapshot.data() as WaterMetrics) : null;
  },

  /**
   * Update water metrics with audit logging in a transaction
   */
  updateMetrics: async (newMetrics: Partial<WaterMetrics>) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");

    const metricsRef = doc(db, METRICS_DOC_PATH);
    
    return runTransaction(db, async (transaction) => {
      const metricsDoc = await transaction.get(metricsRef);
      const previousValues = metricsDoc.exists() ? metricsDoc.data() as WaterMetrics : null;

      const updatedMetrics = {
        ...previousValues,
        ...newMetrics,
        updatedBy: user.email || user.uid,
        updatedAt: serverTimestamp()
      };

      if (!metricsDoc.exists()) {
        transaction.set(metricsRef, updatedMetrics);
      } else {
        transaction.update(metricsRef, updatedMetrics);
      }

      // Create audit log
      const logRef = doc(collection(db, 'admin_logs'));
      const logEntry: AdminLog = {
        adminId: user.uid,
        adminEmail: user.email || 'unknown',
        action: 'UPDATED_WATER_METRICS',
        previousValues: previousValues || {},
        newValues: newMetrics,
        timestamp: Timestamp.now(), // Transactional serverTimestamp() doesn't work for data being used in same tx sometimes, using Timestamp.now() for log
        affectedSettings: Object.keys(newMetrics)
      };
      
      transaction.set(logRef, logEntry);
    });
  },

  /**
   * Initialize metrics if they don't exist
   */
  initializeDefaultMetrics: async () => {
    const metricsRef = doc(db, METRICS_DOC_PATH);
    const snapshot = await getDoc(metricsRef);
    
    if (!snapshot.exists()) {
      const defaultMetrics: WaterMetrics = {
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
        updatedAt: Timestamp.now()
      };
      await setDoc(metricsRef, defaultMetrics);
    }
  }
};
