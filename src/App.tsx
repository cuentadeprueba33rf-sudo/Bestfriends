/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  ArrowRight, 
  PenTool, 
  CheckCircle2, 
  Wind,
  ShieldCheck,
  Star,
  Quote,
  Feather,
  Lock,
  Unlock,
  Settings,
  Plus,
  Image as ImageIcon,
  MessageSquare,
  Trash2,
  X,
  Camera
} from 'lucide-react';

// --- Types ---

interface Moment {
  id: string;
  type: 'text' | 'image';
  content: string;
  date: string;
}

// --- Components ---

const Particle = ({ i }: { i: number; key?: number }) => {
  const angle = (i / 100) * Math.PI * 2;
  const distance = 100 + Math.random() * 400;
  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ 
        x: Math.cos(angle) * distance, 
        y: Math.sin(angle) * distance, 
        opacity: 0, 
        scale: 0 
      }}
      transition={{ 
        duration: 2.5 + Math.random() * 1.5, 
        ease: "easeOut" 
      }}
      className="absolute w-1 h-1 bg-rose-dust rounded-full"
      style={{ left: '50%', top: '50%' }}
    />
  );
};

const ElegantTypewriter = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      const timeout = setTimeout(onComplete, 1000);
      return () => clearTimeout(timeout);
    }
  }, [index, text, onComplete]);

  return (
    <span className="font-serif italic leading-relaxed">
      {displayedText}
      <motion.span 
        animate={{ opacity: [1, 0] }} 
        transition={{ duration: 0.8, repeat: Infinity }} 
        className="inline-block w-[1px] h-6 bg-charcoal/30 ml-1 align-middle" 
      />
    </span>
  );
};

// --- Main App ---

