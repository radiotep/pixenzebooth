import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, LogIn, Palette, Star, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();
    const { user, signInWithGoogle, signOut, signInAnonymously } = useAuth();

    return (
        <div className="min-h-screen font-nunito flex flex-col relative overflow-hidden">

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            {/* Multiple Animated Background Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00F0FF]/20 blur-[100px] rounded-full pointer-events-none"
            ></motion.div>

            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    x: [0, -40, 0],
                    y: [0, 40, 0]
                }}
                transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FF005C]/20 blur-[120px] rounded-full pointer-events-none"
            ></motion.div>

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360]
                }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-[#FFDE00]/15 blur-[80px] rounded-full pointer-events-none"
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
                <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-game-accent" fill="currentColor" />
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
                <Zap className="w-7 h-7 md:w-10 md:h-10 text-game-success" fill="currentColor" />
            </motion.div>

            <motion.div
                animate={{
                    y: [0, 20, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 right-20 md:right-40"
            >
                <Sparkles className="w-6 h-6 md:w-9 md:h-9 text-game-primary" fill="currentColor" />
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
                            <Star className="w-8 h-8 md:w-12 md:h-12 text-[#00F0FF]" fill="currentColor" />
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
                                onClick={signInAnonymously}
                                className="w-full btn-game-secondary text-xl sm:text-2xl py-3 sm:py-4 px-6 bg-[#00F0FF] text-black shadow-game border-4 border-black rounded-2xl font-titan relative overflow-hidden group"
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
                                <span className="text-black font-bold font-titan tracking-wider text-sm md:text-base">PLAYER 1 READY</span>
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
                                            className="w-full bg-white/90 hover:bg-game-surface text-black border-4 border-black shadow-game rounded-xl px-4 py-3 font-bold text-sm md:text-base font-titan flex items-center justify-center gap-2"
                                        >
                                            📖 ABOUT
                                        </motion.button>
                                    </Link>
                                    <Link to="/privacy">
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full bg-white/90 hover:bg-game-surface text-black border-4 border-black shadow-game rounded-xl px-4 py-3 font-bold text-sm md:text-base font-titan flex items-center justify-center gap-2"
                                        >
                                            🔒 PRIVACY
                                        </motion.button>
                                    </Link>
                                    <Link to="/contact">
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full bg-white/90 hover:bg-game-surface text-black border-4 border-black shadow-game rounded-xl px-4 py-3 font-bold text-sm md:text-base font-titan flex items-center justify-center gap-2"
                                        >
                                            💬 CONTACT
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
                <motion.button
                    whileHover={{ scale: 1.15, color: "#00F0FF" }}
                    onClick={() => navigate('/about')}
                    className="hover:text-game-secondary transition"
                >
                    ABOUT
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.15, color: "#00F0FF" }}
                    onClick={() => navigate('/privacy')}
                    className="hover:text-game-secondary transition"
                >
                    PRIVACY
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.15, color: "#00F0FF" }}
                    onClick={() => navigate('/contact')}
                    className="hover:text-game-secondary transition"
                >
                    CONTACT
                </motion.button>
            </motion.div>
        </div>
    );
};

export default Home;
