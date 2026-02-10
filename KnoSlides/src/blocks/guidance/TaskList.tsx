/**
 * TaskList Block
 * 
 * Displays the current step's tasks with completion status.
 * Used in TaskSlot to show checklist of actions.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlockComponentProps } from '../../core/BlockRegistry';
import type { TaskListConfig, Task } from '../../types/unified-schema';
import { useSlideState } from '../../core/SlideStateContext';

export const TaskList: React.FC<BlockComponentProps<TaskListConfig>> = ({
  id,
  config,
  stylePreset,
  className = '',
}) => {
  const { taskIds, showProgress = true, variant = 'checklist' } = config;
  const { currentStep, getTaskStatus, isTaskComplete, areRequiredTasksComplete } = useSlideState();
  
  // Get tasks from current step that match the taskIds
  const tasks = currentStep.tasks.filter(task => taskIds.includes(task.id));
  const completedCount = tasks.filter(task => isTaskComplete(task.id)).length;
  const requiredCount = tasks.filter(task => task.required).length;
  const requiredCompleted = tasks.filter(task => task.required && isTaskComplete(task.id)).length;

  const renderTaskIcon = (task: Task) => {
    const status = getTaskStatus(task.id);
    
    if (status === 'completed') {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      );
    }
    
    if (status === 'in_progress') {
      return (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-5 h-5 rounded-full border-2 border-indigo-500 bg-indigo-50"
        />
      );
    }
    
    // Pending
    if (variant === 'checklist') {
      return (
        <div className={`w-5 h-5 rounded border-2 ${task.required ? 'border-slate-300' : 'border-slate-200'}`} />
      );
    }
    
    if (variant === 'numbered') {
      const index = tasks.findIndex(t => t.id === task.id) + 1;
      return (
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-medium ${task.required ? 'border-slate-400 text-slate-600' : 'border-slate-300 text-slate-400'}`}>
          {index}
        </div>
      );
    }
    
    // Minimal variant
    return (
      <div className="w-2 h-2 rounded-full bg-slate-300" />
    );
  };

  return (
    <div
      id={id}
      className={`
        kno-panel overflow-hidden
        ${stylePreset === 'highlighted' ? 'ring-2 ring-indigo-200' : ''}
        ${className}
      `}
    >
      {/* Header */}
      <div className="kno-panel-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-[15px] font-semibold text-slate-800">Tasks</h3>
        </div>
        
        {showProgress && (
          <span className="text-xs font-medium text-slate-500">
            {completedCount}/{tasks.length}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {showProgress && tasks.length > 0 && (
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="p-4 space-y-2.5">
        <AnimatePresence>
          {tasks.map((task, index) => {
            const status = getTaskStatus(task.id);
            const isComplete = status === 'completed';
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  flex items-start gap-3 p-3 rounded-lg transition-colors
                  ${isComplete ? 'bg-emerald-50' : 'bg-slate-50 hover:bg-slate-100'}
                `}
              >
                {renderTaskIcon(task)}
                
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-5 font-semibold ${isComplete ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {task.label}
                    {task.required && !isComplete && (
                      <span className="ml-1 text-xs text-red-500">*</span>
                    )}
                  </p>
                  
                  {task.hint && !isComplete && (
                    <p className="text-xs text-slate-500 mt-1 leading-5">{task.hint}</p>
                  )}
                  
                  {isComplete && task.successMessage && (
                    <p className="text-xs text-emerald-600 mt-1">{task.successMessage}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer - completion status */}
      {areRequiredTasksComplete() && requiredCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-3 bg-emerald-50 border-t border-emerald-100"
        >
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>All required tasks complete! You can continue.</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TaskList;
