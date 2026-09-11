import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Dashboard from './Dashboard';
import { CheckCircle2, ChevronRight, Activity, Zap, FileText, Lock } from 'lucide-react';
// CLERK IMPORTS - Ye humari app ko secure karenge
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

// --- UI COMPONENTS ---
const InputField = ({ label, name, value, onChange, type = "number", placeholder }) => (
  <div className="relative group">
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">
      {label}
    </label>
    <input type={type} name={name} value={value} required onChange={onChange} placeholder={placeholder}
      className="w-full bg-slate-900/50 border border-slate-700 text-slate-100 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner placeholder:text-slate-600" />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="relative group">
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-400 transition-colors">
      {label}
    </label>
    <select name={name} value={value} onChange={onChange}
      className="w-full bg-slate-900/50 border border-slate-700 text-slate-100 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner appearance-none">
      {options.map((opt, i) => <option key={i} value={opt.value} className="bg-slate-900">{opt.label}</option>)}
    </select>
  </div>
);

// --- SECURE LOGIN SCREEN ---
const LoginLandingPage = () => (
  <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg bg-slate-800/40 backdrop-blur-2xl p-10 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none" />
      
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mx-auto mb-8 relative z-10">
        <Lock size={36} className="text-white" />
      </div>
      
      <h1 className="text-3xl font-black text-white mb-4 relative z-10">Enterprise Access Restricted</h1>
      <p className="text-slate-400 text-base mb-8 relative z-10">Authenticate to access the Placement Intelligence Dashboard and AI roadmap generator.</p>
      
      <div className="relative z-10">
        <SignInButton mode="modal">
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2">
            Continue with Secure Login <ChevronRight size={20} />
          </button>
        </SignInButton>
      </div>
    </motion.div>
  </div>
);

