import React from 'react';
import { ArrowRight, X } from 'lucide-react';

const ReflectionPage = ({
  reflectionPrompts,
  currentPromptIndex,
  setCurrentPromptIndex,
  reflectionContent,
  setReflectionContent,
  reflectionSaved,
  setReflectionSaved,
  colors
}) => {
  const nextReflectionPrompt = () => {
    setCurrentPromptIndex((currentPromptIndex + 1) % reflectionPrompts.length);
    setReflectionContent("");
  };

  const saveReflection = () => {
    if (!reflectionContent.trim()) return;
    
    const newReflection = {
      id: Date.now(),
      date: new Date().toISOString(),
      prompt: reflectionPrompts[currentPromptIndex],
      content: reflectionContent
    };
    
    setReflectionSaved([newReflection, ...reflectionSaved]);
    setReflectionContent("");
    nextReflectionPrompt();
  };

  const deleteReflection = (id) => {
    setReflectionSaved(reflectionSaved.filter(reflection => reflection.id !== id));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <h2 className="text-xl font-bold mb-4">Reflection Practice</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Current Reflection */}
        <div 
          className="rounded-xl shadow-md overflow-hidden flex flex-col"
          style={{ background: colors.cardBg }}
        >
          <div 
            className="p-4 border-b"
            style={{ borderColor: colors.cardHighlight }}
          >
            <h2 className="font-semibold">Current Prompt</h2>
          </div>

          <div className="p-4 flex-grow flex flex-col">
            <div 
              className="p-4 rounded-xl mb-4"
              style={{ background: colors.cardHighlight }}
            >
              <p className="text-lg" style={{ color: colors.primary }}>
                {reflectionPrompts[currentPromptIndex]}
              </p>
            </div>

            <textarea
              value={reflectionContent}
              onChange={(e) => setReflectionContent(e.target.value)}
              placeholder="Write your reflection here..."
              className="flex-grow w-full p-3 rounded-xl resize-none mb-4"
              style={{ 
                background: colors.cardHighlight,
                color: colors.text
              }}
            />

            <div className="flex justify-between">
              <button
                onClick={nextReflectionPrompt}
                className="px-4 py-2 rounded-xl text-sm flex items-center gap-1"
                style={{ background: colors.cardHighlight }}
              >
                Next Prompt
                <ArrowRight size={16} />
              </button>

              <button
                className="px-4 py-2 rounded-xl text-sm"
                style={{ 
                  background: colors.buttonBg, 
                  color: colors.buttonText,
                  opacity: !reflectionContent ? 0.5 : 1
                }}
                disabled={!reflectionContent}
                onClick={saveReflection}
              >
                Save Reflection
              </button>
            </div>
          </div>
        </div>

        {/* Saved Reflections */}
        <div 
          className="rounded-xl shadow-md overflow-hidden flex flex-col"
          style={{ background: colors.cardBg }}
        >
          <div 
            className="p-4 border-b"
            style={{ borderColor: colors.cardHighlight }}
          >
            <h2 className="font-semibold">Your Reflections</h2>
          </div>

          <div className="flex-grow overflow-y-auto">
            {reflectionSaved && reflectionSaved.length > 0 ? (
              <div className="divide-y" style={{ borderColor: colors.cardHighlight }}>
                {reflectionSaved.map(reflection => (
                  <div key={reflection.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ background: colors.cardHighlight }}
                      >
                        {new Date(reflection.date).toLocaleDateString()}
                      </div>
                      <button
                        className="p-1 rounded-full"
                        style={{ color: colors.primary }}
                        onClick={() => deleteReflection(reflection.id)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="italic text-sm mb-2 opacity-70">
                      {reflection.prompt}
                    </div>
                    <p className="text-sm whitespace-pre-line">
                      {reflection.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 opacity-70">
                <p>No reflections saved yet</p>
                <p className="text-sm mt-2">Your reflections will appear here after you save them</p>
              </div>
            )}
          </div>

          {reflectionSaved && reflectionSaved.length > 0 && (
            <div 
              className="p-4 border-t"
              style={{ borderColor: colors.cardHighlight }}
            >
              <button
                className="w-full py-2 rounded-xl text-sm"
                style={{ background: colors.cardHighlight }}
                onClick={() => {
                  // Export reflections functionality
                  const exportData = JSON.stringify(reflectionSaved, null, 2);
                  const blob = new Blob([exportData], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `reflections-${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                Export Reflections
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReflectionPage; 