import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePhotoBooth } from '../hooks/usePhotoBooth';
import { useCamera } from '../hooks/useCamera';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ArrowLeft, RotateCcw, ChevronDown, ChevronUp, Zap, Trash2 } from 'lucide-react';
import CameraView from '../components/CameraView';

const Booth = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { status, countdown, photos, setPhotos, startSession, reset, setStatus, setCountdown, videoRef, config, setConfig } = usePhotoBooth();
    const { startCamera } = useCamera();
    const [showInventory, setShowInventory] = useState(false);

    useEffect(() => {
        startCamera();
    }, []);

    useEffect(() => {
        if (state?.preConfig) {
            const pre = state.preConfig;
            let count = pre.totalPhotos || 3;
            if (pre.layout_config && Array.isArray(pre.layout_config) && pre.layout_config.length > 0) {
                count = pre.layout_config.length;
            }
            setConfig(prev => ({ ...prev, ...pre, totalPhotos: count }));
        }
    }, [state, setConfig]);

    // AUTO-NAVIGATE REMOVED: User must click "Finish" manually now.

    const handleStart = () => {
        if (status === 'finished') {
            // Confirm & Go to Result
            navigate('/result', { state: { photos, config } });
            return;
        }

        if (photos.length > 0) {
            // Resume session
            setStatus('countdown');
            setCountdown(3);
        } else {
            // New session
            startSession(config);
        }
    };

    const handleRemovePhoto = (index) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
        // If we remove a photo, we are definitely not finished. Set to idle so user can click Capture button again.
        if (status === 'finished') {
            setStatus('idle');
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (f) => {
                setPhotos(prev => [...prev, f.target.result]);
            };
            reader.readAsDataURL(file);
        }
    };

    const getFilterCss = (filterName) => {
        switch (filterName) {
            case 'bright': return 'brightness(1.2) contrast(1.1) saturate(1.1)';
            case 'vintage': return 'sepia(0.4) contrast(1.2) brightness(0.9)';
            case 'bw': return 'grayscale(1) contrast(1.1)';
            case 'noir': return 'grayscale(1) contrast(1.5) brightness(0.9)';
            case 'soft': return 'contrast(0.9) brightness(1.1) saturate(0.8)';
            case 'cyber': return 'hue-rotate(180deg) hue-rotate(60deg) contrast(1.2) saturate(1.2)'; // Cool blueish
            case 'toxic': return 'hue-rotate(90deg) contrast(1.1) saturate(1.5)'; // Greenish
            case 'gold': return 'sepia(0.3) saturate(1.5) contrast(1.1) brightness(1.1)';
            case 'vampire': return 'saturate(1.5) contrast(1.2) hue-rotate(-30deg)';
            default: return 'none';
        }
    };

    const progressPercent = (photos.length / config.totalPhotos) * 100;

    const filters = [
        { id: 'none', label: 'NORMAL', icon: '✨', color: 'bg-white text-black' },
        { id: 'bright', label: 'BRIGHT', icon: '☀️', color: 'bg-yellow-100 text-yellow-800' },
        { id: 'soft', label: 'SOFT', icon: '🌸', color: 'bg-pink-100 text-pink-800' },
        { id: 'vintage', label: 'RETRO', icon: '📼', color: 'bg-orange-100 text-orange-800' },
        { id: 'bw', label: 'MONO', icon: '⚫', color: 'bg-gray-200 text-gray-800' },
        { id: 'noir', label: 'NOIR', icon: '🕵️', color: 'bg-gray-800 text-white' },
        { id: 'gold', label: 'GOLD', icon: '👑', color: 'bg-yellow-400 text-black' },
        { id: 'cyber', label: 'CYBER', icon: '🤖', color: 'bg-[#00F0FF] text-black' },
        { id: 'toxic', label: 'TOXIC', icon: '🧪', color: 'bg-[#39FF14] text-black' },
        { id: 'vampire', label: 'VAMP', icon: '🧛', color: 'bg-[#FF005C] text-white' },
    ];

    return (
        <div className="min-h-screen font-nunito flex flex-col overflow-hidden relative">

            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360]
                }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="hidden md:block absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-game-accent/15 blob-optimized rounded-full pointer-events-none"
            ></motion.div>

            {/* COMPACT TOP HUD BAR */}
            <div className="relative z-20 bg-game-dark/95 backdrop-blur-md border-b-4 border-black px-3 md:px-4 py-2 md:py-3">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 md:gap-4">
                    {/* Left: Back Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate('/select-frame')}
                        className="p-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg border-2 border-black transition flex-shrink-0"
                    >
                        <ArrowLeft size={18} />
                    </motion.button>

                    {/* Center: Mission Info + Progress */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs md:text-sm font-titan text-game-accent truncate">
                                {config.name || config.theme?.toUpperCase() || 'PHOTO MISSION'}
                            </p>
                        </div>
                        <div className="w-full bg-black/50 rounded-full h-2 md:h-3 border-2 border-black overflow-hidden">
                            <motion.div
                                animate={{ width: `${progressPercent}%` }}
                                className="bg-gradient-to-r from-game-success to-game-accent h-full"
                            ></motion.div>
                        </div>
                    </div>

                    {/* Right: Counter + Reset */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="bg-game-success text-black font-mono font-bold text-xs md:text-sm px-2 md:px-3 py-1 rounded-full border-2 border-black">
                            {photos.length}/{config.totalPhotos}
                        </span>
                        {photos.length > 0 && status === 'idle' && (
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={reset}
                                className="p-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg border-2 border-black transition"
                            >
                                <RotateCcw size={16} />
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 relative z-10 flex flex-col p-3 md:p-6 max-w-4xl mx-auto w-full gap-3 md:gap-4">

                {/* Camera Mode Tabs */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-full p-1 border-4 border-black w-fit mx-auto flex gap-1 shadow-game"
                >
                    <button className="px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-game-primary text-white font-bold text-xs md:text-sm border-2 border-black font-titan">
                        📷 CAMERA
                    </button>
                    <label className="px-4 md:px-6 py-1.5 md:py-2 rounded-full text-black font-bold text-xs md:text-sm cursor-pointer hover:bg-game-accent transition font-titan">
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                        📤 UPLOAD
                    </label>
                </motion.div>

                {/* Camera Viewport */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-black rounded-2xl md:rounded-3xl border-4 border-black shadow-game p-2 md:p-3 relative overflow-hidden"
                >
                    {/* CRT Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)]  bg-[length:100%_4px]"></div>

                    {/* Corner UI Elements */}
                    <div className="absolute top-3 md:top-5 left-3 md:left-5 z-20 bg-red-500 px-2 py-0.5 md:py-1 rounded font-mono text-xs font-bold text-white border-2 border-black animate-pulse">
                        ● REC
                    </div>
                    <div className="absolute top-3 md:top-5 right-3 md:right-5 z-20 bg-black/70 px-2 md:px-3 py-0.5 md:py-1 rounded font-mono text-xs font-bold text-white border-2 border-white/30">
                        {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <div className="rounded-xl md:rounded-2xl overflow-hidden border-4 border-gray-900 relative bg-neutral-900 aspect-video">
                        <div style={{ filter: getFilterCss(config.filter) }} className="w-full h-full transition-all duration-300">
                            <CameraView onReady={(ref) => { if (videoRef) videoRef.current = ref.current; }} />
                        </div>

                        {/* Countdown Overlay */}
                        <AnimatePresence>
                            {status === 'countdown' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20"
                                >
                                    <motion.h2
                                        key={countdown}
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 2, opacity: 0 }}
                                        className="text-7xl md:text-9xl font-titan text-game-accent drop-shadow-[0_0_30px_rgba(255,215,0,0.8)]"
                                        style={{ textShadow: '4px 4px 0 #000, -2px -2px 0 #000' }}
                                    >
                                        {countdown}
                                    </motion.h2>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Flash Effect */}
                        <AnimatePresence>
                            {status === 'capturing' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0 bg-white z-30"
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Filters - Horizontal Scroll */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-game-dark/80 backdrop-blur-md border-4 border-black rounded-xl md:rounded-2xl p-3 md:p-4 shadow-game"
                >
                    <h3 className="text-xs md:text-sm font-titan text-game-primary mb-2 md:mb-3 flex items-center gap-2">
                        <Zap size={16} fill="currentColor" />
                        POWER-UPS (FILTERS)
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {filters.map(f => (
                            <motion.button
                                key={f.id}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setConfig(prev => ({ ...prev, filter: f.id }))}
                                className={`flex-shrink-0 px-3 md:px-4 py-2 rounded-xl border-b-4 border-r-4 border border-black font-bold transition-all text-xs md:text-sm font-titan flex flex-col items-center gap-1 min-w-[70px] ${config.filter === f.id
                                    ? f.color + ' border-black translate-y-[2px] border-b-2 border-r-2 shadow-inner brightness-110 ring-2 ring-white/50'
                                    : f.color + ' hover:brightness-110 active:translate-y-[2px] active:border-b-2 active:border-r-2'
                                    }`}
                            >
                                <span className="text-xl md:text-2xl drop-shadow-sm filter-icon">{f.icon}</span>
                                <span className="text-[10px] md:text-xs tracking-wider opacity-90">{f.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Action Button */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    {status === 'idle' || status === 'finished' ? (
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleStart}
                            className={`w-full py-3 md:py-5 text-white text-lg md:text-2xl font-titan relative overflow-hidden transition-all ${status === 'finished' ? 'bg-game-success border-game-accent' : 'btn-game-primary'}`}
                        >
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            ></motion.div>
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {status === 'finished' ? (
                                    <>
                                        🎉 FINISH & EDIT <ArrowLeft size={24} className="rotate-180" />
                                    </>
                                ) : (
                                    <>
                                        <Camera size={20} className="md:hidden" />
                                        <Camera size={24} className="hidden md:block" />
                                        CAPTURE PHOTOS
                                    </>
                                )}
                            </span>
                        </motion.button>
                    ) : (
                        <div className="py-4 md:py-5 bg-gradient-to-r from-game-dark to-black rounded-xl md:rounded-2xl font-bold text-game-accent animate-pulse border-4 border-black font-mono tracking-wider md:tracking-widest text-center text-sm md:text-lg shadow-game">
                            {status === 'processing' ? '⚙️ PROCESSING...' : status === 'countdown' ? '⏱️ GET READY...' : '📸 CAPTURING...'}
                        </div>
                    )}
                </motion.div>

                {/* Inventory Toggle Button */}
                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowInventory(!showInventory)}
                    className="w-full py-3 bg-game-dark/80 backdrop-blur-md border-4 border-black rounded-xl md:rounded-2xl font-titan text-game-secondary flex items-center justify-between px-4 shadow-game hover:bg-game-dark transition"
                >
                    <span className="flex items-center gap-2 text-sm md:text-base">
                        📦 INVENTORY ({photos.length}/{config.totalPhotos})
                    </span>
                    <motion.div
                        animate={{ rotate: showInventory ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown size={20} className="text-white" />
                    </motion.div>
                </motion.button>

                {/* Inventory Drawer */}
                <AnimatePresence>
                    {showInventory && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-game-dark/80 backdrop-blur-md border-4 border-black rounded-xl md:rounded-2xl p-3 md:p-4 shadow-game overflow-hidden"
                        >
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                                {Array.from({ length: config.totalPhotos }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="aspect-square bg-black/50 rounded-lg border-3 md:border-4 border-black flex items-center justify-center relative overflow-hidden shadow-game group"
                                    >
                                        {photos[i] ? (
                                            <>
                                                <img
                                                    src={photos[i]}
                                                    className="w-full h-full object-cover"
                                                    alt={`Captured ${i + 1}`}
                                                />
                                                <div className="absolute top-1 left-1 bg-game-accent text-black text-xs px-1.5 py-0.5 rounded font-bold border-2 border-black z-10">
                                                    {i + 1}
                                                </div>

                                                {/* Retake Overlay */}
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleRemovePhoto(i)}
                                                        className="p-2 bg-red-500 rounded-full text-white border-2 border-white"
                                                        title="Retake Photo"
                                                    >
                                                        <Trash2 size={20} />
                                                    </motion.button>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="text-white/20 font-bold text-2xl md:text-3xl font-titan">?</span>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {photos.length === config.totalPhotos && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="mt-3 bg-gradient-to-r from-game-success to-game-accent p-3 rounded-lg border-3 md:border-4 border-black text-center"
                                >
                                    <p className="font-titan text-white text-sm md:text-base">🎉 ALL SLOTS FILLED!</p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Booth;
