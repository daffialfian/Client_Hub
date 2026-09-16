import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { DeliverableModal } from './components/modals/DeliverableModal';
import { NewProjectModal } from './components/modals/NewProjectModal';
import { DocumentModal } from './components/modals/DocumentModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  initialUserData,
  initialProjects,
  initialInvoices,
  initialTasks,
  initialContracts,
  initialTickets,
  initialNotifications,
} from './mockData';
import {
  NavView,
  ContractFilter,
  Project,
  Invoice,
  TaskItem,
  ContractItem,
  SupportTicket,
  UserProfile,
} from './types';

export default function App() {
  // State from mockData
  const [user] = useState<UserProfile>(initialUserData);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [contracts, setContracts] = useState<ContractItem[]>(initialContracts);
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [notifications, setNotifications] = useState(initialNotifications);

  // Navigation and Layout State
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [contractFilter, setContractFilter] = useState<ContractFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal States
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deliverableModalOpen, setDeliverableModalOpen] = useState(false);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractItem | null>(null);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'warning', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, type, title, description };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Deliverable Actions
  const handleOpenDeliverable = (project: Project) => {
    setSelectedProject(project);
    setDeliverableModalOpen(true);
  };

  const handleToggleDeliverable = (projectId: string, deliverableId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedDeliverables = p.deliverables.map((d) =>
          d.id === deliverableId ? { ...d, completed: !d.completed } : d
        );
        return { ...p, deliverables: updatedDeliverables };
      })
    );

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          deliverables: prev.deliverables.map((d) =>
            d.id === deliverableId ? { ...d, completed: !d.completed } : d
          ),
        };
      });
    }
  };

  const handleApproveProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          status: 'Completed',
          progress: 100,
          statusText: '100% Shipped',
          timeframeText: 'Approved Just Now',
          deliverables: p.deliverables.map((d) => ({ ...d, completed: true })),
        };
      })
    );

    // Also update any related task from review to done
    const approvedProj = projects.find((p) => p.id === projectId);
    if (approvedProj) {
      setTasks((prev) =>
        prev.map((t) =>
          t.project === approvedProj.title && t.status === 'review'
            ? { ...t, status: 'done', dueText: 'Completed Today' }
            : t
        )
      );
    }

    addToast(
      'success',
      'Milestone Approved & Signed Off!',
      `You have successfully approved all deliverables for "${approvedProj?.title || 'Project'}". Handover documentation has been archived.`
    );
  };

  // Add New Project
  const handleCreateProject = (projectData: Omit<Project, 'id' | 'deliverables'>) => {
    const newId = `proj-${Date.now()}`;
    const newProj: Project = {
      ...projectData,
      id: newId,
      deliverables: [
        {
          id: `del-${newId}-1`,
          title: 'Project Kickoff & Requirements Specification',
          type: 'doc',
          completed: true,
          actionLabel: 'View Brief',
        },
        {
          id: `del-${newId}-2`,
          title: 'Architecture Blueprint & Wireframes',
          type: 'figma',
          completed: false,
          actionLabel: 'In Progress',
        },
        {
          id: `del-${newId}-3`,
          title: 'Milestone 1 Deliverables Review',
          type: 'signoff',
          completed: false,
          actionLabel: 'Pending',
        },
      ],
    };

    setProjects((prev) => [newProj, ...prev]);
    addToast(
      'success',
      'Project Request Submitted',
      `"${projectData.title}" has been registered. Your technical project manager will contact you within 2 business hours.`
    );
  };

  // Contract Actions
  const handleSignContract = (contractId: string) => {
    setContracts((prev) =>
      prev.map((c) => {
        if (c.id !== contractId) return c;
        return {
          ...c,
          status: 'active',
          validText: `Electronically signed by ${user.name} via DocuSign • Valid until Dec 31, 2026`,
        };
      })
    );

    const signed = contracts.find((c) => c.id === contractId);
    addToast(
      'success',
      'Document Signed Successfully',
      `Electronic signature stamped on "${signed?.title || 'Agreement'}". A PDF copy was dispatched to your email.`
    );
  };

  const handleDownloadContract = (contract: ContractItem) => {
    addToast(
      'info',
      'Preparing PDF Download',
      `Generating authenticated copy of "${contract.pdfName}"...`
    );
  };

  const handleViewContract = (contract: ContractItem) => {
    setSelectedContract(contract);
    setDocumentModalOpen(true);
  };

  const handleUploadContract = () => {
    addToast(
      'info',
      'Upload Legal Document',
      'Document intake portal initialized. Drop your signed PDF or DocuSign bundle.'
    );
  };

  // Invoice Actions
  const handleDownloadInvoice = (invoiceId: string) => {
    addToast(
      'info',
      'Downloading Receipt',
      `Preparing tax invoice and payment breakdown for ${invoiceId}...`
    );
  };

  const handlePayBalance = () => {
    const hasPending = invoices.some((i) => i.status === 'Pending' || i.status === 'Overdue');
    if (!hasPending) {
      addToast('info', 'No Outstanding Balance', 'Your account balance is currently fully settled.');
      return;
    }

    setInvoices((prev) =>
      prev.map((inv) => ({
        ...inv,
        status: 'Paid',
      }))
    );

    addToast(
      'success',
      'Payment Processed Successfully',
      `All outstanding invoices have been settled. Formal payment confirmation sent to ${user.email}.`
    );
  };

  // Task Actions
  const handleAddTask = (newTask: Omit<TaskItem, 'id'>) => {
    const taskWithId: TaskItem = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [taskWithId, ...prev]);
    addToast('success', 'Task Created', `"${newTask.title}" added to Sprint Task Board.`);
  };

  const handleUpdateTaskStatus = (taskId: string, nextStatus: TaskItem['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
    addToast('info', 'Task Status Updated', `Task moved to ${nextStatus.toUpperCase()}.`);
  };

  // Support Ticket Actions
  const handleSubmitTicket = (
    ticketData: Omit<SupportTicket, 'id' | 'timeAgo' | 'status' | 'assignedTo'>
  ) => {
    const newId = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      ...ticketData,
      id: newId,
      timeAgo: 'Just now',
      status: 'Open',
      assignedTo: `${user.name} (Technical Support)`,
    };

    setTickets((prev) => [newTicket, ...prev]);
    addToast(
      'success',
      'Support Ticket Created',
      `Ticket ${newId} submitted. You will receive an update in under 15 minutes.`
    );
  };

  // Notification Actions
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-800 font-sans antialiased">
      {/* 1. Left Navigation Sidebar Component */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        contractFilter={contractFilter}
        setContractFilter={setContractFilter}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        onOpenNewProjectModal={() => setNewProjectModalOpen(true)}
        user={user}
      />

      {/* 2. Main Content Area Component */}
      <MainContent
        activeView={activeView}
        setActiveView={setActiveView}
        contractFilter={contractFilter}
        setContractFilter={setContractFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        projects={projects}
        invoices={invoices}
        tasks={tasks}
        contracts={contracts}
        tickets={tickets}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onSelectProject={handleOpenDeliverable}
        onOpenNewProjectModal={() => setNewProjectModalOpen(true)}
        onDownloadInvoice={handleDownloadInvoice}
        onPayBalance={handlePayBalance}
        onAddTask={handleAddTask}
        onUpdateTaskStatus={handleUpdateTaskStatus}
        onSignContract={handleSignContract}
        onDownloadContract={handleDownloadContract}
        onViewContract={handleViewContract}
        onUploadContract={handleUploadContract}
        onSubmitTicket={handleSubmitTicket}
        user={user}
      />

      {/* 3. Deliverable & Approval Modal */}
      <DeliverableModal
        project={selectedProject}
        isOpen={deliverableModalOpen}
        onClose={() => setDeliverableModalOpen(false)}
        onApproveProject={handleApproveProject}
        onToggleDeliverable={handleToggleDeliverable}
      />

      {/* 4. Request New Project Modal */}
      <NewProjectModal
        isOpen={newProjectModalOpen}
        onClose={() => setNewProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      {/* 5. Document Viewer Modal */}
      <DocumentModal
        contract={selectedContract}
        isOpen={documentModalOpen}
        onClose={() => setDocumentModalOpen(false)}
        onDownload={handleDownloadContract}
      />

      {/* 6. Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
