import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2, CheckCircle, MapPin, Star, Camera, AlertCircle, Clock, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { complaintService } from '../../../services/complaintService';
import VerificationModal from './VerificationModal';
import CommentModal from './CommentModal';

const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const PublicFeed = () => {
    const { user } = useAuth();
    const userArea = user?.area?.trim() || null;
    const [activeTab, setActiveTab] = useState('open'); // 'open' or 'verifiable'
    const [openIssues, setOpenIssues] = useState([]);
    const [verifiableIssues, setVerifiableIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedComplaintForComment, setSelectedComplaintForComment] = useState(null);
    const [likingComplaints, setLikingComplaints] = useState(new Set());
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        // Get user's location for nearby filtering
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.log('Location access denied or unavailable');
                }
            );
        }
    }, []);

    useEffect(() => {
        const fetchFeeds = async () => {
            try {
                setLoading(true);
                
                // Fetch both open issues and verifiable issues in parallel
                // Pass null if location not available - backend will handle it
                const [openData, verifiableData] = await Promise.all([
                    complaintService.getNearbyComplaints(
                        userLocation?.latitude || null,
                        userLocation?.longitude || null,
                        5, // 5km radius
                        userLocation ? null : userArea // use area when no coords
                    ).catch(err => {
                        console.error('Failed to fetch open issues:', err);
                        return [];
                    }),
                    complaintService.getVerifiableComplaints(
                        userLocation?.latitude || null,
                        userLocation?.longitude || null,
                        5, // 5km radius
                        userLocation ? null : userArea // use area when no coords
                    ).catch(err => {
                        console.error('Failed to fetch verifiable issues:', err);
                        return [];
                    })
                ]);
                
                setOpenIssues(Array.isArray(openData) ? openData : []);
                setVerifiableIssues(Array.isArray(verifiableData) ? verifiableData : []);
            } catch (error) {
                console.error('Failed to fetch feed data:', error);
                setOpenIssues([]);
                setVerifiableIssues([]);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if we have location or if location fetch failed (userLocation is null)
        // This prevents infinite loops
        fetchFeeds();
    }, [userLocation, userArea]);

    const handleVerifyClick = (complaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    const handleLikeClick = async (complaint) => {
        if (likingComplaints.has(complaint._id)) return;

        try {
            setLikingComplaints(prev => new Set(prev).add(complaint._id));
            const result = await complaintService.likeComplaint(complaint._id);
            
            // Update the complaint in the list
            if (activeTab === 'open') {
                setOpenIssues(openIssues.map(item => 
                    item._id === complaint._id 
                        ? { ...item, votes: result.complaint.votes, hasVoted: result.hasVoted, votedBy: result.complaint.votedBy, engagementScore: result.complaint.engagementScore, isTrending: result.complaint.isTrending }
                        : item
                ));
            }
        } catch (error) {
            console.error('Failed to like complaint:', error);
            alert(error.message || 'Failed to like complaint');
        } finally {
            setLikingComplaints(prev => {
                const newSet = new Set(prev);
                newSet.delete(complaint._id);
                return newSet;
            });
        }
    };

    const handleCommentClick = (complaint) => {
        setSelectedComplaintForComment(complaint);
        setIsCommentModalOpen(true);
    };

    const handleCommentModalClose = (shouldRefresh) => {
        setIsCommentModalOpen(false);
        setSelectedComplaintForComment(null);
        if (shouldRefresh) {
            // Refresh the feed to update comment counts
            const fetchFeeds = async () => {
                try {
                    const [openData, verifiableData] = await Promise.all([
                        complaintService.getNearbyComplaints(
                            userLocation?.latitude,
                            userLocation?.longitude,
                            5
                        ),
                        complaintService.getVerifiableComplaints(
                            userLocation?.latitude,
                            userLocation?.longitude,
                            5
                        )
                    ]);
                    setOpenIssues(openData);
                    setVerifiableIssues(verifiableData);
                } catch (error) {
                    console.error('Failed to refresh feed:', error);
                }
            };
            fetchFeeds();
        }
    };

    const handleVerificationSuccess = () => {
        // Refresh both feeds after successful verification
        const fetchFeeds = async () => {
            try {
                const [openData, verifiableData] = await Promise.all([
                    complaintService.getNearbyComplaints(
                        userLocation?.latitude,
                        userLocation?.longitude,
                        5
                    ),
                    complaintService.getVerifiableComplaints(
                        userLocation?.latitude,
                        userLocation?.longitude,
                        5
                    )
                ]);
                setOpenIssues(openData);
                setVerifiableIssues(verifiableData);
            } catch (error) {
                console.error('Failed to refresh feed:', error);
            }
        };
        fetchFeeds();
    };

    const extractLocation = (address) => {
        if (!address) return 'Location';
        const parts = address.split(',');
        return parts[0]?.trim() || address;
    };

    if (loading) {
        return (
            <div className="bg-white p-10 rounded-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/40 flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Submitted': { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Submitted' },
            'Assigned': { color: 'text-purple-600', bg: 'bg-purple-50', label: 'Assigned' },
            'In Progress': { color: 'text-orange-600', bg: 'bg-orange-50', label: 'In Progress' }
        };
        const config = statusConfig[status] || { color: 'text-slate-600', bg: 'bg-slate-50', label: status };
        return (
            <span className={`text-[10px] font-black ${config.color} uppercase tracking-tighter ${config.bg} px-2 py-0.5 rounded-md`}>
                {config.label}
            </span>
        );
    };

    const currentItems = activeTab === 'open' ? openIssues : verifiableIssues;

    return (
        <>
            <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-100/60">
                <div className="mb-6">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Public Feed</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">
                        {userLocation ? 'Issues near you' : 'Nearby issues'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('open')}
                        className={`flex-1 px-4 py-2 rounded-lg font-black text-sm transition-all ${
                            activeTab === 'open'
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Open Issues ({openIssues.length})
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('verifiable')}
                        className={`flex-1 px-4 py-2 rounded-lg font-black text-sm transition-all ${
                            activeTab === 'verifiable'
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Verify ({verifiableIssues.length})
                        </div>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-4 my-8">
                        {currentItems.length === 0 ? (
                            <div className="text-center py-12">
                                {activeTab === 'open' ? (
                                    <>
                                        <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold">No open issues nearby</p>
                                        <p className="text-slate-300 text-sm mt-2">All clear in your area!</p>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold">No verifiable issues nearby</p>
                                        <p className="text-slate-300 text-sm mt-2">Check back later for resolved issues to verify</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            currentItems.map((item) => (
                                <div 
                                    key={item._id} 
                                    className={`p-5 rounded-[24px] border-2 group hover:shadow-lg transition-all ${
                                        activeTab === 'open'
                                            ? 'bg-gradient-to-br from-slate-50 to-white border-slate-200 hover:border-slate-300'
                                            : 'bg-gradient-to-br from-slate-50 to-white border-emerald-100 hover:border-emerald-300'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center overflow-hidden border-2 flex-shrink-0 ${
                                            activeTab === 'open' ? 'border-slate-200' : 'border-emerald-100'
                                        }`}>
                                            <img
                                                src={complaintService.getImageUrl(item.images?.[0])}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <h4 className="font-black text-slate-800 text-base mb-1">{item.title}</h4>
                                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                                        {activeTab === 'open' ? (
                                                            <>
                                                                {getStatusBadge(item.status)}
                                                                {item.isTrending && (
                                                                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-tighter bg-orange-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                                        <TrendingUp className="w-3 h-3" />
                                                                        Trending
                                                                    </span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded-md">
                                                                    {item.verificationCount || 0} verified
                                                                </span>
                                                                {item.isVerified && (
                                                                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tighter bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                                        <Star className="w-3 h-3 fill-emerald-600" />
                                                                        Trusted
                                                                    </span>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="font-medium">{extractLocation(item.address)}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                        <span>{formatTimeAgo(item.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {activeTab === 'verifiable' && (
                                                <button
                                                    onClick={() => handleVerifyClick(item)}
                                                    className="mt-4 w-full px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-black text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 group/btn"
                                                >
                                                    <Camera className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                    Verify & Earn 20 Points
                                                </button>
                                            )}
                                            {activeTab === 'open' && (
                                                <>
                                                    <div className="mt-4 flex gap-2">
                                                        <button
                                                            onClick={() => handleLikeClick(item)}
                                                            disabled={likingComplaints.has(item._id)}
                                                            className={`flex-1 px-4 py-2.5 rounded-xl font-black text-sm transition-colors flex items-center justify-center gap-2 ${
                                                                item.hasVoted
                                                                    ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100'
                                                                    : 'bg-slate-100 text-slate-700 border-2 border-slate-200 hover:bg-slate-200'
                                                            } disabled:opacity-50`}
                                                        >
                                                            <Heart className={`w-4 h-4 ${item.hasVoted ? 'fill-red-600' : ''}`} />
                                                            {item.votes || 0}
                                                        </button>
                                                        <button
                                                            onClick={() => handleCommentClick(item)}
                                                            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-black text-sm border-2 border-slate-200 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <MessageCircle className="w-4 h-4" />
                                                            {item.commentCount || 0}
                                                        </button>
                                                    </div>
                                                    {item.engagementScore > 10 && (
                                                        <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                                                            <div className="flex items-center gap-2 text-xs text-orange-700">
                                                                <TrendingUp className="w-3 h-3" />
                                                                <span className="font-bold">High engagement - Issue auto-escalated!</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'verifiable' && (
                    <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="flex items-start gap-3">
                            <Star className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-emerald-800 font-black text-sm mb-1">How Verification Works</p>
                                <ul className="text-emerald-700 text-xs space-y-1">
                                    <li>• Upload a photo showing the issue is resolved</li>
                                    <li>• Earn 20 points for each verified complaint</li>
                                    <li>• Help build trust in the community</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {selectedComplaint && (
                <VerificationModal
                    complaint={selectedComplaint}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedComplaint(null);
                    }}
                    onSuccess={handleVerificationSuccess}
                />
            )}

            {selectedComplaintForComment && (
                <CommentModal
                    complaint={selectedComplaintForComment}
                    isOpen={isCommentModalOpen}
                    onClose={handleCommentModalClose}
                />
            )}
        </>
    );
};

export default PublicFeed;
