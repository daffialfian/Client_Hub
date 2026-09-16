import React from 'react';
import { Header } from './Header';
import { DashboardView } from './views/DashboardView';
import { ProjectsView } from './views/ProjectsView';
import { TasksView } from './views/TasksView';
import { InvoicesView } from './views/InvoicesView';
import { ContractsView } from './views/ContractsView';
import { SupportView } from './views/SupportView';
import {
  NavView,
  ContractFilter,
  Project,
  Invoice,
  TaskItem,
  ContractItem,
  SupportTicket,
  UserProfile
} from '../types';

interface MainContentProps {
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  contractFilter: ContractFilter;
  setContractFilter: (filter: ContractFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenMobileMenu: () => void;
  projects: Project[];
  invoices: Invoice[];
  tasks: TaskItem[];
  contracts: ContractItem[];
  tickets: SupportTicket[];
  notifications: Array<{
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
  }>;
  onMarkNotificationRead: (id: string) => void;
  onSelectProject: (project: Project) => void;
  onOpenNewProjectModal: () => void;
  onDownloadInvoice: (invoiceId: string) => void;
  onPayBalance: () => void;
  onAddTask: (task: Omit<TaskItem, 'id'>) => void;
  onUpdateTaskStatus: (taskId: string, nextStatus: TaskItem['status']) => void;
  onSignContract: (contractId: string) => void;
  onDownloadContract: (contract: ContractItem) => void;
  onViewContract: (contract: ContractItem) => void;
  onUploadContract: () => void;
  onSubmitTicket: (ticket: Omit<SupportTicket, 'id' | 'timeAgo' | 'status' | 'assignedTo'>) => void;
  user?: UserProfile;
}

export const MainContent: React.FC<MainContentProps> = ({
  activeView,
  setActiveView,
  contractFilter,
  setContractFilter,
  searchQuery,
  setSearchQuery,
  onOpenMobileMenu,
  projects,
  invoices,
  tasks,
  contracts,
  tickets,
  notifications,
  onMarkNotificationRead,
  onSelectProject,
  onOpenNewProjectModal,
  onDownloadInvoice,
  onPayBalance,
  onAddTask,
  onUpdateTaskStatus,
  onSignContract,
  onDownloadContract,
  onViewContract,
  onUploadContract,
  onSubmitTicket,
  user
}) => {
  const handleOpenDeliverableByTitle = (title: string) => {
    // Try to match with an existing project
    const match = projects.find((p) =>
      title.toLowerCase().includes(p.title.toLowerCase()) ||
      p.title.toLowerCase().includes(title.toLowerCase())
    ) || projects[0];

    onSelectProject(match);
  };

  return (
    <main id="main-content-area" className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Bar Header */}
      <Header
        activeView={activeView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenMobileMenu={onOpenMobileMenu}
        notifications={notifications}
        onMarkNotificationRead={onMarkNotificationRead}
      />

      {/* Dynamic Viewport Content */}
      <div
        id="content-container"
        className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8"
      >
        {activeView === 'dashboard' && (
          <DashboardView
            projects={projects}
            invoices={invoices}
            onSelectProject={onSelectProject}
            onNavigate={(v) => setActiveView(v)}
            onDownloadInvoice={onDownloadInvoice}
            searchQuery={searchQuery}
            user={user}
          />
        )}

        {activeView === 'projects' && (
          <ProjectsView
            projects={projects}
            onSelectProject={onSelectProject}
            onOpenNewProjectModal={onOpenNewProjectModal}
            searchQuery={searchQuery}
          />
        )}

        {activeView === 'tasks' && (
          <TasksView
            tasks={tasks}
            projects={projects}
            onAddTask={onAddTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
            searchQuery={searchQuery}
            onOpenDeliverableModalByTitle={handleOpenDeliverableByTitle}
          />
        )}

        {activeView === 'invoices' && (
          <InvoicesView
            invoices={invoices}
            onDownloadInvoice={onDownloadInvoice}
            onPayBalance={onPayBalance}
            searchQuery={searchQuery}
          />
        )}

        {activeView === 'contracts' && (
          <ContractsView
            contracts={contracts}
            currentFilter={contractFilter}
            setFilter={setContractFilter}
            onSignContract={onSignContract}
            onDownloadContract={onDownloadContract}
            onViewContract={onViewContract}
            onUploadContract={onUploadContract}
            searchQuery={searchQuery}
          />
        )}

        {activeView === 'support' && (
          <SupportView
            tickets={tickets}
            projects={projects}
            onSubmitTicket={onSubmitTicket}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </main>
  );
};
