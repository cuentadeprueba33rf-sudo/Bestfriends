/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, ArrowRight, Calendar, Lock, Unlock, Volume2, PenTool, CheckCircle2 } from 'lucide-react';

// Typewriter component to handle realistic typing with errors
const Typewriter = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);
  const [errorIndex, setErrorIndex] = useState(-1);

  useEffect(() => {
    setDisplayedText('');
    setIsDeleting(false);
    setIndex(0);
    setErrorIndex(-1);
  }, [text]);

  useEffect(() => {
    if (!text) return;
    if (errorIndex === -1 && text.length > 5 && Math.random() < 0.1) {
      setErrorIndex(Math.floor(Math.random() * (text.length - 3)) + 2);
    }
  }, [text, errorIndex]);

  useEffect(() => {
    if (!text) return;
    let timeout: NodeJS.Timeout;
    const type = () => {
      if (!isDeleting) {
        if (index < text.length) {
          if (index === errorIndex) {
            const wrongChars = "qwertyuiop";
            const wrongChar = wrongChars[Math.floor(Math.random() * wrongChars.length)];
            setDisplayedText(prev => prev + wrongChar);
            setIsDeleting(true);
            timeout = setTimeout(type, 400);
          } else {
            setDisplayedText(prev => prev + text[index]);
            setIndex(prev => prev + 1);
            timeout = setTimeout(type, 50 + Math.random() * 100);
          }
        } else {
          timeout = setTimeout(onComplete, 1500);
        }
      } else {
        setDisplayedText(prev => prev.slice(0, -1));
        setIsDeleting(false);
        setErrorIndex(-2);
        timeout = setTimeout(type, 200);
      }
    };
    timeout = setTimeout(type, 100);
    return () => clearTimeout(timeout);
  }, [index, isDeleting, text, onComplete, errorIndex]);

  return (
    <span className="inline-block">
      {displayedText}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-0.5 h-5 bg-white ml-1 align-middle" />
    </span>
  );
};

