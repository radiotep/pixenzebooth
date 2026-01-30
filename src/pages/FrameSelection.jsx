import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, Zap, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFrames } from '../services/frames';
import FrameCard from '../components/FrameCard';
import ComingSoonModal from '../components/ComingSoonModal';

const FrameSelection = () => {
    const navigate = useNavigate();
    const [selectedFrame, setSelectedFrame] = useState(null);
    const [showComingSoon, setShowComingSoon] = useState(false);

    // --- 1. Gather All Fighters (Frames) ---
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArtist, setSelectedArtist] = useState('all');
    const [artists, setArtists] = useState(['Default']);

    // Basic Themes (Hardcoded for now as fallbacks/options)
    const basicThemes = [
        { id: 'mario', type: 'basic', name: 'Mario', color: 'bg-[#6BB5FF]', hex: '#6BB5FF', stats: { style: 'Classic', vibes: '100' }, artist: 'Default' },
        { id: 'pink', type: 'basic', name: 'Peach', color: 'bg-[#FF99C8]', hex: '#FF99C8', stats: { style: 'Cute', vibes: '100' }, artist: 'Default' },
        { id: 'yellow', type: 'basic', name: 'Coin', color: 'bg-[#FBD000]', hex: '#FBD000', stats: { style: 'Shiny', vibes: '100' }, artist: 'Default' },
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const dbFrames = await getFrames();

            // Transform DB frames to match "fighter" schema
            const formattedDbFrames = dbFrames
                .filter(f => f.status === 'active' || f.status === 'coming_soon')
                .map(f => ({
                    id: f.id,
                    type: 'custom',
                    name: f.name,
                    image: f.image_url,
                    thumbnail: f.thumbnail_url || f.image_url,
                    layout_config: f.layout_config,
                    stats: { style: f.style || 'Custom', vibes: '???' },
                    rarity: f.rarity || 'Common',
                    status: f.status,
                    artist: f.artist || 'PixenzeBooth'
                }));

            const allFrames = [...formattedDbFrames, ...basicThemes];

            // Extract unique artists
            const uniqueArtists = [...new Set(allFrames.map(f => f.artist).filter(Boolean))];
            setArtists(uniqueArtists);
            setFrames(allFrames);

            // Set default selection ONLY after data is loaded
            if (formattedDbFrames.length > 0) setSelectedFrame(formattedDbFrames[0]);
            else setSelectedFrame(basicThemes[0]);

        } catch (error) {
            console.error("Failed to load frames", error);
            setFrames([...basicThemes]);
            setSelectedFrame(basicThemes[0]);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        if (!selectedFrame) return;

        if (selectedFrame.status === 'coming_soon') {
            setShowComingSoon(true);
            return;
        }

        let config = {};
        if (selectedFrame.type === 'basic') {
            config = { theme: selectedFrame.id, frameImage: null };
        } else {
            config = {
                theme: 'custom',
                frameImage: selectedFrame.image,
                layout_config: selectedFrame.layout_config
            };
        }
        navigate('/booth', { state: { preConfig: config } });
    };

    return (
        <div className="h-screen font-nunito flex flex-col overflow-hidden relative bg-game-bg text-game-surface">

            {/* Animated Background Effects */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
                className="hidden md:block absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-game-primary/20 blur-[120px] rounded-full pointer-events-none"
            ></motion.div>

            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [0, 180, 360]
                }}
                transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                className="hidden md:block absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-game-secondary/15 blur-[100px] rounded-full pointer-events-none"
            ></motion.div>

            {/* Header */}
            <div className="relative z-10 pt-4 pb-2 px-4 border-b-4 border-black bg-game-bg-dark/80 backdrop-blur-sm shrink-0">
                <motion.h1
                    initial={{ y: -30, opacity: 0 }}
                    animate={{
                        y: 0,
                        opacity: 1,
                        scale: [1, 1.02, 1]
                    }}
                    transition={{
                        y: { duration: 0.5 },
                        opacity: { duration: 0.5 },
                        scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                    }}
                    className="text-2xl sm:text-3xl md:text-4xl font-titan text-game-secondary text-center text-stroke drop-shadow-game-lg"
                >
                    SELECT YOUR FRAME
                </motion.h1>
            </div>

            {/* Main Content Area - Fighting Game Style */}
            <div className="flex-1 flex flex-col md:flex-row relative z-10 overflow-hidden min-h-0">

                {/* LEFT SIDE: Character Grid Selection (Order 2 on Mobile, 1 on Desktop) */}
                <div className="md:w-2/5 md:border-r-4 border-black flex flex-col order-2 md:order-1 h-full bg-game-bg-dark/40 backdrop-blur-sm min-h-0">
                    {/* Artist Filter Tabs - Scrollable */}
                    <div className="p-2 md:p-3 border-b-4 border-black bg-black/20 shrink-0">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="text-game-secondary" size={16} />
                            <h2 className="font-titan text-xs md:text-base text-white">CATEGORY</h2>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mask-fade-right">
                            <button
                                onClick={() => setSelectedArtist('all')}
                                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all border-2 ${selectedArtist === 'all'
                                    ? 'bg-game-secondary text-black border-black shadow-[2px_2px_0_#000]'
                                    : 'bg-black/40 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'}`}
                            >
                                All Frames
                            </button>
                            {artists.map(artist => (
                                <button
                                    key={artist}
                                    onClick={() => setSelectedArtist(artist)}
                                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all border-2 ${selectedArtist === artist
                                        ? 'bg-game-primary text-white border-black shadow-[2px_2px_0_#000]'
                                        : 'bg-black/40 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'}`}
                                >
                                    {artist}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid Content */}
                    <div className="flex-1 overflow-y-auto p-3 md:p-4 min-h-0 pb-24 md:pb-4">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 content-start">
                            {loading ? (
                                <div className="col-span-full h-40 flex flex-col items-center justify-center text-white/50 animate-pulse">
                                    <div className="w-12 h-12 border-4 border-game-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <span className="font-bold font-mono">LOADING FIGHTERS...</span>
                                </div>
                            ) : (
                                <>
                                    {frames
                                        .filter(f => selectedArtist === 'all' || f.artist === selectedArtist)
                                        .map((fighter) => (
                                            <motion.button
                                                key={fighter.id}
                                                whileHover={{ scale: 1.05, zIndex: 20 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedFrame(fighter)}
                                                className={`aspect-square rounded-xl border-2 overflow-hidden relative transition-all group ${selectedFrame?.id === fighter.id
                                                    ? 'border-game-secondary shadow-[0_0_15px_rgba(250,206,16,0.5)] scale-105 z-10'
                                                    : 'border-black hover:border-white/50'
                                                    } ${fighter.status === 'coming_soon' ? 'opacity-60' : ''}`}
                                            >
                                                {/* Background */}
                                                <div className={`absolute inset-0 ${fighter.type === 'basic' ? fighter.color : 'bg-gradient-to-br from-game-bg-dark to-game-bg'}`}></div>

                                                {/* Image/Icon */}
                                                {fighter.type === 'basic' ? (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Star size={20} className="text-white drop-shadow-md md:hidden" fill="currentColor" />
                                                        <Star size={24} className="text-white drop-shadow-md hidden md:block" fill="currentColor" />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={fighter.thumbnail || fighter.image}
                                                        alt={fighter.name}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                        loading="lazy"
                                                    />
                                                )}

                                                {/* Coming Soon Overlay */}
                                                {fighter.status === 'coming_soon' && (
                                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                                        <Lock size={16} className="text-game-secondary" />
                                                    </div>
                                                )}

                                                {/* Selected Indicator */}
                                                {selectedFrame?.id === fighter.id && (
                                                    <div className="absolute inset-0 border-4 border-game-secondary rounded-xl animate-pulse"></div>
                                                )}
                                            </motion.button>
                                        ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Preview (Order 1 on Mobile, 2 on Desktop) */}
                <div className="md:w-3/5 flex flex-col p-4 md:p-6 lg:p-8 order-1 md:order-2 shrink-0 md:h-full overflow-hidden bg-white/5 md:bg-transparent border-b-4 md:border-b-0 border-black shadow-lg md:shadow-none relative z-20">

                    {/* Character Name Banner */}
                    <div className="mb-2 md:mb-4 shrink-0 flex justify-center md:justify-start">
                        {selectedFrame ? (
                            <motion.div
                                key={selectedFrame.id}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="bg-gradient-to-r from-game-secondary to-game-primary px-4 py-1.5 md:px-6 md:py-2 -skew-x-12 inline-block border-2 md:border-4 border-black shadow-game"
                            >
                                <h2 className="font-titan text-lg md:text-3xl lg:text-4xl text-white skew-x-12 tracking-wider drop-shadow-md text-center">
                                    {selectedFrame.name}
                                </h2>
                            </motion.div>
                        ) : (
                            <div className="h-10 w-48 bg-white/10 rounded animate-pulse"></div>
                        )}
                    </div>

                    {/* Big Character Preview */}
                    <div className="flex-1 flex items-center justify-center md:mb-4 min-h-0 relative max-h-[25vh] md:max-h-full">
                        {loading || !selectedFrame ? (
                            <div className="flex flex-col items-center justify-center text-white/30 space-y-4">
                                <div className="w-12 h-12 md:w-20 md:h-20 border-4 border-white/20 border-t-game-secondary rounded-full animate-spin"></div>
                                <p className="font-titan text-sm md:text-xl animate-pulse">LOADING...</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedFrame.id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className={`relative max-h-full max-w-full drop-shadow-2xl h-full flex items-center justify-center ${selectedFrame.type === 'basic' ? 'aspect-[3/4] w-32 md:w-64' : ''}`}
                                >
                                    {selectedFrame.type === 'basic' ? (
                                        <div className={`w-full h-full rounded-2xl border-4 border-black shadow-game ${selectedFrame.color} flex items-center justify-center`}>
                                            <Star size={40} className="text-white drop-shadow-lg md:hidden" fill="currentColor" />
                                            <Star size={80} className="text-white drop-shadow-lg hidden md:block" fill="currentColor" />
                                        </div>
                                    ) : (
                                        <img
                                            src={selectedFrame.image}
                                            alt={selectedFrame.name}
                                            className="max-h-full max-w-[80%] md:max-w-full object-contain drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]"
                                        />
                                    )}

                                    {/* Stats Floating Badges - Hidden on small mobile to save space */}
                                    <motion.div
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="hidden md:flex absolute -right-4 top-10 flex-col gap-2"
                                    >
                                        <div className="bg-black/80 px-3 py-1 rounded border-2 border-game-secondary shadow-lg">
                                            <p className="text-game-secondary font-mono text-[10px] leading-tight">RARITY</p>
                                            <p className="text-white font-titan text-sm">{selectedFrame.rarity}</p>
                                        </div>
                                        <div className="bg-black/80 px-3 py-1 rounded border-2 border-game-primary shadow-lg">
                                            <p className="text-game-primary font-mono text-[10px] leading-tight">STYLE</p>
                                            <p className="text-white font-titan text-sm">{selectedFrame.stats.style}</p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>

                    {/* Start Button Area - Floating on Mobile, Static on Desktop */}
                    <div className="fixed bottom-4 left-4 right-4 z-50 md:static md:mt-auto md:pt-4">
                        <motion.button
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleConfirm}
                            disabled={loading || !selectedFrame}
                            className="w-full btn-game-primary py-3 md:py-4 text-lg md:text-2xl font-titan relative overflow-hidden group disabled:opacity-50 disabled:grayscale shadow-[0_0_20px_rgba(0,0,0,0.5)] md:shadow-game"
                        >
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            ></motion.div>
                            <span className="relative z-10 text-stroke-sm text-white drop-shadow-lg flex items-center justify-center gap-2">
                                <span>SELECT THIS FRAME</span>
                                <ArrowRight size={20} className="md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* COMING SOON MODAL */}
            <ComingSoonModal
                isOpen={showComingSoon}
                onClose={() => setShowComingSoon(false)}
            />
        </div>
    );
};

export default FrameSelection;
