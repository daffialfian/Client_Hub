import React, { useState } from 'react';
import { Send, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { SupportTicket } from '../../types';

interface SupportViewProps {
  tickets: SupportTicket[];
  onSubmitTicket: (ticket: Omit<SupportTicket, 'id' | 'timeAgo' | 'status' | 'assignedTo'>) => void;
  searchQuery?: string;
}

export const SupportView: React.FC<SupportViewProps> = ({
  tickets,
  onSubmitTicket,
  searchQuery = ''
}) => {
  const [project, setProject] = useState('Website Redesign');
  const [priority, setPriority] = useState<'Normal' | 'Urgent' | 'Critical'>('Normal');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    onSubmitTicket({
      subject: subject.trim(),
      project,
      priority,
      description: description.trim()
    });

    setSubject('');
    setDescription('');
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="view-support" className="space-y-8 animate-fade pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Help Desk & Client Support
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Submit inquiries and questions directly to your dedicated technical account manager.
        </p>
      </div>

      {/* Grid: Form (Left) & Active Tickets (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ticket Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Create Support Ticket</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Average response time is currently under 15 minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Related Project
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              >
                <option>Website Redesign</option>
                <option>Mobile App Development</option>
                <option>E-commerce Migration</option>
                <option>Brand Identity Overhaul</option>
                <option>AWS Cloud Architecture</option>
                <option>Billing / Invoicing Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPriority('Normal')}
                  className={`border rounded-xl p-2 text-center text-xs font-medium transition cursor-pointer ${
                    priority === 'Normal'
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('Urgent')}
                  className={`border rounded-xl p-2 text-center text-xs font-medium transition cursor-pointer ${
                    priority === 'Urgent'
                      ? 'bg-amber-50 border-amber-500 text-amber-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Urgent
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('Critical')}
                  className={`border rounded-xl p-2 text-center text-xs font-medium transition cursor-pointer ${
                    priority === 'Critical'
                      ? 'bg-rose-50 border-rose-500 text-rose-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Critical
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Question regarding header fonts on staging"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Description
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your question or attachment requirements in detail..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Submit Ticket</span>
            </button>
          </form>
        </div>

        {/* Active Tickets List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your Tickets ({tickets.length})</h2>
            <span className="text-xs text-slate-400">Synced live with Wonderinc Helpdesk</span>
          </div>

          <div className="space-y-3">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                No support tickets found.
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2.5 hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500 font-semibold">
                        {ticket.id}
                      </span>
                      <span className="text-xs text-slate-400">• {ticket.project}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          ticket.priority === 'Critical'
                            ? 'bg-rose-100 text-rose-700'
                            : ticket.priority === 'Urgent'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {ticket.priority}
                      </span>

                      {ticket.status === 'Resolved' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Resolved
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-600 animate-spin" />
                          {ticket.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{ticket.subject}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{ticket.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      Assigned to: <strong className="text-slate-600">{ticket.assignedTo}</strong>
                    </span>
                    <span>{ticket.timeAgo}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
