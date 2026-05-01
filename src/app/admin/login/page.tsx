'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [email, setEmail] = useState('info@bond.az');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/admin/dashboard');
            } else {
                const data = await res.json();
                setError(data.message || 'Giriş uğursuz oldu.');
            }
        } catch (err) {
            setError('Şəbəkə xətası baş verdi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4 font-inter">
            <div className="max-w-md w-full bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">BOND AZ</h1>
                    <p className="text-gray-400 mt-2">Admin Panel Girişi</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">E-poçt Ünvanı</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500/50 transition-all text-white"
                            placeholder="info@bond.az"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Şifrə</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500/50 transition-all text-white"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-900/20 disabled:opacity-50"
                    >
                        {loading ? 'Giriş edilir...' : 'Daxil Ol'}
                    </button>
                </form>

                <p className="mt-8 text-center text-xs text-gray-500 uppercase tracking-widest">
                    &copy; 2026 BOND MEDIA GROUP
                </p>
            </div>
        </div>
    );
}
