import React, { useState } from 'react';
import { standardizeDate, isDeadlineNear } from '../../utils/dateUtils';
import { CheckCircle, X, Plus } from 'lucide-react';

const AdminPage = ({
  adminTasksState,
  setAdminTasksState,
  showCompletedTasks,
  setShowCompletedTasks,
  colors
}) => {
  const [showNewAdminTaskModal, setShowNewAdminTaskModal] = useState(false);
  const [newAdminTask, setNewAdminTask] = useState({
    description: '',
    deadline: '',
    completed: false
  });

  const toggleTaskCompletion = (taskId) => {
    setAdminTasksState(adminTasksState.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setAdminTasksState(adminTasksState.filter(task => task.id !== taskId));
  };

  const addNewTask = () => {
    if (!newAdminTask.description.trim()) return;
    
    const taskToAdd = {
      ...newAdminTask,
      id: Date.now()
    };
    
    setAdminTasksState([...adminTasksState, taskToAdd]);
    setNewAdminTask({
      description: '',
      deadline: '',
      completed: false
    });
    setShowNewAdminTaskModal(false);
  };

  const filteredTasks = showCompletedTasks 
    ? adminTasksState 
    : adminTasksState.filter(task => !task.completed);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Admin Tasks</h2>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded-lg text-sm flex items-center gap-1"
            style={{ 
              background: colors.cardHighlight,
              color: showCompletedTasks ? colors.primary : colors.text
            }}
            onClick={() => setShowCompletedTasks(!showCompletedTasks)}
          >
            {showCompletedTasks ? 'Hide Completed' : 'Show Completed'}
          </button>
          <button
            className="px-3 py-1 rounded-lg text-sm flex items-center gap-1"
            style={{ background: colors.buttonBg, color: colors.buttonText }}
            onClick={() => setShowNewAdminTaskModal(true)}
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div 
          className="p-4 rounded-xl shadow-md"
          style={{ background: colors.cardBg }}
        >
          <h3 className="text-sm opacity-70 mb-1">Total Tasks</h3>
          <div className="text-2xl font-bold" style={{ color: colors.primary }}>
            {adminTasksState.length}
          </div>
        </div>

        <div 
          className="p-4 rounded-xl shadow-md"
          style={{ background: colors.cardBg }}
        >
          <h3 className="text-sm opacity-70 mb-1">Completed</h3>
          <div className="text-2xl font-bold" style={{ color: colors.primary }}>
            {adminTasksState.filter(task => task.completed).length}
          </div>
        </div>

        <div 
          className="p-4 rounded-xl shadow-md"
          style={{ background: colors.cardBg }}
        >
          <h3 className="text-sm opacity-70 mb-1">Pending</h3>
          <div className="text-2xl font-bold" style={{ color: colors.primary }}>
            {adminTasksState.filter(task => !task.completed).length}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div 
        className="flex-grow rounded-xl shadow-md overflow-hidden"
        style={{ background: colors.cardBg }}
      >
        <div 
          className="p-4 border-b"
          style={{ borderColor: colors.cardHighlight }}
        >
          <h2 className="font-semibold">
            {showCompletedTasks ? 'All Tasks' : 'Current Tasks'}
          </h2>
        </div>

        <div className="divide-y overflow-y-auto max-h-[calc(100vh-300px)]" style={{ borderColor: colors.cardHighlight }}>
          {filteredTasks.map(task => (
            <div 
              key={task.id}
              className="p-4 flex items-center gap-4"
            >
              <button
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  task.completed 
                    ? 'bg-green-500 text-white' 
                    : 'border border-gray-400'
                }`}
                onClick={() => toggleTaskCompletion(task.id)}
              >
                {task.completed && <CheckCircle size={16} />}
              </button>

              <div className="flex-grow">
                <div className={task.completed ? 'line-through opacity-50' : ''}>
                  {task.description}
                </div>
                {task.deadline && (
                  <div className="text-sm flex items-center gap-1">
                    <span className="opacity-70">Due: {standardizeDate(task.deadline)}</span>
                    {isDeadlineNear(task.deadline) && !task.completed && (
                      <span className="px-1 py-0.5 text-xs rounded" style={{ background: colors.dangerBg || '#FEE2E2', color: colors.dangerText || '#B91C1C' }}>
                        Soon
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                className="p-1 rounded-full"
                style={{ color: colors.primary }}
                onClick={() => deleteTask(task.id)}
              >
                <X size={18} />
              </button>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="p-8 text-center opacity-70">
              <p>No {showCompletedTasks ? '' : 'pending'} admin tasks</p>
              <p className="text-sm mt-2">Add your first task to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* New Task Modal */}
      {showNewAdminTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-2xl shadow-lg max-w-md w-full overflow-hidden flex flex-col"
            style={{ background: colors.cardBg, color: colors.text }}
          >
            <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: colors.cardHighlight }}>
              <h2 className="font-bold text-lg">New Admin Task</h2>
              <button onClick={() => setShowNewAdminTaskModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Task Description</label>
                <input
                  type="text"
                  value={newAdminTask.description}
                  onChange={(e) => setNewAdminTask({...newAdminTask, description: e.target.value})}
                  className="w-full p-2 rounded-lg"
                  style={{ background: colors.cardHighlight }}
                  placeholder="Enter task description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Deadline (Optional)</label>
                <input
                  type="date"
                  value={newAdminTask.deadline}
                  onChange={(e) => setNewAdminTask({...newAdminTask, deadline: e.target.value})}
                  className="w-full p-2 rounded-lg"
                  style={{ background: colors.cardHighlight }}
                />
              </div>
            </div>
            
            <div className="p-4 border-t" style={{ borderColor: colors.cardHighlight }}>
              <button
                className="w-full py-2 rounded-xl"
                style={{ 
                  background: colors.buttonBg, 
                  color: colors.buttonText,
                  opacity: !newAdminTask.description ? 0.5 : 1 
                }}
                disabled={!newAdminTask.description}
                onClick={addNewTask}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage; 