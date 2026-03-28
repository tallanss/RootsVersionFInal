import React from 'react';
import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="sticky top-0 left-0 right-0 ios-header z-50 px-6 py-4 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 text-white" style={{ textShadow: '0 0 10px rgba(255,255,255,0.4)' }}>
                <Camera size={24} className="text-white" />
                <span className="font-bold text-xl tracking-tight">roots<span style={{ color: 'var(--accent)' }}>.</span></span>
            </Link>

            <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden" style={{ borderColor: 'var(--accent)', boxShadow: '0 0 10px rgba(255,46,147,0.5)', background: 'rgba(255,255,255,0.1)' }}>
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jean" style={{ filter: 'brightness(1.5)' }} alt="User" />
                </div>
            </div>
        </header>
    );
};

export default Header;
