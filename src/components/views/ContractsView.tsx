import React from 'react';
import { FileCheck, PenTool, ShieldCheck, Archive, Download, Upload, CheckCircle2, Eye } from 'lucide-react';
import { ContractItem, ContractFilter } from '../../types';

interface ContractsViewProps {
  contracts: ContractItem[];
  currentFilter: ContractFilter;
  setFilter: (filter: ContractFilter) => void;
  onSignContract: (contractId: string) => void;
  onDownloadContract: (contract: ContractItem) => void;
  onViewContract: (contract: ContractItem) => void;
  onUploadContract: () => void;
  searchQuery?: string;
}

export const ContractsView: React.FC<ContractsViewProps> = ({
  contracts,
  currentFilter,
  setFilter,
  onSignContract,
  onDownloadContract,
  onViewContract,
  onUploadContract,
  searchQuery = ''
}) => {
  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (currentFilter === 'active') return c.status === 'active';
    if (currentFilter === 'pending') return c.status === 'pending';
    if (currentFilter === 'completed') return c.status === 'completed';
    return true;
  });

  const getContractIcon = (status: ContractItem['status'], type: string) => {
    if (status === 'pending') {
      return (
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <PenTool className="w-6 h-6" />
        </div>
      );
    }
    if (status === 'completed') {
      return (
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
          <Archive className="w-6 h-6" />
        </div>
      );
    }
    if (type === 'NDA') {
      return (
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
        <FileCheck className="w-6 h-6" />
      </div>
    );
  };

  const activeCount = contracts.filter((c) => c.status === 'active').length;
  const pendingCount = contracts.filter((c) => c.status === 'pending').length;
  const completedCount = contracts.filter((c) => c.status === 'completed').length;

  return (
    <div id="view-contracts" className="space-y-6 animate-fade pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Contracts & Legal Documents
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Master services agreements, non-disclosure contracts, and statement of work filings.
          </p>
        </div>
        <button
          onClick={onUploadContract}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-xs transition shrink-0 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Signed NDA</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-sm font-medium overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            currentFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Documents ({contracts.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            currentFilter === 'active'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            currentFilter === 'pending'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pending Signature ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            currentFilter === 'completed'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Archived / Completed ({completedCount})
        </button>
      </div>

      {/* Contracts List */}
      <div className="space-y-3.5">
        {filteredContracts.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">No contracts match this filter category.</p>
          </div>
        ) : (
          filteredContracts.map((contract) => (
            <div
              key={contract.id}
              className={`bg-white p-5 rounded-2xl border transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                contract.status === 'pending'
                  ? 'border-amber-200 bg-amber-50/20 hover:border-amber-300'
                  : contract.status === 'completed'
                  ? 'border-slate-200 opacity-85 hover:opacity-100'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Left Info */}
              <div className="flex items-start sm:items-center gap-4">
                {getContractIcon(contract.status, contract.type)}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base">{contract.title}</h3>
                    {contract.status === 'active' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    ) : contract.status === 'pending' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Pending Signature
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{contract.validText}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{contract.description}</p>
                </div>
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                {contract.status === 'pending' ? (
                  <button
                    onClick={() => onSignContract(contract.id)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Sign Electronically</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onViewContract(contract)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Document</span>
                  </button>
                )}

                <button
                  onClick={() => onDownloadContract(contract)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
