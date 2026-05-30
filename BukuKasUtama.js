import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
// Assuming lucide-react is installed for icon rendering in a React project
import { TrendingUp, TrendingDown, Trash2, Edit3, Plus, Search, Filter, Calendar, X, AlertTriangle } from 'lucide-react';

export default function BukuKasUtama() {
    // --- States ---
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Form modal state for adding new transaction
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formType, setFormType] = useState('pemasukan'); // 'pemasukan' or 'pengeluaran'
    const [formDesc, setFormDesc] = useState('');
    const [formCategory, setFormCategory] = useState('');
    const [formAmount, setFormAmount] = useState('');

    // Predefined Categories
    const categoriesIncome = ['Penjualan', 'Investasi', 'Lain-lain'];
    const categoriesExpense = ['Bahan Baku', 'Gaji', 'Operasional', 'Sewa', 'Lain-lain'];

    // --- Side Effects ---
    useEffect(() => {
        fetchTransactions();
    }, []);

    // Fetch transactions from Supabase Ordered by created_at DESC
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
            console.error('Error fetching transactions:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- Action Handlers ---

    // Save/Add New Transaction to Supabase
    const handleAddTransaction = async (e) => {
        e.preventDefault();
        if (!formDesc.trim() || !formAmount || !formCategory) {
            alert('Semua baris input wajib diisi.');
            return;
        }

        try {
            const nominalValue = parseFloat(formAmount);
            if (isNaN(nominalValue) || nominalValue <= 0) {
                alert('Nominal harus berupa angka positif.');
                return;
            }

            const newTx = {
                deskripsi: formDesc.trim(),
                kategori: formCategory,
                jenis: formType, // 'pemasukan' or 'pengeluaran'
                nominal: nominalValue
            };

            const { data, error: insertError } = await supabase
                .from('transactions')
                .insert([newTx])
                .select();

            if (insertError) throw insertError;

            // Update UI State with new transaction
            if (data && data.length > 0) {
                setTransactions((prev) => [data[0], ...prev]);
            } else {
                // Fallback refetch if select returns empty
                await fetchTransactions();
            }

            // Reset Form and close Modal
            setFormDesc('');
            setFormAmount('');
            setFormCategory('');
            setIsModalOpen(false);
            alert('Transaksi berhasil ditambahkan.');
        } catch (err) {
            console.error('Error adding transaction:', err.message);
            alert('Gagal menambahkan transaksi: ' + err.message);
        }
    };

    // Delete Transaction from Supabase
    const handleDeleteTransaction = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            return;
        }

        try {
            const { error: deleteError } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;

            // Filter out deleted items from local state
            setTransactions((prev) => prev.filter(tx => tx.id !== id));
            alert('Transaksi berhasil dihapus.');
        } catch (err) {
            console.error('Error deleting transaction:', err.message);
            alert('Gagal menghapus transaksi: ' + err.message);
        }
    };

    // Toggle Category Filter checkboxed
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

    // --- Search & Filter Logic (Client-Side) ---
    const filteredTransactions = transactions.filter(tx => {
        // 1. Search Query filter (matches description, category, or amount)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const descMatch = (tx.deskripsi || '').toLowerCase().includes(query);
            const catMatch = (tx.kategori || '').toLowerCase().includes(query);
            const amountMatch = (tx.nominal || '').toString().includes(query);
            if (!descMatch && !catMatch && !amountMatch) return false;
        }

        // 2. Category / Type filter
        if (selectedCategories.length > 0) {
            let matchesCategory = selectedCategories.includes(tx.kategori);
            let matchesIncomeAll = selectedCategories.includes('income_all') && tx.jenis === 'pemasukan';
            let matchesExpenseAll = selectedCategories.includes('expense_all') && tx.jenis === 'pengeluaran';
            
            if (!matchesCategory && !matchesIncomeAll && !matchesExpenseAll) return false;
        }

        // 3. Date Range filter (using created_at timestamp string or date)
        if (startDate || endDate) {
            const txDate = tx.created_at ? tx.created_at.split('T')[0] : '';
            if (startDate && txDate < startDate) return false;
            if (endDate && txDate > endDate) return false;
        }

        return true;
    });

    // Helper: Format Rupiah Currency
    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(val || 0);
    };

    // Helper: Formatted Date
    const formatIndonesianDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6" id="buku-kas-panel">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Buku Kas Utama</h1>
                    <p className="text-slate-500 text-sm">Kelola pemasukan dan pengeluaran Mutiara Snack secara realtime.</p>
                </div>
                
                {/* Action Controls */}
                <div className="flex items-center gap-3 self-start sm:self-center">
                    {/* Date filter toggle or static search */}
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)} 
                        className={`h-12 px-4 rounded-2xl border flex items-center justify-center gap-2 transition-all text-xs font-bold uppercase tracking-wider ${isFilterOpen ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Filter className="h-4 w-4" />
                        Filter Data
                    </button>
                    
                    <button 
                        onClick={() => { setFormType('pemasukan'); setFormCategory(categoriesIncome[0]); setIsModalOpen(true); }}
                        className="flex h-12 px-6 items-center gap-2 bg-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary/95 transition-all shadow-lg shadow-primary/10"
                    >
                        <Plus className="h-4 w-4" /> Entri Baru
                    </button>
                </div>
            </div>

            {/* Expansible Category and Date Range Filters */}
            {isFilterOpen && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Start Date */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Mulai Tanggal</label>
                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 h-11 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>
                        {/* End Date */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Sampai Tanggal</label>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 h-11 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>
                        {/* Category Checkboxes */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Saring Kategori</label>
                            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-100">
                                <label className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedCategories.includes('income_all')}
                                        onChange={() => handleCategoryToggle('income_all')}
                                        className="rounded border-slate-300 text-primary focus:ring-primary/20"
                                    />
                                    Semua Pemasukan
                                </label>
                                <label className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedCategories.includes('expense_all')}
                                        onChange={() => handleCategoryToggle('expense_all')}
                                        className="rounded border-slate-300 text-primary focus:ring-primary/20"
                                    />
                                    Semua Pengeluaran
                                </label>
                                {[...categoriesIncome, ...categoriesExpense].map(cat => (
                                    <label key={cat} className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() => handleCategoryToggle(cat)}
                                            className="rounded border-slate-300 text-primary focus:ring-primary/20"
                                        />
                                        {cat}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Clear actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <button onClick={handleClearFilters} className="text-xs font-bold text-red-500 hover:underline uppercase tracking-wide">
                            Reset Filter
                        </button>
                        <button onClick={() => setIsFilterOpen(false)} className="text-xs font-bold text-primary hover:underline uppercase tracking-wide">
                            Selesai Menyaring
                        </button>
                    </div>
                </div>
            )}

            {/* Error Message if any */}
            {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex gap-3 text-red-700">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                    <div>
                        <p className="font-bold text-sm">Gagal Sinkronisasi Supabase</p>
                        <p className="text-xs text-red-650 mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Transactions Master Container */}
            <div className="flex flex-col gap-6">
                {/* Live Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Cari deskripsi, kategori, nominal transaksi..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 bg-white border border-slate-200 h-14 rounded-2xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                    />
                </div>

                {loading ? (
                    <div className="py-24 text-center">
                        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-6">Menghubungkan ke Supabase Cloud...</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Grid Layout for Cards (Centered) */}
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
                                            className="w-full max-w-full mx-auto bg-white rounded-2xl px-5 py-5 border border-slate-200 shadow-sm active:scale-[0.98] transition-transform"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                        {isIncome ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <h3 className="text-sm font-bold text-slate-900 leading-tight">{tx.deskripsi}</h3>
                                                        <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest mt-1">
                                                            {formatIndonesianDate(tx.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${isIncome ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100' : 'bg-red-50/50 text-red-650 border-red-100'}`}>
                                                    {tx.kategori}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                                <p className={`text-lg font-black ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
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

                        {/* Desktop Table View */}
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
                                                            <span className={`text-[10px] font-black uppercase tracking-widest border px-3 py-1.5 rounded-xl ${isIncome ? 'text-emerald-600 bg-emerald-50/30 border-emerald-105' : 'text-red-650 bg-red-50/30 border-red-105'}`}>
                                                                {tx.kategori}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <p className={`text-sm font-black ${isIncome ? 'text-emerald-600' : 'text-red-650'}`}>
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

            {/* Form Modal for Creating New Entry */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center px-4 animate-fadeIn">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-slate-100 z-10 transition-transform">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Entri Kas Baru</h3>
                                <p className="text-xs text-slate-400 font-medium">Tambah pencatatan keuangan ke Supabase cloud.</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Transaction Type Tabs */}
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
                                className={`flex-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${formType === 'pengeluaran' ? 'bg-white shadow-sm text-red-650' : 'text-slate-400'}`}
                            >
                                Pengeluaran
                            </button>
                        </div>

                        <form onSubmit={handleAddTransaction} className="space-y-5">
                            {/* Category Dropdown */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Kategori</label>
                                <select 
                                    value={formCategory}
                                    onChange={(e) => setFormCategory(e.target.value)}
                                    className="w-full px-4 h-12 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    {(formType === 'pemasukan' ? categoriesIncome : categoriesExpense).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description Input */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Deskripsi Transaksi</label>
                                <input 
                                    type="text" 
                                    placeholder="Contoh: Penjualan Krupuk Matang" 
                                    value={formDesc}
                                    onChange={(e) => setFormDesc(e.target.value)}
                                    className="w-full px-4 h-12 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-black">Nominal (Rp)</label>
                                <input 
                                    type="number" 
                                    placeholder="0" 
                                    value={formAmount}
                                    onChange={(e) => setFormAmount(e.target.value)}
                                    className="w-full px-4 h-14 bg-slate-50 border border-slate-105 rounded-xl text-xl font-black text-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full h-12 mt-4 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-primary/95 transition-all shadow-lg shadow-primary/25"
                            >
                                Simpan ke Supabase
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
