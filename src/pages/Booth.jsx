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
        if (file && photos.length < config.totalPhotos) {
            const reader = new FileReader();
            reader.onload = (f) => {
                setPhotos(prev => {
                    const newPhotos = [...prev, f.target.result];
                    // Check if all slots are filled after adding this photo
                    if (newPhotos.length >= config.totalPhotos) {
                        setStatus('finished');
                    }
                    return newPhotos;
                });
            };
            reader.readAsDataURL(file);
        }
        // Reset input value so same file can be uploaded again if needed
        e.target.value = '';
    };

    const getFilterCss = (filterName) => {
        switch (filterName) {
            case 'bright': return 'brightness(1.2) contrast(1.1) saturate(1.1)';
            case 'vintage': return 'sepia(0.4) contrast(1.2) brightness(0.9)';
            case 'bw': return 'grayscale(1) contrast(1.1)';
            case 'noir': return 'grayscale(1) contrast(1.8) brightness(0.8)';
            case 'soft': return 'contrast(0.9) brightness(1.1) saturate(0.8)';
            case 'cyber': return 'hue-rotate(180deg) saturate(1.5) contrast(1.2) brightness(1.1)';
            case 'toxic': return 'hue-rotate(80deg) saturate(2) contrast(1.1) brightness(1.1)';
            case 'gold': return 'sepia(0.5) saturate(1.8) contrast(1.1) brightness(1.1)';
            case 'vampire': return 'saturate(1.8) contrast(1.3) hue-rotate(-15deg) brightness(0.95)';
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
            <div className="flex-1 relative z-10 p-3 md:p-4 lg:p-6 max-w-7xl mx-auto w-full overflow-hidden">
                {/* Desktop: Grid Layout (Camera+Controls | Inventory) */}
                <div className="h-full flex flex-col md:grid md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] md:gap-4 lg:gap-6">

                    {/* LEFT COLUMN: Camera + Filters + Action Button */}
                    <div className="flex flex-col gap-3 md:gap-4 min-h-0">
                        {/* Camera Mode Tabs */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white/90 backdrop-blur-sm rounded-full p-1 border-4 border-black w-fit mx-auto flex gap-1 shadow-game flex-shrink-0"
                        >
                            <button className="px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-game-primary text-white font-bold text-xs md:text-sm border-2 border-black font-titan">
                                📷 CAMERA
                            </button>
                            <label className="px-4 md:px-6 py-1.5 md:py-2 rounded-full text-black font-bold text-xs md:text-sm cursor-pointer hover:bg-game-accent transition font-titan">
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                📤 UPLOAD
                            </label>
                        </motion.div>

                        {/* Camera Viewport with Game HUD */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-zinc-800 rounded-2xl md:rounded-3xl border-4 md:border-8 border-black shadow-[0_0_0_2px_#333] p-1 md:p-1.5 lg:p-2 relative overflow-hidden flex-shrink-0"
                        >
                            {/* HUD Overlay Layer (Pointer Events None) */}
                            <div className="absolute inset-0 z-30 pointer-events-none p-3 md:p-4 lg:p-6 flex flex-col justify-between">
                                {/* Corner Brackets */}
                                <div className="absolute top-3 left-3 md:top-4 md:left-4 w-6 h-6 md:w-8 md:h-8 border-t-3 border-l-3 md:border-t-4 md:border-l-4 border-white/90 rounded-tl-sm drop-shadow-md"></div>
                                <div className="absolute top-3 right-3 md:top-4 md:right-4 w-6 h-6 md:w-8 md:h-8 border-t-3 border-r-3 md:border-t-4 md:border-r-4 border-white/90 rounded-tr-sm drop-shadow-md"></div>
                                <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 w-6 h-6 md:w-8 md:h-8 border-b-3 border-l-3 md:border-b-4 md:border-l-4 border-white/90 rounded-bl-sm drop-shadow-md"></div>
                                <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-6 h-6 md:w-8 md:h-8 border-b-3 border-r-3 md:border-b-4 md:border-r-4 border-white/90 rounded-br-sm drop-shadow-md"></div>

                                {/* Top HUD Row */}
                                <div className="flex justify-between items-start">
                                    {/* REC Badge */}
                                    <div className="px-2 md:px-3 py-0.5 md:py-1 bg-red-600 text-white font-mono text-[10px] md:text-xs font-bold rounded flex items-center gap-1.5 md:gap-2 border-2 border-white/20 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.6)]">
                                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div> REC
                                    </div>

                                    {/* Status Info */}
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="px-2 md:px-3 py-0.5 md:py-1 bg-black/70 text-game-success font-mono text-[10px] md:text-xs font-bold rounded border border-game-success/30 backdrop-blur-sm shadow-sm flex items-center gap-1.5 md:gap-2">
                                            <span>CAM-01</span>
                                            <div className="w-0.5 md:w-1 h-2 md:h-3 bg-game-success/50"></div>
                                            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>

                                {/* Center Crosshair */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center opacity-40">
                                    <div className="w-[1px] h-full bg-white/50"></div>
                                    <div className="h-[1px] w-full bg-white/50 absolute"></div>
                                    <div className="w-12 h-12 md:w-16 md:h-16 border border-white/40 absolute rounded-full"></div>
                                </div>

                                {/* Bottom HUD Row */}
                                <div className="flex justify-between items-end">
                                    <div className="text-[9px] md:text-xs font-mono text-white/80 bg-black/40 px-1.5 md:px-2 py-0.5 md:py-1 rounded backdrop-blur-sm border border-white/10 flex gap-2 md:gap-3">
                                        <span className="text-game-secondary">ISO 800</span>
                                        <span className="text-game-primary">F/2.8</span>
                                        <span>1/250</span>
                                    </div>
                                    <div className="text-[9px] md:text-xs font-mono text-game-success bg-black/40 px-1.5 md:px-2 py-0.5 md:py-1 rounded backdrop-blur-sm border border-white/10 animate-pulse">
                                        [ FACE DETECTED ]
                                    </div>
                                </div>
                            </div>

                            {/* Scanline Effect Layer */}
                            <div className="absolute inset-0 pointer-events-none z-20 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>

                            {/* Video Container */}
                            <div className="rounded-xl md:rounded-2xl overflow-hidden border-2 md:border-4 border-gray-900 relative bg-neutral-900 aspect-video shadow-inner">
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
                                            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-40"
                                        >
                                            <motion.h2
                                                key={countdown}
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1.5, opacity: 1 }}
                                                exit={{ scale: 2, opacity: 0 }}
                                                className="text-7xl md:text-8xl lg:text-[10rem] font-titan text-white drop-shadow-[0_0_0_4px_black]"
                                                style={{ textShadow: '8px 8px 0 #000' }}
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
                                            transition={{ duration: 0.15 }}
                                            className="absolute inset-0 bg-white z-50"
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Filters - Horizontal Scroll */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-game-dark/80 backdrop-blur-md border-4 border-black rounded-xl md:rounded-2xl p-2.5 md:p-3 shadow-game flex-shrink-0"
                        >
                            <h3 className="text-xs md:text-sm font-titan text-game-primary mb-2 flex items-center gap-2">
                                <Zap size={14} fill="currentColor" />
                                POWER-UPS (FILTERS)
                            </h3>
                            <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-thin">
                                {filters.map(f => (
                                    <motion.button
                                        key={f.id}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setConfig(prev => ({ ...prev, filter: f.id }))}
                                        className={`flex-shrink-0 px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl border-b-3 border-r-3 md:border-b-4 md:border-r-4 border border-black font-bold transition-all text-[10px] md:text-xs font-titan flex flex-col items-center gap-0.5 min-w-[60px] md:min-w-[65px] ${config.filter === f.id
                                            ? f.color + ' border-black translate-y-[2px] border-b-2 border-r-2 shadow-inner brightness-110 ring-2 ring-white/50'
                                            : f.color + ' hover:brightness-110 active:translate-y-[2px] active:border-b-2 active:border-r-2'
                                            }`}
                                    >
                                        <span className="text-lg md:text-xl drop-shadow-sm filter-icon">{f.icon}</span>
                                        <span className="text-[9px] md:text-[10px] tracking-wider opacity-90">{f.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Action Button */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex-shrink-0"
                        >
                            {status === 'idle' || status === 'finished' ? (
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleStart}
                                    className={`w-full py-3 md:py-4 text-lg md:text-xl font-titan relative overflow-hidden transition-all border-4 border-black rounded-xl md:rounded-2xl shadow-game ${status === 'finished' ? 'bg-game-success text-game-dark' : 'btn-game-primary text-white'}`}
                                >
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    ></motion.div>
                                    <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3 text-stroke-sm drop-shadow-sm">
                                        {status === 'finished' ? (
                                            <>
                                                FINISH & EDIT <ArrowLeft size={24} className="rotate-180" strokeWidth={3} />
                                            </>
                                        ) : (
                                            <>
                                                <Camera size={22} strokeWidth={3} />
                                                CAPTURE PHOTOS
                                            </>
                                        )}
                                    </span>
                                </motion.button>
                            ) : (
                                <div className="py-3 md:py-4 bg-gradient-to-r from-game-dark to-black rounded-xl md:rounded-2xl font-bold text-game-accent animate-pulse border-4 border-black font-mono tracking-wider md:tracking-widest text-center text-sm md:text-base shadow-game">
                                    {status === 'processing' ? '⚙️ PROCESSING...' : status === 'countdown' ? '⏱️ GET READY...' : '📸 CAPTURING...'}
                                </div>
                            )}
                        </motion.div>

                        {/* Mobile Only: Inventory Toggle Button */}
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowInventory(!showInventory)}
                            className="md:hidden w-full py-2.5 bg-game-dark/80 backdrop-blur-md border-4 border-black rounded-xl font-titan text-game-secondary flex items-center justify-between px-4 shadow-game hover:bg-game-dark transition flex-shrink-0"
                        >
                            <span className="flex items-center gap-2 text-sm">
                                📦 INVENTORY ({photos.length}/{config.totalPhotos})
                            </span>
                            <motion.div
                                animate={{ rotate: showInventory ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDown size={18} className="text-white" />
                            </motion.div>
                        </motion.button>

                        {/* Mobile Only: Inventory Drawer */}
                        <AnimatePresence>
                            {showInventory && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="md:hidden bg-game-dark/80 backdrop-blur-md border-4 border-black rounded-xl p-3 shadow-game overflow-hidden flex-shrink-0"
                                >
                                    <div className="grid grid-cols-3 gap-2">
                                        {Array.from({ length: config.totalPhotos }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="aspect-square bg-black/50 rounded-lg border-3 border-black flex items-center justify-center relative overflow-hidden shadow-game group"
                                            >
                                                {photos[i] ? (
                                                    <>
                                                        <img
                                                            src={photos[i]}
                                                            className="w-full h-full object-cover"
                                                            alt={`Captured ${i + 1}`}
                                                        />
                                                        <div className="absolute top-1 left-1 bg-game-accent text-black text-[10px] px-1 py-0.5 rounded font-bold border-2 border-black z-10">
                                                            {i + 1}
                                                        </div>
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => handleRemovePhoto(i)}
                                                                className="p-1.5 bg-red-500 rounded-full text-white border-2 border-white"
                                                                title="Retake Photo"
                                                            >
                                                                <Trash2 size={16} />
                                                            </motion.button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-white/20 font-bold text-2xl font-titan">?</span>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>

                                    {photos.length === config.totalPhotos && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="mt-2 bg-gradient-to-r from-game-success to-game-accent p-2 rounded-lg border-3 border-black text-center"
                                        >
                                            <p className="font-titan text-black text-sm">ALL SLOTS FILLED!</p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT COLUMN: Desktop Inventory Side Panel */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="hidden md:flex flex-col bg-game-dark/80 backdrop-blur-md border-4 border-black rounded-2xl p-4 shadow-game h-fit max-h-full overflow-hidden mt-18"
                    >
                        {/* Inventory Header */}
                        <div className="flex items-center justify-between mb-4 flex-shrink-0">
                            <h3 className="font-titan text-game-secondary text-base flex items-center gap-2">
                                📦 INVENTORY
                            </h3>
                            <span className="bg-game-success text-black font-mono font-bold text-sm px-2.5 py-1 rounded-full border-2 border-black">
                                {photos.length}/{config.totalPhotos}
                            </span>
                        </div>

                        {/* Photo Slots Grid */}
                        <div className="grid grid-cols-2 gap-3 overflow-y-auto scrollbar-thin flex-1">
                            {Array.from({ length: config.totalPhotos }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="aspect-square bg-black/50 rounded-lg border-3 border-black flex items-center justify-center relative overflow-hidden shadow-game group"
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
                                                    <Trash2 size={18} />
                                                </motion.button>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-white/20 font-bold text-2xl font-titan">?</span>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* All Slots Filled Message */}
                        {photos.length === config.totalPhotos && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="mt-4 bg-gradient-to-r from-game-success to-game-accent p-3 rounded-lg border-3 border-black text-center flex-shrink-0"
                            >
                                <p className="font-titan text-black text-sm">ALL SLOTS FILLED!</p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Booth;
