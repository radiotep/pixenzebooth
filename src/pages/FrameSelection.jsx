import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, Zap, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFrames } from '../services/frames';
import FrameCard from '../components/FrameCard';
import ComingSoonModal from '../components/ComingSoonModal';
import bagibagiDonate from '../assets/bagibagi-donate.png';

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

            // Set default selection
            if (formattedDbFrames.length > 0) setSelectedFrame(formattedDbFrames[0]);
            else setSelectedFrame(basicThemes[0]);

        } catch (error) {
            console.error("Failed to load frames", error);
            setFrames([...basicThemes]);
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
        <div className="min-h-screen font-nunito flex flex-col overflow-hidden relative">

            {/* Animated Background Effects */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

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
                className="hidden md:block absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-game-accent/15 blur-[100px] rounded-full pointer-events-none"
            ></motion.div>

            {/* Header */}
            <div className="relative z-10 pt-6 pb-4 px-4 border-b-4 border-black bg-game-dark/80 backdrop-blur-sm">
                {/* Donate Button - Top Right */}
                <motion.a
                    href="https://bagibagi.co/nandaasc"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-4 right-4 z-20 drop-shadow-lg hover:drop-shadow-xl transition-all"
                >
                    <img
                        src={bagibagiDonate}
                        alt="Donate with BagiBagi.co"
                        className="h-10 sm:h-12 md:h-14 w-auto rounded-full"
                    />
                </motion.a>

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
                    className="text-3xl sm:text-4xl md:text-5xl font-titan text-game-accent text-center text-stroke drop-shadow-game-lg"
                >
                    SELECT YOUR FRAME
                </motion.h1>
            </div>

            {/* Main Content Area - Fighting Game Style */}
            <div className="flex-1 flex flex-col lg:flex-row relative z-10 overflow-hidden min-h-0">

                {/* LEFT SIDE: Character Grid Selection */}
                <div className="lg:w-2/5 p-4 md:p-6 flex flex-col bg-gradient-to-br from-game-dark/40 to-transparent backdrop-blur-sm border-r-4 border-black min-h-0 max-h-[40vh] lg:max-h-full">
                    <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                        <Sparkles className="text-game-accent" size={20} />
                        <h2 className="font-titan text-lg md:text-xl text-white">CHOOSE FIGHTER</h2>
                    </div>

                    {/* Artist Filter Tabs */}
                    <div className="flex gap-1 mb-2 overflow-x-auto flex-shrink-0 scrollbar-hide">
                        <button
                            onClick={() => setSelectedArtist('all')}
                            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedArtist === 'all'
                                ? 'bg-game-accent text-black'
                                : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                            🎨 All
                        </button>
                        {artists.map(artist => (
                            <button
                                key={artist}
                                onClick={() => setSelectedArtist(artist)}
                                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedArtist === artist
                                    ? 'bg-game-primary text-white'
                                    : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                ✨ {artist}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-2 overflow-y-auto flex-1 pr-2 pb-2 content-start min-h-0">
                        {loading ? (
                            <div className="col-span-full text-center py-10 text-white font-bold animate-pulse">
                                LOADING FIGHTERS...
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
                                            className={`aspect-square rounded-md border-2 md:border-4 overflow-hidden relative transition-all ${selectedFrame?.id === fighter.id
                                                ? 'border-game-accent shadow-[0_0_15px_rgba(255,215,0,0.8)] scale-110 z-10'
                                                : 'border-black hover:border-game-primary'
                                                } ${fighter.status === 'coming_soon' ? 'opacity-60' : ''}`}
                                        >
                                            {/* Background */}
                                            <div className={`absolute inset-0 ${fighter.type === 'basic' ? fighter.color : 'bg-gradient-to-br from-purple-900/60 via-indigo-900/60 to-purple-900/60'}`}></div>

                                            {/* Image/Icon */}
                                            {fighter.type === 'basic' ? (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Star size={24} className="text-white drop-shadow-md hidden sm:block md:hidden" fill="currentColor" />
                                                    <Star size={20} className="text-white drop-shadow-md sm:hidden" fill="currentColor" />
                                                    <Star size={28} className="text-white drop-shadow-md hidden md:block" fill="currentColor" />
                                                </div>
                                            ) : (
                                                <img
                                                    src={fighter.thumbnail || fighter.image}
                                                    alt={fighter.name}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            )}

                                            {/* Coming Soon Overlay */}
                                            {fighter.status === 'coming_soon' && (
                                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                                    <Lock size={24} className="text-yellow-400" />
                                                </div>
                                            )}

                                            {/* Selected Border Glow */}
                                            {selectedFrame?.id === fighter.id && (
                                                <motion.div
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                                    className="absolute inset-0 border-4 border-game-accent pointer-events-none rounded-lg"
                                                ></motion.div>
                                            )}
                                        </motion.button>
                                    ))}
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: Big Preview & Stats (Like Fighting Game Character Preview) */}
                <div className="lg:w-3/5 flex flex-col p-4 md:p-8">

                    {/* Character Name Banner */}
                    <motion.div
                        key={selectedFrame?.id}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="mb-4 md:mb-6"
                    >
                        <div className="bg-gradient-to-r from-game-accent to-game-primary px-6 py-3 md:py-4 -skew-x-12 inline-block border-4 border-black shadow-game">
                            <h2 className="font-titan text-2xl md:text-4xl lg:text-5xl text-white skew-x-12 tracking-wider">
                                {selectedFrame?.name || '???'}
                            </h2>
                        </div>
                    </motion.div>

                    {/* Big Character Preview */}
                    <div className="flex-1 flex items-center justify-center mb-4 md:mb-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedFrame?.id}
                                initial={{ scale: 0.7, opacity: 0, rotateY: -90 }}
                                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                exit={{ scale: 0.7, opacity: 0, rotateY: 90 }}
                                transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
                                className={`rounded-2xl border-4 border-black shadow-game overflow-hidden relative ${selectedFrame?.type === 'basic' ? 'w-full max-w-md aspect-[3/4]' : 'flex items-center justify-center p-4'} ${selectedFrame?.type === 'basic' ? selectedFrame.color : 'bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-900/40'}`}
                                style={selectedFrame?.type !== 'basic' ? { height: 'calc(28rem * 4 / 3)', maxWidth: '28rem' } : {}}
                            >
                                {selectedFrame?.type === 'basic' ? (
                                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: selectedFrame.hex }}>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                        >
                                            <Star size={120} className="text-white drop-shadow-2xl" fill="currentColor" />
                                        </motion.div>
                                    </div>
                                ) : (
                                    <img
                                        src={selectedFrame?.image}
                                        alt={selectedFrame?.name}
                                        className="max-h-full max-w-full object-contain drop-shadow-2xl"
                                    />
                                )}

                                {/* Power Level Indicator */}
                                <div className="absolute top-4 right-4 bg-black/80 px-4 py-2 rounded-lg border-2 border-game-accent">
                                    <p className="text-game-accent font-mono text-xs">RARITY</p>
                                    <p className="text-white font-titan text-lg">{selectedFrame?.rarity || 'COMMON'}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Stats Panel */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-black/80 backdrop-blur-md border-4 border-black rounded-xl p-4 md:p-6 shadow-game mb-4"
                    >
                        <div className="grid grid-cols-2 gap-4 text-white font-mono text-sm md:text-base">
                            <div>
                                <p className="text-game-success mb-1">{'>'} STYLE:</p>
                                <p className="font-bold text-lg md:text-xl">{selectedFrame?.stats?.style || 'CLASSIC'}</p>
                            </div>
                            <div>
                                <p className="text-game-primary mb-1">{'>'} TYPE:</p>
                                <p className="font-bold text-lg md:text-xl uppercase">{selectedFrame?.type || 'BASIC'}</p>
                            </div>
                        </div>

                        {selectedFrame?.status === 'coming_soon' && (
                            <div className="mt-4 bg-yellow-400/20 border-2 border-yellow-400 rounded-lg p-3 flex items-center gap-2">
                                <Lock className="text-yellow-400" size={20} />
                                <p className="text-yellow-400 font-bold text-sm">LOCKED - COMING SOON!</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Start Button */}
                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleConfirm}
                        className="w-full btn-game-primary py-4 md:py-5 text-2xl md:text-3xl font-titan relative overflow-hidden group"
                    >
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        ></motion.div>
                        <span className="relative z-10 text-stroke-sm text-white drop-shadow-lg">
                            🎮 START GAME! 🎮
                        </span>
                    </motion.button>
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
