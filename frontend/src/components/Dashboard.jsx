import React, { useState, useEffect } from 'react';
import AddRoleModal from './AddRoleModal';
import { api } from '../api';
import './Dashboard.css';

const DEFAULT_ROLES = [
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

import SettingsModal from './SettingsModal';

const Dashboard = ({ onSubmit, isLoading, error }) => {
    const [content, setContent] = useState('');
    const [roles, setRoles] = useState(DEFAULT_ROLES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [llmConfig, setLlmConfig] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const user = await api.getCurrentUser();
            setCurrentUser(user);
            // If running on local dev (api base not empty), we don't force login UI
            // But if user is null and we are in prod (api base empty), show login hint
            if (!user && window.location.hostname.includes('azurecontainerapps.io')) {
                setShowLogin(true);
            }
            setAuthChecked(true);
        };
        checkAuth();

        // Load initial LLM config
        const storedConfig = JSON.parse(localStorage.getItem('llm_config') || '{}');
        setLlmConfig(storedConfig);
    }, []);

    const handleLogin = () => {
        window.location.href = '/.auth/login/aad';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim() && !isLoading) {
            onSubmit(content, roles, llmConfig);
        }
    };

    const handleSettingsSave = (newConfig) => {
        setLlmConfig(newConfig);
    };

    const handleAddRole = (newRole) => {
        setRoles([...roles, newRole]);
    };

    const handleRemoveRole = (roleId) => {
        // Only allow removing custom roles
        const role = roles.find(r => r.id === roleId);
        if (role?.isCustom) {
            setRoles(roles.filter(r => r.id !== roleId));
        }
    };

    return (
        <div className="dashboard">
            {/* Hero Section */}
            <div className="dashboard-hero">
                <div className="hero-top-actions">
                    <button
                        className="settings-btn"
                        onClick={() => setIsSettingsOpen(true)}
                        title="AI Settings"
                    >
                        ⚙️
                    </button>
                </div>
                <div className="hero-badge">
                    <span>🎓</span>
                    <span>Role-Based Review</span>
                </div>
                {currentUser && (
                    <div className="user-welcome">
                        👋 Welcome, {currentUser}
                    </div>
                )}
                <h1 className="hero-title">Nursing Council</h1>
                <p className="hero-subtitle">
                    Get comprehensive feedback from multiple AI perspectives.
                    <br />
                    Each council member brings unique expertise to review your educational content.
                </p>

                {showLogin && !currentUser && (
                    <div className="login-prompt" style={{ marginTop: '20px' }}>
                        <p style={{ marginBottom: '10px', color: '#fca5a5' }}>
                            Authentication Required
                        </p>
                        <button className="login-btn" onClick={handleLogin}>
                            🔒 Login with Microsoft
                        </button>
                    </div>
                )}

                {error && (
                    <div className="error-alert">
                        <span className="error-icon">⚠️</span>
                        <span className="error-text">{error}</span>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="dashboard-content">
                {/* Input Card */}
                <div className="content-card">
                    <h2 className="card-title">Content to Review</h2>
                    <div className="card-subtitle-row">
                        <p className="card-description">
                            Paste your lesson plan, assessment, or educational content below.
                        </p>
                        {llmConfig.provider && llmConfig.provider !== 'azure' && (
                            <span className="provider-badge" title="Using custom provider">
                                By {llmConfig.provider} ({llmConfig.model})
                            </span>
                        )}
                    </div>
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
                        <button
                            className="add-role-btn"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <span>+</span> Add Role
                        </button>
                    </div>
                    <div className="roles-grid">
                        {roles.map((role) => (
                            <div
                                key={role.id}
                                className={`role-card ${role.isCustom ? 'custom-role' : ''}`}
                                style={{ '--role-color': role.color }}
                            >
                                <div className="role-icon">{role.icon}</div>
                                <div className="role-info">
                                    <h3 className="role-name">
                                        {role.name}
                                        {role.isCustom && <span className="custom-badge">Custom</span>}
                                    </h3>
                                    <p className="role-description">{role.description}</p>
                                </div>
                                {role.isCustom && (
                                    <button
                                        className="remove-role-btn"
                                        onClick={() => handleRemoveRole(role.id)}
                                        title="Remove role"
                                        type="button"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AddRoleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddRole={handleAddRole}
            />

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onSave={handleSettingsSave}
            />
        </div>
    );
};

export default Dashboard;
