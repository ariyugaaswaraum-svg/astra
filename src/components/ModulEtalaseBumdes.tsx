import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Store, 
  Star, 
  Plus, 
  Search, 
  PhoneCall, 
  Tag, 
  TrendingUp, 
  Package, 
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Filter,
  DollarSign,
  ShieldCheck,
  Building2,
  Scale,
  Layers,
  Info
} from 'lucide-react';
import { BumdesProduct } from '../types';

interface ModulEtalaseBumdesProps {
  products: BumdesProduct[];
  onAddProduct: (product: BumdesProduct) => void;
}

export const ModulEtalaseBumdes: React.FC<ModulEtalaseBumdesProps> = ({
  products,
  onAddProduct
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<BumdesProduct | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Olahan Pangan & Camilan' | 'Hasil Tani Segar' | 'Kerajinan Tangan' | 'Jasa Teknik & PAMSIMAS' | 'Pupuk & Saprotan'>('Olahan Pangan & Camilan');
  const [price, setPrice] = useState(15000);
  const [unit, setUnit] = useState('Kemasan 250gr');
  const [producer, setProducer] = useState('KWT Dusun Glanggang');
  const [dusun, setDusun] = useState('Dusun 3 (Glanggang)');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600');
  const [description, setDescription] = useState('Produk unggulan olahan pangan lokal berkualitas tinggi.');
  const [stock, setStock] = useState(50);
  const [whatsappContact, setWhatsappContact] = useState('6281234567890');

  const categories = ['Semua', 'Olahan Pangan & Camilan', 'Hasil Tani Segar', 'Pupuk & Saprotan', 'Kerajinan Tangan', 'Jasa Teknik & PAMSIMAS'];

  const filteredProducts = products.filter(p => {
    const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.producer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProd: BumdesProduct = {
      id: `PRD-${Date.now().toString().slice(-4)}`,
      name,
      category,
      price: Number(price) || 10000,
      unit,
      producer,
      dusun,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600',
      description,
      rating: 4.9,
      stock: Number(stock) || 10,
      whatsappContact: whatsappContact.replace(/[^0-9]/g, '') || '6281234567890',
      isBestSeller: true
    };

    onAddProduct(newProd);
    setShowAddProductModal(false);
    setName('');
  };

  const handleOrderWhatsApp = (product: BumdesProduct) => {
    const msg = encodeURIComponent(
      `Halo BUMDes / Pengrajin ${product.producer}, saya ingin memesan "${product.name}" seharga Rp ${product.price.toLocaleString('id-ID')} (${product.unit}). Apakah stok masih tersedia?`
    );
    window.open(`https://wa.me/${product.whatsappContact}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>Pemberdayaan Ekonomi & Usaha Warga</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Etalase Digital BUMDes & UMKM Unggulan
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Katalog produk olahan pangan, beras organik Kali Metro, pupuk kompos desa, dan jasa teknik PAMSIMAS.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk UMKM / BUMDes</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Produk Terdaftar</span>
            <Package className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{products.length} Komoditas</p>
          <span className="text-[11px] text-slate-500">Olahan pangan, tani, & jasa</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold">
            <span>Unit Usaha Terlibat</span>
            <Store className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">12 Kelompok Tani / KWT</p>
          <span className="text-[11px] text-emerald-600 font-medium">Binaan BUMDes Talangagung</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-blue-700 text-xs font-bold">
            <span>Order WhatsApp Langsung</span>
            <PhoneCall className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-700 mt-2">1-Klik Pesan</p>
          <span className="text-[11px] text-blue-600 font-medium">Tanpa potongan komisi pihak ketiga</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold">
            <span>Rata-rata Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">4.9 / 5.0</p>
          <span className="text-[11px] text-amber-600 font-medium">Ulasan kepuasan pembeli</span>
        </div>
      </div>

      {/* PANEL: KONTEKS BUMDES SE-KABUPATEN MALANG */}
      <div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-slate-50 border border-emerald-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/60 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Konteks BUMDes se-Kabupaten Malang
              </h3>
              <p className="text-xs text-slate-600">
                Data pembanding ekosistem Badan Usaha Milik Desa dan status legalitas badan hukum di tingkat daerah
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 bg-white/90 text-emerald-900 border border-emerald-300 rounded-xl self-start sm:self-auto flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-emerald-700" />
            <span>Sumber: <strong>JatimTimes, 21 Februari 2025 - Akhirnya 378 Desa di Kabupaten Malang Miliki BUMDes</strong></span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: 378 Desa */}
          <div className="p-4 bg-white/90 border border-emerald-200 rounded-xl space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide">Cakupan Wilayah</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">33 Kecamatan</span>
            </div>
            <div className="text-2xl font-black text-slate-900">378 Desa</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              378 desa se-Kabupaten Malang (33 kecamatan) sudah memiliki BUMDes per Februari 2025.
            </p>
          </div>

          {/* Card 2: 159 Berbadan Hukum */}
          <div className="p-4 bg-white/90 border border-emerald-200 rounded-xl space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide">Status Legalitas</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">159 BUMDes</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              159 BUMDes sudah berbadan hukum resmi dan terverifikasi oleh Kementerian Desa PDTT.
            </p>
          </div>

          {/* Card 3: Kecamatan Kepanjen */}
          <div className="p-4 bg-white/90 border border-emerald-200 rounded-xl space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide">Kecamatan Kepanjen</span>
              <Building2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">4 BUMDes</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kecamatan Kepanjen memiliki 4 BUMDes dengan status badan hukum lengkap (termasuk BUMDes Talangagung).
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari produk desa, produsen KWT, atau hasil tani..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Product Photo */}
              <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                <img
                  src={product.photoUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                  {product.category}
                </span>

                {product.isBestSeller && (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 fill-white" />
                    Terlaris
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-emerald-700">{product.producer}</span>
                  <div className="flex items-center space-x-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                  {product.name}
                </h4>

                <p className="text-slate-600 text-xs line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Footer Price & WhatsApp Order */}
            <div className="p-4 pt-0 border-t border-slate-100 mt-2">
              <div className="flex items-baseline justify-between py-2">
                <div>
                  <span className="text-base font-black text-emerald-600">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">/ {product.unit}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  Stok: {product.stock}
                </span>
              </div>

              <button
                onClick={() => handleOrderWhatsApp(product)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-all active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Pesan Langsung via WhatsApp</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah Produk Baru */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-600" />
                <span>Tambah Produk BUMDes / UMKM Desa</span>
              </h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Produk / Komoditas:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Keripik Pisang Madu Dusun Glanggang"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori:</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  >
                    <option value="Olahan Pangan & Camilan">Olahan Pangan & Camilan</option>
                    <option value="Hasil Tani Segar">Hasil Tani Segar</option>
                    <option value="Pupuk & Saprotan">Pupuk & Saprotan</option>
                    <option value="Kerajinan Tangan">Kerajinan Tangan</option>
                    <option value="Jasa Teknik & PAMSIMAS">Jasa Teknik & PAMSIMAS</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Satuan Kemasan:</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Contoh: Pcs / 500gr / Sak 20kg"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Harga Jual (Rp):</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jumlah Stok Awal:</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Produsen / Kelompok Tani:</label>
                  <input
                    type="text"
                    value={producer}
                    onChange={(e) => setProducer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dusun Asal:</label>
                  <input
                    type="text"
                    value={dusun}
                    onChange={(e) => setDusun(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor WhatsApp Penjual (Contoh: 628123456789):</label>
                <input
                  type="text"
                  value={whatsappContact}
                  onChange={(e) => setWhatsappContact(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Singkat Keunggulan Produk:</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Simpan & Tampilkan di Etalase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
