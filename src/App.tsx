import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, Copy, Check, Sword, Zap, RefreshCw, Settings, Info, Download } from 'lucide-react';

const CUTTING_PATHS = [
  "1 garis vertikal tengah",
  "diagonal kiri atas ke kanan bawah",
  "diagonal kanan atas ke kiri bawah",
  "horizontal tengah",
  "vertikal sedikit pinggir",
  "Kustom (Isi Sendiri)"
];

const SWORD_TYPES = [
  "Jepang — Katana, pedang samurai melengkung khas Jepang",
  "Jepang — Nodachi, pedang samurai sangat panjang",
  "Inggris — Longsword, pedang panjang era abad pertengahan Eropa",
  "Skotlandia — Claymore, pedang besar dua tangan khas Skotlandia",
  "Jerman — Zweihander, pedang dua tangan besar dari Jerman",
  "Tiongkok — Jian, pedang lurus khas Tiongkok kuno",
  "India — Talwar, pedang melengkung khas India"
];

const CAMERA_MODES = [
  "Video smartphone satu pengambilan tanpa jeda | Sudut pandang tepat dari atas (90°) | Resolusi 8K | Gaya realistis kamera smartphone | Zoom static (tidak ada zoom)",
  "Video smartphone satu pengambilan tanpa jeda | Sudut pandang tepat dari atas (90°) | Resolusi 8K | Gaya realistis kamera smartphone | Slow zoom in halus ke objek",
  "Video smartphone satu pengambilan tanpa jeda | Sudut pandang tepat dari atas (90°) | Resolusi 8K | Gaya realistis kamera smartphone | Slow zoom out halus dari objek",
  "Video smartphone satu pengambilan tanpa jeda | Sudut pandang tepat dari atas (90°) | Resolusi 8K | Gaya realistis kamera smartphone | Micro zoom in fokus ke garis potong",
  "Video smartphone satu pengambilan tanpa jeda | Sudut pandang tepat dari atas (90°) | Resolusi 8K | Gaya realistis kamera smartphone | Punch zoom cepat saat pedang menyentuh objek",
  "Video smartphone satu pengambilan tanpa jeda | Sudut pandang tepat dari atas (90°) | Resolusi 8K | Gaya realistis kamera smartphone | Dynamic zoom mengikuti gerakan pedang",
  "Video smartphone satu pengambilan tanpa jeda | Sudut pandang tepat dari atas (90°) | Resolusi 8K | Gaya realistis kamera smartphone | Zoom in bertahap dari wide ke close-up",
  "Video smartphone satu pengambilan tanpa jeda | Sudut pandang tepat dari atas (90°) | Resolusi 8K | Gaya realistis kamera smartphone | Zoom out setelah objek terbelah",
  "Video smartphone satu pengambilan tanpa jeda | Sudut pandang tepat dari atas (90°) | Resolusi 8K | Gaya realistis kamera smartphone | Cinematic slow zoom + slight shake realistis",
  "Video smartphone satu pengambilan tanpa jeda | Sudut pandang tepat dari atas (90°) | Resolusi 8K | Gaya realistis kamera smartphone | Ultra slow zoom ASMR fokus tekstur",
  "Video smartphone satu pengambilan tanpa jeda | Sudut pandang tepat dari atas (90°) | Resolusi 8K | Gaya realistis kamera smartphone",
  "Kamera drone statis | Overhead 90° vertikal | Resolusi 8K | Dokumenter tambang",
  "Kamera CCTV industri | Top-down 90° | Resolusi 8K | Tampilan pengawasan",
  "Kamera smartphone low angle | Sudut 25° dari bawah | Resolusi 8K | Dramatis skala besar alat berat",
  "Kamera handheld | Sudut 45° diagonal | Resolusi 8K | Realisme dokumenter",
  "Kamera eye-level | Sudut 0° sejajar objek | Resolusi 8K | Perspektif manusia",
  "Kamera drone miring | Sudut 60° | Resolusi 8K | View area tambang luas",
  "Kamera close-up miring | Sudut 30° | Resolusi 8K | Fokus detail tekstur",
  "Kamera cinematic tracking | Sudut 15° | Resolusi 8K | Depth dramatis",
  "Kamera wide landscape | Sudut 35° | Resolusi 8K | Menampilkan lingkungan",
  "Kamera ultra close-up | Sudut 10° | Resolusi 8K | Detail ekstrim material",
  "Kamera macro industrial | Sudut 20° | Resolusi 8K | Fokus tekstur debu dan baja",
  "Kamera action cam | Sudut 70° | Resolusi 8K | Perspektif dinamis",
  "Kamera crane cinematic | Sudut 50° | Resolusi 8K | Gerakan halus",
  "Kamera FPV drone | Sudut 40° | Resolusi 8K | Imersif dan cepat",
  "Kamera stabilizer cinematic | Sudut 30° | Resolusi 8K | Smooth movement",
  "Kamera dokumenter tambang | Sudut 55° | Resolusi 8K | Natural lighting",
  "Kamera industrial inspection | Sudut 80° | Resolusi 8K | Semi-overhead teknis",
  "Kamera wide cinematic | Sudut 25° | Resolusi 8K | Dramatic composition",
  "Kamera realistic ASMR | Sudut 35° | Resolusi 8K | Fokus proses"
];

