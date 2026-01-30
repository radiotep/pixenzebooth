import React, { useEffect, useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { getFrames, deleteFrame, updateFrame } from '../../services/frames';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit, Home, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const FrameManager = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFrames();
    }, []);

    const loadFrames = async () => {
        try {
            const data = await getFrames();
            setFrames(data);
        } catch (error) {
            console.error("Failed to load frames:", error);
            showAlert("Failed to load frames. Check console.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, imageUrl) => {
        if (!confirm("Are you sure you want to delete this frame?")) return;
        try {
            await deleteFrame(id, imageUrl);
            setFrames(frames.filter(f => f.id !== id));
        } catch (error) {
            console.error(error);
            showAlert("Failed to delete.", "error");
        }
    };

    const toggleStatus = async (frame) => {
        const newStatus = frame.status === 'active' ? 'coming_soon' : 'active';
        try {
            const updated = await updateFrame(frame.id, { status: newStatus });
            setFrames(frames.map(f => f.id === frame.id ? updated : f));
        } catch (error) {
            console.error(error);
            showAlert("Failed to update status.", "error");
        }
    };

    return (
        <div className="min-h-screen font-nunito p-4 md:p-8 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

            {/* Animated Background Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360]
                }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-game-secondary/15 blur-[100px] rounded-full pointer-events-none"
            ></motion.div>

            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 360]
                }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                className="absolute top-20 right-16 md:right-24"
            >
                <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-game-accent" fill="currentColor" />
            </motion.div>

            <div className="max-w-6xl mx-auto z-10 relative">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('/')}
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
                        >
                            <Home size={20} />
                        </motion.button>
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="text-2xl sm:text-3xl md:text-4xl font-titan text-game-accent"
                        >
                            ADMIN CONTROL DECK
                        </motion.h1>
                    </div>
                    <motion.button
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/admin/frames/new')}
                        className="flex items-center gap-2 bg-game-success text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold border-b-4 border-green-800 hover:brightness-110 active:border-b-0 active:translate-y-1 transition text-sm md:text-base"
                    >
                        <Plus size={18} /> UPLOAD NEW FRAME
                    </motion.button>
                </div>

                {loading ? (
                    <div className="text-center py-20 animate-pulse text-gray-500 font-mono">LOADING SYSTEM DATA...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {frames.map((frame, index) => (
                            <motion.div
                                key={frame.id}
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className={`bg-white/10 border-4 border-black rounded-xl p-4 flex flex-col gap-4 relative group shadow-game ${frame.status === 'coming_soon' ? 'opacity-70' : ''}`}
                            >

                                <div className="aspect-[2/3] bg-black/50 rounded-lg overflow-hidden relative border border-white/5">
                                    {/* Checkerboard for transparency */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                                    <img src={frame.image_url} className="w-full h-full object-contain relative z-10" alt={frame.name} />

                                    {frame.status === 'coming_soon' && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                                            <span className="bg-yellow-400 text-black font-bold px-4 py-1 rounded rotate-12 font-titan tracking-wider border-2 border-white">COMING SOON</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{frame.name}</h3>
                                        <p className="text-xs text-gray-400 font-mono">{new Date(frame.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/frames/edit/${frame.id}`, { state: { frame } })}
                                            className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition"
                                            title="Calibrate Layout"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(frame.id, frame.image_url)}
                                            className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${frame.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500'}`}></div>
                                        <span className="text-xs font-mono uppercase text-gray-400">{frame.status.replace('_', ' ')}</span>
                                    </div>
                                    <button
                                        onClick={() => toggleStatus(frame)}
                                        className="text-xs font-bold underline hover:text-yellow-400"
                                    >
                                        {frame.status === 'active' ? 'SET TO COMING SOON' : 'ACTIVATE'}
                                    </button>
                                </div>

                            </motion.div>
                        ))}

                        {frames.length === 0 && (
                            <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-gray-700 rounded-xl">
                                <AlertCircle className="mx-auto mb-4 opacity-50" size={48} />
                                <p>NO FRAMES DETECTED IN DATABANKS.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FrameManager;
