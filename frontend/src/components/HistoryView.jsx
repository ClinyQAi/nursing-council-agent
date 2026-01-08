import React from 'react';
import './HistoryView.css';

const HistoryView = ({ conversations, onSelectConversation }) => {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="history-view">
            <div className="history-header">
                <h1 className="history-title">Review History</h1>
                <p className="history-subtitle">
                    View past reviews and council feedback.
                </p>
            </div>

            <div className="history-list">
                {conversations.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📋</span>
                        <p>No reviews yet. Submit your first content for review!</p>
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.id}
                            className="history-card"
                            onClick={() => onSelectConversation(conv.id)}
                        >
                            <div className="history-card-content">
                                <h3 className="history-card-title">
                                    {conv.title || 'Untitled Review'}
                                </h3>
                                <p className="history-card-meta">
                                    {formatDate(conv.created_at)} • {conv.message_count || 0} messages
                                </p>
                            </div>
                            <span className="history-arrow">→</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryView;
