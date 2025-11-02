import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { Button } from './Button';
import { DevToolbar } from './DevToolbar';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`
          block px-4 py-2 rounded-md text-base no-underline transition-colors duration-200
          ${isActive 
            ? 'bg-mono-800/50 text-mono-50 font-semibold border-l-4 border-mono-100' 
            : 'text-mono-300 font-normal hover:text-mono-50 hover:bg-mono-800/30'
          }
        `}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-mono-900 shadow-sm fixed h-screen flex flex-col">
        <div className="p-6">
          <Link 
            to="/" 
            className="text-xl font-bold text-mono-50 no-underline"
          >
            Sandbox Console
          </Link>
        </div>
        
        <nav className="px-6 py-4">
          <div className="flex flex-col gap-4">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/api-keys">API Keys</NavLink>
            <NavLink to="/usage">Usage</NavLink>
            <NavLink to="/docs">Docs</NavLink>
          </div>
        </nav>
        
        {/* Spacer to push logout to bottom */}
        <div className="flex-1"></div>
        
        <div className="p-6 border-t border-mono-800">
          <div className="flex flex-col gap-3">
            <span className="text-sm text-mono-400 truncate">{user?.email}</span>
            <Button size="sm" variant="ghost" onClick={handleLogout} className="w-full">
              Logout
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        <main className="flex-1 py-8 px-6">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
      
      <DevToolbar />
    </div>
  );
};
