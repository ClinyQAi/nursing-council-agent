import React, { useState, useEffect } from 'react';
import './SettingsModal.css';

const PROVIDERS = {
    openai: {
        name: 'OpenAI',
        models: ['gpt-4o', 'gpt-4-turbo']
    },
    anthropic: {
        name: 'Anthropic',
        models: ['claude-3-5-sonnet-20240620', 'claude-3-opus-20240229']
    },
    google: {
        name: 'Google Gemini',
        models: ['gemini/gemini-1.5-pro', 'gemini/gemini-1.5-flash']
    },
    deepseek: {
        name: 'DeepSeek',
        models: ['deepseek-chat']
    }
};

const SettingsModal = ({ isOpen, onClose, onSave }) => {
    const [provider, setProvider] = useState('openai');
    const [model, setModel] = useState('gpt-4o');
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Load from localStorage or defaults
            const storedConfig = JSON.parse(localStorage.getItem('llm_config') || '{}');
            if (storedConfig.provider) setProvider(storedConfig.provider);
            if (storedConfig.model) setModel(storedConfig.model);
            if (storedConfig.apiKey) setApiKey(storedConfig.apiKey);
        }
    }, [isOpen]);

    const handleProviderChange = (e) => {
        const newProvider = e.target.value;
        setProvider(newProvider);
        // Default to first model
        setModel(PROVIDERS[newProvider].models[0]);
    };

    const handleSave = () => {
        const config = { provider, model, apiKey };
        localStorage.setItem('llm_config', JSON.stringify(config));
        onSave(config);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content settings-modal">
                <div className="modal-header">
                    <h2>⚙️ AI Settings</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <p className="settings-intro">
                        Bring your own API key to use different models. Keys are stored safely in your browser.
                    </p>

                    <div className="form-group">
                        <label>Provider</label>
                        <select value={provider} onChange={handleProviderChange}>
                            {Object.entries(PROVIDERS).map(([key, data]) => (
                                <option key={key} value={key}>{data.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Model</label>
                        <select value={model} onChange={(e) => setModel(e.target.value)}>
                            {PROVIDERS[provider].models.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>API Key</label>
                        <div className="password-input">
                            <input
                                type={showKey ? "text" : "password"}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder={`Enter your ${PROVIDERS[provider].name} API Key`}
                            />
                            <button
                                type="button"
                                className="toggle-visibility"
                                onClick={() => setShowKey(!showKey)}
                            >
                                {showKey ? "🙈" : "👁️"}
                            </button>
                        </div>
                        <small className="hint">
                            {provider === 'openai' && 'Sk-...'}
                            {provider === 'anthropic' && 'sk-ant-...'}
                            {provider === 'google' && 'AIza...'}
                        </small>
                    </div>

                </div>

                <div className="modal-footer">
                    <button className="secondary-button" onClick={onClose}>Cancel</button>
                    <button className="primary-button" onClick={handleSave}>Save Settings</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
