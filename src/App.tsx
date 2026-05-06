/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Heart, Globe, Moon, Sun, Music2, VolumeX, Volume2, ArrowDown, Star, Sparkles } from 'lucide-react';
import { PHRASES, ZELIA_TRIBUTE, COLORS } from './constants.ts';
import ParticleEngine from './components/ParticleEngine.tsx';
import LoadingScreen from './components/LoadingScreen.tsx';

export default function App() {
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showFinale, setShowFinale] = useState(false);
  const { scrollYProgress } = useScroll();
  const containerRef = useRef(null);

  useEffect(() => {
    // Simulate initial loading for magical effect
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Background color interpolation
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.8, 1],
    [COLORS.pearl, COLORS.pearl, COLORS.night]
  );
  
  const textColor = useTransform(
    scrollYProgress,
    [0, 0.8, 1],
    ["#1e293b", "#1e293b", "#FDFCF0"]
  );

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      if (v > 0.95) setShowFinale(true);
      else setShowFinale(false);
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <motion.div 
      style={{ backgroundColor, color: textColor }}
      className="min-h-screen transition-colors duration-1000"
    >
      <LoadingScreen isLoading={isLoading} />
      <ParticleEngine count={showFinale ? 100 : 40} theme={showFinale ? 'dark' : 'light'} />
      
      {/* Fixed UI Controls */}
      <nav className="fixed top-6 right-6 z-50 flex gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 glass rounded-full shadow-lg"
          id="sound-toggle"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </motion.button>
      </nav>

      {/* Progress Bar */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 h-1 bg-gold-soft origin-left z-50"
        style={{ scaleX: scrollYProgress, opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]) }}
      />

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="z-10"
        >
          <motion.h1 
            className="text-7xl md:text-9xl font-serif mb-6 text-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 2 }}
          >
            Para {ZELIA_TRIBUTE.name} <span className="text-petal-pink inline-block animate-pulse">🌸</span>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-2xl font-poetic italic opacity-80 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
          >
            "E para todas as mães que transformam o mundo com amor."
          </motion.p>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,209,220,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="px-8 py-4 bg-white/80 border border-gold-soft rounded-full font-medium tracking-widest uppercase text-xs glass"
            id="start-tribute"
          >
            Começar Homenagem
          </motion.button>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30"
        >
          <ArrowDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* Phrases Section */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className="space-y-24">
            {PHRASES.map((phrase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: idx * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative group"
              >
                <div className="absolute -left-8 top-0 text-petal-pink opacity-20 text-6xl font-serif">"</div>
                <p className="text-3xl md:text-5xl font-poetic leading-tight">
                  {phrase}
                </p>
                <div className="h-0.5 w-0 group-hover:w-full bg-gold-soft transition-all duration-700 mt-4" />
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="sticky top-1/4 h-[500px] flex items-center justify-center p-8"
            style={{ rotate: useTransform(scrollYProgress, [0, 1], [0, 15]) }}
          >
            <div className="relative w-full h-full max-w-md">
              <div className="absolute inset-0 glass rounded-[60px] transform rotate-3 shadow-2xl" />
              <img 
                src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1000" 
                alt="Flores"
                className="absolute inset-0 w-full h-full object-cover rounded-[50px] shadow-xl grayscale-[0.2] sepia-[0.2]"
              />
              <motion.div 
                className="absolute -top-10 -right-10 w-24 h-24 glass rounded-full flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Heart className="text-petal-pink w-10 h-10 fill-current" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Garden */}
      <section className="py-40 bg-gradient-to-b from-transparent to-white/10 dark:to-transparent">
        <div className="text-center mb-24 px-6">
          <h2 className="text-4xl md:text-6xl font-serif mb-4">Jardim das Mães</h2>
          <p className="opacity-60 italic">Cada flor que nasce representa um amor infinito.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-16 px-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 50, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 border border-gold-soft rounded-full flex items-center justify-center glass group-hover:bg-petal-pink/20 transition-colors">
                 <Sparkles className="w-12 h-12 text-gold-soft" />
              </div>
              <motion.div 
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-xs uppercase tracking-tighter">Uma mãe amada</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Special Zélia Tribute */}
      <section className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" id="zelia-tribute">
        <div className="relative z-10 max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="glass p-12 md:p-20 rounded-[4rem] text-center shadow-2xl relative overflow-hidden"
          >
            {/* Golden particles orbiting */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute left-1/2 top-1/2 -ml-20 -mt-20 w-40 h-40 border border-gold-soft/30 rounded-full opacity-50"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute left-1/2 top-1/2 -ml-32 -mt-32 w-64 h-64 border border-petal-pink/30 rounded-full opacity-30"
              />
            </div>

            <Heart className="w-16 h-16 text-petal-pink mx-auto mb-10 fill-current opacity-20" />
            
            <h2 className="text-6xl md:text-8xl font-serif mb-8 text-glow">{ZELIA_TRIBUTE.name}</h2>
            
            <div className="space-y-6 text-xl md:text-3xl font-poetic leading-relaxed max-w-2xl mx-auto italic">
              {ZELIA_TRIBUTE.message.split('|').map((part, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.3 }}
                >
                  {part}
                </motion.p>
              ))}
            </div>

            <motion.div 
              className="mt-16 inline-block px-10 py-1 bg-gold-soft/20 rounded-full text-sm uppercase tracking-[0.4em]"
              whileInView={{ letterSpacing: "0.2em" }}
            >
              Eternamente
            </motion.div>
          </motion.div>
        </div>
        
        {/* Background Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-soft/10 blur-[150px] rounded-full -z-10" />
      </section>

      {/* Global Tribute */}
      <section className="py-40 relative flex flex-col items-center justify-center text-center px-6">
        <motion.div
           style={{
             scale: useTransform(scrollYProgress, [0.7, 0.9], [0.8, 1.2]),
             opacity: useTransform(scrollYProgress, [0.7, 0.9], [0, 1])
           }}
           className="mb-20"
        >
          <div className="relative group">
            <Globe className="w-48 h-48 md:w-64 md:h-64 text-gold-soft/40 animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-0 bg-gold-soft/0 group-hover:bg-gold-soft/5 rounded-full transition-all duration-700 blur-xl" />
          </div>
        </motion.div>
        
        <h3 className="text-3xl md:text-5xl font-serif mb-6 max-w-3xl">
          “Em cada canto do planeta existe uma mãe mudando o destino de alguém.”
        </h3>
        
        <p className="opacity-40 max-w-md mx-auto">
          Uma conexão de amor que atravessa oceanos, fronteiras e tempos.
        </p>
      </section>

      {/* Finale Section */}
      <section className="h-[120vh] flex flex-col items-center justify-center text-center px-6 relative">
        <AnimatePresence>
          {showFinale && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="z-10 flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
                className="mb-12"
              >
                <div className="w-32 h-32 md:w-48 md:h-48 glass rounded-full shadow-[0_0_100px_rgba(247,231,206,0.3)] flex items-center justify-center">
                  <Star className="w-16 h-16 text-gold-soft fill-current" />
                </div>
              </motion.div>

              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-4xl md:text-6xl font-serif mb-8 text-pearl"
              >
                Para todas as mães do universo… <br />
                <span className="text-petal-pink italic">obrigado por existirem. ❤️</span>
              </motion.h2>

              <motion.footer 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1.5 }}
                className="mt-20 text-xs uppercase tracking-[0.5em] text-pearl/50"
              >
                Com amor • 2026
              </motion.footer>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Luminous Tree Background (Abstract SVG) */}
        <div className="absolute bottom-0 w-full max-w-4xl opacity-10 blur-sm">
           <svg viewBox="0 0 800 600" className="w-full h-auto">
             <path 
                d="M400 600 Q400 400 400 200 M400 400 Q450 350 500 380 M400 350 Q350 300 300 330 M400 300 Q430 250 480 260 M400 250 Q370 200 320 210" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round"
             />
           </svg>
        </div>
      </section>

      {/* Cinematic Borders */}
      <div className="fixed inset-0 pointer-events-none ring-[1.5rem] md:ring-[3rem] ring-pearl/5 z-40" />
    </motion.div>
  );
}