const LOCATIONS = [
  "Auto (Berdasarkan Objek)",
  "workshop baja realistis",
  "workshop tambang gelap",
  "scrapyard indoor",
  "yard industri outdoor",
  "gudang gelap berkabut",
  "Kustom (Isi Sendiri)"
];

const BACKGROUNDS = [
  "Auto (Berdasarkan Lokasi)",
  "rak pipa, rak baja, peralatan alat berat terparkir, klem, kabel, roller support",
  "percikan api di kejauhan, bayangan mesin berat, kipas industri besar",
  "tumpukan logam berkarat, derek tua, sinar matahari berdebu",
  "pilar beton, pantulan lantai basah, lampu peringatan menyala",
  "gudang raksasa dengan deretan kontainer, forklift lalu lalang, pencahayaan fluoresen redup",
  "pabrik peleburan dengan cahaya oranye panas, tungku menyala di kejauhan, asap tipis",
  "workshop mekanik pesawat dengan alat berat, sayap logam menyilaukan, lantai epoksi bersih",
  "situs konstruksi bawah tanah, bebatuan kasar, alat pengeboran raksasa, lampu proyek",
  "fasilitas perakitan otomotif robotik, lengan robot presisi, conveyor belt berjalan lambat",
  "galangan kapal dengan lambung kapal raksasa, scaffolding tinggi, tali baja bertebaran",
  "Kustom (Isi Sendiri)"
];

const WORKERS = [
  "Auto (Berdasarkan Lokasi)",
  "3 pekerja di kejauhan memakai helm dan rompi safety",
  "2 tukang las di kejauhan dengan percikan las",
  "1 operator forklift memindahkan barang jauh di belakang",
  "Tanpa pekerja, area kosong",
  "beberapa pekerja menggunakan gerinda memercikkan bunga api",
  "tim inspeksi 4 orang menunjuk pada cetak biru dengan senter",
  "pekerja pembersih menyemprotkan air di lantai logam jauh di belakang",
  "teknisi mengecat lambung besi tinggi menggunakan crane",
  "penjaga keamanan berpatroli perlahan dengan senter di area gelap",
  "Kustom (Isi Sendiri)"
];

interface Suggestions {
  sizeInfo: string;
  material: string;
  surfaceCondition: string;
  location: string;
  sound: string;
  cuttingBehavior: string;
  debris: string;
}

interface FinalOutput {
  finalEnglishPrompt: string;
  indonesianPrompt: string;
  negativePrompt: string;
  cameraRules: string;
  objectRules: string;
  cuttingRules: string;
  asmrSoundRules: string;
}

