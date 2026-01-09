import React from 'react';
import './Navbar.css';

const Navbar = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'council', label: 'Council' },
        { id: 'history', label: 'History' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <div className="navbar-brand">
                    <span className="brand-icon">🩺</span>
                    <span className="brand-text">NursingAI</span>
                </div>

                {/* Tabs */}
                <div className="navbar-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => onTabChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Right Section */}
                <div className="navbar-actions">
                    <button className="nav-icon-btn" title="Settings">
                        ⚙️
                    </button>
                    <div className="user-avatar">
                        <span>U</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