// --- MAIN PREDICTOR COMPONENT ---
function PredictorForm() {
  const [formData, setFormData] = useState({
    gender: '1', ssc_p: '', ssc_b: '0', hsc_p: '', hsc_b: '0',
    hsc_s: '2', degree_p: '', degree_t: '2', workex: '0',
    etest_p: '', specialisation: '0', mba_p: ''
  });
  
  const [resumeFile, setResumeFile] = useState(null);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [aiTips, setAiTips] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
  const handleFileChange = (e) => { setResumeFile(e.target.files[0]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setResult(null); setConfidence(null); setAiTips("");
    
    const submitData = new FormData();
    for (const key in formData) { submitData.append(key, formData[key]); }
    if (resumeFile) { submitData.append('resume', resumeFile); }

    try {
      const response = await axios.post('https://placementai-predictor-1.onrender.com/predict', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data.prediction);
      setConfidence(response.data.confidence_score);
      setAiTips(response.data.ai_recommendations);
    } catch (error) {
      console.error("API Error:", error); alert("Backend error.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-center">
      {/* ... (Baki form code same rahega) ... */}
      <div className="text-center mb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
          <Zap size={16} /> Powered by Gemini 3.6 Enterprise
        </motion.div>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-400 tracking-tight mb-4">
          Placement Intelligence Platform
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Upload your resume and academic metrics to generate a predictive placement analysis and hyper-personalized career roadmap.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-slate-800/40 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-[0_0_40px_-15px_rgba(59,130,246,0.2)] border border-slate-700/50 relative overflow-hidden">
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="mb-10 relative group">
            <input type="file" accept=".pdf" id="resume-upload" className="hidden" onChange={handleFileChange} />
            <label htmlFor="resume-upload" className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${resumeFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-600 hover:border-blue-500/50 hover:bg-blue-500/5 bg-slate-900/30'}`}>
              {resumeFile ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                  <CheckCircle2 size={48} className="text-emerald-400 mb-3" />
                  <span className="text-emerald-300 font-medium text-lg">{resumeFile.name}</span>
                  <span className="text-emerald-500/70 text-sm mt-1">Ready for AI Analysis</span>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FileText size={28} className="text-blue-400" />
                  </div>
                  <span className="text-slate-200 font-semibold text-lg mb-1">Upload Resume (PDF)</span>
                  <span className="text-slate-500 text-sm">Drag and drop or click to browse</span>
                </div>
              )}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField label="10th Score (%)" name="ssc_p" value={formData.ssc_p} onChange={handleChange} placeholder="e.g. 85.5" />
            <InputField label="12th Score (%)" name="hsc_p" value={formData.hsc_p} onChange={handleChange} placeholder="e.g. 80.0" />
            <InputField label="Degree Score (%)" name="degree_p" value={formData.degree_p} onChange={handleChange} placeholder="e.g. 75.0" />
            <InputField label="MBA Score (%)" name="mba_p" value={formData.mba_p} onChange={handleChange} placeholder="e.g. 65.5" />
            <InputField label="Employability Test" name="etest_p" value={formData.etest_p} onChange={handleChange} placeholder="e.g. 70.0" />
            
            <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={[{label:'Male', value:'1'}, {label:'Female', value:'0'}]} />
            <SelectField label="12th Stream" name="hsc_s" value={formData.hsc_s} onChange={handleChange} options={[{label:'Science', value:'2'}, {label:'Commerce', value:'1'}, {label:'Arts', value:'0'}]} />
            <SelectField label="Degree Type" name="degree_t" value={formData.degree_t} onChange={handleChange} options={[{label:'Sci & Tech', value:'2'}, {label:'Comm & Mgmt', value:'0'}, {label:'Others', value:'1'}]} />
            <SelectField label="MBA Spec." name="specialisation" value={formData.specialisation} onChange={handleChange} options={[{label:'Mkt & Fin', value:'0'}, {label:'Mkt & HR', value:'1'}]} />
            <SelectField label="Work Experience" name="workex" value={formData.workex} onChange={handleChange} options={[{label:'No', value:'0'}, {label:'Yes', value:'1'}]} />
          </div>

          <div className="mt-10 flex justify-end">
            <button type="submit" disabled={loading} className="relative overflow-hidden group bg-blue-600 text-white font-bold text-lg py-4 px-10 rounded-xl transition-all hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
              <span className="relative z-10">{loading ? "Processing via AI..." : "Run Analysis"}</span>
              {!loading && <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="mt-10 mb-20">
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
                <div className="lg:col-span-1 flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-2xl border border-slate-700/50 h-full">
                  <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6 relative">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="60" fill="transparent" stroke="#1e293b" strokeWidth="8" />
                      <motion.circle cx="64" cy="64" r="60" fill="transparent"
                        stroke={result === 'Placed' ? '#10b981' : '#f43f5e'}
                        strokeWidth="8" strokeDasharray="377"
                        initial={{ strokeDashoffset: 377 }}
                        animate={{ strokeDashoffset: 377 - (377 * confidence) / 100 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                    </svg>
                    <span className="text-3xl font-black text-white">{confidence}%</span>
                  </div>
                  <div className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide uppercase border ${result === 'Placed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                    {result === 'Placed' ? 'High Probability' : 'Needs Optimization'}
                  </div>
                  <p className="text-slate-400 text-sm mt-4 text-center">Prediction Confidence Score</p>
                </div>

                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-lg"><Activity className="text-blue-400" size={24} /></div>
                    <h3 className="text-2xl font-bold text-white">AI Strategy & Insights</h3>
                  </div>
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 text-slate-300 text-base leading-relaxed">
                    <ReactMarkdown 
                      components={{
                        p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                        strong: ({node, ...props}) => <strong className="text-blue-400 font-semibold" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 space-y-2 mb-4 text-slate-300" {...props} />,
                        li: ({node, ...props}) => <li className="pl-2" {...props} />,
                      }}
                    >
                      {aiTips}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- PREMIUM NAVBAR WITH CLERK ---
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0b1120] selection:bg-blue-500/30 text-white font-sans relative overflow-x-hidden">
        
        <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
          <div className="w-full max-w-[1000px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full translate-y-[-20%]" />
        </div>

        <nav className="relative z-50 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 w-full">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Activity size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Placement<span className="text-blue-500">AI</span></span>
            </div>
            
            <div className="flex items-center gap-8">
              {/* Only show these links if SignedIn */}
              <SignedIn>
                <div className="hidden md:flex gap-6">
                  <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Predictor</Link>
                  <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Analytics</Link>
                </div>
              </SignedIn>
              
              <div className="pl-6 border-l border-slate-700 flex items-center gap-3">
                {/* CLERK MAGIC: Agar user login nahi hai, to Sign in button dikhao */}
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">Sign In</button>
                  </SignInButton>
                </SignedOut>
                
                {/* CLERK MAGIC: Agar user login hai, to uski original Google photo (UserButton) dikhao */}
                <SignedIn>
                  <div className="text-right hidden sm:block mr-2">
                    <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Verified User</p>
                  </div>
                  {/* Ye component automatically user ka profile pic and logout menu handle karta hai */}
                  <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-10 h-10 border-2 border-slate-700" }}} />
                </SignedIn>
              </div>
            </div>
          </div>
        </nav>

        <div className="relative z-10">
          {/* SECURE ROUTES */}
          <Routes>
            <Route path="/" element={
              <>
                <SignedOut><LoginLandingPage /></SignedOut>
                <SignedIn><PredictorForm /></SignedIn>
              </>
            } />
            <Route path="/dashboard" element={
              <>
                <SignedOut><LoginLandingPage /></SignedOut>
                <SignedIn><Dashboard /></SignedIn>
              </>
            } />
          </Routes>
        </div>
        
      </div>
    </BrowserRouter>
  );
}