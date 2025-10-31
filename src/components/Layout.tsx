import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { Button } from './Button';
import { colors, spacing, typography, shadows } from '../styles/tokens';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    boxShadow: shadows.sm,
    borderBottom: `1px solid ${colors.neutral[200]}`,
  };

  const headerContentStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${spacing[4]} ${spacing[6]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
    textDecoration: 'none',
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing[6],
    alignItems: 'center',
  };

  const linkStyle = (isActive: boolean): React.CSSProperties => ({
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    fontWeight: isActive ? typography.fontWeight.semibold : typography.fontWeight.normal,
    color: isActive ? colors.primary[600] : colors.neutral[700],
    textDecoration: 'none',
    transition: 'color 200ms ease-in-out',
  });

  const userInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
  };

  const userNameStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `${spacing[8]} ${spacing[6]}`,
    width: '100%',
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={headerContentStyle}>
          <Link to="/" style={logoStyle}>
            Sandbox Console
          </Link>
          <nav style={navStyle}>
            <Link
              to="/dashboard"
              style={linkStyle(location.pathname === '/dashboard')}
              onMouseEnter={(e) => {
                if (location.pathname !== '/dashboard') {
                  e.currentTarget.style.color = colors.primary[600];
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/dashboard') {
                  e.currentTarget.style.color = colors.neutral[700];
                }
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/api-keys"
              style={linkStyle(location.pathname === '/api-keys')}
              onMouseEnter={(e) => {
                if (location.pathname !== '/api-keys') {
                  e.currentTarget.style.color = colors.primary[600];
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/api-keys') {
                  e.currentTarget.style.color = colors.neutral[700];
                }
              }}
            >
              API Keys
            </Link>
            <Link
              to="/usage"
              style={linkStyle(location.pathname === '/usage')}
              onMouseEnter={(e) => {
                if (location.pathname !== '/usage') {
                  e.currentTarget.style.color = colors.primary[600];
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/usage') {
                  e.currentTarget.style.color = colors.neutral[700];
                }
              }}
            >
              Usage
            </Link>
            <Link
              to="/docs"
              style={linkStyle(location.pathname === '/docs')}
              onMouseEnter={(e) => {
                if (location.pathname !== '/docs') {
                  e.currentTarget.style.color = colors.primary[600];
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/docs') {
                  e.currentTarget.style.color = colors.neutral[700];
                }
              }}
            >
              Docs
            </Link>
          </nav>
          <div style={userInfoStyle}>
            <span style={userNameStyle}>{user?.email}</span>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main style={mainStyle}>
        <Outlet />
      </main>
    </div>
  );
};
