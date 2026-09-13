import React, { useState, useEffect } from 'react';
import { X, Check, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Project } from '../../types';

interface DeliverableModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onApproveProject: (projectId: string) => void;
  onToggleDeliverable: (projectId: string, deliverableId: string) => void;
}

export const DeliverableModal: React.FC<DeliverableModalProps> = ({
  project,
  isOpen,
  onClose,
  onApproveProject,
  onToggleDeliverable,
}) => {
  if (!isOpen || !project) return null;

  const allCompleted = project.deliverables.every((d) => d.completed);
  const isAlreadyCompleted = project.status === 'Completed';

  const getStatusBadge = () => {
    if (project.status === 'Completed') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Completed & Approved
        </span>
      );
    }
    if (project.status === 'Pending Approval') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          Pending Approval
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        In Progress
      </span>
    );
  };

  return (
    <div
      id="deliverable-modal"
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">{getStatusBadge()}</div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              {project.title} Deliverables
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          {project.description}
        </p>

        {/* Deliverables Checklist */}
        <div className="space-y-2 border-t border-b border-slate-100 py-3.5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Deliverables Verification Checklist
          </div>

          {project.deliverables.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-xl transition ${
                item.completed ? 'bg-slate-50' : 'bg-amber-50/50 border border-amber-200/60'
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer flex-1 select-none pr-3">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => onToggleDeliverable(project.id, item.id)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span
                  className={`text-xs font-medium ${
                    item.completed ? 'text-slate-700 line-through' : 'text-slate-900 font-semibold'
                  }`}
                >
                  {item.title}
                </span>
              </label>

              {item.actionLabel && (
                <button
                  type="button"
                  onClick={() => alert(`Simulating action: ${item.actionLabel}`)}
                  className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>{item.actionLabel}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Info notice */}
        {project.status === 'Pending Approval' && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <span className="font-semibold">Sign-off required:</span> By approving, you certify that
              the deliverables meet the agreed statement of work. Wonderinc will initiate the final
              handover and warranty phase.
            </div>
          </div>
        )}

        {isAlreadyCompleted && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs text-emerald-800 font-medium">
              This milestone was successfully approved and certified by your organization.
            </span>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            Close
          </button>

          {!isAlreadyCompleted && (
            <button
              type="button"
              id="btn-approve-signoff"
              onClick={() => {
                onApproveProject(project.id);
                onClose();
              }}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs hover:shadow transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Approve & Sign Off</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
