import React, { useState } from 'react';
import './Dashboard.css';

const COUNCIL_ROLES = [
    {
        id: 'academic',
        name: 'The Academic',
        icon: '🎓',
        description: 'NMC Standards, evidence-based practice, scholarly rigor',
        color: '#a855f7',
    },
    {
        id: 'clinical_mentor',
        name: 'The Clinical Mentor',
        icon: '🏥',
        description: 'Ward realism, clinical applicability, compassionate care',
        color: '#22c55e',
    },
    {
        id: 'student_advocate',
        name: 'The Student Advocate',
        icon: '👩‍🎓',
        description: 'Accessibility, clarity, diverse learning needs',
        color: '#3b82f6',
    },
];

const Dashboard = ({ onSubmit, isLoading }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim() && !isLoading) {
            onSubmit(content);
        }
    };

    return (
        <div className="dashboard">
            {/* Hero Section */}
            <div className="dashboard-hero">
                <div className="hero-badge">
                    <span>🎓</span>
                    <span>Role-Based Review</span>
                </div>
                <h1 className="hero-title">Nursing Council</h1>
                <p className="hero-subtitle">
                    Get comprehensive feedback from multiple AI perspectives.
                    <br />
                    Each council member brings unique expertise to review your educational content.
                </p>
            </div>

            {/* Main Content */}
            <div className="dashboard-content">
                {/* Input Card */}
                <div className="content-card">
                    <h2 className="card-title">Content to Review</h2>
                    <p className="card-description">
                        Paste your lesson plan, assessment, or educational content below.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            className="content-textarea"
                            placeholder="Describe your lesson plan, assessment criteria, or educational content that needs multi-perspective review..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={6}
                        />
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={!content.trim() || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Council Reviewing...
                                </>
                            ) : (
                                <>
                                    <span>✨</span>
                                    Submit for Review
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Role Assignments Card */}
                <div className="content-card">
                    <div className="card-header">
                        <div>
                            <h2 className="card-title">Role Assignments</h2>
                            <p className="card-description">
                                Each council member brings a unique perspective to your content.
                            </p>
                        </div>
                        <button className="add-role-btn">
                            <span>+</span> Add Role
                        </button>
                    </div>
                    <div className="roles-grid">
                        {COUNCIL_ROLES.map((role) => (
                            <div
                                key={role.id}
                                className="role-card"
                                style={{ '--role-color': role.color }}
                            >
                                <div className="role-icon">{role.icon}</div>
                                <div className="role-info">
                                    <h3 className="role-name">{role.name}</h3>
                                    <p className="role-description">{role.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
