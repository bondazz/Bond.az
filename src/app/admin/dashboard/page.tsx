'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'posts' | 'authors' | 'ads' | 'categories'>('posts');
    const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0, categories: 0 });
    const [posts, setPosts] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [ads, setAds] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [botLoading, setBotLoading] = useState(false);
    
    // Category Form State
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [categoryForm, setCategoryForm] = useState({ 
        name: '', 
        slug: '', 
        lang: 'az', 
        common_slug: '',
        seo_title: '', 
        seo_description: '', 
        content: '',
        og_title: '',
        og_desc: ''
    });
    
    // Author Form State
    const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState<any>(null);
    const [authorForm, setAuthorForm] = useState({ name: '', job_title: '', lang: 'az', avatar: '' });
    
    // Ads Form State
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<any>(null);
    const [adForm, setAdForm] = useState({ slot_id: 'hero_square', type: 'image', content: '', link_url: '', is_active: true });
    
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
            } else if (activeTab === 'authors') {
                const authorsRes = await fetch('/api/admin/authors');
                if (authorsRes.ok) setAuthors(await authorsRes.json());
            } else if (activeTab === 'categories') {
                const catRes = await fetch('/api/admin/categories');
                if (catRes.ok) setCategories(await catRes.json());
            } else {
                const adsRes = await fetch('/api/admin/ads');
                if (adsRes.ok) setAds(await adsRes.json());
            }
        } catch (err) {
            console.error('Data fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, uploadType: 'author' | 'ad' = 'author') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', uploadType);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                if (uploadType === 'ad') {
                    setAdForm({ ...adForm, content: data.url });
                } else {
                    setAuthorForm({ ...authorForm, avatar: data.url });
                }
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

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const method = editingCategory ? 'PUT' : 'POST';
        const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(categoryForm)
            });
            
            if (res.ok) {
                setIsCategoryModalOpen(false);
                setEditingCategory(null);
                fetchData();
            } else {
                const errorData = await res.json();
                alert(`Xəta: ${errorData.error || 'Məlumat yadda saxlanılmadı'}`);
            }
        } catch (err: any) {
            alert(`Sistem xətası: ${err.message || 'Bilinməyən xəta'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Kateqoriyanı silmək istəyirsiniz?')) return;
        await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
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
                        <button 
                            onClick={() => setActiveTab('categories')}
                            className={`text-xs uppercase tracking-widest font-bold ${activeTab === 'categories' ? 'text-white' : 'text-gray-500'}`}
                        >
                            Kateqoriyalar
                        </button>
                        <button 
                            onClick={() => setActiveTab('ads')}
                            className={`text-xs uppercase tracking-widest font-bold ${activeTab === 'ads' ? 'text-white' : 'text-gray-500'}`}
                        >
                            Reklamlar
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
                        <h3 className="font-bold">
                            {activeTab === 'posts' ? 'Son Xəbərlər' : activeTab === 'authors' ? 'Müəlliflər' : activeTab === 'categories' ? 'Kateqoriyalar' : 'Reklam Meneceri'}
                        </h3>
                        {activeTab === 'authors' && (
                            <button 
                                onClick={() => { setEditingAuthor(null); setAuthorForm({ name: '', job_title: '', lang: 'az', avatar: '' }); setIsAuthorModalOpen(true); }}
                                className="bg-white/10 hover:bg-white/20 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                            >
                                YENİ MÜƏLLİF
                            </button>
                        )}
                        {activeTab === 'categories' && (
                            <button 
                                onClick={() => { 
                                    setEditingCategory(null); 
                                    setCategoryForm({ name: '', slug: '', lang: 'az', common_slug: '', seo_title: '', seo_description: '', content: '', og_title: '', og_desc: '' }); 
                                    setIsCategoryModalOpen(true); 
                                }}
                                className="bg-white/10 hover:bg-white/20 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                            >
                                YENİ KATEQORİYA
                            </button>
                        )}
                        {activeTab === 'ads' && (
                            <button 
                                onClick={() => { setEditingAd(null); setAdForm({ slot_id: 'hero_square', type: 'image', content: '', link_url: '', is_active: true }); setIsAdModalOpen(true); }}
                                className="bg-white/10 hover:bg-white/20 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                            >
                                YENİ REKLAM
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
                            ) : activeTab === 'authors' ? (
                                <>
                                    <thead>
                                        <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/5">
                                            <th className="px-6 py-4 font-medium">Müəllif</th>
                                            <th className="px-6 py-4 font-medium">Vəzifə</th>
                                            <th className="px-6 py-4 font-medium">Email</th>
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
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{author.email}</td>
                                                <td className="px-6 py-4 text-xs uppercase font-bold text-gray-500">{author.lang}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => { setEditingAuthor(author); setAuthorForm({ name: author.name, job_title: author.job_title, lang: author.lang, avatar: author.avatar }); setIsAuthorModalOpen(true); }} className="text-gray-500 hover:text-white mr-4">Redaktə</button>
                                                    <button onClick={() => handleDeleteAuthor(author.id)} className="text-gray-500 hover:text-red-500">Sil</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            ) : activeTab === 'categories' ? (
                                <>
                                    <thead>
                                        <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/5">
                                            <th className="px-6 py-4 font-medium">Ad</th>
                                            <th className="px-6 py-4 font-medium">Slug</th>
                                            <th className="px-6 py-4 font-medium">Dil</th>
                                            <th className="px-6 py-4 font-medium text-right">Əməliyyat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {categories.map((cat) => (
                                            <tr key={cat.id} className="hover:bg-white/[0.02]">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium">{cat.name}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-400">{cat.slug}</td>
                                                <td className="px-6 py-4 text-xs uppercase font-bold text-gray-500">{cat.lang}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => { 
                                                        setEditingCategory(cat); 
                                                        setCategoryForm({ 
                                                            name: cat.name, 
                                                            slug: cat.slug, 
                                                            lang: cat.lang, 
                                                            common_slug: cat.common_slug || '',
                                                            seo_title: cat.seo_title || '', 
                                                            seo_description: cat.seo_description || '', 
                                                            content: cat.content || '',
                                                            og_title: cat.og_title || '',
                                                            og_desc: cat.og_desc || ''
                                                        }); 
                                                        setIsCategoryModalOpen(true); 
                                                    }} className="text-gray-500 hover:text-white mr-4">Redaktə</button>
                                                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-500 hover:text-red-500">Sil</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </>
                            ) : (
                                <>
                                    <thead>
                                        <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/5">
                                            <th className="px-6 py-4 font-medium">Reklam Slotu</th>
                                            <th className="px-6 py-4 font-medium">Növ</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                            <th className="px-6 py-4 font-medium text-right">Əməliyyat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {ads.map((ad) => (
                                            <tr key={ad.id} className="hover:bg-white/[0.02]">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-white/5 uppercase">
                                                            {ad.slot_id.replace('_', ' ')}
                                                        </div>
                                                        <div className="text-sm font-medium uppercase">{ad.slot_id}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${ad.type === 'image' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                                        {ad.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${ad.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                        {ad.is_active ? 'AKTİV' : 'PASSİV'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => { setEditingAd(ad); setAdForm({ slot_id: ad.slot_id, type: ad.type, content: ad.content, link_url: ad.link_url || '', is_active: ad.is_active }); setIsAdModalOpen(true); }} className="text-gray-500 hover:text-white mr-4">Redaktə</button>
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
            {/* Ad Modal */}
            {isAdModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-lg rounded-2xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-bold mb-6">{editingAd ? 'Reklamı Redaktə Et' : 'Yeni Reklam'}</h2>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setIsSaving(true);
                            try {
                                const res = await fetch('/api/admin/ads', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(adForm)
                                });
                                if (res.ok) {
                                    setIsAdModalOpen(false);
                                    fetchData();
                                }
                            } finally {
                                setIsSaving(false);
                            }
                        }} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Reklam Slotu</label>
                                <select 
                                    value={adForm.slot_id} 
                                    onChange={e => setAdForm({...adForm, slot_id: e.target.value})}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none appearance-none"
                                >
                                    <option value="hero_square">Hero Kvadrat (300x300)</option>
                                    <option value="intra_article">Xəbər Daxili (Kvadrat)</option>
                                    <option value="sidebar_left">Sol Sidebar (Skyscraper)</option>
                                    <option value="sidebar_right">Sağ Sidebar (Skyscraper)</option>
                                    <option value="top_banner">Üst Baner (970x90)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Növ</label>
                                <div className="flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setAdForm({...adForm, type: 'image'})}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold border ${adForm.type === 'image' ? 'border-red-500 bg-red-500/10' : 'border-white/5 bg-white/5'}`}
                                    >
                                        ŞƏKİL + LİNK
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setAdForm({...adForm, type: 'code'})}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold border ${adForm.type === 'code' ? 'border-red-500 bg-red-500/10' : 'border-white/5 bg-white/5'}`}
                                    >
                                        HTML KODU
                                    </button>
                                </div>
                            </div>

                            {adForm.type === 'image' ? (
                                <>
                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Reklam Şəkli</label>
                                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                            {adForm.content && <img src={adForm.content} className="w-16 h-16 rounded object-cover" />}
                                            <div className="flex-1">
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={(e) => handleFileUpload(e, 'ad')}
                                                    className="text-xs text-gray-500"
                                                />
                                                <p className="text-[10px] text-gray-600 mt-1">AVIF/WebP formatına avtomatik çevriləcək</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Xarici Link (URL)</label>
                                        <input 
                                            type="url" 
                                            value={adForm.link_url} 
                                            onChange={e => setAdForm({...adForm, link_url: e.target.value})}
                                            placeholder="https://example.com"
                                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none" 
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">HTML / JS Kodu</label>
                                    <textarea 
                                        value={adForm.content} 
                                        onChange={e => setAdForm({...adForm, content: e.target.value})}
                                        rows={6}
                                        placeholder="<script>...</script> və ya <ins>...</ins>"
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none font-mono"
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={adForm.is_active} 
                                    onChange={e => setAdForm({...adForm, is_active: e.target.checked})}
                                    id="ad-active"
                                />
                                <label htmlFor="ad-active" className="text-xs text-gray-400">Bu reklam aktiv olsun</label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAdModalOpen(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm font-bold transition-all"
                                >
                                    İMTİNA
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving || uploading}
                                    className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-xl text-sm font-bold transition-all"
                                >
                                    {isSaving ? '...' : 'REKLAMI YADDA SAXLA'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-2xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl font-bold mb-6">{editingCategory ? 'Kateqoriyanı Redaktə Et' : 'Yeni Kateqoriya'}</h2>
                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Ad</label>
                                    <input 
                                        type="text" 
                                        value={categoryForm.name} 
                                        onChange={e => setCategoryForm({...categoryForm, name: e.target.value})}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Slug (URL)</label>
                                    <input 
                                        type="text" 
                                        value={categoryForm.slug} 
                                        onChange={e => setCategoryForm({...categoryForm, slug: e.target.value})}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none" 
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Dil</label>
                                    <select 
                                        value={categoryForm.lang} 
                                        onChange={e => setCategoryForm({...categoryForm, lang: e.target.value})}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none appearance-none"
                                    >
                                        <option value="az">AZ</option>
                                        <option value="en">EN</option>
                                        <option value="ru">RU</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Common Slug (Dillər arası əlaqə)</label>
                                    <input 
                                        type="text" 
                                        value={categoryForm.common_slug} 
                                        onChange={e => setCategoryForm({...categoryForm, common_slug: e.target.value})}
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none" 
                                        placeholder="iqtisadiyyat"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-white/5 pt-4">
                                <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">SEO AYARLARI</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">SEO Title</label>
                                        <input 
                                            type="text" 
                                            value={categoryForm.seo_title} 
                                            onChange={e => setCategoryForm({...categoryForm, seo_title: e.target.value})}
                                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">SEO Description</label>
                                        <textarea 
                                            value={categoryForm.seo_description} 
                                            onChange={e => setCategoryForm({...categoryForm, seo_description: e.target.value})}
                                            rows={3}
                                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Kateqoriya Mətni (HTML)</label>
                                <textarea 
                                    value={categoryForm.content} 
                                    onChange={e => setCategoryForm({...categoryForm, content: e.target.value})}
                                    rows={6}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none font-mono text-[12px]"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm font-bold transition-all"
                                >
                                    İMTİNA
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving}
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
