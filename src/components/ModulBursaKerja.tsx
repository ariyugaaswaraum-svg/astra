import React, { useState } from 'react';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  GraduationCap, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Send, 
  Users, 
  TrendingUp, 
  Award,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { JobVacancy, JobApplication } from '../types';

interface ModulBursaKerjaProps {
  vacancies: JobVacancy[];
  onAddVacancy: (vacancy: JobVacancy) => void;
}

export const ModulBursaKerja: React.FC<ModulBursaKerjaProps> = ({
  vacancies,
  onAddVacancy
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(vacancies[0] || null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showPostJobModal, setShowPostJobModal] = useState(false);

  // Application form state
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantRtRw, setApplicantRtRw] = useState('RT 02 / RW 01 (Krajan)');
  const [applicantEducation, setApplicantEducation] = useState('SMK Jurusan Mesin / Otomotif');
  const [applicantSkills, setApplicantSkills] = useState('');
  const [submittedApp, setSubmittedApp] = useState<boolean>(false);

  // Post Job form state
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('Area Kepanjen & Sekitarnya');
  const [newIndustry, setNewIndustry] = useState<'Manufaktur' | 'Agribisnis / Pertanian' | 'Otomotif & Servis' | 'Teknologi & Kreatif' | 'Jasa & Perdagangan'>('Agribisnis / Pertanian');
  const [newEmploymentType, setNewEmploymentType] = useState<'Full-Time' | 'Magang SMK' | 'Part-Time' | 'Kerja Musiman'>('Full-Time');
  const [newSalary, setNewSalary] = useState('Rp 2.500.000 - Rp 3.200.000 / bln');
  const [newSlots, setNewSlots] = useState(2);
  const [newRequirements, setNewRequirements] = useState("Pendidikan minimal SMK/SMA\nJujur dan berdedikasi tinggi\nDiutamakan domisili Kepanjen");
  const [newContact, setNewContact] = useState("Ibu Admin HRD - 0812-3456-7890");

  const filteredJobs = vacancies.filter(j => {
    const matchCat = activeCategory === 'Semua' || j.industryType === activeCategory || j.employmentType === activeCategory;
    const matchSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantPhone.trim()) return;

    setSubmittedApp(true);
    setTimeout(() => {
      setSubmittedApp(false);
      setShowApplyModal(false);
      setApplicantName('');
      setApplicantSkills('');
      alert(`Pendaftaran lamaran untuk "${selectedJob?.title}" berhasil dikirim langsung ke tim rekrutmen mitra industri!`);
    }, 1000);
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    const newJob: JobVacancy = {
      id: `JOB-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      company: newCompany,
      location: newLocation,
      industryType: newIndustry,
      employmentType: newEmploymentType,
      salaryRange: newSalary,
      postedDate: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      requirements: newRequirements.split('\n').filter(Boolean),
      slotsAvailable: Number(newSlots) || 1,
      applicantsCount: 0,
      contactPerson: newContact,
      isPriorityForLocal: true
    };

    onAddVacancy(newJob);
    setSelectedJob(newJob);
    setShowPostJobModal(false);
    setNewTitle('');
    setNewCompany('');
  };

  const categories = ['Semua', 'Full-Time', 'Magang SMK', 'Manufaktur', 'Agribisnis / Pertanian', 'Teknologi & Kreatif'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Kemitraan Industri & Penyerapan Tenaga Kerja Desa</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Bursa Kerja Lokal & Program Magang (Link and Match)
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Pusat informasi lowongan kerja industri mitra Kepanjen, program magang siswa SMK, dan penyerapan warga usia produktif.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowPostJobModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Pasang Lowongan Industri</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Lowongan Tersedia</span>
            <Briefcase className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{vacancies.length} Posisi</p>
          <span className="text-[11px] text-slate-500">Kemitraan industri & UMKM</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold">
            <span>Kuota Penerimaan</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">
            {vacancies.reduce((sum, j) => sum + j.slotsAvailable, 0)} Orang
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Prioritas warga lokal desa</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-blue-700 text-xs font-bold">
            <span>Magang SMK TEFA</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-700 mt-2">
            {vacancies.filter(v => v.employmentType === 'Magang SMK').length} Program
          </p>
          <span className="text-[11px] text-blue-600 font-medium">Sertifikasi & uang saku</span>
        </div>

        <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-purple-700 text-xs font-bold">
            <span>Warga Mendaftar</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-700 mt-2">
            {vacancies.reduce((sum, j) => sum + j.applicantsCount, 0)} Pelamar
          </p>
          <span className="text-[11px] text-purple-600 font-medium">Terpantau di dashboard kades</span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari posisi kerja, nama perusahaan, atau keahlian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
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
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Job Cards List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredJobs.map(job => {
            const isSelected = selectedJob?.id === job.id;
            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-indigo-50/60 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md' 
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {job.employmentType}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1.5 leading-snug">
                      {job.title}
                    </h4>
                    <p className="text-slate-600 text-xs font-semibold mt-0.5 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.company}</span>
                    </p>
                  </div>

                  {job.isPriorityForLocal && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 shrink-0">
                      Warga Lokal Prioritas
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center space-x-1 text-slate-700 font-bold">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{job.salaryRange}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-600">
                    {job.applicantsCount} Pelamar • {job.slotsAvailable} Kuota
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Job Details */}
        <div className="lg:col-span-7">
          {selectedJob ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[11px] font-bold">
                      {selectedJob.employmentType}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {selectedJob.industryType}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    {selectedJob.title}
                  </h3>
                  <p className="text-slate-700 text-xs font-bold mt-1 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>{selectedJob.company}</span>
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedJob.location}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-semibold block">Gaji / Insentif</span>
                  <span className="text-base font-black text-emerald-600">
                    {selectedJob.salaryRange}
                  </span>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Kualifikasi & Persyaratan:</span>
                </h4>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <PhoneCall className="w-5 h-5 text-indigo-600" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Kontak Penerimaan / HRD:</span>
                    <p className="font-bold text-slate-800">{selectedJob.contactPerson}</p>
                  </div>
                </div>
                <span className="text-slate-500 text-[11px]">Batas: {selectedJob.deadline}</span>
              </div>

              {/* CTA Apply Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Tersedia <strong>{selectedJob.slotsAvailable} kuota</strong> lowongan
                </span>
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Lamar Sekarang (Cepat dari Aplikasi)</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <Briefcase className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold">Pilih salah satu lowongan kerja di sebelah kiri untuk melihat rincian.</p>
            </div>
          )}
        </div>

      </div>

      {/* Modal Lamar Pekerjaan */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">Lamar Pekerjaan</h3>
                <p className="text-slate-500 text-xs">{selectedJob.title} - {selectedJob.company}</p>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleApply} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Pelamar:</label>
                <input
                  type="text"
                  required
                  placeholder="Nama sesuai KTP"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor WhatsApp / Telepon:</label>
                <input
                  type="text"
                  required
                  placeholder="08xxxxxxxxxx"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Domisili Warga:</label>
                  <input
                    type="text"
                    value={applicantRtRw}
                    onChange={(e) => setApplicantRtRw(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pendidikan Terakhir:</label>
                  <input
                    type="text"
                    value={applicantEducation}
                    onChange={(e) => setApplicantEducation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Keahlian & Pengalaman Singkat:</label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan keahlian teknik, sertifikasi SMK, atau pengalaman kerja Anda..."
                  value={applicantSkills}
                  onChange={(e) => setApplicantSkills(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittedApp}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {submittedApp ? 'Mengirim...' : 'Kirim Berkas Lamaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Pasang Lowongan Industri Baru */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <span>Pasang Lowongan Kerja Mitra Industri</span>
              </h3>
              <button onClick={() => setShowPostJobModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handlePostJob} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Posisi / Judul Lowongan:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Operator Mesin Bubut & Teknisi Listrik"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Perusahaan / Industri / BUMDes:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Manufaktur Mitra Kepanjen"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sektor Industri:</label>
                  <select
                    value={newIndustry}
                    onChange={(e: any) => setNewIndustry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  >
                    <option value="Manufaktur">Manufaktur</option>
                    <option value="Agribisnis / Pertanian">Agribisnis / Pertanian</option>
                    <option value="Otomotif & Servis">Otomotif & Servis</option>
                    <option value="Teknologi & Kreatif">Teknologi & Kreatif</option>
                    <option value="Jasa & Perdagangan">Jasa & Perdagangan</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipe Pekerjaan:</label>
                  <select
                    value={newEmploymentType}
                    onChange={(e: any) => setNewEmploymentType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Magang SMK">Magang SMK</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Kerja Musiman">Kerja Musiman</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rentang Gaji / Uang Saku:</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jumlah Kuota Orang:</label>
                  <input
                    type="number"
                    value={newSlots}
                    onChange={(e) => setNewSlots(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Persyaratan (Satu per baris):</label>
                <textarea
                  rows={3}
                  value={newRequirements}
                  onChange={(e) => setNewRequirements(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kontak HRD / WhatsApp:</label>
                <input
                  type="text"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Publikasikan Lowongan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
