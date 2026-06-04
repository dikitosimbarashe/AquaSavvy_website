import { Timestamp } from 'firebase/firestore';
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
export declare const challengeService: {
    subscribeToChallenges: (callback: (challenges: Challenge[]) => void, type?: "daily" | "weekly" | "community") => import("@firebase/firestore").Unsubscribe;
    createChallenge: (challenge: Omit<Challenge, "id" | "createdAt" | "participantsCount">) => Promise<import("@firebase/firestore").DocumentReference<import("@firebase/firestore").DocumentData, import("@firebase/firestore").DocumentData>>;
    updateChallenge: (id: string, challenge: Partial<Challenge>) => Promise<void>;
    deleteChallenge: (id: string) => Promise<void>;
};
//# sourceMappingURL=challengeService.d.ts.map