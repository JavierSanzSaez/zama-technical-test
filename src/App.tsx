import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './contexts/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { APIKeysPage } from './pages/APIKeysPage';
import { UsagePage } from './pages/UsagePage';
import { DocsPage } from './pages/DocsPage';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="api-keys" element={<APIKeysPage />} />
            <Route path="usage" element={<UsagePage />} />
            <Route path="docs" element={<DocsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;
