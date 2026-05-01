'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'posts' | 'authors'>('posts');
    const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0, categories: 0 });
    const [posts, setPosts] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [botLoading, setBotLoading] = useState(false);
    
    // Author Form State
    const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState<any>(null);
    const [authorForm, setAuthorForm] = useState({ name: '', job_title: '', lang: 'az', avatar: '' });
    const [uploading, setUploading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            const statsRes = await fetch('/api/stats');
            if (statsRes.ok) setStats(await statsRes.json());

            if (activeTab === 'posts') {
                const postsRes = await fetch('/api/admin/posts');
                if (postsRes.ok) setPosts(await postsRes.json());
            } else {
                const authorsRes = await fetch('/api/admin/authors');
                if (authorsRes.ok) setAuthors(await authorsRes.json());
            }
        } catch (err) {
            console.error('Data fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'author');

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setAuthorForm({ ...authorForm, avatar: data.url });
            }
        } catch (err) {
            alert('Şəkil yüklənmədi');
        } finally {
            setUploading(false);
        }
    };

    const [isSaving, setIsSaving] = useState(false);

    const slugify = (text: string) => {
        const charMap: { [key: string]: string } = {
            // AZ
            'ə': 'e', 'ğ': 'g', 'ö': 'o', 'ı': 'i', 'ş': 's', 'ü': 'u',
            'Ə': 'e', 'Ğ': 'g', 'Ö': 'o', 'İ': 'i', 'Ş': 's', 'Ü': 'u',
            // RU (Transliteration)
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
            'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'n': 'n', 'о': 'o',
            'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
            // Symbols
            ' ': '-', '.': '', ',': '', '/': '-', '_': '-'
        };
        return text.split('').map(c => charMap[c.toLowerCase()] || c.toLowerCase()).join('').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
    };

    const handleAuthorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const method = editingAuthor ? 'PUT' : 'POST';
        const url = editingAuthor ? `/api/admin/authors/${editingAuthor.id}` : '/api/admin/authors';

        const finalData = {
            ...authorForm,
            slug: slugify(authorForm.name)
        };

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });
            
            if (res.ok) {
                setIsAuthorModalOpen(false);
                setEditingAuthor(null);
                setAuthorForm({ name: '', job_title: '', lang: 'az', avatar: '' });
                fetchData();
            } else {
                const errorData = await res.json();
                alert(`Xəta: ${errorData.message || 'Məlumat yadda saxlanılmadı'}`);
            }
        } catch (err) {
            alert('Şəbəkə xətası baş verdi. İnternet bağlantınızı yoxlayın.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAuthor = async (id: number) => {
        if (!confirm('Müəllifi silmək istəyirsiniz?')) return;
        await fetch(`/api/admin/authors/${id}`, { method: 'DELETE' });
        fetchData();
    };

    const handleRunBot = async () => {
        setBotLoading(true);
        try {
            const res = await fetch('/api/admin/bot', { method: 'POST' });
            if (res.ok) {
                alert('Bot uğurla işə salındı!');
                fetchData();
            }
        } finally {
            setBotLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Yüklənir...</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-inter">
            {/* Header */}
            <div className="border-b border-white/5 bg-[#111] sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold tracking-tighter">BOND<span className="text-red-600">ADMIN</span></h1>
                    <div className="h-4 w-[1px] bg-white/10"></div>
                    <nav className="flex gap-4">
                        <button 
                            onClick={() => setActiveTab('posts')}
                            className={`text-xs uppercase tracking-widest font-bold ${activeTab === 'posts' ? 'text-white' : 'text-gray-500'}`}
                        >
                            Xəbərlər
                        </button>
                        <button 
                            onClick={() => setActiveTab('authors')}
                            className={`text-xs uppercase tracking-widest font-bold ${activeTab === 'authors' ? 'text-white' : 'text-gray-500'}`}
                        >
                            Müəlliflər
                        </button>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <button 
                        onClick={handleRunBot}
                        disabled={botLoading}
                        className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                    >
                        {botLoading ? 'Bot İşləyir...' : 'BOTU İŞƏ SAL'}
                    </button>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-white text-xs font-medium uppercase tracking-widest">Çıxış</button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto p-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Ümumi Xəbər</p>
                        <h2 className="text-4xl font-bold">{stats.totalPosts}</h2>
                    </div>
                    <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Ümumi Baxış</p>
                        <h2 className="text-4xl font-bold">{stats.totalViews.toLocaleString()}</h2>
                    </div>
                    <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Müəllif Sayı</p>
                        <h2 className="text-4xl font-bold">{authors.length || '-'}</h2>
                    </div>
                </div>

                {/* Content Table */}
                <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold">{activeTab === 'posts' ? 'Son Xəbərlər' : 'Müəlliflər'}</h3>
                        {activeTab === 'authors' && (
                            <button 
                                onClick={() => { setEditingAuthor(null); setAuthorForm({ name: '', job_title: '', lang: 'az', avatar: '' }); setIsAuthorModalOpen(true); }}
                                className="bg-white/10 hover:bg-white/20 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                            >
                                YENİ MÜƏLLİF
                            </button>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            {activeTab === 'posts' ? (
                                <>
                                    <thead>
                                        <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/5">
                                            <th className="px-6 py-4 font-medium">Xəbər</th>
                                            <th className="px-6 py-4 font-medium">Dil</th>
                                            <th className="px-6 py-4 font-medium">Baxış</th>
                                            <th className="px-6 py-4 font-medium text-right">Əməliyyat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {posts.map((post) => (
                                            <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        {post.image && <img src={post.image} className="w-10 h-10 rounded-lg object-cover" />}
                                                        <div className="text-sm font-medium line-clamp-1">{post.title}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs uppercase font-bold text-gray-500">{post.lang}</td>
                                                <td className="px-6 py-4 text-sm font-mono text-gray-400">{post.views}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => alert('Tezliklə...')} className="text-gray-500 hover:text-white mr-4">Redaktə</button>
                                                    <button onClick={async () => { if(confirm('Silinsin?')) { await fetch(`/api/admin/posts/${post.id}`, {method:'DELETE'}); fetchData(); } }} className="text-gray-500 hover:text-red-500">Sil</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            ) : (
                                <>
                                    <thead>
                                        <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/5">
                                            <th className="px-6 py-4 font-medium">Müəllif</th>
                                            <th className="px-6 py-4 font-medium">Vəzifə</th>
                                            <th className="px-6 py-4 font-medium">Dil</th>
                                            <th className="px-6 py-4 font-medium text-right">Əməliyyat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {authors.map((author) => (
                                            <tr key={author.id} className="hover:bg-white/[0.02]">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <img src={author.avatar || '/placeholder-user.png'} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                                        <div className="text-sm font-medium">{author.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-400">{author.job_title}</td>
                                                <td className="px-6 py-4 text-xs uppercase font-bold text-gray-500">{author.lang}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => { setEditingAuthor(author); setAuthorForm({ name: author.name, job_title: author.job_title, lang: author.lang, avatar: author.avatar }); setIsAuthorModalOpen(true); }} className="text-gray-500 hover:text-white mr-4">Redaktə</button>
                                                    <button onClick={() => handleDeleteAuthor(author.id)} className="text-gray-500 hover:text-red-500">Sil</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            )}
                        </table>
                    </div>
                </div>
            </main>

            {/* Author Modal */}
            {isAuthorModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-md rounded-2xl p-8 shadow-2xl">
                        <h2 className="text-xl font-bold mb-6">{editingAuthor ? 'Müəllifi Redaktə Et' : 'Yeni Müəllif'}</h2>
                        <form onSubmit={handleAuthorSubmit} className="space-y-4">
                            <div className="flex justify-center mb-6">
                                <div className="relative group">
                                    <img 
                                        src={authorForm.avatar || 'https://via.placeholder.com/150'} 
                                        className="w-24 h-24 rounded-full object-cover border-2 border-white/5 group-hover:border-red-500 transition-all"
                                    />
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all pointer-events-none text-[10px] font-bold">
                                        {uploading ? '...' : 'DƏYİŞ'}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Ad Soyad</label>
                                <input 
                                    type="text" 
                                    value={authorForm.name} 
                                    onChange={e => setAuthorForm({...authorForm, name: e.target.value})}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none" 
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Vəzifə</label>
                                <input 
                                    type="text" 
                                    value={authorForm.job_title} 
                                    onChange={e => setAuthorForm({...authorForm, job_title: e.target.value})}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Dil</label>
                                <select 
                                    value={authorForm.lang} 
                                    onChange={e => setAuthorForm({...authorForm, lang: e.target.value})}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none appearance-none"
                                >
                                    <option value="az">AZ</option>
                                    <option value="en">EN</option>
                                    <option value="ru">RU</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAuthorModalOpen(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm font-bold transition-all"
                                >
                                    İMTİNA
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving || uploading}
                                    className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-xl text-sm font-bold shadow-lg shadow-red-900/20 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? '...' : 'YADDA SAXLA'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
