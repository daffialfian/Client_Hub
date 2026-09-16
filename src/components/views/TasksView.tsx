import React, { useState } from 'react';
import { Plus, Calendar, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { TaskItem, Project } from '../../types';

interface TasksViewProps {
  tasks: TaskItem[];
  projects?: Project[];
  onAddTask: (task: Omit<TaskItem, 'id'>) => void;
  onUpdateTaskStatus: (taskId: string, nextStatus: TaskItem['status']) => void;
  searchQuery?: string;
  onOpenDeliverableModalByTitle?: (title: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  projects = [],
  onAddTask,
  onUpdateTaskStatus,
  searchQuery = '',
  onOpenDeliverableModalByTitle
}) => {
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('All');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('Front-End');

  // Available project names derived from projects prop or tasks
  const projectOptions = Array.from(
    new Set([
      ...projects.map((p) => p.title),
      ...tasks.map((t) => t.project)
    ])
  );

  const [newTaskProject, setNewTaskProject] = useState(
    projectOptions[0] || 'Client-Hub - Client Portal Interaktif'
  );

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedProjectFilter !== 'All' && t.project !== selectedProjectFilter) return false;
    return true;
  });

  const columns: Array<{
    id: TaskItem['status'];
    title: string;
    dotColor: string;
    badgeBg: string;
    badgeText: string;
  }> = [
    { id: 'todo', title: 'To Do', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-200', badgeText: 'text-slate-600' },
    { id: 'in-progress', title: 'In Progress', dotColor: 'bg-blue-500', badgeBg: 'bg-blue-100', badgeText: 'text-blue-700' },
    { id: 'review', title: 'Under Review', dotColor: 'bg-amber-500', badgeBg: 'bg-amber-100', badgeText: 'text-amber-700' },
    { id: 'done', title: 'Done', dotColor: 'bg-emerald-500', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-700' },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      title: newTaskTitle.trim(),
      tag: newTaskTag,
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
      status: 'todo',
      dueText: '3 days left',
      project: newTaskProject,
      assignee: {
        name: 'Daffi Alfian Hadi',
        avatar: 'my-photo.jpeg'
      }
    });

    setNewTaskTitle('');
    setShowAddTaskModal(false);
  };

  const getNextStatus = (current: TaskItem['status']): TaskItem['status'] => {
    switch (current) {
      case 'todo':
        return 'in-progress';
      case 'in-progress':
        return 'review';
      case 'review':
        return 'done';
      case 'done':
        return 'todo';
    }
  };

  return (
    <div id="view-tasks" className="space-y-6 animate-fade pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Task Board
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Sprint management and deliverable tracking across all active accounts.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs text-slate-700">
            <span className="text-slate-400">Project:</span>
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer max-w-[200px] truncate"
            >
              <option value="All">All Projects</option>
              {projectOptions.map((projTitle) => (
                <option key={projTitle} value={projTitle}>
                  {projTitle}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddTaskModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`}></span>
                  <h3 className="font-bold text-sm text-slate-800">{col.title}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${col.badgeBg} ${col.badgeText}`}
                  >
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/60 transition"
                  title="Add Task to this Column"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Tasks in Column */}
              <div className="space-y-3">
                {colTasks.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    No tasks in {col.title}
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`bg-white p-4 rounded-xl border shadow-xs space-y-3 hover:shadow-md transition ${
                        task.status === 'review'
                          ? 'border-amber-200/80 hover:border-amber-400'
                          : task.status === 'done'
                          ? 'border-slate-200 opacity-90'
                          : 'border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      {/* Tag & Project */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span
                          className={`font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${task.tagColor}`}
                        >
                          {task.tag}
                        </span>
                        <span className="text-slate-400 truncate max-w-[110px] text-[10px]">
                          {task.project}
                        </span>
                      </div>

                      {/* Task Title */}
                      <h4
                        className={`text-sm font-semibold leading-snug ${
                          task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h4>

                      {/* Review Action if in Review */}
                      {task.status === 'review' && onOpenDeliverableModalByTitle && (
                        <div className="bg-amber-50 p-2 rounded-lg border border-amber-200/60 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-amber-800">
                            Deliverable awaiting sign-off
                          </span>
                          <button
                            onClick={() => onOpenDeliverableModalByTitle(task.title)}
                            className="text-xs font-bold text-amber-700 hover:underline"
                          >
                            Review
                          </button>
                        </div>
                      )}

                      {/* Footer: Date & Assignee & Quick Status bump */}
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                          {task.status === 'done' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          {task.dueText}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateTaskStatus(task.id, getNextStatus(task.status))}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            title={`Move to ${getNextStatus(task.status)}`}
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            title={task.assignee.name}
                            className="w-6 h-6 rounded-full object-cover ring-2 ring-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Quick Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create Sprint Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Audit checkout session error reporting"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project
                </label>
                <select
                  value={newTaskProject}
                  onChange={(e) => setNewTaskProject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800"
                >
                  {projectOptions.map((projTitle) => (
                    <option key={projTitle} value={projTitle}>
                      {projTitle}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Tag
                </label>
                <select
                  value={newTaskTag}
                  onChange={(e) => setNewTaskTag(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800"
                >
                  <option>Front-End</option>
                  <option>UI/UX</option>
                  <option>Database</option>
                  <option>Backend</option>
                  <option>Desktop</option>
                  <option>Game Dev</option>
                  <option>AI / Tools</option>
                  <option>Deliverable</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
