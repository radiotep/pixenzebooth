import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Instagram, Globe, MessageCircle, Sparkles } from 'lucide-react';

const Contact = () => {
    const contactMethods = [
        {
            icon: Mail,
            label: "Email",
            value: "support@pixenzebooth.com",
            link: "mailto:support@pixenzebooth.com",
            color: "text-game-primary",
            bg: "from-game-primary/20 to-game-primary/5"
        },
        {
            icon: Github,
            label: "GitHub",
            value: "NandaAddi",
            link: "https://github.com/NandaAddi",
            color: "text-white",
            bg: "from-white/20 to-white/5"
        },
        {
            icon: Instagram,
            label: "Instagram",
            value: "@pixenzebooth",
            link: "https://instagram.com/pixenzebooth",
            color: "text-game-accent",
            bg: "from-game-accent/20 to-game-accent/5"
        },
        {
            icon: Globe,
            label: "Website",
            value: "www.pixenzebooth.com",
            link: "https://www.pixenzebooth.com",
            color: "text-game-success",
            bg: "from-game-success/20 to-game-success/5"
        }
    ];

    return (
        <div className="min-h-screen font-nunito text-white p-4 md:p-8 relative overflow-hidden">
            {/* Background Blobs */}
            <motion.div
                animate={{ scale: [1, 1.3, 1], x: [0, 40, 0] }}
                transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                className="hidden md:block absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-game-secondary/15 blur-[120px] rounded-full pointer-events-none"
            ></motion.div>

            <motion.div
                animate={{ scale: [1.2, 1, 1.2], rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="hidden md:block absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-game-primary/10 blur-[100px] rounded-full pointer-events-none"
            ></motion.div>

            {/* Floating Sparkles */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                className="absolute top-20 right-16 md:right-24"
            >
                <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-game-accent" fill="currentColor" />
            </motion.div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-8 md:mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <MessageCircle className="w-10 h-10 md:w-12 md:h-12 text-game-primary" />
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-titan text-game-primary">
                            CONTACT US
                        </h1>
                    </div>
                </motion.div>

                {/* Introduction */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-sm border-4 border-black rounded-2xl p-6 md:p-8 mb-8 shadow-game text-center"
                >
                    <h2 className="text-xl md:text-2xl font-bold text-game-accent mb-4">
                        Punya pertanyaan, saran, atau ingin kolaborasi?
                    </h2>
                    <p className="text-base md:text-lg text-gray-200">
                        Kami senang mendengarnya! 💫
                    </p>
                    <p className="text-sm md:text-base text-gray-300 mt-2">
                        Silakan hubungi kami melalui:
                    </p>
                </motion.div>

                {/* Contact Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                    {contactMethods.map((method, index) => (
                        <motion.a
                            key={index}
                            href={method.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + (index * 0.1) }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`bg-gradient-to-br ${method.bg} backdrop-blur-sm border-4 border-black rounded-2xl p-6 shadow-game cursor-pointer group`}
                        >
                            <div className="flex items-center gap-4">
                                <motion.div
                                    whileHover={{ rotate: 360, scale: 1.2 }}
                                    transition={{ duration: 0.5 }}
                                    className={`${method.color} flex-shrink-0`}
                                >
                                    <method.icon size={40} className="md:w-12 md:h-12" />
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">
                                        {method.label}
                                    </p>
                                    <p className="text-base md:text-lg font-bold text-white truncate group-hover:text-game-accent transition">
                                        {method.value}
                                    </p>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* Collaboration Note */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-br from-game-accent/20 to-game-primary/20 backdrop-blur-sm border-4 border-black rounded-2xl p-6 md:p-8 shadow-game"
                >
                    <div className="flex items-start gap-4">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-game-accent flex-shrink-0" fill="currentColor" />
                        </motion.div>
                        <div>
                            <h3 className="text-lg md:text-xl font-titan text-game-accent mb-3">
                                KOLABORASI KHUSUS
                            </h3>
                            <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                                Untuk kerja sama ilustrator, event, atau kebutuhan khusus, jangan ragu untuk menghubungi kami melalui email dengan subjek:
                            </p>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="mt-4 bg-black/50 border-2 border-game-accent rounded-lg p-4 font-mono text-sm md:text-base"
                            >
                                <p className="text-game-accent font-bold">
                                    📧 Subject: "Collaboration – PixenzeBooth"
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Back Button */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="text-center mt-8"
                >
                    <a href="/">
                        <button className="btn-game-primary px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-titan">
                            ← BACK TO HOME
                        </button>
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
