import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ResultsView from './components/ResultsView';
import HistoryView from './components/HistoryView';
import { api } from './api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('council');
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'results'

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const convs = await api.listConversations();
      setConversations(convs);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const handleSubmit = async (content) => {
    setIsLoading(true);
    try {
      // Create a new conversation
      const newConv = await api.createConversation();
      setCurrentConversationId(newConv.id);

      // Initialize response state
      const responseData = {
        stage1: null,
        stage2: null,
        stage3: null,
      };

      // Stream the council process
      await api.sendMessageStream(newConv.id, content, (eventType, event) => {
        switch (eventType) {
          case 'stage1_complete':
            responseData.stage1 = event.data;
            setCurrentResponse({ ...responseData });
            break;

          case 'stage2_complete':
            responseData.stage2 = event.data;
            setCurrentResponse({ ...responseData });
            break;

          case 'stage3_complete':
            responseData.stage3 = event.data;
            setCurrentResponse({ ...responseData });
            break;

          case 'complete':
            setView('results');
            setIsLoading(false);
            loadConversations();
            break;

          case 'error':
            console.error('Stream error:', event.message);
            setIsLoading(false);
            break;

          default:
            break;
        }
      });
    } catch (error) {
      console.error('Failed to submit:', error);
      setIsLoading(false);
    }
  };

  const handleNewReview = () => {
    setCurrentResponse(null);
    setCurrentConversationId(null);
    setView('dashboard');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'council' && !currentResponse) {
      setView('dashboard');
    }
  };

  const handleSelectConversation = async (id) => {
    try {
      const conv = await api.getConversation(id);
      if (conv.messages && conv.messages.length >= 2) {
        // Get the last assistant message
        const assistantMsg = conv.messages.find((m) => m.role === 'assistant');
        if (assistantMsg) {
          setCurrentResponse({
            stage1: assistantMsg.stage1,
            stage2: assistantMsg.stage2,
            stage3: assistantMsg.stage3,
          });
          setCurrentConversationId(id);
          setView('results');
          setActiveTab('council');
        }
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  return (
    <div className="app">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="app-content">
        {activeTab === 'council' && (
          <>
            {view === 'dashboard' && (
              <Dashboard onSubmit={handleSubmit} isLoading={isLoading} />
            )}
            {view === 'results' && currentResponse && (
              <ResultsView response={currentResponse} onNewReview={handleNewReview} />
            )}
          </>
        )}
        {activeTab === 'history' && (
          <HistoryView
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
          />
        )}
      </div>
    </div>
  );
}

export default App;
