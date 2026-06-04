export interface Review {
    id: string;
    author: string;
    rating: number;
    date: string;
    title: string;
    content: string;
    helpful: number;
    avatar: string;
    timestamp: number;
}
/**
 * Add a new review to Firestore
 */
export declare const addReview: (author: string, rating: number, title: string, content: string, avatar: string) => Promise<Review>;
/**
 * Fetch all reviews from Firestore, sorted by newest first
 */
export declare const fetchReviews: () => Promise<Review[]>;
//# sourceMappingURL=reviewService.d.ts.map