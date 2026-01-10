import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Terminal, Users, Play, RefreshCw, Armchair, ChevronRight, Settings, Cpu, X } from 'lucide-react';
import './index.css';

function App() {
  const [step, setStep] = useState(0); 
  const [config, setConfig] = useState({ students: '', seats: '' });
  const [rolls, setRolls] = useState([]);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [reshuffleRoll, setReshuffleRoll] = useState('');
  const [showReshuffleInput, setShowReshuffleInput] = useState(false);
  const [simulationSeed, setSimulationSeed] = useState(null);
  const [reshuffleHistory, setReshuffleHistory] = useState([]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Matrix Rain Effect
  useEffect(() => {
    const canvas = document.getElementById('rain-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const columns = Math.floor(width / 20);
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * height; // Random start positions
    }
    
    const chars = "XYZ0123456789ABCDEFGHIJKLMNOPQR";
    
    const draw = () => {
        // Semi-transparent black to create trail effect
        ctx.shadowBlur = 0; // No shadow for the fade rect
        ctx.fillStyle = 'rgba(3, 3, 5, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = '#ff1f1f'; // Primary color
        ctx.font = '15px monospace';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff1f1f'; // Neon glow
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            
            // Randomly vary opacity for "glitch" feel, but keep it brighter
            ctx.globalAlpha = Math.random() > 0.95 ? 1 : 0.6;
            
            ctx.fillText(text, i * 20, drops[i] * 20);
            
            // Reset drop to top with randomness or keep falling
            if (drops[i] * 20 > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        ctx.globalAlpha = 1; // Reset opacity
    };

    const interval = setInterval(draw, 50); // 20 FPS-ish
    
    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
        clearInterval(interval);
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleConfigSubmit = (e) => {
    e.preventDefault();
    if (parseInt(config.students) > parseInt(config.seats)) {
      setError("Number of students cannot exceed total seats!");
      return;
    }
    setError(null);
    setRolls(Array(parseInt(config.students)).fill(''));
    setStep(1);
    // Reset seed when starting new config
    setSimulationSeed(null);
  };

  const handleRollChange = (index, value) => {
    const newRolls = [...rolls];
    newRolls[index] = value;
    setRolls(newRolls);
  };

  const runSimulation = async (rollToUndo = null) => {
    setStep(2);
    // Use a persistent seed for the layout
    let baseSeed;
    let currentHistory = [...reshuffleHistory];
    
    if (rollToUndo) {
      baseSeed = simulationSeed || Math.floor(Math.random() * 1000000);
      currentHistory.push(rollToUndo);
      setReshuffleHistory(currentHistory);
    } else {
      baseSeed = Math.floor(Math.random() * 1000000);
      setSimulationSeed(baseSeed);
      setReshuffleHistory([]);
      currentHistory = [];
    }

    console.log(`[Simulation] Stable BaseSeed: ${baseSeed}, History: ${currentHistory.join(',')}`);

    let inputStr = `${config.students}\n${config.seats}\n`;
    rolls.forEach(r => inputStr += `${r}\n`);

    // Add all reshuffles in sequence. Each 'y' draws from the SAME stable rand() sequence.
    currentHistory.forEach(roll => {
      inputStr += `y\n${roll}\n`;
    });
    inputStr += `n\n`;

    try {
      const response = await fetch('http://localhost:3001/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          input: inputStr,
          seed: baseSeed
        })
      });
      const data = await response.json();
      
      if (data.output) {
        setTimeout(() => {
            parseOutput(data.output);
            setStep(3);
            setShowReshuffleInput(false);
        }, 1500);
      } else {
        setError("No output received from backend");
        setStep(0);
      }
    } catch (err) {
      setError("Failed to connect to backend");
      setStep(0);
    }
  };

  const parseOutput = (rawOutput) => {
    const lines = rawOutput.split('\n');
    const seats = [];
    let parsing = false;
    
    for (const line of lines) {
      if (line.includes("Final Seating Arrangement:")) {
        parsing = true;
        continue;
      }
      if (parsing && line.trim().startsWith("Seat")) {
        const match = line.match(/Seat (\d+): (Roll (\d+)|Empty)/);
        if (match) {
          seats.push({
            id: parseInt(match[1]),
            roll: match[3] ? match[3] : null,
            empty: match[2] === 'Empty'
          });
        }
      }
    }
    setOutput(seats);
  };

  const reset = () => {
    setStep(0);
    setConfig({ students: '', seats: '' });
    setRolls([]);
    setOutput(null);
    setError(null);
    setReshuffleRoll('');
    setShowReshuffleInput(false);
    setReshuffleHistory([]);
  };

  const handleReshuffle = (e) => {
    e.preventDefault();
    if (!reshuffleRoll) return;

    // Validate that the roll number exists
    if (!rolls.includes(reshuffleRoll)) {
      setError(`Roll number ${reshuffleRoll} does not exist in the registry!`);
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setError(null);
    runSimulation(reshuffleRoll);
  };

  const handleRegenerate = () => {
    runSimulation(null); // This generates a fresh seed automatically
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="app-layout">
      {/* Backgrounds */}
      <canvas id="rain-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.8, pointerEvents: 'none' }}></canvas>
      <div className="grid-bg"></div>
      <div 
        className="spotlight-bg"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 31, 31, 0.08), transparent 40%)`
        }}
      />

      <div className="main-container">
        <motion.header 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="app-header"
        >
          <div className="title-wrapper">
            <h1 className="hero-title">
              EXAM SEATING <br /> <span className="text-gradient">ARRANGEMENT GENERATOR</span>
            </h1>
            <motion.div 
               className="title-underline"
               initial={{ width: 0 }}
               animate={{ width: '100%' }}
               transition={{ delay: 0.5, duration: 0.8 }}
            />
          </div>
          <p className="hero-subtitle">
            Start allocation sequence
          </p>
        </motion.header>

        <LayoutGroup>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="error-box"
              >
                {error}
              </motion.div>
            )}

            {step === 0 && (
              <motion.div
                key="step0"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="glass-panel panel-sm"
              >
                <div className="panel-header">
                  <div className="icon-wrapper">
                    <Settings />
                  </div>
                  <h2>System Configuration</h2>
                </div>
                
                <form onSubmit={handleConfigSubmit} className="config-form">
                  <div className="form-group">
                    <label className="input-label">Student Count</label>
                    <input 
                      type="number" 
                      value={config.students}
                      onChange={(e) => setConfig({...config, students: e.target.value})}
                      className="modern-input"
                      placeholder="e.g. 5"
                      required
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label className="input-label">Seat Capacity</label>
                    <input 
                      type="number" 
                      value={config.seats}
                      onChange={(e) => setConfig({...config, seats: e.target.value})}
                      className="modern-input"
                      placeholder="e.g. 10"
                      required
                      min="1"
                    />
                  </div>
                  <button type="submit" className="btn-modern btn-full">
                    Initialize Setup <ChevronRight />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="glass-panel panel-md"
              >
                <div className="panel-header spaced">
                  <div className="flex-row">
                    <div className="icon-wrapper">
                      <Users />
                    </div>
                    <h2>Student Registry</h2>
                  </div>
                  <span className="badge">{rolls.length} ENTRIES</span>
                </div>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="roll-grid"
                >
                  {rolls.map((roll, i) => (
                    <motion.div key={i} variants={itemVariants} className="roll-item">
                      <div className="input-group">
                        <label className="floating-label">
                          STUDENT {i + 1}
                        </label>
                        <input 
                          type="number"
                          value={roll}
                          onChange={(e) => handleRollChange(i, e.target.value)}
                          className="modern-input center-text"
                          placeholder="000"
                          required
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="action-row">
                  <button onClick={() => setStep(0)} className="btn-secondary">
                    Back
                  </button>
                  <button onClick={() => runSimulation(null)} className="btn-modern flex-grow">
                    Process Allocation <Play size={18} fill="currentColor" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="loading-screen"
              >
                <div className="loader-wrapper">
                  <div className="cyber-loader"></div>
                  <div className="loader-icon">
                    <Cpu />
                  </div>
                </div>
                <h3>Simulating...</h3>
                <p className="pulse-text">OPTIMIZING ARRANGEMENT</p>
              </motion.div>
            )}

            {step === 3 && output && (
              <motion.div
                key="step3"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                className="glass-panel panel-lg"
              >
                <div className="panel-header spaced">
                  <div className="flex-row">
                    <div className="icon-wrapper alert">
                      <Armchair />
                    </div>
                    <div>
                      <h2 className="no-margin">Seating Plan</h2>
                      <p className="sub-text">OPTIMIZED LAYOUT GENERATED</p>
                    </div>
                  </div>

                  <div className="controls-row">
                     {!showReshuffleInput ? (
                      <button 
                        onClick={() => setShowReshuffleInput(true)} 
                        className="btn-secondary btn-sm"
                      >
                        Modify Allocation
                      </button>
                    ) : (
                      <motion.form 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onSubmit={handleReshuffle} 
                        className="reshuffle-form"
                      >
                        <input 
                          type="number" 
                          value={reshuffleRoll}
                          onChange={e => setReshuffleRoll(e.target.value)}
                          placeholder="Enter Student Roll No"
                          className="modern-input py-2 px-3 w-48 text-sm"
                          autoFocus
                        />
                        <button type="submit" className="btn-icon"><ChevronRight size={18} /></button>
                        <button type="button" onClick={() => setShowReshuffleInput(false)} className="btn-icon secondary"><X size={18} /></button>
                      </motion.form>
                    )}
                    <button 
                      onClick={handleRegenerate}
                      className="btn-secondary btn-sm icon-btn"
                      title="Regenerate All"
                    >
                      <RefreshCw size={14} className={step === 2 ? "animate-spin" : ""} />
                    </button>
                    <button 
                      onClick={reset} 
                      className="btn-secondary btn-sm icon-btn"
                      title="New Configuration"
                    >
                      <Settings size={14} />
                    </button>
                  </div>
                </div>

                <motion.div 
                  className="seat-grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {output.map((seat) => (
                    <motion.div
                      key={seat.id}
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -5,
                        transition: { duration: 0.2 } 
                      }}
                      className={`seat-card-modern ${seat.empty ? 'empty' : 'occupied'}`}
                    >
                      <div className="seat-top">
                        <span className="seat-label">SEAT</span>
                        <span className="seat-id">{String(seat.id).padStart(2, '0')}</span>
                      </div>
                      
                      <div className="seat-main">
                         {seat.empty ? (
                           <div className="badge-vacant">
                             VACANT
                           </div>
                         ) : (
                           <>
                             <div className="student-label">ROLL NO</div>
                             <div className="seat-roll">{seat.roll}</div>
                           </>
                         )}
                      </div>

                      <div className="seat-status-bar">
                        <div className={`status-fill ${seat.empty ? '' : 'filled'}`}></div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  );
}

export default App;
