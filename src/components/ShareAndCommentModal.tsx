import { useState } from 'react';
import { X, Heart, HandHeart, Users, Share2, MessageCircle, Instagram, Twitter, Youtube, Send, Check } from 'lucide-react';
import { LostItem } from '../types';

interface ShareAndCommentModalProps {
  item: LostItem;
  userEmail: string;
  onClose: () => void;
  onAddComment: (itemId: string, content: string) => void;
  onAddReaction: (itemId: string, reactionType: 'heart' | 'pray' | 'support') => void;
}

function ShareAndCommentModal({ item, userEmail, onClose, onAddComment, onAddReaction }: ShareAndCommentModalProps) {
  const [activeTab, setActiveTab] = useState<'share' | 'comment'>('share');
  const [comment, setComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const shareText = `Help find: ${item.description.substring(0, 80)}... Lost in ${item.city}, ${item.country}. Reward: $${item.rewardAmount}`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform: string) => {
    let url = '';

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'instagram':
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        return;
      case 'youtube':
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        return;
      case 'copy':
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        return;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      onAddComment(item.id, comment);
      setComment('');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    }
  };

  const handleReaction = (reactionType: 'heart' | 'pray' | 'support') => {
    onAddReaction(item.id, reactionType);
    setSelectedReaction(reactionType);
    setTimeout(() => setSelectedReaction(null), 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Share & Support</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 rounded-lg p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-6 border border-blue-100">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900">{item.fullName}</p>
                <p className="text-sm text-gray-600">{item.city}, {item.country}</p>
              </div>
              <div className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                ${item.rewardAmount}
              </div>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">{item.description}</p>
          </div>

          <div className="flex space-x-2 mb-6 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('share')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'share'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={() => setActiveTab('comment')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'comment'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Comment</span>
            </button>
          </div>

          {activeTab === 'share' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">React to this post</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReaction('heart')}
                    className={`flex-1 group relative overflow-hidden bg-gradient-to-br from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-2 border-red-200 hover:border-red-300 rounded-xl py-4 transition-all transform hover:scale-105 ${
                      selectedReaction === 'heart' ? 'scale-110 shadow-lg' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Heart className={`w-6 h-6 text-red-600 transition-all ${selectedReaction === 'heart' ? 'fill-red-600' : 'group-hover:fill-red-600'}`} />
                      <span className="text-sm font-semibold text-red-700">Heart</span>
                      <span className="text-xs text-red-600">{item.reactions.heart}</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleReaction('pray')}
                    className={`flex-1 group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl py-4 transition-all transform hover:scale-105 ${
                      selectedReaction === 'pray' ? 'scale-110 shadow-lg' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <HandHeart className={`w-6 h-6 text-blue-600 transition-all ${selectedReaction === 'pray' ? 'fill-blue-600' : 'group-hover:fill-blue-600'}`} />
                      <span className="text-sm font-semibold text-blue-700">Pray</span>
                      <span className="text-xs text-blue-600">{item.reactions.pray}</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleReaction('support')}
                    className={`flex-1 group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 hover:border-green-300 rounded-xl py-4 transition-all transform hover:scale-105 ${
                      selectedReaction === 'support' ? 'scale-110 shadow-lg' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Users className={`w-6 h-6 text-green-600 transition-all ${selectedReaction === 'support' ? 'fill-green-600' : 'group-hover:fill-green-600'}`} />
                      <span className="text-sm font-semibold text-green-700">Support</span>
                      <span className="text-xs text-green-600">{item.reactions.support}</span>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Share on social media</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white py-4 rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <Twitter className="w-5 h-5 fill-white" />
                    <span className="font-semibold">Twitter</span>
                  </button>

                  <button
                    onClick={() => handleShare('instagram')}
                    className="flex items-center justify-center space-x-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white py-4 rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="font-semibold">Instagram</span>
                  </button>

                  <button
                    onClick={() => handleShare('youtube')}
                    className="flex items-center justify-center space-x-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <Youtube className="w-5 h-5" />
                    <span className="font-semibold">YouTube</span>
                  </button>

                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center justify-center space-x-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-4 rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="font-semibold">Copy Link</span>
                  </button>
                </div>
              </div>

              {showSuccess && (
                <div className="flex items-center justify-center space-x-2 bg-green-50 border border-green-200 text-green-700 py-3 px-4 rounded-xl animate-in fade-in slide-in-from-bottom duration-300">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Success! Thank you for sharing</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'comment' && (
            <div className="space-y-4">
              {item.comments.length > 0 && (
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 sticky top-0 bg-white py-2">
                    Comments ({item.comments.length})
                  </h3>
                  {item.comments.map((c) => (
                    <div key={c.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{c.author}</span>
                        <span className="text-xs text-gray-500">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{c.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
                  Add your comment
                </label>
                <div className="relative">
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Share your support, tips, or any helpful information..."
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Posting as: <span className="font-medium">{userEmail}</span>
                </p>
              </div>

              {showSuccess ? (
                <div className="flex items-center justify-center space-x-2 bg-green-50 border border-green-200 text-green-700 py-3 px-4 rounded-xl animate-in fade-in slide-in-from-bottom duration-300">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Comment posted successfully!</span>
                </div>
              ) : (
                <button
                  onClick={handleSubmitComment}
                  disabled={!comment.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  <Send className="w-4 h-4" />
                  <span>Post Comment</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShareAndCommentModal;
