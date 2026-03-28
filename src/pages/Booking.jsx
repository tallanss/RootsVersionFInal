import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, startOfToday } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const Booking = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isBooked, setIsBooked] = useState(false);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const onDateClick = (day) => {
        if (isBefore(day, startOfToday())) return;
        setSelectedDate(day);
    };

    const handleBooking = () => {
        if (!selectedDate) return;
        // Simulate API call to Google Calendar
        console.log(`Booking for ${format(selectedDate, 'PPP')} sent to Google Calendar`);
        setIsBooked(true);
    };

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-xl font-bold capitalize">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex space-x-2">
                    <button onClick={prevMonth} className="p-2 bg-white hover:bg-slate-50 rounded-full transition-colors border shadow-sm">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-2 bg-white hover:bg-slate-50 rounded-full transition-colors border shadow-sm">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        return (
            <div className="grid grid-cols-7 mb-4 px-2">
                {days.map((day, i) => (
                    <div key={i} className="text-center text-xs font-bold text-text-muted uppercase tracking-widest leading-loose">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;
                const isDisabled = !isSameMonth(day, monthStart) || isBefore(day, startOfToday());
                const isSelected = isSameDay(day, selectedDate);

                days.push(
                    <div
                        key={day.toString()}
                        className={`flex items-center justify-center h-12 w-full cursor-pointer relative transition-all duration-300 ${isDisabled ? 'text-slate-200 cursor-not-allowed' : 'text-text-main'}`}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        {isSelected && (
                            <motion.div
                                layoutId="activeDay"
                                className="absolute inset-[6px] bg-primary rounded-xl shadow-lg shadow-primary-glow"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className={`relative text-sm font-bold transition-colors ${isSelected ? 'text-white' : ''}`}>
                            {formattedDate}
                        </span>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="p-2 mb-8">{rows}</div>;
    };

    return (
        <div className="container py-8 animate-in">
            <h1 className="section-title">Date & Heure</h1>
            <p className="section-subtitle">Réservez votre créneau en quelques clics.</p>

            {!isBooked ? (
                <div className="card-premium mb-24 relative">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h2 className="text-xl font-bold capitalize text-white">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h2>
                        <div className="flex space-x-2">
                            <button onClick={prevMonth} className="p-2 bg-black-30 hover-bg-white-20 rounded-full transition-colors border border-border-light shadow-sm">
                                <ChevronLeft size={20} color="white" />
                            </button>
                            <button onClick={nextMonth} className="p-2 bg-black-30 hover-bg-white-20 rounded-full transition-colors border border-border-light shadow-sm">
                                <ChevronRight size={20} color="white" />
                            </button>
                        </div>
                    </div>
                    {renderDays()}
                    {renderCells()}

                    <AnimatePresence>
                        {selectedDate && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-8 overflow-hidden"
                            >
                                <div className="bg-black-30 p-4 rounded-xl border border-border-medium mb-6 backdrop-blur-md">
                                    <p className="text-xs text-text-muted uppercase font-bold tracking-wider mb-1">Cible temporelle</p>
                                    <p className="text-lg font-bold text-accent">{format(selectedDate, 'EEEE do MMMM yyyy')}</p>
                                </div>

                                <button
                                    onClick={handleBooking}
                                    className="btn-primary"
                                >
                                    Confirmer la Séquence
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card-premium flex flex-col items-center justify-center text-center py-20"
                >
                    <div className="text-accent p-4 rounded-full mb-6" style={{ background: 'rgba(255, 46, 147, 0.1)', boxShadow: '0 0 20px var(--accent-glow)' }}>
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-white">Séquence Confirmée.</h2>
                    <p className="text-text-muted mb-8 text-center max-w-xs">Votre réservation a été synchronisée dans le réseau (Google Calendar). Transmission en cours.</p>
                    <button
                        onClick={() => setIsBooked(false)}
                        className="btn-secondary"
                    >
                        Nouvelle synchronisation
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Booking;
