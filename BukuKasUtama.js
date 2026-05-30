import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
// Menggunakan library lucide-react untuk ikon UI profesional
import { TrendingUp, TrendingDown, Trash2, Edit3, Plus, Search, Filter, Calendar, X, AlertTriangle } from 'lucide-react';

export default function BukuKasUtama() {
    // --- State Management ---
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter Utama
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Form Modal Entri Baru
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formType, setFormType] = useState('pemasukan'); // 'pemasukan' atau 'pengeluaran'
    const [formDesc, setFormDesc] = useState('');
    const [formCategory, setFormCategory] = useState('');
    const [formAmount, setFormAmount] = useState('');

    // Kategori Statis Mutiara Snack
    const categoriesIncome = ['Penjualan', 'Investasi', 'Lain-lain'];
    const categoriesExpense = ['Bahan Baku', 'Gaji', 'Operasional', 'Sewa', 'Lain-lain'];

    // --- Efek Samping (Fetch Data Awal) ---
    useEffect(() => {
        fetchTransactions();
    }, []);

    // Mengambil Seluruh Data Transaksi dari Supabase secara Asynchronous
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('transactions')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setTransactions(data || []);
        } catch (err) {
            console.error('Koneksi Supabase Bermasalah:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- Aksi Handler ---

    // Handler 1: Tambah Transaksi ke Supabase Database
    const handleAddTransaction = async (e) => {
        e.preventDefault();
        if (!formDesc.trim() || !formAmount || !formCategory) {
            alert('Semua entri form wajib diisi.');
            return;
        }

        try {
            const nominalValue = parseFloat(formAmount);
            if (isNaN(nominalValue) || nominalValue <= 0) {
                alert('Nominal transaksi harus berupa angka positif.');
                return;
            }

            const newTx = {
                deskripsi: formDesc.trim(),
                kategori: formCategory,
                jenis: formType, // 'pemasukan' atau 'pengeluaran'
                nominal: nominalValue
            };

            const { data, error: insertError } = await supabase
                .from('transactions')
                .insert([newTx])
                .select();

            if (insertError) throw insertError;

            // Optimistic update state dengan baris data baru dari DB
            if (data && data.length > 0) {
                setTransactions((prev) => [data[0], ...prev]);
            } else {
                await fetchTransactions();
            }

            // Reset forms & status modal
            setFormDesc('');
            setFormAmount('');
            setFormCategory('');
            setIsModalOpen(false);
            alert('Transaksi baru berhasil disimpan ke Supabase.');
        } catch (err) {
            console.error('Gagal Menyimpan Transaksi:', err.message);
            alert('Error menyimpan data: ' + err.message);
        }
    };

    // Handler 2: Hapus Transaksi Terpilih dari Supabase Database
    const handleDeleteTransaction = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus data transaksi ini secara permanen dari Cloud?')) {
            return;
        }

        try {
            const { error: deleteError } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            // Mutasi filter state lokal pasca-proses delete berhasil
            setTransactions((prev) => prev.filter(tx => tx.id !== id));
            alert('Transaksi sukses terhapus.');
        } catch (err) {
            console.error('Gagal Menghapus Transaksi:', err.message);
            alert('Error menghapus data: ' + err.message);
        }
    };

    // Filter Kategori Checklist Handler
    const handleCategoryToggle = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(prev => prev.filter(cat => cat !== category));
        } else {
            setSelectedCategories(prev => [...prev, category]);
        }
    };

    const handleClearFilters = () => {
        setSelectedCategories([]);
        setStartDate('');
        setEndDate('');
        setSearchQuery('');
    };

    // --- Pemrosesan Filter & Pencarian Sisi Klien ---
    const filteredTransactions = transactions.filter(tx => {
        // 1. Filter Pencarian Teks (Deskripsi, Kategori, atau Angka Nominal)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const descMatch = (tx.deskripsi || '').toLowerCase().includes(query);
            const catMatch = (tx.kategori || '').toLowerCase().includes(query);
            const amountMatch = (tx.nominal || '').toString().includes(query);
            if (!descMatch && !catMatch && !amountMatch) return false;
        }

        // 2. Filter Kategori Selektif (Checkbox Fix Logic)
        if (selectedCategories.length > 0) {
            const matchesCategory = selectedCategories.includes(tx.kategori);
            const matchesIncomeAll = selectedCategories.includes('income_all') && tx.jenis === 'pemasukan';
            const matchesExpenseAll = selectedCategories.includes('expense_all') && tx.jenis === 'pengeluaran';
            
            // Menggunakan kondisi OR agar tidak saling mematikan data filter
            if (!matchesCategory && !matchesIncomeAll && !matchesExpenseAll) return false;
        }

        // 3. Filter Rentang Tanggal
        if (startDate || endDate) {
            const txDate = tx.created_at ? tx.created_at.split('T')[0] : '';
            if (startDate && txDate < startDate) return false;
            if (endDate && txDate > endDate) return false;
        }

        return true;
    });

    // Formatting Rupiah IDR
    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(val || 0);
    };

    // Formatting Tanggal Indonesia Resmi
    const formatIndonesianDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6" id="buku-kas-panel">
            {/* Header Utama */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Buku Kas Utama</h1>
                    <p className="text-slate-500 text-sm">Kelola pemasukan dan pengeluaran Mutiara Snack secara realtime.</p>
                </div>
                
                {/* Panel Aksi Cepat */}
                <div className="flex items-center gap-3 self-start sm:self-center">
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)} 
                        className={`h-12 px-4 rounded-2xl border flex items-center justify-center gap-2 transition-all text-xs font-bold uppercase tracking-wider ${isFilterOpen ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Filter className="h-4 w-4" />
                        Filter Data
                    </button>
                    
                    <button 
                        onClick={() => { setFormType('pemasukan'); setFormCategory(categoriesIncome[0]); setIsModalOpen(true); }}
                        className="flex h-12 px-6 items-center gap-2 bg-teal-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/10"
                    >
                        <Plus className="h-4 w-4" /> Entri Baru
                    </button>
                </div>
            </div>

            {/* Filter Drawer Animatif */}
            {isFilterOpen && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Pilih Tanggal Awal */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Mulai Tanggal</label>
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 h-11 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-600/20 outline-none"
                            />
                        </div>
                        {/* Pilih Tanggal Akhir */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Sampai Tanggal</label>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 h-11 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-600/20 outline-none"
                            />
                        </div>
                        {/* Filter Kategori Dinamis */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Saring Kategori</label>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-100">
                                <label className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedCategories.includes('income_all')}
                                        onChange={() => handleCategoryToggle('income_all')}
                                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                    />
                                    Semua Pemasukan
                                </label>
                                <label className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedCategories.includes('expense_all')}
                                        onChange={() => handleCategoryToggle('expense_all')}
                                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                    />
                                    Semua Pengeluaran
                                </label>
                                {[...categoriesIncome, ...categoriesExpense].map(cat => (
                                    <label key={cat} className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() => handleCategoryToggle(cat)}
                                            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                        />
                                        {cat}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <button onClick={handleClearFilters} className="text-xs font-bold text-red-500 hover:underline uppercase tracking-wide">
                            Reset Filter
                        </button>
                        <button onClick={() => setIsFilterOpen(false)} className="text-xs font-bold text-teal-600 hover:underline uppercase tracking-wide">
                            Selesai Menyaring
                        </button>
                    </div>
                </div>
            )}

            {/* Kotak Peringatan Hubungan Supabase */}
            {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex gap-3 text-red-700">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                    <div>
                        <p className="font-bold text-sm">Gagal Sinkronisasi Supabase Cloud</p>
                        <p className="text-xs text-red-600 mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Tabel & Container Mutrasi */}
            <div className="flex flex-col gap-6">
                {/* Search Input Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Cari deskripsi, kategori, nominal transaksi..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 bg-white border border-slate-200 h-14 rounded-2xl text-sm focus:ring-2 focus:ring-teal-600/20 transition-all outline-none"
                    />
                </div>

                {loading ? (
                    <div className="py-24 text-center">
                        <div className="h-10 w-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4 font-black"></div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Supabase...</p>
                    </div>
                ) : (
                    <>
                        {/* 1. TAMPILAN MOBILE CARDS (Fully Centered & Responsive) */}
                        <div className="md:hidden flex flex-col items-center w-full space-y-4">
                            {filteredTransactions.length === 0 ? (
                                <div className="py-20 text-center space-y-3 w-full">
                                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                        <X className="h-8 w-8" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Data Tidak Ditemukan</p>
                                </div>
                            ) : (
                                filteredTransactions.map((tx) => {
                                    const isIncome = tx.jenis === 'pemasukan';
                                    return (
                                        <div 
                                            key={tx.id} 
                                            className="w-full bg-white rounded-2xl px-5 py-5 border border-slate-200 shadow-sm active:scale-[0.99] transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                        {isIncome ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <h3 className="text-sm font-bold text-slate-900 leading-tight">{tx.deskripsi}</h3>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                            {formatIndonesianDate(tx.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${isIncome ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100' : 'bg-red-50/50 text-red-600 border-red-100'}`}>
                                                    {tx.kategori}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                                <p className={`text-lg font-black ${isIncome ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {isIncome ? '+' : '-'} {formatRupiah(tx.nominal)}
                                                </p>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleDeleteTransaction(tx.id)} 
                                                        className="h-10 w-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4.5 w-4.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* 2. TAMPILAN TABLE DESKTOP */}
                        <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            <th className="px-6 py-4">Transaksi & Tanggal</th>
                                            <th className="px-6 py-4">Kategori</th>
                                            <th className="px-6 py-4 text-right">Nominal</th>
                                            <th className="px-6 py-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredTransactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="py-20 text-center">
                                                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-3">
                                                        <X className="h-8 w-8" />
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Data Tidak Ditemukan</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredTransactions.map((tx) => {
                                                const isIncome = tx.jenis === 'pemasukan';
                                                return (
                                                    <tr key={tx.id} className="group hover:bg-slate-50/70 transition-colors">
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                                    {isIncome ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-bold text-slate-900">{tx.deskripsi}</span>
                                                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">
                                                                        {formatIndonesianDate(tx.created_at)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className={`text-[10px] font-black uppercase tracking-widest border px-3 py-1.5 rounded-xl ${isIncome ? 'text-emerald-600 bg-emerald-50/30 border-emerald-100' : 'text-red-500 bg-red-50/30 border-red-100'}`}>
                                                                {tx.kategori}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <p className={`text-sm font-black ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
                                                                {isIncome ? '+' : '-'} {formatRupiah(tx.nominal)}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <button 
                                                                onClick={() => handleDeleteTransaction(tx.id)} 
                                                                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg text-red-500 transition-all inline-flex items-center justify-center" 
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="h-4.5 w-4.5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal Formulir Simpan Data Supabase */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center px-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-slate-100 z-10">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Entri Kas Supabase</h3>
                                <p className="text-xs text-slate-400 font-medium">Buku catatan keuangan real-time terenkripsi cloud.</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Pilihan Jenis Transaksi */}
                        <div className="flex h-12 p-1 bg-slate-100 rounded-2xl gap-1 mb-6">
                            <button 
                                type="button"
                                onClick={() => { setFormType('pemasukan'); setFormCategory(categoriesIncome[0]); }}
                                className={`flex-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${formType === 'pemasukan' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}
                            >
                                Pemasukan
                            </button>
                            <button 
                                type="button"
                                onClick={() => { setFormType('pengeluaran'); setFormCategory(categoriesExpense[0]); }}
                                className={`flex-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${formType === 'pengeluaran' ? 'bg-white shadow-sm text-red-600' : 'text-slate-400'}`}
                            >
                                Pengeluaran
                            </button>
                        </div>

                        <form onSubmit={handleAddTransaction} className="space-y-5">
                            {/* Kategori Input */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Kategori</label>
                                <select 
                                    value={formCategory}
                                    onChange={(e) => setFormCategory(e.target.value)}
                                    className="w-full px-4 h-12 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-teal-600/20 outline-none"
                                >
                                    {(formType === 'pemasukan' ? categoriesIncome : categoriesExpense).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Deskripsi Teks */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Deskripsi Transaksi</label>
                                <input 
                                    type="text" 
                                    placeholder="Contoh: Pembelian Bahan Baku Tepung Terigu" 
                                    value={formDesc}
                                    onChange={(e) => setFormDesc(e.target.value)}
                                    className="w-full px-4 h-12 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-teal-600/20 outline-none"
                                />
                            </div>

                            {/* Jumlah Nominal Rp */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-extrabold">Nominal (Rp)</label>
                                <input 
                                    type="number" 
                                    placeholder="0" 
                                    value={formAmount}
                                    onChange={(e) => setFormAmount(e.target.value)}
                                    className="w-full px-4 h-14 bg-slate-50 border border-slate-100 rounded-xl text-xl font-black text-teal-600 focus:ring-2 focus:ring-teal-600/20 outline-none"
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full h-12 mt-4 bg-teal-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
                            >
                                Simpan ke Supabase Cloud
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
