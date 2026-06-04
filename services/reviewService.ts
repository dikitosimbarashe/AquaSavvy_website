import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  getDocs,
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase";

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

const REVIEWS_COLLECTION = "appReviews";

/**
 * Add a new review to Firestore
 */
export const addReview = async (
  author: string,
  rating: number,
  title: string,
  content: string,
  avatar: string
): Promise<Review> => {
  try {
    const reviewData = {
      author,
      rating,
      title,
      content,
      avatar,
      helpful: 0,
      timestamp: Timestamp.now(),
      createdAt: new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      })
    };

    const docRef = await addDoc(
      collection(db, REVIEWS_COLLECTION),
      reviewData
    );

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
  } catch (error) {
    console.error("Error adding review:", error);
    throw new Error("Failed to save review. Please try again.");
  }
};

/**
 * Fetch all reviews from Firestore, sorted by newest first
 */
export const fetchReviews = async (): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];

    querySnapshot.forEach((doc) => {
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
        timestamp: data.timestamp?.toMillis?.() || Date.now()
      });
    });

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to load reviews. Please try again.");
  }
};
