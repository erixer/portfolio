import { useState } from 'react';
import { useContent } from '../../context/ContentContext.jsx';

export default function AdminDashboard({ onBackToPortfolio }) {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    certificates,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    experiences,
    addExperience,
    updateExperience,
    deleteExperience,
    getAiKey,
    saveAiKey,
    adminUser,
    updateCredentials,
    logout,
    resetToDefaults
  } = useContent();

  const [activeTab, setActiveTab] = useState('overview');

  // AI Key state
  const [currentAiKey, setCurrentAiKey] = useState(getAiKey());
  const [showAiKey, setShowAiKey] = useState(false);
  const [aiTestStatus, setAiTestStatus] = useState(null); // { success, message, latency }
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [aiSaveSuccess, setAiSaveSuccess] = useState(false);

  // Account Settings state
  const [newUsername, setNewUsername] = useState(adminUser);
  const [newPassword, setNewPassword] = useState('');
  const [accountMsg, setAccountMsg] = useState(null);

  // Modals state
  const [projectModal, setProjectModal] = useState({ open: false, isEdit: false, data: null });
  const [certModal, setCertModal] = useState({ open: false, isEdit: false, data: null });
  const [expModal, setExpModal] = useState({ open: false, isEdit: false, data: null });

  // Notifications
  const [notification, setNotification] = useState('');
  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Handle Save AI Key
  const handleSaveAi = (e) => {
    e.preventDefault();
    saveAiKey(currentAiKey);
    setAiSaveSuccess(true);
    showNotification('API Key Gemini berhasil disimpan!');
    setTimeout(() => setAiSaveSuccess(false), 2500);
  };

  // Test AI Connection Live
  const handleTestAi = async () => {
    setIsTestingAi(true);
    setAiTestStatus(null);
    const start = performance.now();

    const keyToTest = currentAiKey.trim();
    if (!keyToTest) {
      setIsTestingAi(false);
      setAiTestStatus({
        success: false,
        message: 'Masukkan API Key terlebih dahulu sebelum melakukan tes koneksi.'
      });
      return;
    }

    try {
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': keyToTest
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'ping' }] }]
          })
        }
      );

      const elapsed = Math.round(performance.now() - start);
      if (response.ok) {
        setAiTestStatus({
          success: true,
          message: `Koneksi Berhasil! Model gemini-2.5-flash aktif (${elapsed}ms).`
        });
      } else {
        const err = await response.json().catch(() => null);
        setAiTestStatus({
          success: false,
          message: `Gagal (${response.status}): ${err?.error?.message || 'Kunci API ditolak oleh Google.'}`
        });
      }
    } catch (err) {
      setAiTestStatus({
        success: false,
        message: `Koneksi gagal: ${err.message || 'Periksa jaringan internet Anda.'}`
      });
    } finally {
      setIsTestingAi(false);
    }
  };

  // Handle Account Update
  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      setAccountMsg({ type: 'error', text: 'Username dan Password baru tidak boleh kosong!' });
      return;
    }
    updateCredentials(newUsername, newPassword);
    setAccountMsg({ type: 'success', text: 'Akun login berhasil diperbarui!' });
    setNewPassword('');
    setTimeout(() => setAccountMsg(null), 3000);
  };

  // Handle Image File Upload Conversion to Base64
  const handleImageFile = (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file terlalu besar! Maksimal 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-brandDark text-zinc-100 flex flex-col md:flex-row">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-sky-500 text-black font-semibold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <i className="fas fa-check-circle" />
          <span>{notification}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 p-[1.5px] shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-xl flex items-center justify-center">
                <i className="fas fa-cubes text-sm text-sky-400" />
              </div>
            </div>
            <div>
              <h2 className="font-syne font-bold text-sm text-white">Dashboard</h2>
              <span className="text-[10px] text-zinc-500 font-mono">Portfolio CMS</span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1.5 flex-1">
          {[
            { id: 'overview', label: 'Ringkasan', icon: 'fa-chart-pie' },
            { id: 'projects', label: 'Kelola Project', icon: 'fa-laptop-code', count: projects.length },
            { id: 'certificates', label: 'Sertifikat', icon: 'fa-certificate', count: certificates.length },
            { id: 'experiences', label: 'Pengalaman Kerja', icon: 'fa-briefcase', count: experiences.length },
            { id: 'ai', label: 'Gemini AI Key', icon: 'fa-robot' },
            { id: 'account', label: 'Pengaturan Akun', icon: 'fa-user-gear' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold shadow-lg shadow-sky-500/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <i className={`fas ${item.icon} w-4 text-center`} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  activeTab === item.id ? 'bg-white/20 text-white' : 'bg-zinc-900 text-zinc-400'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom User & Actions */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={onBackToPortfolio}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white/5 hover:bg-white/10 text-sky-400 hover:text-sky-300 font-semibold transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-arrow-left text-[11px]" />
            <span>Lihat Web Portofolio</span>
          </button>

          <button
            onClick={logout}
            className="w-full px-3.5 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-arrow-right-from-bracket text-[11px]" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="px-8 py-5 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="font-syne font-bold text-lg text-white capitalize">
              {activeTab === 'overview' && 'Ringkasan Portofolio'}
              {activeTab === 'projects' && 'Manajemen Proyek'}
              {activeTab === 'certificates' && 'Manajemen Sertifikat'}
              {activeTab === 'experiences' && 'Pengalaman Kerja'}
              {activeTab === 'ai' && 'Konfigurasi Gemini AI'}
              {activeTab === 'account' && 'Pengaturan Akun'}
            </h1>
            <p className="text-[11px] text-zinc-500">
              Perubahan yang Anda simpan langsung aktif pada website portofolio
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 hidden sm:inline">
              Login sebagai: <strong className="text-white font-mono">{adminUser}</strong>
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 p-[1.5px]">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-sky-400 text-xs">
                <i className="fas fa-user-shield" />
              </div>
            </div>
          </div>
        </header>

        {/* Tab Views */}
        <div className="p-8 flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { title: 'Total Project', count: projects.length, icon: 'fa-laptop-code', color: 'text-blue-400', tab: 'projects' },
                  { title: 'Sertifikat', count: certificates.length, icon: 'fa-certificate', color: 'text-sky-400', tab: 'certificates' },
                  { title: 'Pengalaman', count: experiences.length, icon: 'fa-briefcase', color: 'text-indigo-400', tab: 'experiences' },
                  { title: 'AI Assistant', count: getAiKey() ? 'Terhubung' : 'Belum Ada Key', icon: 'fa-robot', color: getAiKey() ? 'text-emerald-400' : 'text-amber-400', tab: 'ai' }
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveTab(stat.tab)}
                    className="p-5 rounded-2xl bg-zinc-950/60 border border-white/5 hover:border-sky-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-400">{stat.title}</span>
                      <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                        <i className={`fas ${stat.icon} text-xs`} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="font-syne font-bold text-2xl text-white">{stat.count}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="p-6 rounded-3xl bg-zinc-950/60 border border-white/5 space-y-4">
                <h3 className="font-syne font-bold text-sm text-white">Aksi Cepat</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      setActiveTab('projects');
                      setProjectModal({ open: true, isEdit: false, data: null });
                    }}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-colors flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                      <i className="fas fa-plus" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Tambah Project</h4>
                      <p className="text-[10px] text-zinc-500">Tampilkan karya terbaru</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('certificates');
                      setCertModal({ open: true, isEdit: false, data: null });
                    }}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-colors flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                      <i className="fas fa-award" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Tambah Sertifikat</h4>
                      <p className="text-[10px] text-zinc-500">Upload sertifikat baru</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('experiences');
                      setExpModal({ open: true, isEdit: false, data: null });
                    }}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-colors flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                      <i className="fas fa-building" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Tambah Pengalaman</h4>
                      <p className="text-[10px] text-zinc-500">Update riwayat karir</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-syne font-bold text-base text-white">Daftar Project Portofolio</h3>
                  <p className="text-xs text-zinc-400">Total {projects.length} project ditampilkan</p>
                </div>
                <button
                  onClick={() => setProjectModal({ open: true, isEdit: false, data: null })}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-syne font-bold text-xs shadow-lg shadow-sky-500/20 hover:opacity-95 flex items-center gap-2"
                >
                  <i className="fas fa-plus text-xs" />
                  <span>Tambah Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-5 rounded-2xl bg-zinc-950/60 border border-white/5 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-sky-400 border border-blue-500/20 uppercase">
                          {proj.category || 'Development'} • {proj.year || 2024}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setProjectModal({ open: true, isEdit: true, data: proj })}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-xs transition-colors"
                            title="Edit Project"
                          >
                            <i className="fas fa-pen-to-square" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus project "${proj.title}"?`)) {
                                deleteProject(proj.id);
                                showNotification('Project berhasil dihapus.');
                              }
                            }}
                            className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center text-xs transition-colors"
                            title="Hapus Project"
                          >
                            <i className="fas fa-trash-can" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-syne font-bold text-base text-white">{proj.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {typeof proj.description === 'object' ? proj.description.id : proj.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {proj.details?.stack && (
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">
                            {proj.details.stack}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-syne font-bold text-base text-white">Daftar Sertifikat</h3>
                  <p className="text-xs text-zinc-400">Total {certificates.length} sertifikat terpasang</p>
                </div>
                <button
                  onClick={() => setCertModal({ open: true, isEdit: false, data: null })}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-syne font-bold text-xs shadow-lg shadow-sky-500/20 hover:opacity-95 flex items-center gap-2"
                >
                  <i className="fas fa-plus text-xs" />
                  <span>Tambah Sertifikat</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {certificates.map((cert) => (
                  <div key={cert.id} className="rounded-2xl bg-zinc-950/60 border border-white/5 overflow-hidden flex flex-col justify-between">
                    <div className="aspect-[4/3] w-full bg-zinc-900 relative overflow-hidden">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const fileName = cert.image?.split('/').pop();
                          if (fileName && !e.target.dataset.triedFallback) {
                            e.target.dataset.triedFallback = 'true';
                            e.target.src = '/' + fileName;
                          }
                        }}
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {cert.year}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-syne font-bold text-sm text-white line-clamp-2">{cert.title}</h4>
                        <p className="text-xs text-zinc-400 mt-1">{cert.issuer}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setCertModal({ open: true, isEdit: true, data: cert })}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-300 transition-colors flex items-center gap-1.5"
                        >
                          <i className="fas fa-edit" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus sertifikat "${cert.title}"?`)) {
                              deleteCertificate(cert.id);
                              showNotification('Sertifikat berhasil dihapus.');
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 transition-colors flex items-center gap-1.5"
                        >
                          <i className="fas fa-trash" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCES */}
          {activeTab === 'experiences' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-syne font-bold text-base text-white">Riwayat Pengalaman Kerja</h3>
                  <p className="text-xs text-zinc-400">Total {experiences.length} riwayat pekerjaan</p>
                </div>
                <button
                  onClick={() => setExpModal({ open: true, isEdit: false, data: null })}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-syne font-bold text-xs shadow-lg shadow-sky-500/20 hover:opacity-95 flex items-center gap-2"
                >
                  <i className="fas fa-plus text-xs" />
                  <span>Tambah Pengalaman</span>
                </button>
              </div>

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-5 rounded-2xl bg-zinc-950/60 border border-white/5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-syne font-bold text-sm text-white">{exp.role}</h4>
                        <span className="text-xs text-blue-400 font-semibold">• {exp.company}</span>
                      </div>
                      <span className="inline-block text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">
                        {exp.date}
                      </span>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-light">
                        {exp.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-start">
                      <button
                        onClick={() => setExpModal({ open: true, isEdit: true, data: exp })}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 flex items-center justify-center text-xs transition-colors"
                        title="Edit Pengalaman"
                      >
                        <i className="fas fa-edit" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus pengalaman di "${exp.company}"?`)) {
                            deleteExperience(exp.id);
                            showNotification('Pengalaman kerja berhasil dihapus.');
                          }
                        }}
                        className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center text-xs transition-colors"
                        title="Hapus Pengalaman"
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GEMINI AI KEY */}
          {activeTab === 'ai' && (
            <div className="max-w-2xl space-y-6 animate-fade-in">
              <div className="p-6 rounded-3xl bg-zinc-950/60 border border-white/5 space-y-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                      <i className="fas fa-robot text-sm" />
                    </div>
                    <h3 className="font-syne font-bold text-base text-white">Google Gemini API Key</h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Kunci ini digunakan oleh Chatbot AI Assistant untuk menjawab pertanyaan seputar portofolio dan proyek Anda.
                  </p>
                </div>

                <form onSubmit={handleSaveAi} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-2">API Key</label>
                    <div className="relative">
                      <input
                        type={showAiKey ? 'text' : 'password'}
                        value={currentAiKey}
                        onChange={(e) => setCurrentAiKey(e.target.value)}
                        placeholder="Tempel Gemini API Key di sini (contoh: AIzaSy...)"
                        className="w-full pl-4 pr-12 py-3 bg-zinc-900 border border-zinc-800 focus:border-sky-500 rounded-xl text-xs text-white font-mono focus:outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAiKey(!showAiKey)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-white text-xs transition-colors"
                      >
                        <i className={`fas ${showAiKey ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-syne font-bold text-xs shadow-lg shadow-sky-500/20 hover:opacity-95 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <i className="fas fa-save" />
                      <span>Simpan Kunci API</span>
                    </button>

                    <button
                      type="button"
                      disabled={isTestingAi}
                      onClick={handleTestAi}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sky-400 border border-sky-500/20 font-semibold text-xs active:scale-95 transition-all flex items-center gap-2"
                    >
                      {isTestingAi ? (
                        <>
                          <i className="fas fa-spinner fa-spin" />
                          <span>Menguji Koneksi...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-bolt" />
                          <span>Uji Koneksi Gemini AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* AI Connection Test Result Badge */}
                {aiTestStatus && (
                  <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 animate-fade-in ${
                    aiTestStatus.success
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-950/40 border-red-500/30 text-red-300'
                  }`}>
                    <i className={`fas ${aiTestStatus.success ? 'fa-circle-check text-emerald-400' : 'fa-triangle-exclamation text-red-400'} mt-0.5`} />
                    <div className="flex-1">
                      <p className="font-semibold">{aiTestStatus.success ? 'Berhasil' : 'Peringatan'}</p>
                      <p className="mt-0.5 opacity-90 leading-relaxed">{aiTestStatus.message}</p>
                    </div>
                  </div>
                )}

                {aiSaveSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                    <i className="fas fa-check" />
                    <span>API Key berhasil disimpan dan langsung aktif di Chatbot!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: ACCOUNT & SYSTEM SETTINGS */}
          {activeTab === 'account' && (
            <div className="max-w-2xl space-y-6 animate-fade-in">
              {/* Credentials Card */}
              <div className="p-6 rounded-3xl bg-zinc-950/60 border border-white/5 space-y-5">
                <div>
                  <h3 className="font-syne font-bold text-base text-white">Akun Login Admin</h3>
                  <p className="text-xs text-zinc-400">Ubah username atau password dashboard Anda</p>
                </div>

                {accountMsg && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    accountMsg.type === 'success'
                      ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                      : 'bg-red-950/40 border border-red-500/30 text-red-300'
                  }`}>
                    <i className={`fas ${accountMsg.type === 'success' ? 'fa-check' : 'fa-circle-exclamation'}`} />
                    <span>{accountMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleSaveAccount} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Username Baru</label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-sky-500 rounded-xl text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Password Baru</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Masukkan password baru..."
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-sky-500 rounded-xl text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-syne font-bold text-xs hover:opacity-95 active:scale-95 transition-all"
                  >
                    Simpan Perubahan Akun
                  </button>
                </form>
              </div>

              {/* Reset System Card */}
              <div className="p-6 rounded-3xl bg-red-950/20 border border-red-500/20 space-y-3">
                <h4 className="font-syne font-bold text-sm text-red-400">Reset Semua Konten ke Bawaan</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  Tindakan ini akan mengembalikan seluruh data Project, Sertifikat, dan Pengalaman ke data bawaan awal.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Apakah Anda yakin ingin me-reset seluruh konten kembali ke data bawaan awal?')) {
                      resetToDefaults();
                      showNotification('Seluruh data berhasil di-reset ke data bawaan.');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold transition-colors"
                >
                  Reset Konten ke Bawaan
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL 1: ADD / EDIT PROJECT */}
      {projectModal.open && (
        <ProjectEditModal
          isOpen={projectModal.open}
          isEdit={projectModal.isEdit}
          initialData={projectModal.data}
          onClose={() => setProjectModal({ open: false, isEdit: false, data: null })}
          onSave={(data) => {
            if (projectModal.isEdit) {
              updateProject(projectModal.data.id, data);
              showNotification('Project berhasil diperbarui!');
            } else {
              addProject(data);
              showNotification('Project baru berhasil ditambahkan!');
            }
            setProjectModal({ open: false, isEdit: false, data: null });
          }}
        />
      )}

      {/* MODAL 2: ADD / EDIT CERTIFICATE */}
      {certModal.open && (
        <CertEditModal
          isOpen={certModal.open}
          isEdit={certModal.isEdit}
          initialData={certModal.data}
          onClose={() => setCertModal({ open: false, isEdit: false, data: null })}
          onSave={(data) => {
            if (certModal.isEdit) {
              updateCertificate(certModal.data.id, data);
              showNotification('Sertifikat berhasil diperbarui!');
            } else {
              addCertificate(data);
              showNotification('Sertifikat baru berhasil ditambahkan!');
            }
            setCertModal({ open: false, isEdit: false, data: null });
          }}
          onUploadImage={handleImageFile}
        />
      )}

      {/* MODAL 3: ADD / EDIT EXPERIENCE */}
      {expModal.open && (
        <ExpEditModal
          isOpen={expModal.open}
          isEdit={expModal.isEdit}
          initialData={expModal.data}
          onClose={() => setExpModal({ open: false, isEdit: false, data: null })}
          onSave={(data) => {
            if (expModal.isEdit) {
              updateExperience(expModal.data.id, data);
              showNotification('Pengalaman berhasil diperbarui!');
            } else {
              addExperience(data);
              showNotification('Pengalaman baru berhasil ditambahkan!');
            }
            setExpModal({ open: false, isEdit: false, data: null });
          }}
        />
      )}
    </div>
  );
}

// Subcomponent: Project Edit Modal
function ProjectEditModal({ isOpen, isEdit, initialData, onClose, onSave }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || 'development');
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear());
  const [stack, setStack] = useState(initialData?.details?.stack || '');
  const [roles, setRoles] = useState(initialData?.details?.roles?.id || initialData?.details?.roles || 'Full-stack Developer');
  const [desc, setDesc] = useState(typeof initialData?.description === 'object' ? initialData.description.id : initialData?.description || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      category,
      year: parseInt(year, 10) || new Date().getFullYear(),
      subCategories: [category === 'development' ? 'Development' : 'Design'],
      gradientClass: category === 'development' ? 'from-blue-900/40 to-black' : 'from-indigo-900/40 to-black',
      tagColors: ['text-sky-400', 'text-blue-400'],
      description: { id: desc, en: desc },
      details: {
        category: { id: `${category} • ${year}`, en: `${category} • ${year}` },
        roles: { id: roles, en: roles },
        stack: stack,
        desc: { id: desc, en: desc },
        features: {
          id: ["Fitur unggulan interaktif", "Desain sepenuhnya responsif", "Performa tinggi"],
          en: ["Interactive features", "Fully responsive design", "High performance"]
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <h3 className="font-syne font-bold text-base text-white">
            {isEdit ? 'Edit Project' : 'Tambah Project Baru'}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-xs">
            <i className="fas fa-times" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Judul Project</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: AI Dashboard Analytics"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
              >
                <option value="development">Development</option>
                <option value="design">Design</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Tahun</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Tech Stack</label>
            <input
              type="text"
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              placeholder="Contoh: React, TailwindCSS, Node.js"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Peran Anda</label>
            <input
              type="text"
              value={roles}
              onChange={(e) => setRoles(e.target.value)}
              placeholder="Contoh: Lead Frontend Developer"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Deskripsi Singkat</label>
            <textarea
              rows={3}
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Jelaskan tujuan dan fungsi project ini..."
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="pt-3 border-t border-white/5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-syne font-bold hover:opacity-95"
            >
              Simpan Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Subcomponent: Certificate Edit Modal
function CertEditModal({ isOpen, isEdit, initialData, onClose, onSave, onUploadImage }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [issuer, setIssuer] = useState(initialData?.issuer || '');
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear().toString());
  const [image, setImage] = useState(initialData?.image || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      issuer,
      year,
      image: image || '/src/assets/certificate_python.png'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <h3 className="font-syne font-bold text-base text-white">
            {isEdit ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-xs">
            <i className="fas fa-times" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Nama Sertifikat</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Full-Stack JavaScript Developer"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Penerbit (Issuer)</label>
              <input
                type="text"
                required
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="Contoh: Dicoding / IBM"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Tahun</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Gambar Sertifikat (Upload atau URL)</label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onUploadImage(e, (base64) => setImage(base64))}
                className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-500/10 file:text-sky-400 hover:file:bg-sky-500/20 cursor-pointer"
              />
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Atau masukkan URL gambar /src/assets/..."
                className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none text-[11px]"
              />
            </div>

            {image && (
              <div className="mt-2 aspect-[4/3] w-28 rounded-lg overflow-hidden border border-white/10 bg-zinc-900">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-syne font-bold hover:opacity-95"
            >
              Simpan Sertifikat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Subcomponent: Experience Edit Modal
function ExpEditModal({ isOpen, isEdit, initialData, onClose, onSave }) {
  const [role, setRole] = useState(initialData?.role || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [description, setDescription] = useState(initialData?.description || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      role,
      company,
      date,
      description
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <h3 className="font-syne font-bold text-base text-white">
            {isEdit ? 'Edit Pengalaman Kerja' : 'Tambah Pengalaman Kerja'}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-xs">
            <i className="fas fa-times" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Posisi / Peran (Role)</label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Contoh: Senior Frontend Developer"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Perusahaan / Organisasi</label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Contoh: PT Teknologi Indonesia"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Periode Waktu</label>
            <input
              type="text"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Contoh: Januari 2024 — Sekarang"
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-semibold mb-1">Deskripsi Tanggung Jawab</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan peran dan pencapaian Anda..."
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="pt-3 border-t border-white/5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-syne font-bold hover:opacity-95"
            >
              Simpan Pengalaman
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