export default function App() {
  const [objectName, setObjectName] = useState('');
  const [objectDetails, setObjectDetails] = useState('');
  const [swordType, setSwordType] = useState(SWORD_TYPES[0]);
  const [cuttingPath, setCuttingPath] = useState(CUTTING_PATHS[0]);
  const [cameraMode, setCameraMode] = useState(CAMERA_MODES[0]);
  const [locationTheme, setLocationTheme] = useState(LOCATIONS[0]);
  const [backgroundTheme, setBackgroundTheme] = useState(BACKGROUNDS[0]);
  const [workers, setWorkers] = useState(WORKERS[0]);
  
  const [customCuttingPath, setCustomCuttingPath] = useState('');
  const [customLocationTheme, setCustomLocationTheme] = useState('');
  const [customBackgroundTheme, setCustomBackgroundTheme] = useState('');
  const [customWorkers, setCustomWorkers] = useState('');
  
  // 1: input, 2: loading suggestions, 3: review suggestions, 4: loading final, 5: final prompt
  const [step, setStep] = useState<number>(1);
  
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [finalOutput, setFinalOutput] = useState<FinalOutput | null>(null);
  const [promptHistory, setPromptHistory] = useState<FinalOutput[]>([]);

  const [errorInfo, setErrorInfo] = useState('');

  const parseJSON = (text: string) => {
    try {
      // Cari blok JSON di dalam teks menggunakan regex, untuk menghindari teks tambahan dari AI
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
      // Fallback pembersihan markdown biasa
      const cleaned = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed to parse JSON", e, text);
      return null;
    }
  };

  const handleAnalisa = async () => {
    if (!objectName.trim()) return;
    setStep(2);
    setErrorInfo('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Gunakan Bahasa Indonesia. Analisa detail objek industri "${objectName}" ${objectDetails ? `dengan deskripsi: "${objectDetails}"` : ''} untuk konten video "Industrial ASMR Cutting". 
      Kembalikan HANYA JSON dengan properti berikut (jangan gunakan format markdown, langsung JSON string):
      "sizeInfo", "material", "surfaceCondition", "location", "sound", "cuttingBehavior", "debris".`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });
      
      const data = parseJSON(response.text);
      if (data) {
        setSuggestions(data);
        setStep(3);
      } else {
        throw new Error("Gagal parsing hasil AI.");
      }
    } catch (error: any) {
      console.error(error);
      setErrorInfo(error.message || 'Terjadi kesalahan saat analisa. Coba lagi.');
      setStep(1);
    }
  };

  const handleEksekusi = async () => {
    setStep(4);
    setErrorInfo('');

    const finalCuttingPath = cuttingPath === "Kustom (Isi Sendiri)" ? customCuttingPath : cuttingPath;
    const finalLocationTheme = locationTheme === "Kustom (Isi Sendiri)" ? customLocationTheme : locationTheme;
    const finalBackgroundTheme = backgroundTheme === "Kustom (Isi Sendiri)" ? customBackgroundTheme : backgroundTheme;
    const finalWorkers = workers === "Kustom (Isi Sendiri)" ? customWorkers : workers;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Tugas: Buat Final Video Prompt ASMR Industrial Ultra-Realistic.
      Gunakan template berikut untuk 'finalEnglishPrompt', ganti bagian dalam tanda kurung kotak [...] dengan deskripsi yang sangat detail (gabungan Inggris dan Indonesia seperti contoh) sesuai dengan analisis objek "${objectName}" ${objectDetails ? `dan detail: "${objectDetails}"` : ''}.

      TEMPLATE 'finalEnglishPrompt':
      Use the supplied object image as the exact object reference and the supplied portrait image as the identity reference for the only main actor.

      Create an 8-second ultra-realistic industrial ASMR video, vertical 9:16, filmed like authentic smartphone footage. One continuous take only. No cuts, no transitions, no edits.

      CAMERA:
      [Terjemahkan bagian ini sesuai gaya prompt AI video Inggris: ${cameraMode}], object dominates the foreground, actor appears lower and farther behind the object. Object centered for the entire shot. Locked focus, exposure, and white balance.

      ACTOR:
      Only one main actor performs the cut. The actor wears authentic real leather work gloves on both hands. The actor face must NOT be the main focus; only arms, gloves, and partial torso dominate the action. Exactly TWO hands only, one left hand and one right hand only. No duplicate fingers, no extra arms, no cloned gloves, no mirrored hands. The object is extremely close to the camera and dominates the foreground. The actor stands farther behind the object, appearing lower and smaller with realistic depth compression.

      OBJECT:
      [Isi dengan deskripsi Inggris dan Indonesia yang sangat detail tentang ${objectName}. Sertakan detail ketebalan, bobot ekstrem, permukaan, tekstur, dan visual density berdasarkan: ${suggestions?.sizeInfo}, ${suggestions?.material}, ${suggestions?.surfaceCondition}. Akhiri dengan: The object remains perfectly intact before contact. No pre-cut line, no crack, no dent, no flex, no deformation, no hidden seam.]

      LOCATION:
      [Isi dengan deskripsi lokasi industrial yg cocok dalam bhs Inggris berdasarkan: ${finalLocationTheme !== 'Auto (Berdasarkan Objek)' ? finalLocationTheme : `analisis AI (${suggestions?.location})`}]

      BACKGROUND:
      [Isi dengan deskripsi background yg cocok dalam bhs Inggris yang berisi detail alat berikut: ${finalBackgroundTheme !== 'Auto (Berdasarkan Lokasi)' ? finalBackgroundTheme : 'sesuaikan dengan lokasi'}. Dan pekerja: ${finalWorkers !== 'Auto (Berdasarkan Lokasi)' ? finalWorkers : 'pekerja jauh'}. Akhiri dengan: Background stays alive but controlled, slightly blurred by depth, never interfering with the main action, never changing layout.]

      ACTION:
      A very sharp LONG REALISTIC FULL-LENGTH [Terjemahkan jenis pedang ini ke bhs Inggris: ${swordType}] with visible metal blade, realistic steel reflections, authentic handle grip, and physically continuous blade enters from the top center and follows this exact cut path: [TERJEMAHKAN KE INGGRIS jalur tebasan ini: ${finalCuttingPath}]. The weapon must remain fully visible during the entire cut and must NEVER disappear, fade, bend, deform, shorten, or become transparent. One slash only. No zigzag, no curve, no teleport, no jump, no reset, no second cut line.

      CRITICAL TIMING:
      The object shows absolutely no change before the blade touches it. The cut appears only at the exact first frame of blade contact and only along the active live blade path. Untouched areas remain fully intact.

      CUT RESULT:
      Impossible but believable physics. The cut must feel extremely difficult due to the physical thickness and density. One perfectly straight slash with instant clean separation and no secondary fracture. The object splits cleanly into TWO realistic heavy halves after the blade passes through the selected path.

      CUT BEHAVIOR:
      The cutting process is extremely slow, dense, heavy, and mechanically difficult. The material shows immense resistance and internal stress during separation. No sparks, no fire, no glowing particles, no molten metal, no plasma effects, no heat waves, no electric arc, no energy effects, no light streaks. The separation is driven purely by extreme sharpness, pressure, force, and mechanical precision. The cut surface appears cold, rough, dense, mechanically separated, industrial, and physically believable. [Tambahkan detail spesifik material dlm bhs Inggris berdasarkan: ${suggestions?.cuttingBehavior} TANPA melanggar aturan NO SPARKS/FIRE].

      DEBRIS:
      Minimal cold heavy dust and tiny dense particles only. No sparks, no glowing debris, no molten droplets, no fire particles, no smoke explosion, no energy burst, no burning fragments. [Tambahkan karakter serpihan spesifik dlm bhs Inggris berdasarkan: ${suggestions?.debris}].

      ASMR AUDIO:
      No hook. Start with steady cold industrial ambience only.
      PRE-CONTACT: subtle blade air movement, cloth rustle, and distant industrial ambience.
      CONTACT: Deep heavy metallic grinding, dense pressure resonance, low-frequency material stress, industrial scraping, heavy mechanical resistance, thick friction, realistic resonance. No spark sizzling, no plasma sounds, no fire sounds, no electric sounds, no sci-fi effects. [Tambahkan deskripsi audio kontak dlm bhs Inggris berdasarkan: ${suggestions?.sound}].
      POST-CUT: soft pressure release, small debris falling, heavy object settling with weight.
      No music, no voice.

      VISUAL STYLE:
      Ultra realistic industrial ASMR, genuine smartphone realism, natural industrial lighting, believable mass, detailed texture, not CGI, not stylized, not cartoon.

      === END TEMPLATE ===

      Buat output JSON dengan key berikut:
      "finalEnglishPrompt" -> String Prompt final sesuai template di atas secara utuh.
      "indonesianPrompt" -> Terjemahan dari objek dan action.
      "negativePrompt" -> "NO SPARKS, NO FIRE, NO GLOWING PARTICLES, NO MOLTEN METAL, NO PLASMA, NO ELECTRIC ARC, NO ENERGY EFFECTS, NO LIGHT STREAKS, NO CGI PARTICLES, NO EXPLOSION, NO FIREWORK SPARKS, NO BURNING EFFECTS, katana hilang, pedang transparan, bilah putus, pedang memendek, pedang bengkok, pedang berubah bentuk, katana patah, kartun, anime, stylized, tampilan CGI, render 3D palsu, grafis game, pedang bercahaya, efek energi, laser, pedang api, ledakan, percikan berlebihan, tepi meleleh, garis potong awal, retakan awal, kerusakan sebelum kontak, deformasi sebelum menyentuh, perubahan bentuk objek, diameter berubah, banyak aktor utama, tangan tambahan, tangan dobel, pedang dobel, tebasan kedua, garis potong kedua, gerakan zigzag, potongan melengkung, pedang teleport, jump cut, reset gerakan, kamera goyang, pan, tilt, zoom, reframing, perubahan exposure, perubahan warna, glitch, background berubah, pekerja mengganggu, watermark, logo, subtitle, musik, voice-over, ember, efek las"
      "cameraRules" -> "- Rasio 9:16, durasi 8 detik\\n- Satu pengambilan tanpa cut\\n- Mode kamera: ${cameraMode}\\n- Objek dominan di foreground"
      "objectRules" -> "- Objek utuh sebelum terkena pedang\\n- Tidak ada garis potong atau retakan awal\\n- Bentuk dan tekstur tetap konsisten\\n- Bagian yang belum tersentuh tetap utuh"
      "cuttingRules" -> "- 1 aktor, 1 senjata, 1 tebasan\\n- Senjata yang digunakan: ${swordType}\\n- Jalur pedang mengikuti preset dropdown\\n- Pedang bergerak mengikuti arah: ${finalCuttingPath}\\n- Potongan muncul hanya saat kontak\\n- Senjata harus tetap terlihat dan tidak boleh hilang\\n- Hasil akhir: terbelah dua secara realistis\\n- Potongan bersih dan halus tanpa percikan api, ledakan, efek las, atau efek terbakar. Gunakan material dingin natural."
      "asmrSoundRules" -> "- Ambience industrial dingin\\n- Pre-contact: udara bilah + ambience\\n- Saat kontak: [ISI DESKRIPSI SUARA ASMR AUTENTIK KHUSUS ${objectName} BERDASARKAN ${suggestions?.sound}]\\n- Setelah: pelepasan tekanan + debris jatuh + settling berat\\n- Tanpa musik, tanpa suara manusia"
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });
      
      const data = parseJSON(response.text);
      if (data) {
        setFinalOutput(data);
        setPromptHistory((prev) => [data, ...prev].slice(0, 5));
        setStep(5);
      } else {
         throw new Error("Gagal membangun Final Prompt.");
      }
    } catch (error: any) {
      console.error(error);
      setErrorInfo(error.message || 'Terjadi kesalahan saat generating final prompt. Coba lagi.');
      setStep(3);
    }
  };

  const handleReset = () => {
    setStep(1);
    setObjectName('');
    setObjectDetails('');
    setSwordType(SWORD_TYPES[0]);
    setSuggestions(null);
    setFinalOutput(null);
    setErrorInfo('');
    setCustomCuttingPath('');
    setCustomLocationTheme('');
    setCustomBackgroundTheme('');
    setCustomWorkers('');
  }

  const handleDownload = () => {
    if (!finalOutput) return;
    const text = `INDUSTRIAL ASMR PROMPT:
${finalOutput.finalEnglishPrompt}

INDONESIAN PROMPT:
${finalOutput.indonesianPrompt}

NEGATIVE PROMPT:
${finalOutput.negativePrompt}

CAMERA RULES:
${finalOutput.cameraRules}

OBJECT RULES:
${finalOutput.objectRules}

CUTTING RULES:
${finalOutput.cuttingRules}

SOUND RULES:
${finalOutput.asmrSoundRules}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ASMR_Industrial_Prompt_${objectName.substring(0, 10).replace(/ /g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stepText = (s: number) => {
    if(s === 1) return "Ketik Objek";
    if(s === 2 || s === 3) return "Analisis Material";
    if(s >= 4) return "Eksekusi Final";
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 selection:bg-amber-500/30 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between border-b border-zinc-900 pb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded flex justify-center items-center">
              <Sword className="text-amber-500" strokeWidth={1.5} size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Industrial ASMR</h1>
              <p className="text-sm text-zinc-500 uppercase tracking-widest mt-1">Prompt Generator Engine</p>
            </div>
          </div>

          <div className="flex space-x-2">
            {[1, 3, 5].map((st, i) => (
              <div key={i} className="flex items-center">
                <div className={`text-xs font-medium px-3 py-1.5 rounded ${step >= st ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-zinc-900 text-zinc-600 border border-transparent'}`}>
                  {stepText(st)}
                </div>
                {i < 2 && <div className={`w-4 h-[1px] mx-1 ${step > st ? 'bg-amber-500/50' : 'bg-zinc-800'}`} />}
              </div>
            ))}
          </div>
        </header>

        {errorInfo && (
           <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-3">
             <Info size={16} /> {errorInfo}
           </div>
        )}

        {/* State Container */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: INITIAL INPUT */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-2xl"
              >
                <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg mb-6">
                  <h1 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">⚔️ Heavy Industrial ASMR Object Pack</h1>
                  <p className="text-zinc-400 text-center font-medium italic mb-4">*Designed for Extreme Cutting Content Creators*</p>
                  <p className="text-sm text-zinc-300 mb-4">
                    Dirancang untuk content creator AI cinematic dan penggiat ASMR industrial yang membuat adegan pemotongan objek ekstrem dengan efek visual melawan hukum fisika 🎬⚙️
                  </p>
                  <div className="text-xs text-zinc-500 border-t border-zinc-800 pt-4 mt-2">
                    <p className="mb-2"><strong>Cocok untuk:</strong> ASMR cutting, AI cinematic video, industrial destruction, heavy object slicing, physics-defying visuals.</p>
                    <p className="text-amber-600 font-semibold">Perfect for: AI Video Creators • Industrial ASMR Artists • Prompt Engineers • Cinematic Physics Creators</p>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg mb-6">
                  <h3 className="text-amber-500 font-bold flex items-center gap-2 mb-2">
                    <Info size={16} /> Cara Penggunaan
                  </h3>
                  <ol className="text-sm text-zinc-300 space-y-1 list-decimal list-inside">
                    <li>Siapkan foto profil sebagai karakter utama.</li>
                    <li>Nanti saat menggunakan prompt ini di AI Video Generator (veo3.1 fast, kalo mau akurat), unggah foto tersebut sebagai referensi.</li>
                    <li>Sebutkan nama objek dan atur settingan di bawah ini.</li>
                    <li>Klik 'Analisis Material' untuk generate teknis.</li>
                    <li>Klik tombol panah bawah (Download) untuk mengunduh hasil prompt dalam format .txt.</li>
                  </ol>
                </div>

                <div className="mb-6">
                  <h2 className="text-2xl text-white font-semibold flex items-center gap-2">
                    Siapkan Mesinmu
                  </h2>
                  <p className="text-zinc-400 mt-1">
                    Sebutkan objek industri yang keras, berat, menantang untuk katana Amran.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 uppercase tracking-widest px-1">Nama Objek Industri</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Pipa Beton Bertulang, Mesin V8 Utuh, Rantai Baja Raksasa..."
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none p-4 rounded text-white text-lg placeholder-zinc-700"
                      value={objectName}
                      onChange={(e) => setObjectName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAnalisa()}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 uppercase tracking-widest px-1">Detail Objek (Wajib diisi)</label>
                    <textarea 
                      placeholder="Contoh: Sangat berkarat parah, tebal dinding 50cm, tertutup jelaga hitam... (Wajib diisi)"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none p-4 rounded text-white text-sm placeholder-zinc-700 min-h-[100px] resize-y"
                      value={objectDetails}
                      onChange={(e) => setObjectDetails(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400 uppercase tracking-widest px-1">Jenis Pedang</label>
                      <select 
                        className="w-full bg-zinc-950 border border-zinc-800 outline-none p-4 rounded text-zinc-300 text-sm truncate"
                        value={swordType}
                        onChange={(e) => setSwordType(e.target.value)}
                        title={swordType}
                      >
                        {SWORD_TYPES.map(sword => (
                          <option key={sword} value={sword}>{sword}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400 uppercase tracking-widest px-1">Arah Jalur Tebasan</label>
                      <select 
                        className="w-full bg-zinc-950 border border-zinc-800 outline-none p-4 rounded text-zinc-300"
                        value={cuttingPath}
                        onChange={(e) => setCuttingPath(e.target.value)}
                      >
                        {CUTTING_PATHS.map(path => (
                          <option key={path} value={path}>{path}</option>
                        ))}
                      </select>
                      {cuttingPath === "Kustom (Isi Sendiri)" && (
                        <input 
                          type="text" 
                          placeholder="Isi custom arah jalur tebasan..." 
                          className="w-full bg-zinc-950 border border-amber-500/50 outline-none p-4 rounded text-zinc-200 mt-2"
                          value={customCuttingPath}
                          onChange={(e) => setCustomCuttingPath(e.target.value)}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400 uppercase tracking-widest px-1">Mode Kamera</label>
                      <select 
                        className="w-full bg-zinc-950 border border-zinc-800 outline-none p-4 rounded text-zinc-300 text-sm"
                        value={cameraMode}
                        onChange={(e) => setCameraMode(e.target.value)}
                        title={cameraMode}
                      >
                        {CAMERA_MODES.map(mode => (
                          <option key={mode} value={mode}>{mode}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400 uppercase tracking-widest px-1">Lokasi</label>
                      <select 
                        className="w-full bg-zinc-950 border border-zinc-800 outline-none p-4 rounded text-zinc-300 truncate"
                        value={locationTheme}
                        onChange={(e) => setLocationTheme(e.target.value)}
                      >
                        {LOCATIONS.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                      {locationTheme === "Kustom (Isi Sendiri)" && (
                        <input 
                          type="text" 
                          placeholder="Isi custom lokasi..." 
                          className="w-full bg-zinc-950 border border-amber-500/50 outline-none p-4 rounded text-zinc-200 mt-2"
                          value={customLocationTheme}
                          onChange={(e) => setCustomLocationTheme(e.target.value)}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400 uppercase tracking-widest px-1">Latar Belakang</label>
                      <select 
                        className="w-full bg-zinc-950 border border-zinc-800 outline-none p-4 rounded text-zinc-300 truncate"
                        value={backgroundTheme}
                        onChange={(e) => setBackgroundTheme(e.target.value)}
                      >
                        {BACKGROUNDS.map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                      {backgroundTheme === "Kustom (Isi Sendiri)" && (
                        <input 
                          type="text" 
                          placeholder="Isi custom detail latar belakang..." 
                          className="w-full bg-zinc-950 border border-amber-500/50 outline-none p-4 rounded text-zinc-200 mt-2"
                          value={customBackgroundTheme}
                          onChange={(e) => setCustomBackgroundTheme(e.target.value)}
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400 uppercase tracking-widest px-1">Pekerja Latar Belakang</label>
                      <select 
                        className="w-full bg-zinc-950 border border-zinc-800 outline-none p-4 rounded text-zinc-300 truncate"
                        value={workers}
                        onChange={(e) => setWorkers(e.target.value)}
                      >
                        {WORKERS.map(worker => (
                          <option key={worker} value={worker}>{worker}</option>
                        ))}
                      </select>
                      {workers === "Kustom (Isi Sendiri)" && (
                        <input 
                          type="text" 
                          placeholder="Isi custom pekerja latar belakang..." 
                          className="w-full bg-zinc-950 border border-amber-500/50 outline-none p-4 rounded text-zinc-200 mt-2"
                          value={customWorkers}
                          onChange={(e) => setCustomWorkers(e.target.value)}
                        />
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={handleAnalisa}
                    disabled={!objectName.trim() || !objectDetails.trim()}
                    className="w-full flex justify-center items-center gap-2 bg-white hover:bg-zinc-200 text-black py-4 rounded font-bold transition-all disabled:opacity-50 disabled:hover:bg-white"
                  >
                    <Sparkles size={18} />
                    Analisis Material (Pre-Cut)
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 & 4: LOADINGS */}
            {(step === 2 || step === 4) && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-64 flex flex-col items-center justify-center space-y-4"
              >
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <p className="text-zinc-400">
                  {step === 2 ? 'Sistem AI sedang menganalisis kerapatan material...' : 'Menempa instruksi final scene video...'}
                </p>
              </motion.div>
            )}

            {/* STEP 3: REVIEW SUGGESTIONS */}
            {step === 3 && suggestions && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
                  
                  <h2 className="text-2xl text-white font-semibold flex items-center gap-3 mb-6">
                    <Settings className="text-amber-500" />
                    Analisis Sistem: {objectName}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SuggestionCard title="Ukuran & Bentuk" content={suggestions.sizeInfo} />
                    <SuggestionCard title="Analogi Material" content={suggestions.material} />
                    <SuggestionCard title="Kondisi Permukaan" content={suggestions.surfaceCondition} />
                    <SuggestionCard title="Lingkungan / Lokasi" content={suggestions.location} />
                    <SuggestionCard title="Karakter Suara" content={suggestions.sound} />
                    <SuggestionCard title="Perilaku Potong" content={suggestions.cuttingBehavior} />
                    <SuggestionCard title="Serpihan/Debris" content={suggestions.debris} className="md:col-span-2" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 border border-zinc-800 hover:bg-zinc-900 rounded font-medium text-zinc-400 transition-all flex items-center justify-center gap-2"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleEksekusi}
                    className="flex-2 w-full py-4 bg-amber-500 hover:bg-amber-400 text-black rounded font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Zap size={18} />
                    GAS! EKSEKUSI.
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: FINAL OUTPUT */}
            {step === 5 && finalOutput && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded">
                  <div>
                    <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                       <Check size={20} /> Prompt Berhasil Dibuat
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">Siap di-copy ke AI Video Generator Anda.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleDownload} className="p-3 text-emerald-400 hover:text-white rounded border border-emerald-900 hover:bg-emerald-900 transition-colors" title="Download Text">
                      <Download size={18} />
                    </button>
                    <button onClick={handleReset} className="p-3 text-zinc-400 hover:text-white rounded border border-zinc-800 hover:bg-zinc-800 transition-colors">
                      <RefreshCw size={18} />
                    </button>
                  </div>
                </div>

                {/* THE 7 SECTIONS */}
                <div className="space-y-4">
                  <OutputSection title="1. FINAL ENGLISH VIDEO PROMPT" text={finalOutput.finalEnglishPrompt} highlight />
                  <OutputSection title="2. PROMPT BAHASA INDONESIA" text={finalOutput.indonesianPrompt} />
                  <OutputSection title="3. NEGATIVE PROMPT" text={finalOutput.negativePrompt} textClass="text-red-400 font-mono text-sm" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <OutputSection title="4. ATURAN KAMERA" text={finalOutput.cameraRules} noCopy />
                    <OutputSection title="5. ATURAN OBJEK" text={finalOutput.objectRules} noCopy />
                    <OutputSection title="6. ATURAN POTONG" text={finalOutput.cuttingRules} noCopy />
                    <OutputSection title="7. ATURAN SUARA ASMR" text={finalOutput.asmrSoundRules} noCopy />
                  </div>
                </div>

              </motion.div>
            )}
            
            {/* HISTORY AND TIPS SECTION */}
            <div className="mt-12 space-y-8 pt-8 border-t border-zinc-800">
               {/* Prompt History */}
               {promptHistory.length > 0 && (
                 <div>
                   <h3 className="text-lg font-bold text-white mb-4">Penyimpanan Riwayat (Prompt History)</h3>
                   <div className="space-y-2">
                     {promptHistory.map((item, i) => (
                       <div key={i} className="p-3 bg-zinc-900 border border-zinc-800 rounded text-sm text-zinc-400 truncate cursor-pointer hover:border-amber-500/50"
                        onClick={() => {setFinalOutput(item); setStep(5);}}>
                         {item.indonesianPrompt.substring(0, 50)}...
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {/* Tips Optimasi */}
               <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                 <h3 className="text-lg font-bold text-white mb-4">Tips Optimasi AI (Lanjutan)</h3>
                 <ul className="text-sm text-zinc-400 space-y-2 list-disc list-inside">
                   <li>Gunakan foto referensi objek yang pencahayaannya sesuai dengan lokasi target.</li>
                   <li>Untuk hasil ekstrem, tambahkan detail "extreme high-speed camera settings" di bagian camera rules.</li>
                   <li>Jika ada artifact, fokuskan pada penguatan Negative Prompt pada bagian visual style.</li>
                   <li>Jaga rasio aspek tetap 9:16 untuk konsistensi komposisi.</li>
                 </ul>
               </div>
            </div>
            
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// -- Helpers --

function SuggestionCard({ title, content, className = '' }: { title: string, content: string, className?: string }) {
  return (
    <div className={`p-4 bg-zinc-950 border border-zinc-800 rounded ${className}`}>
      <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-2">{title}</h3>
      <p className="text-zinc-300 text-sm leading-relaxed">{content}</p>
    </div>
  )
}

function OutputSection({ title, text, textClass = 'text-zinc-200', highlight = false, noCopy = false }: { title: string, text: string, textClass?: string, highlight?: boolean, noCopy?: boolean }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`border rounded ${highlight ? 'bg-amber-500/5 border-amber-500/20' : 'bg-zinc-900 border-zinc-800'}`}>
      <div className={`flex justify-between items-center px-4 py-3 border-b ${highlight ? 'border-amber-500/10' : 'border-zinc-800'}`}>
        <h3 className={`text-sm font-bold tracking-wide ${highlight ? 'text-amber-500' : 'text-zinc-400'}`}>{title}</h3>
        {!noCopy && (
          <button 
            onClick={handleCopy} 
            className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-white transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="p-4 overflow-x-auto">
        <p className={`whitespace-pre-wrap ${textClass} leading-relaxed`}>{text}</p>
      </div>
    </div>
  )
}
