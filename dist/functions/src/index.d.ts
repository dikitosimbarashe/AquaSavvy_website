/**
 * Triggered when water metrics are updated in system_settings/water_metrics.
 * This function logs the change and can trigger global recalculations.
 */
export declare const onWaterMetricsUpdate: import("firebase-functions/core").CloudFunction<import("firebase-functions/v2/firestore").FirestoreEvent<import("firebase-functions/v2/firestore").Change<import("firebase-functions/v2/firestore").QueryDocumentSnapshot> | undefined, {}>>;
/**
 * Validates water metrics before they are saved.
 */
export declare const validateWaterMetrics: import("firebase-functions/core").CloudFunction<import("firebase-functions/v2/firestore").FirestoreEvent<import("firebase-functions/v2/firestore").Change<import("firebase-functions/v2/firestore").DocumentSnapshot> | undefined, {}>>;
export declare const api: import("firebase-functions/v2/https").HttpsFunction;
//# sourceMappingURL=index.d.ts.map