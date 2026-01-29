import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createStrip } from '../utils/imageUtils';
import { Download, Share2, RotateCcw, Star, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stripUrl, setStripUrl] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (state?.photos) {
            const generate = async () => {
                try {
                    const url = await createStrip(state.photos, state.config);
                    setStripUrl(url);
                } catch (error) {
                    console.error("Failed to generate strip", error);
                    alert("Failed to generate your photo strip. Please try again.");
                    navigate('/');
                }
            };
            generate();
        } else {
            navigate('/');
        }
    }, [state, navigate]);

    const handleDownload = () => {
        if (stripUrl) {
            const link = document.createElement('a');
            link.href = stripUrl;
            link.download = `sparkle-booth-${Date.now()}.png`;
            link.click();
        }
    };

    const handleRetake = () => {
        navigate('/booth');
    };

    const handleShare = async () => {
        if (!user || !supabase) {
            alert("Please login to save your mission data!");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(stripUrl);
            const blob = await res.blob();
            const fileName = `${user.id}/${Date.now()}.png`;
            const { error: uploadError } = await supabase.storage.from('photos').upload(fileName, blob);
            if (uploadError) throw uploadError;
            const { error: dbError } = await supabase.from('history').insert([{ user_id: user.id, url: fileName, created_at: new Date() }]);
            if (dbError) throw dbError;
            alert("MISSION DATA ARCHIVED SUCCESSFULLY.");
        } catch (err) {
            console.error(err);
            alert("ARCHIVE FAILED: CONNECTION LOST.");
        } finally {
            setSaving(false);
        }
    };

    if (!stripUrl) return (
        <div className="flex justify-center items-center h-screen font-titan text-xl md:text-2xl animate-pulse text-white">
            Creating Magic... ✨
        </div>
    );

    return (
        <div className="min-h-screen font-nunito flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            {/* Animated Background Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-game-accent/20 blur-[120px] rounded-full pointer-events-none"
            ></motion.div>

            <motion.div
                animate={{
                    scale: [1.1, 1, 1.1],
                    x: [0, 30, 0],
                    y: [0, -20, 0]
                }}
                transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-game-success/15 blur-[100px] rounded-full pointer-events-none"
            ></motion.div>

            {/* Floating Stars */}
            <motion.div
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, 360]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute top-16 right-12 md:right-24"
            >
                <Star className="w-8 h-8 md:w-10 md:h-10 text-game-accent" fill="currentColor" />
            </motion.div>

            <motion.div
                animate={{
                    y: [0, 20, 0],
                    scale: [1, 1.3, 1]
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute top-32 left-12 md:left-24"
            >
                <Sparkles className="w-7 h-7 md:w-9 md:h-9 text-game-primary" fill="currentColor" />
            </motion.div>

            <div className="text-center mb-6 md:mb-8 z-10 w-full">
                <motion.h1
                    initial={{ scale: 0.8, y: -30 }}
                    animate={{
                        scale: 1,
                        y: [0, -10, 0]
                    }}
                    transition={{
                        scale: { duration: 0.5 },
                        y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                    }}
                    className="text-3xl sm:text-5xl md:text-7xl font-titan text-game-accent text-stroke drop-shadow-[5px_5px_0_#000]"
                >
                    MISSION COMPLETE!
                </motion.h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-center justify-center z-10 w-full max-w-6xl">

                {/* Result Strip Preview */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        rotate: [0, -2, 0, 2, 0]
                    }}
                    transition={{
                        scale: { type: 'spring', bounce: 0.5 },
                        rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                    }}
                    className="bg-zinc-800 p-3 md:p-4 pb-10 md:pb-12 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white relative group max-w-[90vw]"
                >
                    {/* Tape Effect */}
                    <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 w-24 md:w-32 h-8 md:h-10 bg-white/20 backdrop-blur-sm rotate-2 z-20 shadow-sm border-l border-r border-white/30"></div>

                    {stripUrl ? (
                        <img src={stripUrl} alt="Photostrip" className="max-h-[50vh] md:max-h-[60vh] shadow-inner bg-white object-contain" />
                    ) : (
                        <div className="flex items-center justify-center h-96 w-32 bg-gray-200 animate-pulse text-gray-400 font-mono text-sm">GENERATING...</div>
                    )}
                </motion.div>

                {/* Action Panel */}
                <div className="flex flex-col gap-4 w-full lg:w-auto min-w-[90vw] sm:min-w-0 sm:w-full md:w-auto md:min-w-[300px]">
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="card-game bg-game-surface text-black border-4 p-5 md:p-6"
                    >
                        <h2 className="text-xl md:text-2xl font-titan text-game-primary mb-4 border-b-4 border-black pb-2 text-stroke-sm">DATA SAVE</h2>

                        <div className="space-y-3">
                            <motion.button
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleDownload}
                                className="w-full py-3 btn-game-accent flex items-center justify-center gap-2 text-sm md:text-base"
                            >
                                <Download size={20} /> SAVE TO DISK
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleShare}
                                disabled={saving}
                                className="w-full py-3 btn-game-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                            >
                                <Share2 size={20} /> {saving ? 'UPLOADING...' : 'UPLOAD TO CLOUD'}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleRetake}
                                className="w-full py-3 btn-game-danger flex items-center justify-center gap-2 text-sm md:text-base"
                            >
                                <RotateCcw size={20} /> REPLAY MISSION
                            </motion.button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-game-dark border-4 border-black p-4 rounded-xl text-center shadow-game"
                    >
                        <p className="text-game-success text-xs font-mono mb-1">SESSION ID: {Date.now().toString().slice(-6)}</p>
                        <p className="text-white font-bold text-sm">THANK YOU FOR PLAYING!</p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Result;
