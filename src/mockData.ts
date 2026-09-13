import rawData from './mockData.json';
import { Project, Invoice, TaskItem, ContractItem, SupportTicket, UserProfile } from './types';

export const initialUserData: UserProfile = rawData.user as UserProfile;
export const initialProjects: Project[] = rawData.projects as Project[];
export const initialInvoices: Invoice[] = rawData.invoices as Invoice[];
export const initialTasks: TaskItem[] = rawData.tasks as TaskItem[];
export const initialContracts: ContractItem[] = rawData.contracts as ContractItem[];
export const initialTickets: SupportTicket[] = rawData.tickets as SupportTicket[];
export const initialNotifications = rawData.notifications;
