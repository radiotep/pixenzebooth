import React, { useEffect, useState } from 'react';
import { useAlert } from '../context/AlertContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { createStrip } from '../utils/imageUtils';
import { Download, Share2, RotateCcw, Star, Sparkles, Mail, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { uploadAndSendEmail } from '../services/googleDriveService';
import { motion } from 'framer-motion';

const Result = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const [stripUrl, setStripUrl] = useState(null);
    const [saving, setSaving] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (state?.photos) {
            const generate = async () => {
                try {
                    const url = await createStrip(state.photos, state.config);
                    setStripUrl(url);
                } catch (error) {
                    console.error("Failed to generate strip", error);
                    showAlert("Failed to generate your photo strip. Please try again.", "error");
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
        navigate('/');
    };

    const handleEmailClick = () => {
        if (!user) {
            showAlert("Please login to use this feature!", "error");
            return;
        }
        setShowEmailModal(true);
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        if (!email) return;

        setSaving(true);
        try {
            // 1. Upload to Google Drive & Send Email
            const result = await uploadAndSendEmail(stripUrl, email);

            if (!result.success) {
                throw new Error(result.message);
            }

            // 2. Save Metadata to Supabase
            // We use the Google Drive Public URL (result.url) 
            if (user && supabase) {
                const { error: dbError } = await supabase.from('history').insert([{
                    user_id: user.id,
                    url: 'GOOGLE_DRIVE_UPLOAD', // Legacy column requiring value
                    email: email,
                    gdrive_link: result.url,
                    created_at: new Date()
                }]);

                if (dbError) {
                    console.error("Metadata save failed:", dbError);
                    // We don't block the user success message if just the DB log failed
                }
            }

            showAlert(`SUCCESS! check your email: ${email}`, "success");
            setShowEmailModal(false);
            setEmail('');

        } catch (err) {
            console.error(err);
            showAlert(`FAILED: ${err.message}`, "error");
        } finally {
            setSaving(false);
        }
    };

    if (!stripUrl) return (
        <div className="flex justify-center items-center h-screen font-titan text-xl md:text-2xl animate-pulse text-white">
            Tunggu Ya Kaks!...
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
                className="hidden md:block absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-game-accent/20 blob-optimized rounded-full pointer-events-none"
            ></motion.div>

            <motion.div
                animate={{
                    scale: [1.1, 1, 1.1],
                    x: [0, 30, 0],
                    y: [0, -20, 0]
                }}
                transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                className="hidden md:block absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-game-success/15 blob-optimized rounded-full pointer-events-none"
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
                                onClick={handleEmailClick}
                                disabled={saving}
                                className="w-full py-3 btn-game-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base !text-black"
                            >
                                <Mail size={20} /> {saving ? 'SENDING...' : 'SEND TO EMAIL'}
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

            {/* Email Input Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white border-4 border-black p-6 rounded-2xl max-w-md w-full relative shadow-[8px_8px_0_#000]"
                    >
                        <button
                            onClick={() => setShowEmailModal(false)}
                            className="absolute top-4 right-4 text-black hover:scale-110 transition-transform"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-titan text-game-primary mb-2">SEND PERMANENTLY</h2>
                        <p className="text-gray-600 mb-6 font-mono text-sm leading-relaxed">
                            Enter your email to receive the high-quality digital copy of your photo strip.
                        </p>

                        <form onSubmit={handleSendEmail} className="flex flex-col gap-4">
                            <div>
                                <label className="block font-bold text-xs mb-1 uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yourname@gmail.com"
                                    className="w-full border-2 border-black rounded-lg p-3 font-mono focus:outline-none focus:ring-4 focus:ring-game-primary/30"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={saving}
                                type="submit"
                                className="bg-game-success text-black font-titan py-3 rounded-lg border-2 border-black shadow-[4px_4px_0_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] transition-all flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Sparkles className="animate-spin" size={20} /> SENDING...
                                    </>
                                ) : (
                                    <>
                                        SEND NOW <Mail size={20} />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Result;
