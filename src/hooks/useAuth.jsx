import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        if (!supabase) {
            alert("Backend not configured. Cannot login.");
            return;
        }
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            }
        });
        if (error) {
            console.error("Login Error:", error);
            alert(`Login Failed: ${error.message}\n(Hint: Did you enable the Google Provider in your Supabase Dashboard?)`);
        }
    };

    const signOut = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
    };

    const signInAnonymously = async () => {
        if (!supabase) return;
        const { error } = await supabase.auth.signInAnonymously();
        if (error) {
            console.error(error);
            alert(`Guest Login Failed: ${error.message}\n(Make sure 'Anonymous Sign-ins' is enabled in Supabase Auth Providers)`);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInAnonymously, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
