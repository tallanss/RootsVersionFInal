import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

const ADMIN_PIN = '010272';

export const AdminProvider = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return sessionStorage.getItem('pr_admin') === '1';
  });

  const login = (pin) => {
    if (pin === ADMIN_PIN) {
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
