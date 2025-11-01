import { useState } from 'react';
import { LogOut, Shield, Check, X, Eye, MapPin, DollarSign, Calendar, User, Phone, Mail, AlertCircle } from 'lucide-react';
import { LostItem } from '../types';
import { mockLostItems } from '../data/mockData';

interface AdminDashboardProps {
  onLogout: () => void;
}

function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [items, setItems] = useState(mockLostItems);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => item.status === filter);

  const pendingCount = items.filter(item => item.status === 'pending').length;

  const handleApprove = (itemId: string) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, status: 'approved' as const } : item
    ));
  };

  const handleReject = (itemId: string) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, status: 'rejected' as const } : item
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage lost item reports</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          <div className="mt-4 flex items-center space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap flex items-center space-x-2 ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Pending ({pendingCount})</span>
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                filter === 'approved'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Approved ({items.filter(i => i.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Rejected ({items.filter(i => i.status === 'rejected').length})
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(item.status)}`}>
                          {item.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">ID: {item.id}</span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{item.fullName}</h3>
                      <div className="flex items-center text-sm text-gray-500 space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(item.reportedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-lg">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">{item.rewardAmount}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start space-x-2 text-sm">
                      <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item.fullName}</span>
                    </div>
                    <div className="flex items-start space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item.phoneNumber}</span>
                    </div>
                    <div className="flex items-start space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item.email}</span>
                    </div>
                    <div className="flex items-start space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item.city}, {item.country}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Description:</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
                  </div>

                  {item.sightings.length > 0 && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
                      <button
                        onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                        className="w-full flex items-center justify-between"
                      >
                        <h4 className="font-semibold text-blue-900 flex items-center">
                          <Eye className="w-4 h-4 mr-2" />
                          Sightings Reported ({item.sightings.length})
                        </h4>
                        <span className="text-blue-600">
                          {expandedItem === item.id ? '−' : '+'}
                        </span>
                      </button>

                      {expandedItem === item.id && (
                        <div className="mt-3 space-y-2">
                          {item.sightings.map((sighting) => (
                            <div key={sighting.id} className="bg-white rounded-lg p-3 border border-blue-100">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm text-gray-900">{sighting.reportedBy}</span>
                                <span className="text-xs text-gray-500">{formatDate(sighting.reportedAt)}</span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{sighting.reportedByEmail}</p>
                              <p className="text-sm text-gray-700 mb-2">{sighting.notes}</p>
                              <p className="text-xs text-gray-600 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {sighting.location}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {item.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {item.status === 'approved' && (
                    <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                      <p className="text-sm text-green-800 font-medium">
                        This item is visible to all users
                      </p>
                    </div>
                  )}

                  {item.status === 'rejected' && (
                    <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
                      <p className="text-sm text-red-800 font-medium">
                        This item has been rejected
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
