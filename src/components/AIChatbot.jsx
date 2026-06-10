import { useState, useEffect, useRef } from 'react';

const systemPrompt = `Anda adalah Asisten AI Virtual resmi untuk Achmad Khoiri, seorang Software Engineer & UI/UX Designer berbakat.
Tugas Anda adalah membantu pengunjung portofolionya dengan menjawab pertanyaan tentang dirinya dengan ramah, profesional, ringkas, dan jelas. Gunakan Bahasa Indonesia yang sopan dan lugas.

Gunakan data berikut untuk menjawab pertanyaan:
- Nama: Achmad Khoiri (@achmad_khoiri)
- Peran: Software Engineer & UI/UX Specialist dengan pengalaman lebih dari 4 tahun.
- Lokasi saat ini: Indonesia.
- Pekerjaan Sekarang: Associate Software Engineer di OneShield Software (sejak Agustus 2022). Fokus pada pengembangan sistem arsitektur frontend web responsif, optimalisasi Angular, TypeScript, dan manajemen state. Berhasil memotong waktu pemuatan sistem sebesar 30%.
- Pengalaman Lainnya: Pendiri & Direktur Teknologi Komunitas "Design and Code" (sejak Januari 2021) dengan lebih dari 1000 anggota; Design Engineer di BlackboxAI (Feb - Mar 2025).
- Proyek-proyek Terpilih:
  1. Code Screenshot: Alat interaktif untuk mendesain, menyesuaikan, dan mengekspor cuplikan kode dengan gaya gradien kustom (React, Zustand, TailwindCSS).
  2. Snapalyzer AI: Sistem analitik gambar berbasis AI memanfaatkan Google Gemini API untuk analisis visual real-time (NextJS, TypeScript).
  3. Collabxweb: Ruang kolaborasi penulisan kode real-time menggunakan Firebase Realtime Sync.
  4. IndiCov Resource: Portal penanganan pandemi darurat di India, memenangkan MLH Hack At Home II (ReactJS, ChartJS).
- Hubungi: Kirim pesan lewat formulir di bagian bawah website, atau email ke akhoiri052@gmail.com.

Berikan jawaban yang ramah, berfokus pada potensi kolaborasi profesional, dan selalu tawarkan mereka untuk menghubungi atau merekrut Achmad untuk proyek digital mereka.`;

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('GEMINI_API_KEY') || '');
  const [inputKey, setInputKey] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Welcome message when opened first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: 'bot',
          text: 'Halo! Saya adalah Asisten AI Virtual Achmad. Ada yang bisa saya bantu untuk mengenalkannya lebih dekat kepada Anda? Silakan tanya mengenai proyek-proyeknya, keahlian rekayasa webnya, atau cara bekerja sama.'
        }
      ]);
    }
  }, [isOpen, messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowSettings(false);
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    const cleanKey = inputKey.trim();
    localStorage.setItem('GEMINI_API_KEY', cleanKey);
    setApiKey(cleanKey);
    setShowSettings(false);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('GEMINI_API_KEY');
    setApiKey('');
    setInputKey('');
    setShowSettings(false);
  };

  // Pre-fill input with key when settings is opened
  const handleOpenSettings = () => {
    setInputKey(apiKey);
    setShowSettings(true);
  };

  const appendMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const fetchGeminiResponse = async (userMessage, currentHistory) => {
    // Check if we have a manually entered API Key in local storage
    const localKey = apiKey.trim().replace(/^['"]|['"]$/g, '');

    // Check if we are running in localhost dev mode
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    let apiUrl = '';
    const headers = { 'Content-Type': 'application/json' };

    if (isLocalhost) {
      // Use the Vite development server proxy to hide the key from Network inspector
      apiUrl = '/api-gemini/v1beta/models/gemini-2.5-flash:generateContent';

      // If the user has entered a custom key in the settings panel, pass it in a header.
      // Otherwise, the proxy will fallback to the key in the server's `.env` automatically.
      if (localKey) {
        headers['x-local-api-key'] = localKey;
      }
    } else {
      // In production, make direct calls to Google Gemini
      const prodKey = localKey || import.meta.env.VITE_GEMINI_API_KEY || '';

      if (!prodKey) {
        return 'API Key Google Gemini belum dikonfigurasi! Silakan klik tombol ⚙️ (Pengaturan) di kanan atas jendela chat ini untuk memasukkan API Key Anda agar saya dapat membalas.';
      }

      apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
      // Pass key in a header instead of a URL query parameter to avoid exposing it in the URL when inspected
      headers['x-goog-api-key'] = prodKey.trim().replace(/^['"]|['"]$/g, '');
    }

    // Map history to Gemini API structure
    const contents = currentHistory.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      }
    };

    let attempt = 0;
    const maxAttempts = 3;
    let delay = 1000;

    while (attempt < maxAttempts) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          if (response.status === 400 || response.status === 403 || response.status === 401) {
            throw new Error('API Key Google Gemini tidak valid atau belum diatur. Silakan periksa file .env Anda atau masukkan kunci yang benar melalui tombol ⚙️ di kanan atas.');
          }
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, saya tidak dapat merumuskan jawaban saat ini.';
      } catch (error) {
        attempt++;
        if (attempt >= maxAttempts) {
          console.error('Gemini API call failed:', error);
          return error.message || 'Sistem asisten AI saya sedang mengalami gangguan koneksi. Silakan kirimkan penawaran Anda langsung melalui email ke achmadkhoiri@gmail.com agar Achmad dapat segera merespons Anda!';
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  };


  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    setInputText('');
    appendMessage('user', text);
    setIsTyping(true);

    // Capture history before appending
    const historySnapshot = [...messages];

    try {
      const response = await fetchGeminiResponse(text, historySnapshot);
      setIsTyping(false);
      appendMessage('bot', response);
    } catch (err) {
      setIsTyping(false);
      appendMessage('bot', 'Mohon maaf, koneksi asisten AI terputus sementara. Anda bisa bertanya kembali atau langsung mengirim pesan lewat formulir kontak!');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleSuggestedClick = (text) => {
    handleSendMessage(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* AI Chat Window Panel */}
      <div
        id="ai-chat-window"
        className={`w-[90vw] sm:w-[380px] h-[500px] rounded-3xl glass-card border border-white/10 flex flex-col shadow-2xl mb-4 overflow-hidden transform transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'
          }`}
      >
        {/* Panel Header */}
        <div className="p-4 bg-gradient-to-r from-purple-900/60 via-zinc-900/80 to-emerald-900/60 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-emerald-400 p-[1.5px]">
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-brandDark animate-pulse" />
              <div className="w-full h-full rounded-full bg-brandDark flex items-center justify-center">
                <i className="fas fa-robot text-xs text-emerald-400" />
              </div>
            </div>
            <div>
              <h4 className="font-syne font-bold text-xs text-white">Asisten AI Achmad</h4>
              <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-mono">Selalu Online</span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* <button
              onClick={showSettings ? () => setShowSettings(false) : handleOpenSettings}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              title="API Key Configuration"
            >
              <i className="fas fa-cog text-xs" />
            </button> */}

            <button
              onClick={toggleChat}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <i className="fas fa-times text-xs" />
            </button>
          </div>
        </div>

        {/* Panel Content (Conditional Settings vs Chat) */}
        {showSettings ? (
          <form onSubmit={handleSaveApiKey} className="flex-1 p-5 flex flex-col justify-between bg-zinc-950/90 text-xs">
            <div className="space-y-4">
              <div>
                <h4 className="font-syne font-bold text-sm text-white mb-1">Pengaturan API Key</h4>
                <p className="text-zinc-500 font-light leading-relaxed">
                  Asisten ini menggunakan model Google Gemini API. Masukkan API Key Anda di sini untuk mengaktifkan chatbot. Kunci ini disimpan secara aman hanya di browser Anda (local storage).
                </p>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1.5 font-semibold">Gemini API Key</label>
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder={apiKey ? "•••••••••••••••••••••••••••••" : "Masukkan API Key Anda..."}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg text-white focus:outline-none text-xs transition-colors"
                />
              </div>

              <div className="text-[10px] text-zinc-500 leading-normal">
                Belum punya API Key? Dapatkan gratis di{' '}
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  Google AI Studio <i className="fas fa-external-link-alt text-[8px]" />
                </a>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClearApiKey}
                className="flex-1 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-red-900/20 hover:text-red-400 text-zinc-400 font-bold transition-all text-[11px]"
              >
                Hapus Kunci
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-white text-black hover:bg-emerald-400 font-bold transition-all text-[11px]"
              >
                Simpan Kunci
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Chat History Panel */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin text-xs">
              {messages.map((msg, index) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl ${isUser
                        ? 'bg-gradient-to-r from-purple-600 to-emerald-500 text-white rounded-tr-none shadow-md'
                        : 'bg-zinc-900 border border-white/5 text-zinc-300 rounded-tl-none leading-relaxed'
                        }`}
                    >
                      <p className="whitespace-pre-line text-xs font-light">{msg.text}</p>
                    </div>
                  </div>
                );
              })}

              {/* Bot Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start items-center gap-1 bg-zinc-900 border border-white/5 w-16 px-3 py-2.5 rounded-2xl rounded-tl-none">
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full bounce-dot" />
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full bounce-dot" />
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full bounce-dot" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Banner */}
            <div className="px-3 py-2 border-t border-white/5 bg-zinc-950/30 flex flex-wrap gap-1.5">
              <button
                onClick={() => handleSuggestedClick('Apa saja proyek terbaik Achmad?')}
                className="px-2.5 py-1 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-full text-[10px] text-zinc-400 border border-white/5 transition-colors"
              >
                🚀 Proyek Unggulan
              </button>
              <button
                onClick={() => handleSuggestedClick('Teknologi apa saja yang ia kuasai?')}
                className="px-2.5 py-1 bg-white/5 hover:bg-purple-500/10 hover:text-purple-400 rounded-full text-[10px] text-zinc-400 border border-white/5 transition-colors"
              >
                💻 Keahlian Tech
              </button>
              <button
                onClick={() => handleSuggestedClick('Bagaimana cara berkolaborasi dengannya?')}
                className="px-2.5 py-1 bg-white/5 hover:bg-pink-500/10 hover:text-pink-400 rounded-full text-[10px] text-zinc-400 border border-white/5 transition-colors">
                ✉️ Kontak
              </button>
            </div>

            {/* Input Message Form */}
            <form onSubmit={handleFormSubmit} className="p-3 bg-zinc-950 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                autoComplete="off"
                required
                placeholder="Tanyakan sesuatu tentang Achmad..."
                className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-2xl text-xs text-white focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-2xl bg-white text-black hover:bg-emerald-400 transition-colors flex items-center justify-center active:scale-95 shadow-md"
              >
                <i className="fas fa-paper-plane text-xs" />
              </button>
            </form>
          </>
        )}
      </div>

      {/* Sticky floating trigger button */}
      <button
        onClick={toggleChat}
        className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-emerald-400 p-[2px] shadow-2xl transition-all duration-300 active:scale-95 group z-50"
        aria-label="Toggle AI Assistant Chat"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping -z-10 group-hover:opacity-100 opacity-60" />
        <div className="w-full h-full rounded-full bg-brandDark flex items-center justify-center group-hover:bg-brandDark/80 transition-colors">
          <i className={`fas text-lg transition-transform ${isOpen ? 'fa-times text-purple-400' : 'fa-comment-dots text-emerald-400 group-hover:scale-110'
            }`} />
        </div>
      </button>
    </div>
  );
}
