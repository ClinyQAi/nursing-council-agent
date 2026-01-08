import React, { useState } from 'react';
import './AddRoleModal.css';

const AddRoleModal = ({ isOpen, onClose, onAddRole }) => {
    const [roleName, setRoleName] = useState('');
    const [roleDescription, setRoleDescription] = useState('');
    const [roleIcon, setRoleIcon] = useState('👤');

    const iconOptions = ['👤', '📚', '🔬', '💼', '🎯', '🩺', '📋', '🧠', '💡', '🌟'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (roleName.trim() && roleDescription.trim()) {
            onAddRole({
                id: `custom_${Date.now()}`,
                name: roleName,
                description: roleDescription,
                icon: roleIcon,
                color: '#8b5cf6', // Purple for custom roles
                isCustom: true,
            });
            setRoleName('');
            setRoleDescription('');
            setRoleIcon('👤');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add Custom Role</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Role Icon</label>
                        <div className="icon-picker">
                            {iconOptions.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    className={`icon-option ${roleIcon === icon ? 'selected' : ''}`}
                                    onClick={() => setRoleIcon(icon)}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="roleName">Role Name</label>
                        <input
                            id="roleName"
                            type="text"
                            placeholder="e.g., The Policy Expert"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="roleDescription">Role Focus</label>
                        <textarea
                            id="roleDescription"
                            placeholder="Describe what this role should focus on when reviewing content..."
                            value={roleDescription}
                            onChange={(e) => setRoleDescription(e.target.value)}
                            rows={3}
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Add Role
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoleModal;
