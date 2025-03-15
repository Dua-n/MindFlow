import React, { useState } from 'react';
import { formatDisplayDate } from '../../utils/dateUtils';
import { ArrowLeft, ArrowRight, Edit3, MoreHorizontal, CheckCircle, X, BarChart2 } from 'lucide-react';
import { CustomIcon } from '../../components/CustomIcon';
import JournalAnalysis from '../../components/JournalAnalysis';

const JournalPage = ({ 
  currentJournalDate, 
  journalEntriesState, 
  setJournalEntriesState, 
  journalAnalysisState, 
  setJournalAnalysisState, 
  navigateJournalDate,
  colors
}) => {
  const [newEntry, setNewEntry] = useState("");
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showDailyAnalysis, setShowDailyAnalysis] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const getCurrentDateKey = () => {
    return currentJournalDate.toISOString().split("T")[0];
  };

  // Analyze entry content using basic NLP
  const analyzeEntry = (content) => {
    const positiveWords = ['happy', 'good', 'great', 'excellent', 'excited', 'wonderful'];
    const negativeWords = ['sad', 'bad', 'terrible', 'worried', 'anxious', 'frustrated'];
    
    const words = content.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    const wordFrequency = {};
    words.forEach(word => {
      if (word.length > 3) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });
    
    const themes = Object.entries(wordFrequency)
      .filter(([_, count]) => count > 1)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
    
    const actionVerbs = ['need', 'must', 'should', 'will', 'plan'];
    const sentences = content.split(/[.!?]+/).map(s => s.trim());
    const actionItems = sentences.filter(sentence => 
      actionVerbs.some(verb => sentence.toLowerCase().startsWith(verb))
    );

    return {
      sentiment: positiveCount > negativeCount ? 'Positive' : 
                negativeCount > positiveCount ? 'Negative' : 'Neutral',
      themes: themes.slice(0, 3),
      actionItems,
      wordCount: words.length
    };
  };

  // Save text entry
  const saveJournalEntry = () => {
    if (newEntry.trim() === "") return;
    
    const dateKey = getCurrentDateKey();
    const timeStamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    
    const newEntryObject = {
      id: Date.now(),
      content: newEntry,
      timestamp: timeStamp,
      type: "text",
    };
    
    setJournalEntriesState(prevState => {
      const existingEntries = prevState[dateKey] || [];
      const updatedEntries = [...existingEntries, newEntryObject];
      
      localStorage.setItem('journalEntries', JSON.stringify({
        ...prevState,
        [dateKey]: updatedEntries
      }));
      
      return {
        ...prevState,
        [dateKey]: updatedEntries
      };
    });
    
    const analysis = analyzeEntry(newEntry);
    updateAnalysis(dateKey, analysis);
    
    setNewEntry("");
  };

  // Update analysis for a given date
  const updateAnalysis = (dateKey, newAnalysis) => {
    setJournalAnalysisState(prevState => {
      const existingAnalysis = prevState[dateKey];
      const updatedAnalysis = {
        themes: [...new Set([...(existingAnalysis?.themes || []), ...newAnalysis.themes])],
        sentiment: newAnalysis.sentiment,
        actionItems: [...new Set([...(existingAnalysis?.actionItems || []), ...newAnalysis.actionItems])],
        wordCount: (existingAnalysis?.wordCount || 0) + newAnalysis.wordCount
      };
      
      localStorage.setItem('journalAnalysis', JSON.stringify({
        ...prevState,
        [dateKey]: updatedAnalysis
      }));
      
      return {
        ...prevState,
        [dateKey]: updatedAnalysis
      };
    });
  };

  // Delete entry
  const deleteEntry = (entryId) => {
    const dateKey = getCurrentDateKey();
    
    setJournalEntriesState(prev => {
      const updatedEntries = {
        ...prev,
        [dateKey]: prev[dateKey].filter(entry => entry.id !== entryId)
      };
      
      localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
      return updatedEntries;
    });
    
    const remainingEntries = journalEntriesState[dateKey].filter(entry => entry.id !== entryId);
    if (remainingEntries.length > 0) {
      const combinedContent = remainingEntries
        .filter(entry => entry.type === 'text')
        .map(entry => entry.content)
        .join(' ');
      const analysis = analyzeEntry(combinedContent);
      updateAnalysis(dateKey, analysis);
    } else {
      setJournalAnalysisState(prev => {
        const updated = { ...prev };
        delete updated[dateKey];
        localStorage.setItem('journalAnalysis', JSON.stringify(updated));
        return updated;
      });
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold" style={{ color: colors.text }}>Daily Journal</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateJournalDate("prev")}
            className="p-1 rounded-full hover:opacity-70"
            style={{ color: colors.primary }}
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex items-center">
            <span className="mr-2" style={{ color: colors.text }}>
              <CustomIcon type="calendar" />
            </span>
            <span style={{ color: colors.text }}>{formatDisplayDate(currentJournalDate)}</span>
          </div>
          
          <button
            onClick={() => navigateJournalDate("next")}
            className="p-1 rounded-full hover:opacity-70"
            style={{ color: colors.primary }}
          >
            <ArrowRight size={18} />
          </button>

          {journalEntriesState[getCurrentDateKey()] && (
            <button
              onClick={() => setShowDailyAnalysis(true)}
              className="ml-2 px-3 py-1 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{ 
                background: colors.buttonBg,
                color: colors.buttonText
              }}
            >
              <BarChart2 size={16} />
              <span className="text-sm">Daily Analysis</span>
            </button>
          )}

          <button
            className="ml-2 p-1 rounded-full hover:opacity-70"
            style={{ color: colors.primary }}
            title="Monthly Analysis"
            onClick={() => setShowAnalysisModal(true)}
          >
            <CustomIcon type="analysis" />
          </button>
        </div>
      </div>

      {/* Journal Entries Area */}
      <div 
        className="flex-grow overflow-y-auto p-4 rounded-2xl shadow-md mb-4"
        style={{ background: colors.cardBg }}
      >
        {journalEntriesState[getCurrentDateKey()] ? (
          journalEntriesState[getCurrentDateKey()].map((entry) => (
            <div 
              key={entry.id} 
              className="p-3 mb-3 rounded-xl"
              style={{ background: colors.cardHighlight }}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="text-xs opacity-70" style={{ color: colors.text }}>
                  {entry.timestamp}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="p-1 rounded-full hover:opacity-70"
                    style={{ color: colors.primary }}
                    onClick={() => deleteEntry(entry.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm" style={{ color: colors.text }}>{entry.content}</p>
            </div>
          ))
        ) : (
          <div 
            className="flex flex-col items-center justify-center h-full text-center opacity-60"
            style={{ color: colors.text }}
          >
            <CustomIcon type="journal" />
            <p className="mt-2">No entries for this day yet.</p>
            <p className="text-sm mt-1">Add your first thought below.</p>
          </div>
        )}
      </div>

      {/* Entry Input Area */}
      <div 
        className="p-3 rounded-2xl shadow-md"
        style={{ background: colors.cardBg }}
      >
        <div className="flex items-center gap-2">
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (newEntry.trim()) {
                  saveJournalEntry();
                }
              }
            }}
            placeholder="What's on your mind? Press Enter to save..."
            className="flex-grow p-3 rounded-xl resize-none"
            rows={2}
            style={{ 
              background: colors.cardHighlight,
              color: colors.text 
            }}
          />
          <button
            className="p-2 rounded-xl hover:opacity-90 transition-opacity"
            style={{ 
              background: colors.buttonBg, 
              color: colors.buttonText 
            }}
            onClick={() => {
              if (newEntry.trim()) {
                saveJournalEntry();
              }
            }}
          >
            <CheckCircle size={18} />
          </button>
        </div>
      </div>

      {/* Daily Analysis Modal */}
      {showDailyAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-2xl shadow-lg max-w-md w-full overflow-hidden flex flex-col"
            style={{ background: colors.cardBg, color: colors.text }}
          >
            <div className="flex justify-between items-center p-4 border-b" 
              style={{ borderColor: colors.cardHighlight }}>
              <div className="flex items-center gap-2">
                <BarChart2 size={20} />
                <h2 className="font-bold text-lg">Daily Analysis</h2>
              </div>
              <button 
                onClick={() => setShowDailyAnalysis(false)}
                className="hover:opacity-70 transition-opacity"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              {journalAnalysisState[getCurrentDateKey()] ? (
                <JournalAnalysis 
                  analysis={journalAnalysisState[getCurrentDateKey()]}
                  colors={colors}
                />
              ) : (
                <div className="text-center py-8 opacity-70">
                  <p>No analysis available for today.</p>
                  <p className="text-sm mt-2">Add more entries to generate insights.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Monthly Analysis Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-2xl shadow-lg max-w-md w-full overflow-hidden flex flex-col"
            style={{ background: colors.cardBg, color: colors.text }}
          >
            <div className="flex justify-between items-center p-4 border-b" 
              style={{ borderColor: colors.cardHighlight }}>
              <h2 className="font-bold text-lg">Monthly Analysis</h2>
              <button onClick={() => setShowAnalysisModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              {journalAnalysisState[getCurrentDateKey()] ? (
                <JournalAnalysis 
                  analysis={journalAnalysisState[getCurrentDateKey()]}
                  colors={colors}
                  isMonthly={true}
                />
              ) : (
                <div className="text-center py-8 opacity-70">
                  <p>No analysis available for this month yet.</p>
                  <p className="text-sm mt-2">Add entries to see monthly insights.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage; 