// Particle component for the disintegration effect
const Particle = ({ i }: { i: number; key?: number }) => {
  const randomX = (Math.random() - 0.5) * 1200;
  const randomY = -800 - Math.random() * 400;
  const randomRotate = (Math.random() - 0.5) * 1440;
  const size = 4 + Math.random() * 8;
  
  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
      animate={{ 
        x: randomX, 
        y: randomY, 
        opacity: 0, 
        scale: Math.random() * 0.5,
        rotate: randomRotate 
      }}
      transition={{ 
        duration: 2.5 + Math.random() * 2, 
        ease: [0.4, 0, 0.2, 1],
        delay: Math.random() * 0.8
      }}
      className="absolute bg-stone-100/60 backdrop-blur-[1px] rounded-[1px] shadow-sm"
      style={{
        width: `${size}px`,
        height: `${size * (0.8 + Math.random() * 0.4)}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
  );
};

// Flame effect for the word "infierno"
const FlameText = ({ text }: { text: string }) => {
  return (
    <span className="relative inline-block group">
      <span className="relative z-10 text-orange-700 font-bold">{text}</span>
      <span className="absolute inset-0 flex justify-center items-end pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute bottom-0 w-full h-full rounded-full bg-gradient-to-t from-orange-500 via-red-500 to-transparent blur-[2px] opacity-40"
            animate={{
              height: ["40%", "120%", "40%"],
              opacity: [0.2, 0.6, 0.2],
              x: [i * 2 - 6, i * -2 + 6, i * 2 - 6],
              scaleX: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
            style={{ width: `${15 + Math.random() * 10}%` }}
          />
        ))}
      </span>
    </span>
  );
};

export default function App() {
  const [name, setName] = useState('');
  const [step, setStep] = useState(0); // 0: Name, 1: Birthday, 2: Success L2, 3: L3 Sequence, 4: Letter, 5: Contract, 6: Disintegration, 7: Final, 8: Final Sentimental, 9: Glitch, 10: Brand
  const [birthday, setBirthday] = useState({ day: '', month: '', year: '' });
  const [error, setError] = useState(false);
  const [l3SubStep, setL3SubStep] = useState(0);
  const [isSigned, setIsSigned] = useState(false);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) setStep(1);
  };

  const handleBirthdaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthday.day === '3' && (birthday.month.toLowerCase() === 'noviembre' || birthday.month === '11') && birthday.year === '2010') {
      setError(false);
      setStep(2);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const startLevel3 = () => {
    setStep(3);
    setL3SubStep(0);
  };

  useEffect(() => {
    if (step === 3) {
      if (l3SubStep === 0) {
        const timer = setTimeout(() => setL3SubStep(1), 3000);
        return () => clearTimeout(timer);
      }
      if (l3SubStep >= 7 && l3SubStep <= 10) {
        const delays = { 7: 1500, 8: 1500, 9: 1000, 10: 2000 };
        const timer = setTimeout(() => {
          if (l3SubStep === 10) setStep(4);
          else setL3SubStep(prev => prev + 1);
        }, delays[l3SubStep as keyof typeof delays]);
        return () => clearTimeout(timer);
      }
    }
  }, [step, l3SubStep]);

  const l3Messages = [
    "",
    "Hola...",
    "soy Samuel del futuro",
    "no te rías!!",
    "Lo digo en serio, quiero decirte lo linda que es nuestra amistad acá",
    "y si nuestra amistad aún sigue en pie e intacta",
    "yo aún soy esa pequeña luz de tu confianza",
  ];

  const onTypewriterComplete = useCallback(() => {
    setL3SubStep(prev => prev + 1);
  }, []);

  const handleSign = () => {
    setIsSigned(true);
    setTimeout(() => {
      setStep(6);
      setTimeout(() => setStep(8), 4500);
    }, 2000);
  };

  useEffect(() => {
    if (step === 7) {
      const timer = setTimeout(() => {
        setStep(9);
        setTimeout(() => setStep(10), 1500);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 font-serif transition-colors duration-1000 ${step === 3 || step === 9 || step === 10 ? 'bg-black' : step === 4 || step === 5 || step === 6 || step === 7 || step === 8 ? 'bg-white' : 'magic-gradient'}`}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }} className="max-w-md w-full text-center space-y-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block p-4 rounded-full bg-rose-50 text-rose-400 mb-4"><Sparkles size={32} /></motion.div>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-display italic text-rose-900 leading-tight">Algo especial <br /> está por comenzar...</h1>
              <p className="text-lg text-stone-500 font-sans tracking-wide uppercase text-xs">Un pequeño rincón dedicado a una gran amistad</p>
            </div>
            <form onSubmit={handleNameSubmit} className="relative group">
              <div className="relative">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="¿Cómo te llamas?" className="w-full bg-white/50 backdrop-blur-sm border-b-2 border-rose-200 py-4 px-2 text-2xl text-center focus:outline-none focus:border-rose-400 transition-colors placeholder:text-stone-300 font-serif italic" required />
                <button type="submit" className="absolute right-0 bottom-4 text-rose-400 hover:text-rose-600 transition-colors"><ArrowRight size={28} /></button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="birthday" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="max-w-md w-full text-center space-y-10">
            <div className="space-y-4">
              <motion.div animate={error ? { x: [-10, 10, -10, 10, 0] } : {}} className="text-rose-400 flex justify-center mb-6"><Lock size={48} className={error ? "text-red-400" : "text-rose-300"} /></motion.div>
              <h2 className="text-4xl font-display text-rose-900 italic">Hola, {name}</h2>
              <p className="text-stone-600 font-sans text-sm uppercase tracking-widest">Nivel 2: El Desafío</p>
              <p className="text-xl text-stone-500 italic">Para continuar, dime: <br /><span className="text-rose-800 font-bold not-italic">¿Cuándo nació Samuel?</span></p>
            </div>
            <form onSubmit={handleBirthdaySubmit} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <input type="text" placeholder="Día" value={birthday.day} onChange={(e) => setBirthday({...birthday, day: e.target.value})} className="bg-white/60 border-b-2 border-rose-100 py-3 text-center focus:outline-none focus:border-rose-400 transition-all text-xl font-serif" maxLength={2} />
                <input type="text" placeholder="Mes" value={birthday.month} onChange={(e) => setBirthday({...birthday, month: e.target.value})} className="bg-white/60 border-b-2 border-rose-100 py-3 text-center focus:outline-none focus:border-rose-400 transition-all text-xl font-serif" />
                <input type="text" placeholder="Año" value={birthday.year} onChange={(e) => setBirthday({...birthday, year: e.target.value})} className="bg-white/60 border-b-2 border-rose-100 py-3 text-center focus:outline-none focus:border-rose-400 transition-all text-xl font-serif" maxLength={4} />
              </div>
              <button type="submit" className="w-full bg-rose-400 text-white py-4 rounded-full font-sans font-semibold tracking-widest uppercase text-xs shadow-lg shadow-rose-200 hover:bg-rose-500 transition-colors flex items-center justify-center gap-2">Verificar <Calendar size={16} /></button>
              {error && <p className="text-red-400 text-sm italic">Mmm... esa no parece ser la fecha correcta. ¡Inténtalo de nuevo!</p>}
            </form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-8">
            <motion.div animate={{ rotateY: [0, 360], scale: [1, 1.2, 1] }} transition={{ duration: 1.5 }} className="text-emerald-400 flex justify-center"><Unlock size={64} /></motion.div>
            <h2 className="text-5xl font-display text-rose-900 italic">¡Correcto!</h2>
            <p className="text-xl text-stone-600 max-w-sm mx-auto leading-relaxed">Vaya, realmente conoces bien a Samuel. <br />Has desbloqueado el siguiente nivel.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startLevel3} className="px-8 py-3 bg-rose-400 text-white rounded-full font-sans text-xs uppercase tracking-widest font-bold shadow-lg shadow-rose-100">Entrar al Nivel 3</motion.button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="level3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black flex items-center justify-center p-8">
            <AnimatePresence mode="wait">
              {l3SubStep >= 1 && l3SubStep <= 6 && (
                <motion.div key={l3SubStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="text-white text-center">
                  <div className="text-lg md:text-xl font-serif italic tracking-widest flex items-center justify-center gap-3"><Volume2 size={16} className="opacity-30" /><Typewriter text={l3Messages[l3SubStep] || ""} onComplete={onTypewriterComplete} /></div>
                </motion.div>
              )}
            </AnimatePresence>
            {l3SubStep === 7 && <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]" />}
            {l3SubStep === 9 && <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} className="w-4 h-4 bg-white rounded-full" />}
            {l3SubStep === 10 && <motion.div initial={{ scale: 1, opacity: 1 }} animate={{ scale: 100, opacity: 1 }} transition={{ duration: 1.5, ease: "easeIn" }} className="w-10 h-10 bg-white rounded-full fixed" />}
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="final-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }} className="max-w-2xl w-full text-center space-y-12 py-12">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-display text-rose-900 italic leading-tight">Lo que siempre he querido <br /> que recuerdes...</h2>
              <div className="space-y-6 text-stone-600 text-lg leading-relaxed font-serif italic px-4">
                <p>No todos merecen tu luz; no te desgastes donde no perteneces. Recuerda que es mejor la soledad que una compañía que no te deja florecer.</p>
                <p>Busca a quienes vibren en tu misma frecuencia, porque bajo presión es como se forman los diamantes más valiosos. No trates de ser alguien que no eres solo por encajar.</p>
                <p>Imagina ese atardecer perfecto en la escuela, en silencio, compartiendo tu mundo con alguien que realmente te entienda y disfrute escucharte.</p>
                <p className="text-rose-800 font-bold not-italic pt-4">¿Te gustaría que algo así sucediera con esa mejor amiga? Que aunque aún no esté, ya ella aprendió a hacer lo que tú estás aprendiendo apenas.</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(5)}
                className="mt-8 px-10 py-4 bg-rose-500 text-white rounded-full font-sans text-xs uppercase tracking-widest font-bold shadow-xl shadow-rose-100 flex items-center justify-center gap-2 mx-auto"
              >
                He terminado de leer <CheckCircle2 size={18} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="contract"
            initial={{ opacity: 0, scale: 0.9, rotateX: 45 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -100, rotateX: -90 }}
            transition={{ type: "spring", damping: 15 }}
            className="max-w-xl w-full bg-[#fffcf5] p-12 shadow-2xl border border-stone-200 relative overflow-hidden"
            style={{ perspective: "1000px" }}
          >
            <div className="absolute inset-0 border-[20px] border-double border-stone-100/50 pointer-events-none" />
            <div className="space-y-8 text-center relative z-10">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <h3 className="text-3xl font-display text-stone-800 italic border-b border-stone-200 pb-4">Contrato de Amistad Eterna</h3>
              </motion.div>
              
              <div className="space-y-6 text-stone-600 font-serif italic text-lg leading-relaxed">
                <p>Por medio del presente documento, se hace constar que la amistad entre Samuel y {name} es considerada un tesoro invaluable.</p>
                <p>Ambas partes se comprometen a ser la luz en los momentos oscuros, a vibrar en la misma frecuencia y a florecer juntos, sin importar la presión del mundo exterior.</p>
                <p>Este pacto trasciende el tiempo y el espacio, sellado por la confianza y el cariño mutuo.</p>
              </div>

              <div className="grid grid-cols-2 gap-12 pt-12">
                <div className="space-y-2">
                  <div className="h-16 flex items-end justify-center">
                    <motion.span 
                      initial={{ opacity: 0, pathLength: 0 }}
                      animate={{ opacity: 1, pathLength: 1 }}
                      className="text-3xl font-display text-rose-500 italic"
                    >
                      Samuel
                    </motion.span>
                  </div>
                  <div className="border-t border-stone-400 pt-2">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400">Firma de Samuel</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-16 flex items-end justify-center relative">
                    <AnimatePresence>
                      {isSigned ? (
                        <motion.span 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-3xl font-display text-rose-500 italic"
                        >
                          {name}
                        </motion.span>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.1, color: "#f43f5e" }}
                          onClick={handleSign}
                          className="text-stone-300 flex flex-col items-center gap-1 group"
                        >
                          <PenTool size={24} className="group-hover:animate-bounce" />
                          <span className="text-[10px] uppercase tracking-tighter">Click para firmar</span>
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="border-t border-stone-400 pt-2">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400">Firma de {name}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Magical sparkles on the paper */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute text-rose-200"
                  style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                >
                  <Sparkles size={12} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 6 && (
          <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-white">
            <div className="relative w-full h-full">
              {[...Array(300)].map((_, i) => (
                <Particle key={i} i={i} />
              ))}
              <motion.div
                initial={{ opacity: 1, scale: 1, rotate: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: 0.7, 
                  y: -400, 
                  rotate: 15,
                  skewX: 10,
                  filter: "blur(4px)"
                }}
                transition={{ duration: 2, ease: "easeIn" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-96 h-[500px] bg-[#fffcf5] shadow-2xl border border-stone-200" />
              </motion.div>
            </div>
          </div>
        )}

        {step === 8 && (
          <motion.div
            key="sentimental"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl w-full text-center space-y-12 py-12"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="space-y-10"
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-rose-500"
                >
                  <Heart size={64} className="fill-rose-500" />
                </motion.div>
              </div>

              <div className="space-y-8 text-stone-800 text-2xl md:text-3xl leading-relaxed font-serif italic px-6">
                <div>
                  Te acompañaré hasta el fin del mundo, sin importar lo que pase.
                </div>
                <div>
                  Y si algún día voy al <FlameText text="infierno" /> en tierra, iremos juntos al fin del mundo, porque nuestra amistad es el refugio más seguro que existe.
                </div>
                <div className="text-rose-900 font-bold not-italic">
                  Eres, y siempre serás, mi mejor amiga.
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(7)}
                className="mt-12 px-12 py-4 bg-rose-600 text-white rounded-full font-sans text-xs uppercase tracking-widest font-bold shadow-2xl shadow-rose-200"
              >
                Sellar para siempre
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {step === 7 && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-12"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-rose-500 flex justify-center"
            >
              <Heart size={80} className="fill-rose-500" />
            </motion.div>
            <div className="space-y-4">
              <h2 className="text-5xl font-display text-rose-900 italic">Pacto Sellado</h2>
              <p className="text-xl text-stone-500 max-w-md mx-auto leading-relaxed italic">
                Nuestra amistad ahora es parte del viento, eterna y libre. Gracias por ser mi mejor amiga, {name}.
              </p>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-stone-300 text-[10px] uppercase tracking-[0.5em] pt-12"
            >
              Fin de la experiencia
            </motion.div>
          </motion.div>
        )}

        {step === 9 && (
          <motion.div
            key="glitch"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0.8, 1, 0],
              x: [0, -10, 10, -5, 5, 0],
              filter: ["none", "hue-rotate(90deg) blur(2px)", "none", "invert(1)"]
            }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
          >
            <div className="text-9xl font-bold text-black opacity-20 select-none">ERROR_SYSTEM_FAILURE</div>
          </motion.div>
        )}

        {step === 10 && (
          <motion.div
            key="brand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, letterSpacing: "1em" }}
              animate={{ scale: 1, opacity: 1, letterSpacing: "0.2em" }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="relative"
            >
              <motion.h1 
                className="text-8xl md:text-9xl font-black text-white tracking-tighter"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(255,255,255,0.5)",
                    "0 0 50px rgba(255,255,255,0.8)",
                    "0 0 20px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                SAM
              </motion.h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.5, duration: 1 }}
                className="h-1 bg-gradient-to-r from-transparent via-white to-transparent mt-4"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 1 }}
              className="mt-12 text-center space-y-2"
            >
              <p className="text-stone-500 text-[10px] uppercase tracking-[0.4em]">
                Todos los derechos reservados © 2026
              </p>
              <p className="text-stone-700 text-[8px] uppercase tracking-[0.2em]">
                Hecho con amor para una amistad eterna
              </p>
            </motion.div>

            {/* Final spectacular particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: "50%", 
                    y: "50%", 
                    scale: 0,
                    opacity: 1 
                  }}
                  animate={{ 
                    x: `${Math.random() * 100}%`, 
                    y: `${Math.random() * 100}%`,
                    scale: Math.random() * 2,
                    opacity: 0
                  }}
                  transition={{ 
                    delay: 3 + Math.random() * 2, 
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 5
                  }}
                  className="absolute w-1 h-1 bg-white rounded-full"
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5 }}
              className="absolute bottom-10"
            >
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-stone-800 text-[9px] uppercase tracking-widest"
              >
                Fin del viaje
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {step < 3 && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
          {[...Array(15)].map((_, i) => (
            <motion.div key={i} className="absolute text-rose-200/20" initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", scale: Math.random() * 0.5 + 0.5, rotate: Math.random() * 360 }} animate={{ y: [null, "-20%"], opacity: [0, 1, 0] }} transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }}><Sparkles size={Math.random() * 20 + 10} /></motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
