"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchReviews = exports.addReview = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../firebase");
const REVIEWS_COLLECTION = "appReviews";
/**
 * Add a new review to Firestore
 */
const addReview = async (author, rating, title, content, avatar) => {
    try {
        const reviewData = {
            author,
            rating,
            title,
            content,
            avatar,
            helpful: 0,
            timestamp: firestore_1.Timestamp.now(),
            createdAt: new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            })
        };
        const docRef = await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, REVIEWS_COLLECTION), reviewData);
        return {
            id: docRef.id,
            author,
            rating,
            title,
            content,
            avatar,
            helpful: 0,
            date: new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            }),
            timestamp: Date.now()
        };
    }
    catch (error) {
        console.error("Error adding review:", error);
        throw new Error("Failed to save review. Please try again.");
    }
};
exports.addReview = addReview;
/**
 * Fetch all reviews from Firestore, sorted by newest first
 */
const fetchReviews = async () => {
    try {
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, REVIEWS_COLLECTION), (0, firestore_1.orderBy)("timestamp", "desc"));
        const querySnapshot = await (0, firestore_1.getDocs)(q);
        const reviews = [];
        querySnapshot.forEach((doc) => {
            var _a, _b;
            const data = doc.data();
            reviews.push({
                id: doc.id,
                author: data.author,
                rating: data.rating,
                title: data.title,
                content: data.content,
                avatar: data.avatar,
                helpful: data.helpful || 0,
                date: data.createdAt || new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                }),
                timestamp: ((_b = (_a = data.timestamp) === null || _a === void 0 ? void 0 : _a.toMillis) === null || _b === void 0 ? void 0 : _b.call(_a)) || Date.now()
            });
        });
        return reviews;
    }
    catch (error) {
        console.error("Error fetching reviews:", error);
        throw new Error("Failed to load reviews. Please try again.");
    }
};
exports.fetchReviews = fetchReviews;
//# sourceMappingURL=reviewService.js.map