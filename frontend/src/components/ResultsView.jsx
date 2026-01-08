import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ResultsView.css';

const ResultsView = ({ response, onNewReview }) => {
    const { stage1, stage2, stage3 } = response;

    return (
        <div className="results-view">
            {/* Header */}
            <div className="results-header">
                <div>
                    <div className="results-badge">
                        <span>✅</span>
                        <span>Review Complete</span>
                    </div>
                    <h1 className="results-title">Council Feedback</h1>
                </div>
                <button className="new-review-btn" onClick={onNewReview}>
                    <span>✨</span> New Review
                </button>
            </div>

            {/* Stage 3: Final Synthesis (Show First) */}
            {stage3 && (
                <div className="results-card synthesis-card">
                    <div className="card-header-row">
                        <span className="stage-icon">👤</span>
                        <h2>Head of Nursing Education</h2>
                        <span className="stage-label">Synthesis</span>
                    </div>
                    <div className="card-content markdown-content">
                        <ReactMarkdown>{stage3.response || stage3}</ReactMarkdown>
                    </div>
                </div>
            )}

            {/* Stage 1: Individual Responses */}
            {stage1 && stage1.length > 0 && (
                <div className="results-section">
                    <h3 className="section-title">Individual Perspectives</h3>
                    <div className="responses-grid">
                        {stage1.map((item, index) => (
                            <div key={index} className="response-card">
                                <div className="response-header">
                                    <span className="response-model">{item.model}</span>
                                </div>
                                <div className="response-content markdown-content">
                                    <ReactMarkdown>{item.response}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stage 2: Rankings (Collapsible) */}
            {stage2 && stage2.length > 0 && (
                <details className="rankings-section">
                    <summary className="rankings-toggle">
                        <span>📊 View Peer Rankings</span>
                    </summary>
                    <div className="rankings-content">
                        {stage2.map((item, index) => (
                            <div key={index} className="ranking-card">
                                <div className="ranking-header">{item.ranker}</div>
                                <div className="ranking-body markdown-content">
                                    <ReactMarkdown>{item.ranking}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                    </div>
                </details>
            )}
        </div>
    );
};

export default ResultsView;
