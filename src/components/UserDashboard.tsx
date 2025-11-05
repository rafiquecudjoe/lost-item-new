import { useState } from 'react';
import { LogOut, Search, MapPin, DollarSign, Calendar, Eye, Plus, Phone, Mail, User, Share2, MessageCircle, Heart, HandHeart, Users } from 'lucide-react';
import { LostItem } from '../types';
import { mockLostItems } from '../data/mockData';
import ReportSightingModal from './ReportSightingModal';
import ReportLostItemModal from './ReportLostItemModal';
import ShareAndCommentModal from './ShareAndCommentModal';

interface UserDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

function UserDashboard({ userEmail, onLogout }: UserDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareItem, setShareItem] = useState<LostItem | null>(null);
  const [items, setItems] = useState(mockLostItems);
  const approvedItems = items.filter(item => item.status === 'approved');

  const filteredItems = approvedItems.filter(item =>
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleAddComment = (itemId: string, content: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          comments: [...item.comments, {
            id: `c${Date.now()}`,
            author: userEmail.split('@')[0],
            authorEmail: userEmail,
            content,
            createdAt: new Date().toISOString(),
          }],
        };
      }
      return item;
    }));
  };

  const handleAddReaction = (itemId: string, reactionType: 'heart' | 'pray' | 'support') => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          reactions: {
            ...item.reactions,
            [reactionType]: item.reactions[reactionType] + 1,
          },
        };
      }
      return item;
    }));
  };

  const handleOpenShare = (item: LostItem) => {
    setShareItem(item);
    setShowShareModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Lost & Found</h1>
                <p className="text-sm text-gray-600">{userEmail}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Report Lost Item</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by description, city, or country..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No items found</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-5 h-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">{item.fullName}</h3>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(item.reportedAt)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {item.city}, {item.country}
                        </span>
                        <span className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {item.phoneNumber}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-lg">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">{item.rewardAmount}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">{item.description}</p>

                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <Mail className="w-4 h-4" />
                    <span>{item.email}</span>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200">
                    <div className="flex items-center justify-around">
                      <button
                        onClick={() => handleAddReaction(item.id, 'heart')}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors group"
                      >
                        <Heart className="w-5 h-5 group-hover:fill-red-600" />
                        <span className="text-sm font-semibold">{item.reactions.heart}</span>
                      </button>
                      <button
                        onClick={() => handleAddReaction(item.id, 'pray')}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors group"
                      >
                        <HandHeart className="w-5 h-5 group-hover:fill-blue-600" />
                        <span className="text-sm font-semibold">{item.reactions.pray}</span>
                      </button>
                      <button
                        onClick={() => handleAddReaction(item.id, 'support')}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors group"
                      >
                        <Users className="w-5 h-5 group-hover:fill-green-600" />
                        <span className="text-sm font-semibold">{item.reactions.support}</span>
                      </button>
                      <button
                        onClick={() => handleOpenShare(item)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">{item.comments.length}</span>
                      </button>
                    </div>
                  </div>

                  {item.sightings.length > 0 && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        Recent Sightings ({item.sightings.length})
                      </h4>
                      <div className="space-y-2">
                        {item.sightings.map((sighting) => (
                          <div key={sighting.id} className="bg-white rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-gray-900">{sighting.reportedBy}</span>
                              <span className="text-xs text-gray-500">{formatDate(sighting.reportedAt)}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-1">{sighting.notes}</p>
                            <p className="text-xs text-gray-600 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {sighting.location}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <Eye className="w-4 h-4" />
                      <span>I've Seen This</span>
                    </button>
                    <button
                      onClick={() => handleOpenShare(item)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share & Support</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {selectedItem && (
        <ReportSightingModal
          item={selectedItem}
          userEmail={userEmail}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {showReportModal && (
        <ReportLostItemModal
          userEmail={userEmail}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {showShareModal && shareItem && (
        <ShareAndCommentModal
          item={shareItem}
          userEmail={userEmail}
          onClose={() => {
            setShowShareModal(false);
            setShareItem(null);
          }}
          onAddComment={handleAddComment}
          onAddReaction={handleAddReaction}
        />
      )}
    </div>
  );
}

export default UserDashboard;
