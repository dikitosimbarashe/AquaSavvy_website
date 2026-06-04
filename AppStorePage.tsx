import { useState, useEffect } from 'react';
import { Star, Download, ChevronLeft, ChevronRight, Shield, Zap, Droplet, Award, Calendar, User, ThumbsUp, Share2, Bookmark, Smartphone, Lock, Database, Eye, Loader2 } from 'lucide-react';
import { addReview, fetchReviews } from './services/reviewService';

interface AppStorePageProps {
  onBack: () => void;
  onDownload: () => void;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  avatar: string;
}

export default function AppStorePage({ onBack, onDownload }: AppStorePageProps) {
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string>('');

  const screenshots = [
    { id: 1, title: 'Home & Water Usage', image: '/images/screenshot-home.png' },
    { id: 2, title: 'Add New Taps', image: '/images/screenshot-add-taps.png' },
    { id: 3, title: 'Help & Support', image: '/images/screenshot-help.png' },
    { id: 4, title: 'Leaderboard & Rankings', image: '/images/screenshot-leaderboard.png' },
    { id: 5, title: 'Add Tap', image: '/images/screenshot-add-tap.png' }
  ];

  const features = [
    {
      icon: Droplet,
      title: 'Real-Time Monitoring',
      description: 'Track your water usage in real-time with smart IoT integration'
    },
    {
      icon: Zap,
      title: 'Instant Alerts',
      description: 'Get notified of leaks, high usage, and maintenance needs'
    },
    {
      icon: Award,
      title: 'Rewards & Challenges',
      description: 'Earn points and unlock achievements for saving water'
    },
    {
      icon: Shield,
      title: 'Verified Plumbers',
      description: 'Connect with certified professionals for repairs and maintenance'
    }
  ];

  // Load reviews from Firestore on component mount
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoadingReviews(true);
        const firebaseReviews = await fetchReviews();
        setUserReviews(firebaseReviews);
        setReviewError('');
      } catch (error) {
        console.error('Failed to load reviews:', error);
        setReviewError('Could not load reviews at this time.');
      } finally {
        setIsLoadingReviews(false);
      }
    };

    loadReviews();
  }, []);

  const stats = {
    averageRating: 4.8,
    totalRatings: 12847,
    fiveStars: 10234,
    fourStars: 2103,
    threeStars: 398,
    twoStars: 87,
    oneStars: 25
  };

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const calculatePercentage = (count: number) => {
    return (count / stats.totalRatings) * 100;
  };

  const nextScreenshot = () => {
    setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
  };

  const prevScreenshot = () => {
    setCurrentScreenshot((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  const handleSubmitReview = async () => {
    if (userRating === 0 || reviewTitle.trim() === '' || reviewContent.trim() === '') {
      setReviewError('Please provide a rating, title, and review content.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewError('');

    try {
      const newReview = await addReview(
        'You',
        userRating,
        reviewTitle,
        reviewContent,
        'YU'
      );

      setUserReviews([newReview, ...userReviews]);
      setShowReviewForm(false);
      setUserRating(0);
      setReviewTitle('');
      setReviewContent('');
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewError('Failed to save your review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">AquaSavvy Store</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* App Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Side - App Info */}
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-5xl font-bold text-slate-900 mb-3">AquaSavvy</h2>
              <p className="text-lg text-blue-600 mb-6 font-medium">Smart Water Management System</p>

              {/* Stats Row */}
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-900 mb-1">{stats.averageRating}★</div>
                  <div className="text-xs text-slate-600">{(stats.totalRatings / 1000).toFixed(0)}K reviews</div>
                </div>
                <div className="h-10 w-px bg-slate-300"></div>
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-900 mb-1">1M+</div>
                  <div className="text-xs text-slate-600">Downloads</div>
                </div>
                <div className="h-10 w-px bg-slate-300"></div>
                <div className="text-center flex flex-col items-center">
                  <div className="text-sm font-medium text-slate-900 mb-1 px-2 py-0.5 border border-slate-400 rounded">12+</div>
                  <div className="text-xs text-slate-600">Rated for 12+</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={onDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-lg font-semibold transition-colors"
                >
                  Install
                </button>
                <button className="p-3 hover:bg-slate-100 rounded-lg transition-colors">
                  <Share2 size={20} className="text-blue-600" />
                </button>
                <button className="p-3 hover:bg-slate-100 rounded-lg transition-colors">
                  <Bookmark size={20} className="text-blue-600" />
                </button>
              </div>

              {/* Device Compatibility */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Smartphone size={16} />
                <span>This app is available for your device</span>
              </div>
            </div>

            {/* Right Side - App Icon */}
            <div className="flex-shrink-0 flex items-center justify-center p-6">
              <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center">
                <Droplet size={96} className="text-white" strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>

        {/* Screenshots Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Screenshots</h3>

          <div className="relative px-12">
            {/* Screenshot Display */}
            <div className="overflow-hidden">
              <div
                className="flex gap-4 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(calc(-${currentScreenshot} * (33.333% + 1rem)))`
                }}
              >
                {screenshots.map((screenshot) => (
                  <div
                    key={screenshot.id}
                    className="flex-shrink-0"
                    style={{ width: 'calc(33.333% - 0.67rem)' }}
                  >
                    <div className="aspect-[9/16] rounded-2xl shadow-xl overflow-hidden bg-slate-200">
                      <img
                        src={screenshot.image}
                        alt={screenshot.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevScreenshot}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextScreenshot}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all z-10"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Screenshot Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentScreenshot(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentScreenshot ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">About this app</h3>
          <div className="space-y-4 text-slate-700">
            <p>
              AquaSavvy is your intelligent companion for water conservation and management. Track your water usage in real-time,
              receive instant alerts for leaks and anomalies, and participate in exciting challenges to earn rewards while saving water.
            </p>
            <p>
              Our smart IoT integration provides accurate monitoring of every tap in your home or business, helping you identify
              wastage and optimize consumption. Connect with verified plumbers instantly when you need repairs, and join a global
              community committed to sustainable water usage.
            </p>
            <p className="font-semibold">Key highlights:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Real-time water consumption tracking with detailed analytics</li>
              <li>Smart leak detection with instant mobile notifications</li>
              <li>Daily, weekly, and community challenges with rewards</li>
              <li>Verified plumber marketplace for quick professional help</li>
              <li>Comprehensive water usage reports and insights</li>
              <li>Multi-tap monitoring for homes and businesses</li>
            </ul>
            <p className="text-sm text-slate-600 mt-4">Updated on Apr 20, 2026</p>
          </div>
        </div>

        {/* Data Safety Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Data safety</h3>
          <p className="text-slate-700 mb-6">
            Safety starts with understanding how developers collect and share your data. Data privacy and security
            practices may vary based on your use, region, and age. The developer provided this information and may update it over time.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="p-2 bg-white rounded-lg">
                <Lock size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-1">No data shared with third parties</h4>
                <p className="text-sm text-slate-600">The developer states that this app doesn't share user data with other companies or organizations</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="p-2 bg-white rounded-lg">
                <Database size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-1">Data is encrypted in transit</h4>
                <p className="text-sm text-slate-600">Your data is transferred over a secure connection using industry-standard encryption</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="p-2 bg-white rounded-lg">
                <Eye size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-1">You can request data deletion</h4>
                <p className="text-sm text-slate-600">You can contact the developer to request that your data be deleted</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500 mt-6">Learn more about how developers declare data collection and sharing</p>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ratings & Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Ratings & Reviews</h3>

          {/* Rating Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-6xl font-bold text-slate-900 mb-2">{stats.averageRating}</div>
              <div className="flex justify-center mb-2">
                {renderStars(5, 20)}
              </div>
              <p className="text-slate-600">{stats.totalRatings.toLocaleString()} ratings</p>
            </div>

            {/* Rating Bars */}
            <div className="space-y-2">
              {[
                { stars: 5, count: stats.fiveStars },
                { stars: 4, count: stats.fourStars },
                { stars: 3, count: stats.threeStars },
                { stars: 2, count: stats.twoStars },
                { stars: 1, count: stats.oneStars }
              ].map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-12">{rating.stars} star</span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                      style={{ width: `${calculatePercentage(rating.count)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-600 w-16 text-right">
                    {rating.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Write Review Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmittingReview}
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {/* Error Message */}
          {reviewError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{reviewError}</p>
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <div className="border border-slate-300 rounded-xl p-6 mb-6 bg-slate-50">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Share your experience</h4>

              {/* Star Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="transition-transform hover:scale-110 disabled:opacity-50"
                      disabled={isSubmittingReview}
                    >
                      <Star
                        size={32}
                        className={star <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Review Title</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
                  disabled={isSubmittingReview}
                />
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Your Review</label>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Share your thoughts about the app..."
                  rows={5}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none disabled:opacity-50"
                  disabled={isSubmittingReview}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitReview}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={isSubmittingReview}
              >
                {isSubmittingReview && <Loader2 size={18} className="animate-spin" />}
                {isSubmittingReview ? 'Saving...' : 'Submit Review'}
              </button>
            </div>
          )}

          {/* Individual Reviews */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-slate-900">User Reviews</h4>
            
            {isLoadingReviews ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600">Loading reviews...</span>
              </div>
            ) : userReviews.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              userReviews.map((review) => (
                <div key={review.id} className="border-b border-slate-200 pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {review.avatar}
                    </div>

                    <div className="flex-1">
                      {/* Reviewer Info */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-bold text-slate-900">{review.author}</div>
                          <div className="text-xs text-slate-500">{review.date}</div>
                        </div>
                        {renderStars(review.rating, 16)}
                      </div>

                      {/* Review Title & Content */}
                      <h5 className="font-bold text-slate-900 mb-2">{review.title}</h5>
                      <p className="text-slate-700 mb-3">{review.content}</p>

                      {/* Helpful Button */}
                      <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                        <ThumbsUp size={16} />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* App Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-slate-600 mb-1">Developer</div>
              <div className="font-semibold text-slate-900">AquaSavvy Inc.</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Category</div>
              <div className="font-semibold text-slate-900">Utilities & Productivity</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Version</div>
              <div className="font-semibold text-slate-900">1.0.0 (Beta)</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Size</div>
              <div className="font-semibold text-slate-900">124 MB</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Last Updated</div>
              <div className="font-semibold text-slate-900">April 20, 2026</div>
            </div>
            <div>
              <div className="text-sm text-slate-600 mb-1">Age Rating</div>
              <div className="font-semibold text-slate-900">4+</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Droplet size={24} className="text-blue-400" />
              <span className="text-lg font-semibold">AquaSavvy Store</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-300">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
              <a href="#" className="hover:text-white transition-colors">Help Center</a>
            </div>
          </div>
          <div className="text-center text-sm text-slate-400 mt-4">
            © 2026 AquaSavvy Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}