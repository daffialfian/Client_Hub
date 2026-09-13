import React, { useState } from 'react';
import { Download, CreditCard, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { Invoice } from '../../types';

interface InvoicesViewProps {
  invoices: Invoice[];
  onDownloadInvoice: (id: string) => void;
  onPayBalance: () => void;
  searchQuery?: string;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  onDownloadInvoice,
  onPayBalance,
  searchQuery = ''
}) => {
  const [filter, setFilter] = useState<'all' | 'Paid' | 'Pending' | 'Overdue'>('all');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.amount.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filter !== 'all' && inv.status !== filter) return false;
    return true;
  });

  const totalOutstanding = invoices
    .filter((inv) => inv.status === 'Pending' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.amountNumber, 0);

  const totalPaid = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amountNumber, 0);

  return (
    <div id="view-invoices" className="space-y-6 animate-fade pb-8">
      {/* Top Header & Balance CTA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Billing & Invoices
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Download official receipts, manage payment methods, and check outstanding balances.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Outstanding Balance card */}
          <div className="bg-blue-50/80 border border-blue-100 px-4 py-2 rounded-xl text-left sm:text-right">
            <span className="text-xs text-blue-600 font-medium block">Total Balance Due</span>
            <span className="text-xl font-bold text-blue-900">
              ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            id="btn-pay-balance"
            onClick={onPayBalance}
            disabled={totalOutstanding === 0}
            className={`px-4 py-2.5 text-white text-sm font-semibold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer ${
              totalOutstanding === 0
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Balance Now</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Paid</p>
            <p className="text-lg font-bold text-emerald-700 mt-0.5">
              ${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Invoices</p>
            <p className="text-lg font-bold text-amber-700 mt-0.5">
              ${invoices
                .filter((i) => i.status === 'Pending')
                .reduce((s, i) => s + i.amountNumber, 0)
                .toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overdue</p>
            <p className="text-lg font-bold text-rose-700 mt-0.5">
              ${invoices
                .filter((i) => i.status === 'Overdue')
                .reduce((s, i) => s + i.amountNumber, 0)
                .toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-sm font-medium">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setFilter('Paid')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filter === 'Paid' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Paid ({invoices.filter((i) => i.status === 'Paid').length})
        </button>
        <button
          onClick={() => setFilter('Pending')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filter === 'Pending' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pending ({invoices.filter((i) => i.status === 'Pending').length})
        </button>
        <button
          onClick={() => setFilter('Overdue')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filter === 'Overdue' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Overdue ({invoices.filter((i) => i.status === 'Overdue').length})
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase font-semibold text-slate-400 bg-slate-50/70 border-b border-slate-100">
                <th className="py-3.5 px-6">Invoice ID</th>
                <th className="py-3.5 px-6">Project Name</th>
                <th className="py-3.5 px-6">Issue Date</th>
                <th className="py-3.5 px-6">Due Date</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">
                    {inv.id}
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-900 whitespace-nowrap">
                    {inv.project}
                  </td>
                  <td className="py-4 px-6 text-slate-500 whitespace-nowrap">{inv.issueDate}</td>
                  <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{inv.dueDate}</td>
                  <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">
                    {inv.amount}
                  </td>
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
