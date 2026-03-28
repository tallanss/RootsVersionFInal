import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, Camera, Heart, CheckCircle2, ScanFace } from 'lucide-react';

const Creator = () => {
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = image;

        img.onload = () => {
            // Set canvas size (vertical Save the Date format)
            canvas.width = 1200;
            canvas.height = 1600;

            // Draw background image
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

            // Draw Overlay
            ctx.fillStyle = 'rgba(0, 0, 5, 0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Border
            ctx.strokeStyle = 'rgba(255, 46, 147, 0.6)';
            ctx.lineWidth = 4;
            ctx.strokeRect(80, 80, canvas.width - 160, canvas.height - 160);

            // Draw Text
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';

            ctx.font = 'italic 120px Outfit, sans-serif';
            ctx.fillText('SAVE', canvas.width / 2, canvas.height / 2 - 100);
            ctx.fillStyle = '#FF2E93';
            ctx.fillText('THE DATE', canvas.width / 2, canvas.height / 2 + 20);

            ctx.fillStyle = 'white';
            ctx.font = 'bold 40px Outfit, sans-serif';
            ctx.fillText('24 . 06 . 2030', canvas.width / 2, canvas.height / 2 + 160);

            ctx.font = 'italic 30px Outfit, sans-serif';
            ctx.fillText('Bordeaux, France', canvas.width / 2, canvas.height / 2 + 240);

            // Download
            const link = document.createElement('a');
            link.download = 'Hologram-Save-The-Date-Roots.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
    };

    return (
        <div className="container py-8 animate-in relative z-10 text-white">
            <h1 className="section-title">Laboratoire IA</h1>
            <p className="section-subtitle" style={{ color: 'var(--text-light)' }}>Générez votre hologramme "Save the Date".</p>

            {/* Hidden Canvas for Export */}
            <canvas ref={canvasRef} className="hidden" />

            {!image ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-premium py-20 flex flex-col items-center justify-center cursor-pointer transition-all bg-transparent relative overflow-hidden"
                    style={{ border: '2px dashed rgba(255,46,147,0.4)', borderRadius: '32px', background: 'rgba(255,255,255,0.02)' }}
                    onClick={() => fileInputRef.current.click()}
                >
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(255,46,147,0.1) 0%, transparent 70%)' }}></div>
                    <div className="p-5 rounded-full mb-6 relative z-10" style={{ background: 'rgba(255,46,147,0.2)', boxShadow: '0 0 30px rgba(255,46,147,0.4)' }}>
                        <ScanFace size={32} color="#fff" />
                    </div>
                    <p className="font-bold text-lg mb-2 relative z-10 text-white">Scanner une empreinte visuelle</p>
                    <p className="text-sm text-center max-w-xs relative z-10" style={{ color: 'var(--text-muted)' }}>Formats supportés : JPG, PNG. Synthèse 8K max.</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                    />
                </motion.div>
            ) : (
                <div className="flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full aspect-3-4 max-w-sm rounded-32px overflow-hidden shadow-lg mb-8 group bg-black"
                        style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}
                    >
                        <img
                            src={image}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover grayscale-10 contrast-105"
                        />

                        {/* Overlay Design Elements */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none p-8 select-none" style={{ background: 'rgba(0,0,5,0.4)' }}>
                            <div className="p-8 w-full h-full flex flex-col items-center justify-center" style={{ border: '1px solid rgba(255,46,147,0.4)' }}>
                                <Heart size={32} fill="var(--accent)" color="var(--accent)" className="mb-6" style={{ filter: 'drop-shadow(0 0 10px var(--accent))' }} />
                                <h2 className="text-3xl font-serif italic mb-1 tracking-widest uppercase">SAVE</h2>
                                <h2 className="text-3xl font-serif italic mb-8 tracking-widest uppercase" style={{ color: 'var(--accent)', textShadow: '0 0 10px rgba(255,46,147,0.5)' }}>THE DATE</h2>

                                <div className="px-6 py-2 mb-4 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <span className="text-xs font-bold uppercase tracking-widest">24 . 06 . 2030</span>
                                </div>

                                <p className="text-sm font-medium tracking-wide" style={{ color: 'var(--text-light)' }}>Bordeaux, France</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setImage(null)}
                            className="absolute top-4 right-4 backdrop-blur-md px-3 py-1-5 rounded-full text-white text-xs font-bold pointer-events-auto transition-colors"
                            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                            Changer
                        </button>
                    </motion.div>

                    {/* Controls */}
                    <div className="flex space-x-3 w-full max-w-sm mb-24">
                        <button
                            onClick={handleDownload}
                            className="btn-primary flex-1"
                        >
                            <Download size={20} className="mr-2" />
                            Extraire l'hologramme
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Creator;