export default function App() {
  const [chapter, setChapter] = useState(0); // 0: Intro, 1: Essence, 2: Truth, 3: Pact, 4: Legacy, 5: Vault
  const [name, setName] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [isDisintegrating, setIsDisintegrating] = useState(false);

  // Vault States
  const [moments, setMoments] = useState<Moment[]>([]);
  const [vaultPassword, setVaultPassword] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newMomentType, setNewMomentType] = useState<'text' | 'image' | null>(null);
  const [newText, setNewText] = useState('');
  const [unlockInput, setUnlockInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');

  // Load from localStorage
  useEffect(() => {
    const savedMoments = localStorage.getItem('eternity_moments');
    const savedPass = localStorage.getItem('eternity_vault_pass');
    const savedChapter = localStorage.getItem('eternity_chapter');
    const savedName = localStorage.getItem('eternity_name');

    if (savedMoments) setMoments(JSON.parse(savedMoments));
    if (savedPass) {
      setVaultPassword(savedPass);
      setIsLocked(true);
    }
    if (savedChapter) setChapter(parseInt(savedChapter));
    if (savedName) setName(savedName);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('eternity_moments', JSON.stringify(moments));
  }, [moments]);

  useEffect(() => {
    localStorage.setItem('eternity_chapter', chapter.toString());
  }, [chapter]);

  useEffect(() => {
    if (name) localStorage.setItem('eternity_name', name);
  }, [name]);

  const nextChapter = () => setChapter(prev => prev + 1);

  const addMoment = (type: 'text' | 'image', content: string) => {
    const newMoment: Moment = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      date: new Date().toLocaleDateString()
    };
    setMoments([newMoment, ...moments]);
    setNewMomentType(null);
    setNewText('');
  };

  const deleteMoment = (id: string) => {
    setMoments(moments.filter(m => m.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addMoment('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const setPassword = () => {
    if (newPassInput.trim()) {
      localStorage.setItem('eternity_vault_pass', newPassInput);
      setVaultPassword(newPassInput);
      setNewPassInput('');
      setIsSettingsOpen(false);
    }
  };

  const removePassword = () => {
    localStorage.removeItem('eternity_vault_pass');
    setVaultPassword(null);
    setIsLocked(false);
    setIsSettingsOpen(false);
  };

  const unlockVault = () => {
    if (unlockInput === vaultPassword) {
      setIsLocked(false);
      setUnlockInput('');
    } else {
      alert('Clave incorrecta');
    }
  };

  const resetExperience = () => {
    if (confirm('¿Quieres volver a ver la Galería desde el principio? Tus momentos guardados NO se borrarán.')) {
      localStorage.removeItem('eternity_chapter');
      setChapter(0);
      setIsSettingsOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory selection:bg-rose-dust/30 font-sans text-charcoal overflow-hidden relative">
      
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-dust/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-muted/20 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* CHAPTER 0: EL UMBRAL (The Threshold) */}
        {chapter === 0 && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-12 z-10"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="space-y-4"
            >
              <h1 className="text-7xl md:text-8xl font-serif italic tracking-tight text-charcoal/90">
                Galería de la <br /> <span className="text-gold-muted">Eternidad</span>
              </h1>
              <p className="text-xs uppercase tracking-[0.6em] text-charcoal/40 font-sans">Un espacio dedicado a ti</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="w-full max-w-xs space-y-8"
            >
              <div className="relative group">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre..."
                  className="w-full bg-transparent border-b border-charcoal/10 py-4 px-2 text-2xl text-center focus:outline-none focus:border-gold-muted transition-all placeholder:text-charcoal/10 font-serif italic"
                />
              </div>
              {name.length > 2 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={nextChapter}
                  className="group flex items-center gap-3 mx-auto text-xs uppercase tracking-[0.4em] text-gold-muted hover:text-charcoal transition-colors"
                >
                  Comenzar el viaje <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* CHAPTER 1: LA ESENCIA (The Essence) */}
        {chapter === 1 && (
          <motion.div 
            key="essence"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-8 max-w-4xl mx-auto z-10"
          >
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.2 }}
                className="space-y-8"
              >
                <div className="w-12 h-[1px] bg-gold-muted" />
                <h2 className="text-5xl font-serif italic leading-tight">
                  Capítulo I: <br /> <span className="text-gold-muted">La Luz de {name}</span>
                </h2>
                <p className="text-lg text-charcoal/70 font-serif leading-relaxed italic">
                  "Hay personas que no solo están en tu vida, sino que la iluminan. Tu presencia es como ese primer rayo de sol que atraviesa la niebla: silencioso, pero transformador."
                </p>
                <motion.button
                  whileHover={{ x: 10 }}
                  onClick={nextChapter}
                  className="text-xs uppercase tracking-[0.4em] text-gold-muted flex items-center gap-2"
                >
                  Continuar <ArrowRight size={14} />
                </motion.button>
              </motion.div>
              
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="relative aspect-square flex items-center justify-center"
              >
                <div className="absolute inset-0 border border-gold-muted/10 rounded-full animate-[spin_20s_linear_infinite]" />
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-48 h-48 bg-rose-dust/20 rounded-full blur-3xl" 
                />
                <Star size={48} className="text-gold-muted animate-pulse" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* CHAPTER 2: EL REFUGIO (The Refuge) */}
        {chapter === 2 && (
          <motion.div 
            key="truth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-8 max-w-2xl mx-auto z-10 text-center space-y-12"
          >
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
              <Quote size={40} className="text-gold-muted/30 mx-auto mb-8" />
              <div className="space-y-8 text-2xl md:text-3xl font-serif italic text-charcoal/80 leading-snug">
                <ElegantTypewriter 
                  text={`"No todos merecen tu luz, ${name}. Recuerda que bajo presión es como se forman los diamantes más valiosos. No trates de ser alguien que no eres solo por encajar. Tu autenticidad es tu mayor tesoro."`} 
                  onComplete={() => {}}
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 6 }}
              className="pt-8"
            >
              <button 
                onClick={nextChapter}
                className="px-12 py-4 border border-charcoal/10 rounded-full text-xs uppercase tracking-[0.4em] hover:bg-charcoal hover:text-ivory transition-all duration-500"
              >
                Guardar en el corazón
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* CHAPTER 3: EL VOTO SAGRADO (The Sacred Vow) */}
        {chapter === 3 && (
          <motion.div 
            key="pact"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="min-h-screen flex flex-col items-center justify-center p-8 z-10"
          >
            <motion.div 
              animate={isDisintegrating ? { opacity: 0, scale: 0.9, filter: 'blur(20px)' } : {}}
              className="glass-panel max-w-lg w-full p-12 space-y-12 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-muted/30 to-transparent" />
              
              <div className="text-center space-y-4">
                <ShieldCheck size={32} className="text-gold-muted mx-auto mb-4" />
                <h3 className="text-3xl font-serif italic">Voto de Amistad Eterna</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal/40">Un compromiso más allá del tiempo</p>
              </div>

              <div className="space-y-6 text-sm font-serif italic text-charcoal/60 leading-relaxed text-center">
                <p>"Prometo acompañarte hasta el fin del mundo. Si algún día el camino se vuelve oscuro, caminaremos juntos. Tu confianza es mi luz, y mi lealtad es tu escudo."</p>
              </div>

              <div className="pt-12 space-y-8">
                <div className="flex justify-between items-end px-4">
                  <div className="text-center space-y-2">
                    <span className="text-2xl font-serif italic text-gold-muted">Samuel</span>
                    <div className="w-24 h-[1px] bg-charcoal/20 mx-auto" />
                    <p className="text-[8px] uppercase tracking-widest opacity-40">Autor</p>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="h-10 flex items-center justify-center">
                      <AnimatePresence>
                        {isSigned ? (
                          <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-serif italic text-rose-dust"
                          >
                            {name}
                          </motion.span>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setIsSigned(true)}
                            className="text-gold-muted/40 hover:text-gold-muted transition-colors"
                          >
                            <PenTool size={24} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="w-24 h-[1px] bg-charcoal/20 mx-auto" />
                    <p className="text-[8px] uppercase tracking-widest opacity-40">Testigo</p>
                  </div>
                </div>

                {isSigned && !isDisintegrating && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => {
                      setIsDisintegrating(true);
                      setTimeout(nextChapter, 3000);
                    }}
                    className="w-full py-4 bg-charcoal text-ivory text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-gold-muted transition-colors duration-500"
                  >
                    Sellar el Pacto
                  </motion.button>
                )}
              </div>
            </motion.div>

            {isDisintegrating && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(100)].map((_, i) => (
                  <Particle key={i} i={i} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* CHAPTER 4: EL LEGADO (The Legacy) */}
        {chapter === 4 && (
          <motion.div 
            key="legacy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center p-8 text-center z-10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2 }}
              className="space-y-16"
            >
              <div className="space-y-4">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-gold-muted/20 flex justify-center"
                >
                  <Heart size={64} />
                </motion.div>
                <h2 className="text-4xl font-serif italic text-charcoal/80">Nuestra historia es eterna.</h2>
              </div>

              <div className="relative py-12">
                <motion.h1 
                  initial={{ letterSpacing: "1em", opacity: 0 }}
                  animate={{ letterSpacing: "0.4em", opacity: 1 }}
                  transition={{ duration: 2.5, ease: "easeOut" }}
                  className="text-8xl md:text-9xl font-black text-charcoal tracking-tighter"
                >
                  SAM
                </motion.h1>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.5, duration: 1.5 }}
                  className="h-[1px] bg-gradient-to-r from-transparent via-gold-muted to-transparent mt-4" 
                />
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="space-y-2"
              >
                <p className="text-[10px] uppercase tracking-[0.6em] text-charcoal/30">Todos los derechos reservados © 2026</p>
                <p className="text-[8px] uppercase tracking-[0.4em] text-gold-muted/60 italic">Una obra dedicada a la amistad verdadera</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5 }}
              className="absolute bottom-12 flex flex-col items-center gap-6"
            >
              <div className="flex items-center gap-4 text-charcoal/20">
                <div className="w-12 h-[1px] bg-current" />
                <span className="text-[10px] uppercase tracking-widest">Fin de la Galería</span>
                <div className="w-12 h-[1px] bg-current" />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={nextChapter}
                className="px-8 py-3 bg-gold-muted/10 border border-gold-muted/20 rounded-full text-[10px] uppercase tracking-[0.4em] text-gold-muted hover:bg-gold-muted hover:text-ivory transition-all duration-500"
              >
                Entrar al Archivo Privado
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* CHAPTER 5: EL ARCHIVO (The Vault) */}
        {chapter === 5 && (
          <motion.div 
            key="vault"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col p-8 md:p-16 z-10"
          >
            {/* Vault Header */}
            <div className="flex justify-between items-center mb-12">
              <div className="space-y-1">
                <h2 className="text-3xl font-serif italic">Nuestros Momentos</h2>
                <p className="text-[10px] uppercase tracking-[0.3em] text-charcoal/40">Galería Privada</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-3 rounded-full hover:bg-charcoal/5 transition-colors text-charcoal/40 hover:text-charcoal"
                >
                  <Settings size={20} />
                </button>
                {vaultPassword && (
                  <button 
                    onClick={() => setIsLocked(true)}
                    className="p-3 rounded-full hover:bg-charcoal/5 transition-colors text-charcoal/40 hover:text-charcoal"
                  >
                    <Lock size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Locked State */}
            {isLocked ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center space-y-8"
              >
                <div className="w-16 h-16 bg-gold-muted/10 rounded-full flex items-center justify-center text-gold-muted">
                  <Lock size={32} />
                </div>
                <div className="space-y-4 text-center">
                  <h3 className="text-xl font-serif italic">Galería Bloqueada</h3>
                  <input 
                    type="password" 
                    value={unlockInput}
                    onChange={(e) => setUnlockInput(e.target.value)}
                    placeholder="Ingresa la clave..."
                    className="w-full max-w-xs bg-transparent border-b border-charcoal/10 py-3 text-center focus:outline-none focus:border-gold-muted transition-all font-serif italic"
                  />
                  <button 
                    onClick={unlockVault}
                    className="block mx-auto px-8 py-2 bg-charcoal text-ivory text-[10px] uppercase tracking-widest rounded-full"
                  >
                    Desbloquear
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1">
                {/* Add Moment Actions */}
                <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
                  <button 
                    onClick={() => setNewMomentType('text')}
                    className="flex-shrink-0 flex items-center gap-3 px-6 py-3 border border-charcoal/5 rounded-xl hover:bg-charcoal/5 transition-all text-xs uppercase tracking-widest"
                  >
                    <MessageSquare size={16} /> Nota de Texto
                  </button>
                  <label className="flex-shrink-0 flex items-center gap-3 px-6 py-3 border border-charcoal/5 rounded-xl hover:bg-charcoal/5 transition-all text-xs uppercase tracking-widest cursor-pointer">
                    <Camera size={16} /> Subir Captura
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>

                {/* New Text Moment Modal */}
                <AnimatePresence>
                  {newMomentType === 'text' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-ivory/95 backdrop-blur-sm z-50 flex items-center justify-center p-8"
                    >
                      <div className="w-full max-w-lg space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="text-2xl font-serif italic">Nueva Nota</h3>
                          <button onClick={() => setNewMomentType(null)}><X size={20} /></button>
                        </div>
                        <textarea 
                          value={newText}
                          onChange={(e) => setNewText(e.target.value)}
                          placeholder="Escribe algo especial..."
                          className="w-full h-48 bg-transparent border border-charcoal/10 rounded-2xl p-6 focus:outline-none focus:border-gold-muted transition-all font-serif italic text-lg"
                        />
                        <button 
                          onClick={() => addMoment('text', newText)}
                          className="w-full py-4 bg-charcoal text-ivory rounded-2xl text-[10px] uppercase tracking-[0.4em] font-bold"
                        >
                          Guardar Momento
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Moments Grid */}
                {moments.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-charcoal/20 space-y-4">
                    <Feather size={48} />
                    <p className="font-serif italic">Aún no hay momentos guardados...</p>
                  </div>
                ) : (
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {moments.map((moment) => (
                      <motion.div 
                        key={moment.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="break-inside-avoid glass-panel p-6 rounded-2xl group relative"
                      >
                        <button 
                          onClick={() => deleteMoment(moment.id)}
                          className="absolute top-4 right-4 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                        
                        {moment.type === 'text' ? (
                          <div className="space-y-4">
                            <MessageSquare size={16} className="text-gold-muted/40" />
                            <p className="font-serif italic text-lg leading-relaxed text-charcoal/80">{moment.content}</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <ImageIcon size={16} className="text-gold-muted/40" />
                            <img 
                              src={moment.content} 
                              alt="Momento" 
                              className="w-full rounded-lg shadow-sm"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        <div className="mt-6 pt-4 border-t border-charcoal/5 flex justify-between items-center">
                          <span className="text-[8px] uppercase tracking-widest text-charcoal/30">{moment.date}</span>
                          <Sparkles size={10} className="text-gold-muted/20" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Modal */}
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-charcoal/20 backdrop-blur-md z-[60] flex items-center justify-center p-8"
                >
                  <motion.div 
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    className="bg-ivory w-full max-w-sm rounded-3xl p-8 space-y-8 shadow-2xl"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-serif italic">Seguridad</h3>
                      <button onClick={() => setIsSettingsOpen(false)}><X size={20} /></button>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] uppercase tracking-widest text-charcoal/40">Configurar Clave</p>
                      <input 
                        type="password" 
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        placeholder="Nueva clave..."
                        className="w-full bg-transparent border-b border-charcoal/10 py-2 focus:outline-none focus:border-gold-muted transition-all"
                      />
                      <div className="flex gap-3 pt-4">
                        <button 
                          onClick={setPassword}
                          className="flex-1 py-3 bg-charcoal text-ivory text-[10px] uppercase tracking-widest rounded-xl"
                        >
                          Guardar
                        </button>
                        {vaultPassword && (
                          <button 
                            onClick={removePassword}
                            className="px-4 py-3 border border-red-100 text-red-400 text-[10px] uppercase tracking-widest rounded-xl"
                          >
                            Quitar
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-charcoal/5">
                      <button 
                        onClick={resetExperience}
                        className="w-full py-3 border border-gold-muted/20 text-gold-muted text-[10px] uppercase tracking-widest rounded-xl hover:bg-gold-muted/5 transition-colors"
                      >
                        Reiniciar Experiencia
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Floating Sparkles (Global) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0 
            }}
            animate={{ 
              y: [null, "-20%"],
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              duration: 10 + Math.random() * 10, 
              repeat: Infinity,
              delay: Math.random() * 10
            }}
            className="absolute text-gold-muted/40"
          >
            <Sparkles size={Math.random() * 10 + 5} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
