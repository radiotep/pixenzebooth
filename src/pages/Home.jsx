import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, LogIn, Palette, Star, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

import { Helmet } from 'react-helmet-async';

import TurnstileWidget from '../components/TurnstileWidget';
import bagibagiDonate from '../assets/bagibagi-donate.png';

import logoNew from '../assets/logo-new.png';

const Home = () => {
    const navigate = useNavigate();
    const { user, signInWithGoogle, signOut, signInAnonymously } = useAuth();
    const [showVerification, setShowVerification] = React.useState(false);
    const [turnstileToken, setTurnstileToken] = React.useState(null);

    // Fun random names for guest users
    const guestNames = [
        'Orang Random', 'Guestnya gweh'
    ];

    // Get display name for user
    const getDisplayName = React.useMemo(() => {
        if (!user) return '';

        // Check if user is anonymous (guest)
        if (user.is_anonymous) {
            // Use a consistent random name based on user id
            const index = user.id.charCodeAt(0) % guestNames.length;
            return guestNames[index];
        }

        // For Google Auth users, get their name
        const fullName = user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'Player';

        // Get first name only for cleaner display
        return fullName.split(' ')[0];
    }, [user]);

    const handleGuestClick = () => {
        setShowVerification(true);
    };

    const handleVerificationSuccess = (token) => {
        setTurnstileToken(token);
        // Add a small delay for visual feedback before signing in
        setTimeout(() => {
            signInAnonymously();
        }, 500);
    };

    return (
        <div className="min-h-screen font-nunito flex flex-col relative overflow-hidden">
            <Helmet>
                <title>PixenzeBooth - Fun Online Photobooth</title>
                <meta name="description" content="Click, Snap, Shine! Create amazing photo memories with PixenzeBooth. Fun frames, filters, and effects." />
            </Helmet>

            {/* Verification Modal */}
            {showVerification && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#2D1B69] border-4 border-game-secondary p-6 md:p-8 rounded-3xl max-w-sm w-full shadow-game-lg relative text-center"
                    >
                        <button
                            onClick={() => setShowVerification(false)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white font-bold"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-titan text-white mb-2">SECURITY CHECK</h2>
                        <p className="text-white/80 font-mono text-sm mb-6">Please verify you are not a robot to enter the arcade.</p>

                        <div className="flex justify-center mb-4">
                            <TurnstileWidget
                                onSuccess={handleVerificationSuccess}
                                onError={() => setTurnstileToken(null)}
                            />
                        </div>

                        {turnstileToken && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-game-success font-bold font-mono animate-pulse"
                            >
                                ACCESS GRANTED...
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            {/* Donate Button - Fixed Top Right */}
            <motion.a
                href="https://bagibagi.co/PixenzeBooth"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-4 left-4 sm:bottom-auto sm:left-auto sm:top-4 sm:right-4 md:top-6 md:right-6 z-50 drop-shadow-lg hover:drop-shadow-2xl transition-all"
            >
                <img
                    src={bagibagiDonate}
                    alt="Donate with BagiBagi.co"
                    className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto"
                />
            </motion.a>

            {/* Multiple Animated Background Blobs - Hidden on Mobile for Performance */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="hidden md:block absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#1a3dbf]/30 blob-optimized rounded-full pointer-events-none"
            ></motion.div>

            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    x: [0, -40, 0],
                    y: [0, 40, 0]
                }}
                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                className="hidden md:block absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#ba1c16]/20 blob-optimized rounded-full pointer-events-none"
            ></motion.div>

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360]
                }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="hidden md:block absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-[#face10]/20 blob-optimized rounded-full pointer-events-none"
            ></motion.div>

            {/* Floating Decorative Elements */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0]
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute top-20 left-10 md:left-20"
            >
                <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-[#face10]" fill="currentColor" />
            </motion.div>

            <motion.div
                animate={{
                    y: [0, 15, 0],
                    x: [0, 10, 0],
                    rotate: [0, -15, 15, 0]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-32 right-10 md:right-24"
            >
                <Star className="w-6 h-6 md:w-10 md:h-10 text-game-secondary" fill="currentColor" />
            </motion.div>

            <motion.div
                animate={{
                    y: [0, -25, 0],
                    rotate: [0, 360]
                }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                className="absolute bottom-32 left-16 md:left-32"
            >
                <Zap className="w-7 h-7 md:w-10 md:h-10 text-[#39FF14]" fill="currentColor" />
            </motion.div>

            <motion.div
                animate={{
                    y: [0, 20, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 right-20 md:right-40"
            >
                <Sparkles className="w-6 h-6 md:w-9 md:h-9 text-[#ba1c16]" fill="currentColor" />
            </motion.div>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col items-center justify-center w-full p-4 md:p-6 z-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center flex flex-col items-center w-full max-w-4xl"
                >
                    {/* Logo / Title */}
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="relative mb-8 md:mb-12"
                    >
                        <motion.h1
                            animate={{ rotate: [-2, -3, -1, -2] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="text-5xl sm:text-7xl md:text-9xl font-titan text-game-accent text-stroke drop-shadow-game-lg"
                        >
                            PIXENZE
                        </motion.h1>
                        <motion.h1
                            animate={{ rotate: [2, 3, 1, 2] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                            className="text-5xl sm:text-7xl md:text-9xl font-titan text-game-primary text-stroke drop-shadow-game-lg -mt-2 md:-mt-4"
                        >
                            BOOTH
                        </motion.h1>

                        {/* Decorative Stars with more playful animations */}
                        <motion.div
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.3, 1]
                            }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            className="absolute -top-4 md:-top-8 -right-4 md:-right-8"
                        >
                            <Star className="w-8 h-8 md:w-12 md:h-12 text-[#face10]" fill="currentColor" />
                        </motion.div>

                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                scale: [1, 1.5, 1]
                            }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="absolute bottom-2 md:bottom-4 -left-6 md:-left-12"
                        >
                            <Star className="w-6 h-6 md:w-8 md:h-8 text-[#39FF14]" fill="currentColor" />
                        </motion.div>
                    </motion.div>

                    <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="bg-black/80 text-white font-mono text-sm sm:text-lg md:text-xl px-4 sm:px-8 py-2 sm:py-3 rounded-full border-2 border-white/20 backdrop-blur-sm mb-10 md:mb-16 shadow-lg tracking-wider"
                    >
                        ✨ CAPTURE YOUR MOMENT IN STYLE ✨
                    </motion.p>

                    {/* Main Action Area */}
                    {!user ? (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col gap-4 md:gap-6 items-center w-full max-w-sm px-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGuestClick}
                                className="w-full btn-game-secondary text-xl sm:text-2xl py-3 sm:py-4 px-6 bg-[#face10] text-black shadow-game border-4 border-black rounded-2xl font-titan relative overflow-hidden group"
                            >
                                <motion.div
                                    animate={{ x: [-100, 200] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    className="absolute inset-0 w-1/2 bg-white/30 skew-x-12 group-hover:w-full"
                                ></motion.div>
                                <span className="flex items-center justify-center gap-3 relative z-10">
                                    PLAY AS GUEST
                                </span>
                            </motion.button>

                            <div className="flex items-center gap-4 w-full">
                                <div className="h-[2px] bg-white/20 flex-1"></div>
                                <span className="text-white/50 font-bold text-xs uppercase">OR</span>
                                <div className="h-[2px] bg-white/20 flex-1"></div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
                                whileTap={{ scale: 0.95 }}
                                onClick={signInWithGoogle}
                                className="w-full btn-game-primary text-lg sm:text-xl flex items-center justify-center gap-2 py-3 sm:py-4 px-6 shadow-game rounded-2xl font-titan relative overflow-hidden group"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    <LogIn size={24} />
                                </motion.div>
                                LOGIN GOOGLE
                            </motion.button>

                            <motion.p
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-[#00F0FF] font-mono text-xs mt-2"
                            >
                                INSERT COIN TO START
                            </motion.p>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center gap-6 md:gap-8 w-full max-w-3xl px-4">

                            {/* User Badge */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white border-2 border-black px-4 md:px-6 py-2 rounded-full shadow-[4px_4px_0_#000] flex items-center gap-3 transform -rotate-1 mb-2 md:mb-4"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="w-3 h-3 rounded-full bg-green-500 border border-black"
                                ></motion.div>
                                <span className="text-black font-bold font-titan tracking-wider text-sm md:text-base">
                                    HI, {getDisplayName.toUpperCase()}!
                                </span>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
                                <motion.button
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    whileHover={{
                                        scale: 1.05,
                                        rotate: [0, -2, 2, 0],
                                        y: -8
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/select-frame')}
                                    className="group bg-game-success text-black border-4 border-black shadow-game rounded-3xl p-6 md:p-8 flex flex-col items-center gap-4 transition-all relative overflow-hidden"
                                >
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                                    ></motion.div>

                                    <motion.div
                                        whileHover={{ rotate: 12, scale: 1.1 }}
                                        className="bg-black/10 p-4 rounded-full border-2 border-black/10 relative z-10"
                                    >
                                        <Camera size={40} className="md:w-12 md:h-12" />
                                    </motion.div>
                                    <span className="text-2xl md:text-4xl font-titan text-stroke-sm text-white drop-shadow-md relative z-10">START GAME</span>
                                </motion.button>

                                {/* Navigation Cards */}
                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-col gap-3"
                                >
                                    <Link to="/about">
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full btn-game-primary rounded-xl px-4 py-3 font-bold text-sm md:text-base font-titan flex items-center justify-center gap-2"
                                        >
                                            ABOUT
                                        </motion.button>
                                    </Link>
                                    <Link to="/privacy">
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full btn-game-accent rounded-xl px-4 py-3 font-bold text-sm md:text-base font-titan flex items-center justify-center gap-2"
                                        >
                                            PRIVACY
                                        </motion.button>
                                    </Link>
                                    <Link to="/contact">
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full btn-game-secondary rounded-xl px-4 py-3 font-bold text-sm md:text-base font-titan flex items-center justify-center gap-2 !text-black"
                                        >
                                            CONTACT
                                        </motion.button>
                                    </Link>
                                </motion.div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={signOut}
                                className="text-red-400 font-bold hover:text-white hover:underline mt-4 md:mt-8 text-xs md:text-sm font-mono tracking-widest uppercase bg-black/50 px-4 py-2 rounded-full border border-white/10 hover:border-red-500 transition-colors"
                            >
                                Quit Game (Logout)
                            </motion.button>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Footer Menu (Static at bottom) */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full py-4 md:py-6 flex justify-center gap-4 md:gap-8 text-white/50 font-bold font-mono text-xs tracking-widest z-20"
            >
                <p>
                    &copy; {new Date().getFullYear()} PIXENZEBOOTH. ALL RIGHTS RESERVED.
                </p>
            </motion.div>
        </div>
    );
};

export default Home;
