import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Facebook, ShieldCheck, HelpCircle, ChevronRight, LogOut, Hexagon } from 'lucide-react';

const Profile = () => {
    return (
        <div className="container py-8 animate-in relative z-10 pb-32">
            <h1 className="section-title" style={{ color: '#fff' }}>Mon ID Spatial</h1>
            <p className="section-subtitle" style={{ color: 'var(--text-muted)' }}>Gérez vos informations du réseau.</p>

            {/* User Info Card */}
            <div className="flex items-center space-x-4 mb-10 card-premium" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)' }}>
                <div className="w-16 h-16 rounded-full bg-slate-200 border border-border-medium flex items-center justify-center overflow-hidden flex-shrink-0" style={{ boxShadow: '0 0 20px var(--accent-glow)' }}>
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jean" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                    <h2 className="text-xl font-bold text-white">Jean Bonneau</h2>
                    <p className="text-sm" style={{ color: 'var(--text-light)' }}>jean.bonneau@holo-reseau.com</p>
                </div>
                <button className="text-sm font-semibold px-4 py-2 rounded-full" style={{ background: 'rgba(255,46,147,0.1)', color: 'var(--accent)', border: '1px solid rgba(255,46,147,0.2)' }}>Modifier</button>
            </div>

            {/* Contact Section */}
            <h2 className="text-lg font-bold mb-4 text-white">Contact & Légal</h2>
            <div className="rounded-2xl overflow-hidden mb-8" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}>
                {[
                    { icon: <Mail size={20} color="var(--accent)" />, title: "Transmission", subtitle: "contact@roots-photobooth.fr" },
                    { icon: <Phone size={20} color="#2E93FF" />, title: "Liaison vocale", subtitle: "+33 6 12 34 56 78" },
                    { icon: <MapPin size={20} color="#A12EFF" />, title: "Secteur d'opération", subtitle: "Nouvelle-Aquitaine" }
                ].map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between p-4 cursor-pointer hover-bg-white-20 transition-colors ${index !== 2 ? 'border-b border-border-light' : ''}`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                {item.icon}
                            </div>
                            <div>
                                <p className="font-semibold text-base text-white">{item.title}</p>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.subtitle}</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-text-muted" />
                    </div>
                ))}
            </div>

            {/* Help & Support */}
            <h2 className="text-lg font-bold mb-4 text-white">Assistance IA</h2>
            <div className="rounded-2xl overflow-hidden mb-10" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}>
                {[
                    { icon: <ShieldCheck size={20} color="white" />, title: "Chiffrement & Données" },
                    { icon: <HelpCircle size={20} color="white" />, title: "Centre d'aide 2030" }
                ].map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between p-4 cursor-pointer hover-bg-white-20 transition-colors ${index !== 1 ? 'border-b border-border-light' : ''}`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                {item.icon}
                            </div>
                            <p className="font-semibold text-base text-white">{item.title}</p>
                        </div>
                        <ChevronRight size={20} className="text-text-muted" />
                    </div>
                ))}
            </div>

            <button className="w-full py-4 font-semibold text-base flex justify-center items-center space-x-2 mb-8 rounded-xl transition-all" style={{ background: 'rgba(255,46,147,0.1)', color: 'var(--accent)', border: '1px solid rgba(255,46,147,0.2)' }}>
                <LogOut size={20} />
                <span>Déconnexion Séquentielle</span>
            </button>

            {/* Social Media Links */}
            <div className="flex justify-center space-x-8 mb-12">
                <div className="p-3 rounded-full cursor-pointer hover-bg-white-20" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Instagram size={24} color="white" />
                </div>
                <div className="p-3 rounded-full cursor-pointer hover-bg-white-20" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Facebook size={24} color="white" />
                </div>
            </div>
        </div>
    );
};

export default Profile;
