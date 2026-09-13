import React, { useState } from 'react';
import { Plus, CheckCircle2, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { Project } from '../../types';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenNewProjectModal: () => void;
  searchQuery?: string;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSelectProject,
  onOpenNewProjectModal,
  searchQuery = ''
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all');

  const filteredProjects = projects.filter((project) => {
    // Text search
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.category && project.category.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Filter tab
    if (filter === 'active') return project.status === 'In Progress';
    if (filter === 'pending') return project.status === 'Pending Approval';
    if (filter === 'completed') return project.status === 'Completed';
    return true;
  });

  const countActive = projects.filter((p) => p.status === 'In Progress').length;
  const countPending = projects.filter((p) => p.status === 'Pending Approval').length;
  const countCompleted = projects.filter((p) => p.status === 'Completed').length;

  return (
    <div id="view-projects" className="space-y-8 animate-fade pb-8">
      {/* Top Title & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Projects Gallery
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review your organization's ongoing builds, milestones, and deliverable approvals.
          </p>
        </div>
        <button
          id="btn-request-new-project"
          onClick={onOpenNewProjectModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Request New Project</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-sm font-medium overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            filter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Projects ({projects.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            filter === 'active'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          In Progress ({countActive})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            filter === 'pending'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pending Approval ({countPending})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            filter === 'completed'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Completed ({countCompleted})
        </button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">No projects found matching this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition group flex flex-col"
            >
              {/* Image banner */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${
                    project.status === 'In Progress'
                      ? 'bg-blue-600 text-white'
                      : project.status === 'Pending Approval'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {project.status}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>{project.category || 'Engineering'}</span>
                    <span>{project.timeframeText}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                    <span>{project.phase || 'Progress'}</span>
                    <span
                      className={`font-semibold ${
                        project.status === 'Completed'
                          ? 'text-emerald-600'
                          : project.status === 'Pending Approval'
                          ? 'text-amber-600'
                          : 'text-blue-600'
                      }`}
                    >
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        project.status === 'Completed'
                          ? 'bg-emerald-500'
                          : project.status === 'Pending Approval'
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Action CTA based on status */}
                {project.status === 'Pending Approval' ? (
                  <button
                    onClick={() => onSelectProject(project)}
                    className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-xl border border-amber-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>⚡ Action Needed: Sign Off</span>
                  </button>
                ) : project.status === 'Completed' ? (
                  <button
                    onClick={() => onSelectProject(project)}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
                  >
                    View Handover Package
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectProject(project)}
                    className="w-full py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200/80 transition cursor-pointer"
                  >
                    Inspect Deliverables & Approval
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
