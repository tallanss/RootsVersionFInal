import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return sessionStorage.getItem('pr_admin') === '1';
  });

  const login = (pin) => {
    const validPin = import.meta.env.VITE_ADMIN_PIN;
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
