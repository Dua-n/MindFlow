import React, { useState } from 'react';
import { standardizeDate, isDeadlineNear } from '../utils/dateUtils';
import { ChevronDown, CheckCircle } from 'lucide-react';

const TaskSelector = ({ 
  currentFocusTaskId, 
  setCurrentFocusTaskId, 
  priorityTasks,
  colors
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const calculateProgress = (task) => {
    if (!task?.steps?.length) return 0;
    const completedSteps = task.steps.filter(step => step.completed).length;
    return Math.round((completedSteps / task.steps.length) * 100);
  };

  const currentTask = priorityTasks.find(task => task.id === currentFocusTaskId);

  return (
    <div className="relative">
      <button
        className="w-full px-4 py-2 rounded-xl text-left flex items-center justify-between"
        style={{ background: colors.cardHighlight }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span>
            {currentTask 
              ? currentTask.name
              : 'Select a task to focus on'}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-1 z-10 w-72 overflow-hidden rounded-xl shadow-lg"
          style={{ background: colors.cardBg }}
        >
          <div className="p-2 max-h-60 overflow-y-auto">
            {priorityTasks.map(task => (
              <button
                key={task.id}
                className="w-full text-left p-2 rounded-lg mb-1 flex items-start gap-2 transition-colors"
                style={{ 
                  background: task.id === currentFocusTaskId ? colors.cardHighlight : 'transparent'
                }}
                onClick={() => {
                  setCurrentFocusTaskId(task.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="flex-grow">{task.name}</span>
                    {task.completed && (
                      <CheckCircle size={14} className="text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    {task.deadline && (
                      <div className="text-xs opacity-70 flex items-center gap-1">
                        Due: {standardizeDate(task.deadline)}
                        {isDeadlineNear(task.deadline) && (
                          <span className="px-1 rounded text-red-500">Soon</span>
                        )}
                      </div>
                    )}
                    <div className="text-xs opacity-70">
                      Progress: {calculateProgress(task)}%
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {priorityTasks.length === 0 && (
              <div className="p-4 text-center text-sm opacity-70">
                No tasks available. Add tasks in the Projects tab to get started.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSelector; 