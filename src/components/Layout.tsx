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
          text-base no-underline transition-colors duration-200
          ${isActive 
            ? 'text-blue-600 font-semibold' 
            : 'text-gray-700 font-normal hover:text-blue-600'
          }
        `}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link 
            to="/" 
            className="text-2xl font-bold text-blue-600 no-underline"
          >
            Sandbox Console
          </Link>
          
          <nav className="flex gap-6 items-center">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/api-keys">API Keys</NavLink>
            <NavLink to="/usage">Usage</NavLink>
            <NavLink to="/docs">Docs</NavLink>
          </nav>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-6xl mx-auto py-8 px-6 w-full">
        <Outlet />
      </main>
      
      {/* Dev Toolbar - only shows if DEBUG_MODE is true */}
      <DevToolbar />
    </div>
  );
};
