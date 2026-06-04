"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.challengeService = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../firebase");
exports.challengeService = {
    subscribeToChallenges: (callback, type) => {
        let q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'challenges'));
        if (type === 'community') {
            q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'challenges'), (0, firestore_1.where)('communityChallenge', '==', true));
        }
        else if (type === 'daily' || type === 'weekly') {
            q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'challenges'), (0, firestore_1.where)('type', '==', type));
        }
        return (0, firestore_1.onSnapshot)(q, (snapshot) => {
            const challenges = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Ensure dates are strings for the UI
                    startDate: data.startDate || '',
                    endDate: data.endDate || '',
                };
            });
            // Sort in memory safely
            const sortedChallenges = challenges.sort((a, b) => {
                const timeA = a.createdAt && typeof a.createdAt.toMillis === 'function' ? a.createdAt.toMillis() : 0;
                const timeB = b.createdAt && typeof b.createdAt.toMillis === 'function' ? b.createdAt.toMillis() : 0;
                return timeB - timeA;
            });
            callback(sortedChallenges);
        }, (error) => {
            console.error("Firestore subscription error:", error);
            callback([]); // Stop loading even on error
        });
    },
    createChallenge: async (challenge) => {
        return (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, 'challenges'), {
            ...challenge,
            participantsCount: 0,
            createdAt: (0, firestore_1.serverTimestamp)(),
        });
    },
    updateChallenge: async (id, challenge) => {
        const challengeRef = (0, firestore_1.doc)(firebase_1.db, 'challenges', id);
        return (0, firestore_1.updateDoc)(challengeRef, challenge);
    },
    deleteChallenge: async (id) => {
        return (0, firestore_1.deleteDoc)((0, firestore_1.doc)(firebase_1.db, 'challenges', id));
    }
};
//# sourceMappingURL=challengeService.js.map