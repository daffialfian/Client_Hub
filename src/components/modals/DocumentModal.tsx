import React from 'react';
import { X, Download, FileText, CheckCircle2 } from 'lucide-react';
import { ContractItem } from '../../types';

interface DocumentModalProps {
  contract: ContractItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (contract: ContractItem) => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  contract,
  isOpen,
  onClose,
  onDownload,
}) => {
  if (!isOpen || !contract) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{contract.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{contract.pdfName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulated Document Preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 font-mono text-xs text-slate-700 space-y-4 leading-relaxed select-text">
          <div className="text-center font-sans border-b border-slate-200 pb-3">
            <h4 className="font-bold text-base text-slate-900">{contract.title}</h4>
            <p className="text-[11px] text-slate-500 mt-1">Wonderinc Legal Agreement • ID: {contract.id}</p>
          </div>

          <p>
            <strong>1. PARTIES & SCOPE:</strong> This Agreement is executed by and between Wonderinc Digital Inc. ("Provider") and Joel Hannibal ("Client"). The terms defined herein govern all deliverable submissions, intellectual property transfers, and service milestones.
          </p>

          <p>
            <strong>2. DELIVERABLES & ACCEPTANCE:</strong> Client agrees to review all milestone submissions within fourteen (14) business days. Acceptance or requested revisions shall be conducted via the Wonderinc Client Portal.
          </p>

          <p>
            <strong>3. CONFIDENTIALITY:</strong> All software code, staging builds, architectural diagrams, and trade secrets shall be maintained in strict confidence according to international NDA standards.
          </p>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between font-sans text-xs">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Certified Digital Signature Verified</span>
            </div>
            <span className="text-slate-500">DocuSign Envelope ID: #8928-192B</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => onDownload(contract)}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Copy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
