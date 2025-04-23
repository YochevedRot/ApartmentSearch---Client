// App.js
import React, { createContext, useState, useContext } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate
} from 'react-router-dom';
import TopBar from './components/Views/TopBar';
import ApartmentSearchPage from './components/Views/ApartmentSearchPage';
import PersonalArea from './components/Views/PersonalArea';
import LoginPage from './components/Views/LoginPage';
import ApartmentDetailPage from './components/Views/ApartmentDetailPage'

// 1) Simple auth context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (u) => setUser(u);
  const logout = () => setUser(null);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 2) A layout that always shows the TopBar and then whatever child route
function Layout({ onSearch }) {
  return (
    <>
      <Outlet />
    </>
  );
}

// 3) Protect the /personal route
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    // not logged in, send to login
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const [filters, setFilters] = useState({ city: '', price: '', floor: '', rooms: '' });
  const handleSearch = (f) => setFilters(f);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* All these routes render inside <Layout> which shows TopBar */}
          <Route element={<Layout onSearch={handleSearch} />}>
            {/* Start page: TopBar + apartment grid */}
            <Route
              path="/"
              element={<ApartmentSearchPage filters={filters} />}
            />

            {/* Protected personal area */}
            <Route
              path="/personal"
              element={
                <ProtectedRoute>
                  <PersonalArea
                    /* pass your endpoints & callbacks here */
                    userEndpoint="http://localhost:5031/api/user"
                    onEdit={(id) => console.log('Edit', id)}
                    onDelete={(id) => console.log('Delete', id)}
                    onRemoveSaved={(id) => console.log('Remove', id)}
                  />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Login sits outside the TopBar/Layout (so TopBar won’t show on /login) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/apartments/:id" element={<ApartmentDetailPage />} />
              
          {/* Catch-all redirect back to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
