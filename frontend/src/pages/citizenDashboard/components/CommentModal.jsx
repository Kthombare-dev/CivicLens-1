import React, { useState, useEffect } from 'react';
import { X, Send, Heart, Loader2 } from 'lucide-react';
import { complaintService } from '../../../services/complaintService';
import { useAuth } from '../../../context/AuthContext';

const CommentModal = ({ complaint, isOpen, onClose }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [likingComments, setLikingComments] = useState(new Set());

    useEffect(() => {
        if (isOpen && complaint) {
            loadComments();
        }
    }, [isOpen, complaint]);

    const loadComments = async () => {
        try {
            setLoading(true);
            const data = await complaintService.getComments(complaint._id);
            setComments(data);
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setSubmitting(true);
            const result = await complaintService.addComment(complaint._id, newComment);
            setComments([result.comment, ...comments]);
            setNewComment('');
            // Refresh complaint data to update comment count
            onClose(true); // Pass true to indicate refresh needed
        } catch (error) {
            console.error('Failed to add comment:', error);
            alert(error.message || 'Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLikeComment = async (commentId) => {
        if (likingComments.has(commentId)) return;

        try {
            setLikingComments(prev => new Set(prev).add(commentId));
            const result = await complaintService.likeComment(complaint._id, commentId);
            
            setComments(comments.map(comment => 
                comment._id === commentId 
                    ? { ...comment, likes: result.comment.likes, likedBy: result.comment.likedBy }
                    : comment
            ));
        } catch (error) {
            console.error('Failed to like comment:', error);
        } finally {
            setLikingComments(prev => {
                const newSet = new Set(prev);
                newSet.delete(commentId);
                return newSet;
            });
        }
    };

    const isCommentLiked = (comment) => {
        if (!comment.likedBy || !user) return false;
        const userId = user.id || user._id || (user.user && (user.user.id || user.user._id));
        if (!userId) return false;
        return comment.likedBy.some(id => {
            const idStr = typeof id === 'object' ? (id._id || id.toString()) : id.toString();
            return idStr === userId.toString();
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between rounded-t-[32px]">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Comments</h2>
                        <p className="text-slate-500 text-sm mt-1">{complaint?.title}</p>
                    </div>
                    <button
                        onClick={() => onClose(false)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-600" />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-400 font-medium">No comments yet</p>
                            <p className="text-slate-300 text-sm mt-2">Be the first to comment!</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment._id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-black text-slate-800 text-sm">
                                                {comment.user_id?.name || 'Anonymous'}
                                            </span>
                                            <span className="text-slate-400 text-xs">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-slate-700 text-sm leading-relaxed">{comment.text}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleLikeComment(comment._id)}
                                    disabled={likingComments.has(comment._id)}
                                    className={`mt-3 flex items-center gap-2 text-xs font-medium transition-colors ${
                                        isCommentLiked(comment)
                                            ? 'text-red-600'
                                            : 'text-slate-500 hover:text-red-600'
                                    }`}
                                >
                                    <Heart 
                                        className={`w-4 h-4 ${isCommentLiked(comment) ? 'fill-red-600' : ''}`} 
                                    />
                                    {comment.likes || 0}
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Comment Input */}
                <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 rounded-b-[32px]">
                    <form onSubmit={handleSubmitComment} className="flex gap-3">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            maxLength={500}
                            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-700"
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim() || submitting}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {submitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </form>
                    <p className="text-xs text-slate-400 mt-2 text-right">
                        {newComment.length}/500
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CommentModal;
