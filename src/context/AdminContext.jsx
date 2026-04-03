import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState(() => {
    const isPreview = new URLSearchParams(window.location.search).get('preview') === '1';
    if (isPreview) return false;
    return sessionStorage.getItem('pr_admin') === '1';
  });

  const login = (pin) => {
    const validPin = import.meta.env.VITE_ADMIN_PIN;
    if (!validPin && import.meta.env.DEV) {
      console.warn('[AdminContext] VITE_ADMIN_PIN non défini dans .env — la connexion admin sera toujours refusée.');
    }
    if (pin === validPin) {
      setIsAdminMode(true);
      sessionStorage.setItem('pr_admin', '1');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminMode(false);
    sessionStorage.removeItem('pr_admin');
  };

  return (
    <AdminContext.Provider value={{ isAdminMode, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};
