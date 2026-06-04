import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where,
  serverTimestamp,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Challenge {
  id?: string;
  title: string;
  description: string;
  type: string;
  difficulty?: string;
  target: number;
  unit: string;
  xpReward: number;
  ecoPointsReward: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Upcoming' | 'Completed' | 'Draft';
  communityChallenge: boolean;
  createdBy: string;
  createdAt?: Timestamp;
  participantsCount: number;
  progressValue?: string;
  progressLabel?: string;
  progressBar?: string;
  milestones?: any[];
}

export const challengeService = {
  subscribeToChallenges: (callback: (challenges: Challenge[]) => void, type?: 'daily' | 'weekly' | 'community') => {
    let q = query(collection(db, 'challenges'));
    
    if (type === 'community') {
      q = query(collection(db, 'challenges'), where('communityChallenge', '==', true));
    } else if (type === 'daily' || type === 'weekly') {
      q = query(collection(db, 'challenges'), where('type', '==', type));
    }

    return onSnapshot(q, (snapshot) => {
      const challenges = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure dates are strings for the UI
          startDate: data.startDate || '',
          endDate: data.endDate || '',
        } as Challenge;
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

  createChallenge: async (challenge: Omit<Challenge, 'id' | 'createdAt' | 'participantsCount'>) => {
    return addDoc(collection(db, 'challenges'), {
      ...challenge,
      participantsCount: 0,
      createdAt: serverTimestamp(),
    });
  },

  updateChallenge: async (id: string, challenge: Partial<Challenge>) => {
    const challengeRef = doc(db, 'challenges', id);
    return updateDoc(challengeRef, challenge);
  },

  deleteChallenge: async (id: string) => {
    return deleteDoc(doc(db, 'challenges', id));
  }
};
