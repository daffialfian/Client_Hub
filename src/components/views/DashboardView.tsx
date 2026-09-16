import React from 'react';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  MoreHorizontal,
  Image as ImageIcon
} from 'lucide-react';
import { Project, Invoice, NavView, UserProfile } from '../../types';

interface DashboardViewProps {
  projects: Project[];
  invoices: Invoice[];
  onSelectProject: (project: Project) => void;
  onNavigate: (view: NavView) => void;
  onDownloadInvoice: (invoiceId: string) => void;
  searchQuery?: string;
  user?: UserProfile;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  invoices,
  onSelectProject,
  onNavigate,
  onDownloadInvoice,
  searchQuery = '',
  user
}) => {
  // Filter by search query if any
  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvoices = invoices.filter(
    (i) =>
      i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Take top 3 projects for the dashboard view as in design
  const displayProjects = filteredProjects.slice(0, 3);
  const displayInvoices = filteredInvoices.slice(0, 3);

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm border border-slate-100">
            In Progress
          </span>
        );
      case 'Pending Approval':
        return (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-amber-700 shadow-sm border border-slate-100">
            Pending Approval
          </span>
        );
      case 'Completed':
        return (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 shadow-sm border border-slate-100">
            Completed
          </span>
        );
    }
  };

  const getFooterStatus = (project: Project) => {
    if (project.status === 'Completed') {
      return (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5 text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {project.timeframeText}
          </span>
          <span className="text-emerald-600 font-semibold">{project.statusText}</span>
        </div>
      );
    }

    if (project.status === 'Pending Approval') {
      return (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5 text-amber-700">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            {project.timeframeText}
          </span>
          <span className="text-amber-600 font-semibold">{project.statusText}</span>
        </div>
      );
    }

    return (
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1.5 text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          {project.timeframeText}
        </span>
        <span className="text-blue-600 font-semibold">{project.statusText}</span>
      </div>
    );
  };

  return (
    <div id="view-dashboard" className="space-y-10 animate-fade pb-8">
      {/* Welcome Header */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome Back, {user?.name || 'Daffi Alfian Hadi'}
          </h1>
          {user?.role && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
              {user.role}
            </span>
          )}
        </div>
        <p className="text-slate-500 text-sm sm:text-base">
          {user?.school ? `${user.school} • ` : ''}Here's a quick overview of your projects, sprint tasks, and client portal activities.
        </p>
      </div>

      {/* Active Projects Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Active Projects
          </h2>
          <button
            onClick={() => onNavigate('projects')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group transition cursor-pointer"
          >
            <span>View all projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 3 Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project) => (
            <div
              key={project.id}
              id={`dashboard-project-${project.id}`}
              onClick={() => onSelectProject(project)}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col"
            >
              {/* Image banner with placeholder icon fallback */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300">
                    <ImageIcon className="w-10 h-10 stroke-1" />
                  </div>
                )}
                {getStatusBadge(project.status)}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {getFooterStatus(project)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Invoices Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Recent Invoices
          </h2>
          <button
            onClick={() => onNavigate('invoices')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition cursor-pointer"
          >
            View all invoices
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase font-semibold text-slate-400 bg-slate-50/70 border-b border-slate-100">
                  <th className="py-3 px-6 whitespace-nowrap">Invoice ID</th>
                  <th className="py-3 px-6 whitespace-nowrap">Project</th>
                  <th className="py-3 px-6 whitespace-nowrap">Amount</th>
                  <th className="py-3 px-6 whitespace-nowrap">Due Date</th>
                  <th className="py-3 px-6 whitespace-nowrap">Status</th>
                  <th className="py-3 px-6 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {displayInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-medium text-slate-900 whitespace-nowrap">
                      {inv.id}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">
                      {inv.project}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-900 whitespace-nowrap">
                      {inv.amount}
                    </td>
                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{inv.dueDate}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {inv.status === 'Paid' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          Paid
                        </span>
                      ) : inv.status === 'Pending' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                          Overdue
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => onDownloadInvoice(inv.id)}
                        className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-lg transition"
                        title="Download Invoice PDF"
                        aria-label={`Download invoice ${inv.id}`}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
