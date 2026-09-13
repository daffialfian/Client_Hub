import React, { useState } from 'react';
import {
  LayoutDashboard,
  Folder,
  CheckSquare,
  Receipt,
  FileText,
  LifeBuoy,
  Plus,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  X,
  Settings,
  LogOut,
  UserCheck
} from 'lucide-react';
import { NavView, ContractFilter, UserProfile } from '../types';

interface SidebarProps {
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  contractFilter: ContractFilter;
  setContractFilter: (filter: ContractFilter) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenNewProjectModal: () => void;
  user: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  contractFilter,
  setContractFilter,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  onOpenNewProjectModal,
  user
}) => {
  const [contractsOpen, setContractsOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleNavClick = (view: NavView) => {
    setActiveView(view);
    setMobileOpen(false);
  };

  const handleContractSubmenuClick = (filter: ContractFilter) => {
    setActiveView('contracts');
    setContractFilter(filter);
    setMobileOpen(false);
  };

  const navItems = [
    { id: 'dashboard' as NavView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects' as NavView, label: 'Projects', icon: Folder },
    { id: 'tasks' as NavView, label: 'Tasks', icon: CheckSquare },
    { id: 'invoices' as NavView, label: 'Invoices', icon: Receipt },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between select-none">
      {/* Top Header & Brand */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className={`h-20 px-5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-slate-100/80`}>
          <button
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 group text-left focus:outline-none"
            title="Client Hub"
          >
            {/* Geometric Wonderinc Icon */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 via-blue-500 to-indigo-400 flex items-center justify-center p-1.5 shadow-sm shrink-0 group-hover:scale-105 transition">
              <div className="w-full h-full rounded-full border-2 border-white/90 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            {!isCollapsed && (
              <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                Client Hub
              </span>
            )}
          </button>

          {/* Desktop collapse button */}
          <button
            id="toggle-sidebar-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition focus:outline-none"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3.5 px-3.5 py-2.5'
                } rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-blue-600 bg-blue-50/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}

          {/* Contracts with accordion */}
          <div>
            <button
              id="nav-contracts"
              onClick={() => {
                if (isCollapsed) {
                  handleNavClick('contracts');
                } else {
                  setContractsOpen(!contractsOpen);
                  setActiveView('contracts');
                }
              }}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3.5 py-2.5'
              } rounded-xl text-sm font-medium transition-all ${
                activeView === 'contracts'
                  ? 'text-blue-600 bg-blue-50/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={isCollapsed ? 'Contracts' : undefined}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3.5'}`}>
                <FileText className={`w-5 h-5 shrink-0 ${activeView === 'contracts' ? 'text-blue-600' : 'text-slate-500'}`} />
                {!isCollapsed && <span>Contracts</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    contractsOpen ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {/* Submenu */}
            {!isCollapsed && contractsOpen && (
              <div className="ml-9 mt-1 pl-3 border-l border-slate-200/90 space-y-0.5">
                <button
                  id="nav-contracts-active"
                  onClick={() => handleContractSubmenuClick('active')}
                  className={`w-full text-left py-1.5 px-2.5 text-sm rounded-lg transition-colors ${
                    activeView === 'contracts' && contractFilter === 'active'
                      ? 'text-blue-600 bg-blue-50/70 font-semibold'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  Active
                </button>
                <button
                  id="nav-contracts-pending"
                  onClick={() => handleContractSubmenuClick('pending')}
                  className={`w-full text-left py-1.5 px-2.5 text-sm rounded-lg transition-colors ${
                    activeView === 'contracts' && contractFilter === 'pending'
                      ? 'text-blue-600 bg-blue-50/70 font-semibold'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  Pending
                </button>
                <button
                  id="nav-contracts-completed"
                  onClick={() => handleContractSubmenuClick('completed')}
                  className={`w-full text-left py-1.5 px-2.5 text-sm rounded-lg transition-colors ${
                    activeView === 'contracts' && contractFilter === 'completed'
                      ? 'text-blue-600 bg-blue-50/70 font-semibold'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  Completed
                </button>
              </div>
            )}
          </div>

          {/* Support Link */}
          <button
            id="nav-support"
            onClick={() => handleNavClick('support')}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3.5 px-3.5 py-2.5'
            } rounded-xl text-sm font-medium transition-all ${
              activeView === 'support'
                ? 'text-blue-600 bg-blue-50/80 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title={isCollapsed ? 'Support' : undefined}
          >
            <LifeBuoy className={`w-5 h-5 shrink-0 ${activeView === 'support' ? 'text-blue-600' : 'text-slate-500'}`} />
            {!isCollapsed && <span className="truncate">Support</span>}
          </button>
        </nav>
      </div>

      {/* Bottom Action & Profile */}
      <div className="p-4 border-t border-slate-100 flex flex-col gap-3 relative">
        <button
          id="btn-add-project-sidebar"
          onClick={onOpenNewProjectModal}
          className={`w-full ${
            isCollapsed ? 'p-2.5' : 'py-2.5 px-4'
          } bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
          title="Add Project"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Add Project</span>}
        </button>

        {/* User Profile */}
        <div className="relative">
          <div
            id="user-profile-toggle"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className={`flex items-center ${
              isCollapsed ? 'justify-center p-1' : 'justify-between px-2 py-2'
            } rounded-xl hover:bg-slate-50 transition cursor-pointer group`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
              />
              {!isCollapsed && (
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-sm font-semibold text-slate-900 leading-tight truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-slate-500 truncate">{user.email}</span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform ${
                  profileDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            )}
          </div>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500">{user.role}</p>
              </div>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  alert('Account settings dialog');
                }}
                className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Settings</span>
              </button>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  alert('Switch client workspace');
                }}
                className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Switch Workspace</span>
              </button>
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    alert('Logging out of Client Hub');
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id="desktop-sidebar"
        className={`hidden md:block ${
          isCollapsed ? 'w-20' : 'w-64'
        } border-r border-slate-200/80 bg-white shrink-0 transition-all duration-300 z-20`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-2xl transition-transform duration-300 transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
