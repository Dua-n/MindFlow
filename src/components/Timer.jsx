import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const Timer = ({ 
  timeRemaining, 
  setTimeRemaining, 
  isActive, 
  setIsActive, 
  mode, 
  setMode, 
  colors,
  onTimerComplete 
}) => {
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            try {
              const audio = new Audio('https://cdn.freesound.org/previews/352/352661_5121236-lq.mp3');
              audio.play();
            } catch (e) {
              console.error('Could not play sound:', e);
            }
            if (onTimerComplete) {
              onTimerComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, onTimerComplete, setTimeRemaining, setIsActive]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeRemaining(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeRemaining(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Mode selector */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded-lg text-xs transition-colors ${mode === 'focus' ? 'font-bold' : 'opacity-70'}`}
          style={{ 
            background: mode === 'focus' ? colors.buttonBg : 'transparent',
            color: mode === 'focus' ? colors.buttonText : colors.text
          }}
          onClick={() => switchMode('focus')}
        >
          Focus
        </button>
        <button
          className={`px-3 py-1 rounded-lg text-xs transition-colors ${mode === 'break' ? 'font-bold' : 'opacity-70'}`}
          style={{ 
            background: mode === 'break' ? colors.buttonBg : 'transparent',
            color: mode === 'break' ? colors.buttonText : colors.text
          }}
          onClick={() => switchMode('break')}
        >
          Break
        </button>
      </div>

      {/* Timer display */}
      <div 
        className="text-4xl font-bold mb-4"
        style={{ color: colors.primary }}
      >
        {formatTime(timeRemaining)}
      </div>

      {/* Duration presets */}
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {[5, 15, 25, 30, 45, 60].map(minutes => (
          <button
            key={minutes}
            className="px-2 py-1 rounded-lg text-xs transition-colors"
            style={{ 
              background: timeRemaining === minutes * 60 ? colors.primary : colors.cardHighlight,
              color: timeRemaining === minutes * 60 ? colors.buttonText : colors.text
            }}
            onClick={() => {
              setTimeRemaining(minutes * 60);
              setIsActive(false);
            }}
          >
            {minutes}m
          </button>
        ))}
      </div>

      {/* Control buttons */}
      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
          style={{ 
            background: isActive ? colors.cardHighlight : colors.buttonBg, 
            color: isActive ? colors.text : colors.buttonText 
          }}
          onClick={toggleTimer}
        >
          {isActive ? <Pause size={16} /> : <Play size={16} />}
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button
          className="px-3 py-2 rounded-xl text-sm flex items-center gap-2"
          style={{ background: colors.cardHighlight }}
          onClick={resetTimer}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Status message */}
      {isActive && (
        <div className="mt-4 text-center text-sm opacity-80">
          {mode === 'focus' 
            ? 'Focus on your task. Stay present and avoid distractions.' 
            : 'Take a break. Stretch, breathe, or get some water.'}
        </div>
      )}
    </div>
  );
};

export default Timer; 