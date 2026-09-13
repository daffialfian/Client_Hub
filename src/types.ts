export type NavView = 'dashboard' | 'projects' | 'tasks' | 'invoices' | 'contracts' | 'support';

export type ContractFilter = 'all' | 'active' | 'pending' | 'completed';
export type ProjectStatus = 'In Progress' | 'Pending Approval' | 'Completed';
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

export interface DeliverableItem {
  id: string;
  title: string;
  type: 'figma' | 'deployment' | 'signoff' | 'code' | 'doc';
  completed: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  timeframeText: string;
  statusText: string;
  image: string;
  category?: string;
  phase?: string;
  deliverables: DeliverableItem[];
}

export interface Invoice {
  id: string;
  project: string;
  amount: string;
  amountNumber: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

export interface TaskItem {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  dueText: string;
  project: string;
  assignee: {
    name: string;
    avatar: string;
  };
}

export interface ContractItem {
  id: string;
  title: string;
  type: string;
  status: 'active' | 'pending' | 'completed';
  validText: string;
  description: string;
  pdfName: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  project: string;
  priority: 'Normal' | 'Urgent' | 'Critical';
  status: 'Open' | 'Investigating' | 'Resolved';
  timeAgo: string;
  assignedTo: string;
  description: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}
