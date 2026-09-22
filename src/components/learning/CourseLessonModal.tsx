import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle2,
  Check,
  ChevronRight,
  BookOpen,
  Award,
  Download,
  FileText,
  Clock,
  Sparkles,
  Share2
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import type { Course } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface LessonItem {
  id: string;
  title: string;
  duration: string;
  durationSec: number;
  description: string;
  videoUrl?: string;
  previewThumbnail?: string;
}

export const COURSE_CURRICULUMS: Record<string, LessonItem[]> = {
  cr001: [
    {
      id: 'cr001_l1',
      title: 'Lesson 1: Introduction to Equities & Capital Markets',
      duration: '15:20',
      durationSec: 920,
      description: 'Understanding equity ownership, stock exchange infrastructure (NSE/BSE), and basic market terminology.',
      previewThumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop'
    },
    {
      id: 'cr001_l2',
      title: 'Lesson 2: How Order Matching & Market Auctions Work',
      duration: '18:45',
      durationSec: 1125,
      description: 'Limit orders, market orders, stop-loss orders, continuous trading sessions, and pre-market call auctions.',
      previewThumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop'
    },
    {
      id: 'cr001_l3',
      title: 'Lesson 3: Reading Balance Sheets & Income Statements',
      duration: '24:10',
      durationSec: 1450,
      description: 'Analyzing revenue growth, EBITDA margins, working capital cycles, and debt-to-equity ratios.',
      previewThumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop'
    },
    {
      id: 'cr001_l4',
      title: 'Lesson 4: Valuation Multiples (P/E, P/B, EV/EBITDA)',
      duration: '21:30',
      durationSec: 1290,
      description: 'Evaluating intrinsic stock value using PEG ratios, enterprise value, and industry benchmark comparisons.',
      previewThumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop'
    },
    {
      id: 'cr001_l5',
      title: 'Lesson 5: Constructing Your First All-Weather Portfolio',
      duration: '26:40',
      durationSec: 1600,
      description: 'Asset allocation principles, sector diversification, rupee-cost averaging, and risk tolerance calibration.',
      previewThumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop'
    }
  ],
  cr002: [
    {
      id: 'cr002_l1',
      title: 'Lesson 1: Candlestick Anatomy & Price Psychology',
      duration: '18:40',
      durationSec: 1120,
      description: 'Bullish/Bearish engulfing, pin bars, hammer candles, morning stars, and psychological exhaustion signals.',
      previewThumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop'
    },
    {
      id: 'cr002_l2',
      title: 'Lesson 2: Identifying Major Support & Resistance Zones',
      duration: '24:15',
      durationSec: 1455,
      description: 'Dynamic trendlines, pivot points, volume profile nodes, and historical liquidity accumulation pockets.',
      previewThumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&h=450&fit=crop'
    },
    {
      id: 'cr002_l3',
      title: 'Lesson 3: High-Probability Chart Patterns & Breakouts',
      duration: '32:10',
      durationSec: 1930,
      description: 'Head & Shoulders, Ascending Triangles, Double Bottoms, Bull Flags, and false-breakout filters.',
      previewThumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=450&fit=crop'
    },
    {
      id: 'cr002_l4',
      title: 'Lesson 4: Momentum Oscillators (RSI, MACD, Stochastics)',
      duration: '28:50',
      durationSec: 1730,
      description: 'Bullish/Bearish divergences, hidden divergences, MACD histogram crossovers, and multi-timeframe confirmation.',
      previewThumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop'
    },
    {
      id: 'cr002_l5',
      title: 'Lesson 5: Volume Profile & Institutional Order Flow',
      duration: '35:20',
      durationSec: 2120,
      description: 'POC (Point of Control), Value Area High/Low, delta footprint analysis, and institutional absorption.',
      previewThumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=450&fit=crop'
    },
    {
      id: 'cr002_l6',
      title: 'Lesson 6: Risk-to-Reward Calibration & Trade Execution',
      duration: '22:15',
      durationSec: 1335,
      description: '1:3 minimum risk/reward ratios, trailing stop techniques, position sizing formula, and trade journal logging.',
      previewThumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=450&fit=crop'
    }
  ],
  cr003: [
    {
      id: 'cr003_l1',
      title: 'Lesson 1: Quant Trading Environment Setup (Python & Pandas)',
      duration: '22:10',
      durationSec: 1330,
      description: 'Setting up Jupyter Lab, fetching tick data via APIs, and vectorizing pandas price series.',
      previewThumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=450&fit=crop'
    },
    {
      id: 'cr003_l2',
      title: 'Lesson 2: Mean-Reversion Strategy Formulation',
      duration: '28:30',
      durationSec: 1710,
      description: 'Building Bollinger Band and Z-score spread models for equity pairs and index baskets.',
      previewThumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&h=450&fit=crop'
    },
    {
      id: 'cr003_l3',
      title: 'Lesson 3: Backtesting & Slippage Simulation with VectorBT',
      duration: '34:00',
      durationSec: 2040,
      description: 'Realistic execution models, transaction cost accounting, drawdown analysis, and Sharpe ratio calculation.',
      previewThumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop'
    },
    {
      id: 'cr003_l4',
      title: 'Lesson 4: Live Order Routing via Broker REST WebSockets',
      duration: '30:45',
      durationSec: 1845,
      description: 'Handling WebSocket reconnects, heartbeat checks, automatic position square-off, and risk kill-switches.',
      previewThumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop'
    }
  ],
  cr004: [
    {
      id: 'cr004_l1',
      title: 'Lesson 1: Call & Put Options Foundations',
      duration: '20:15',
      durationSec: 1215,
      description: 'Strike prices, moneyness (ITM, ATM, OTM), intrinsic vs extrinsic value, and contract expiration cycles.',
      previewThumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop'
    },
    {
      id: 'cr004_l2',
      title: 'Lesson 2: Demystifying Option Greeks (Delta, Gamma, Theta, Vega)',
      duration: '29:40',
      durationSec: 1780,
      description: 'Directional sensitivity, gamma risk acceleration, theta time decay curves, and implied volatility crush.',
      previewThumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop'
    },
    {
      id: 'cr004_l3',
      title: 'Lesson 3: High-Win Rate Spreads (Bull Call & Bear Put)',
      duration: '25:20',
      durationSec: 1520,
      description: 'Capping maximum risk and margin requirements with vertical debit and credit spreads.',
      previewThumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop'
    },
    {
      id: 'cr004_l4',
      title: 'Lesson 4: Iron Condor & Delta-Neutral Strategies',
      duration: '31:10',
      durationSec: 1870,
      description: 'Collecting premium in range-bound markets, managing wings, and adjusting strikes during sharp breakouts.',
      previewThumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=450&fit=crop'
    }
  ],
  cr005: [
    {
      id: 'cr005_l1',
      title: 'Lesson 1: The Compounding Formula & Rupee Cost Averaging',
      duration: '16:30',
      durationSec: 990,
      description: 'How disciplined monthly SIPs turn market volatility into superior compound annual growth.',
      previewThumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop'
    },
    {
      id: 'cr005_l2',
      title: 'Lesson 2: Direct Mutual Funds vs Regular Plans',
      duration: '19:45',
      durationSec: 1185,
      description: 'Expense ratio drag analysis, tracking error in Index funds, and choosing between active vs passive funds.',
      previewThumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop'
    },
    {
      id: 'cr005_l3',
      title: 'Lesson 3: Tax Optimization (LTCG, STCG, Section 80C)',
      duration: '22:15',
      durationSec: 1335,
      description: 'Tax harvesting strategies, grandfathering clauses, and structuring multi-generational wealth vehicles.',
      previewThumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop'
    }
  ],
  cr006: [
    {
      id: 'cr006_l1',
      title: 'Lesson 1: Blockchain Infrastructure & Smart Contract Security',
      duration: '21:00',
      durationSec: 1260,
      description: 'Consensus mechanisms (PoW/PoS), layer 1 vs layer 2 rollups, and evaluating smart contract audits.',
      previewThumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=450&fit=crop'
    },
    {
      id: 'cr006_l2',
      title: 'Lesson 2: Decentralized Finance (DeFi) Yield Mechanics',
      duration: '27:30',
      durationSec: 1650,
      description: 'Automated Market Makers (AMM), liquidity pool impermanent loss, lending protocols, and flash loans.',
      previewThumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=450&fit=crop'
    },
    {
      id: 'cr006_l3',
      title: 'Lesson 3: On-Chain Derivatives & Perpetual Futures',
      duration: '25:40',
      durationSec: 1540,
      description: 'Analyzing funding rates, oracle price feeds, liquidation thresholds, and hedging spot exposures.',
      previewThumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&h=450&fit=crop'
    }
  ],
  default: [
    {
      id: 'def_l1',
      title: 'Lesson 1: Core Fundamentals & Market Terminology',
      duration: '15:30',
      durationSec: 930,
      description: 'Essential investing concepts, order books, and market mechanics.',
      previewThumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop'
    },
    {
      id: 'def_l2',
      title: 'Lesson 2: Analyzing Financial Statements & Ratios',
      duration: '22:45',
      durationSec: 1365,
      description: 'Evaluating corporate profitability, cash flows, and growth durability.',
      previewThumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop'
    },
    {
      id: 'def_l3',
      title: 'Lesson 3: Quantitative Strategy Construction',
      duration: '29:10',
      durationSec: 1750,
      description: 'Formulating systematic rules and timing entries with high mathematical edge.',
      previewThumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop'
    },
    {
      id: 'def_l4',
      title: 'Lesson 4: Risk Parity & Capital Preservation',
      duration: '25:00',
      durationSec: 1500,
      description: 'Position sizing, maximum drawdown rules, and long-term risk management.',
      previewThumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop'
    }
  ]
};

interface CourseLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export const CourseLessonModal: React.FC<CourseLessonModalProps> = ({ isOpen, onClose, course }) => {
  const { updateCourseProgress, enrollCourse, currentUser } = useAppStore();
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(65);
  const [playbackSpeed, setPlaybackSpeed] = useState<'1.0x' | '1.25x' | '1.5x' | '2.0x'>('1.0x');
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (course) {
      setActiveLessonIndex(0);
      setPlaybackTime(45);
      setIsPlaying(true);
      if (!course.isEnrolled) {
        enrollCourse(course.id);
      }
    }
  }, [course?.id]);

  if (!isOpen || !course) return null;

  const lessons = COURSE_CURRICULUMS[course.id] || COURSE_CURRICULUMS.default;
  const currentLesson = lessons[activeLessonIndex] || lessons[0];
  const maxDurationSec = currentLesson.durationSec || 1200;

  const handleLessonSelect = (index: number) => {
    setActiveLessonIndex(index);
    setPlaybackTime(0);
    setIsPlaying(true);
    toast.info(`Playing: ${lessons[index].title}`);
  };

  const handleMarkComplete = () => {
    const newCompleted = { ...completedLessons, [currentLesson.id]: true };
    setCompletedLessons(newCompleted);

    const completedCount = Object.keys(newCompleted).length;
    const progressPercent = Math.min(100, Math.round(((completedCount) / lessons.length) * 100));
    updateCourseProgress(course.id, progressPercent);

    toast.success(`Lesson marked completed! Total progress: ${progressPercent}%`);

    if (activeLessonIndex < lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
      setPlaybackTime(0);
      setIsPlaying(true);
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
      setPlaybackTime(0);
      setIsPlaying(true);
    } else {
      toast.success('You have completed all lessons in this course! Certificate earned.');
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = Math.floor(sec % 60);
    return `${mins}:${remainingSec < 10 ? '0' : ''}${remainingSec}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-[#0a1224] border border-[#243960] rounded-2xl max-w-6xl w-full max-h-[94vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-[#1c2a45] flex items-center justify-between bg-[#0f1c33]">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 font-bold text-xs uppercase flex items-center gap-1.5 flex-shrink-0">
              <BookOpen size={13} /> {course.level}
            </span>
            <h3 className="text-sm sm:text-base font-display font-bold text-white truncate">
              {course.title}
            </h3>
            <span className="hidden md:inline-block text-xs text-slate-400 font-mono">
              Instructor: {course.instructor}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Area + Curriculum Sidebar */}
        <div className="grid lg:grid-cols-3 flex-1 overflow-y-auto">
          
          {/* Main Video Player & Lesson Details */}
          <div className="lg:col-span-2 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-[#1c2a45] flex flex-col justify-between space-y-4">
            
            {/* Interactive Video Box */}
            <div className="relative aspect-video w-full rounded-xl bg-slate-950 border border-[#1c2a45] overflow-hidden flex flex-col justify-between p-4 shadow-2xl group">
              <img
                src={currentLesson.previewThumbnail || course.thumbnail}
                alt={currentLesson.title}
                className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Top Video Overlay Controls */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-md bg-black/70 backdrop-blur-md text-xs font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Lesson {activeLessonIndex + 1} of {lessons.length}
                </span>
                <span className="text-xs text-slate-300 font-mono bg-black/60 px-2.5 py-1 rounded border border-white/10">
                  HD 1080p · Ultra Audio
                </span>
              </div>

              {/* Center Play / Pause Indicator */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="relative z-10 self-center w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl transform transition-transform hover:scale-110"
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>

              {/* Bottom Video Controller Bar */}
              <div className="relative z-10 space-y-2 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>{formatSeconds(playbackTime)}</span>
                  <span>{currentLesson.duration}</span>
                </div>

                {/* Scrubber Progress Bar */}
                <div
                  className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden cursor-pointer relative"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    setPlaybackTime(Math.round(pct * maxDurationSec));
                  }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 transition-all duration-150"
                    style={{ width: `${Math.min(100, (playbackTime / maxDurationSec) * 100)}%` }}
                  />
                </div>

                {/* Controls Strip */}
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-white transition-colors">
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white transition-colors">
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <button
                      onClick={() => setPlaybackTime(Math.max(0, playbackTime - 10))}
                      className="hover:text-white flex items-center gap-0.5 text-[11px] font-mono transition-colors"
                    >
                      <RotateCcw size={14} /> -10s
                    </button>
                    <button
                      onClick={() => setPlaybackTime(Math.min(maxDurationSec, playbackTime + 10))}
                      className="hover:text-white flex items-center gap-0.5 text-[11px] font-mono transition-colors"
                    >
                      <RotateCw size={14} /> +10s
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Speed Selector */}
                    <div className="flex items-center gap-1 bg-[#101c33] px-2 py-0.5 rounded border border-[#1c2a45]">
                      {(['1.0x', '1.25x', '1.5x'] as const).map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setPlaybackSpeed(spd)}
                          className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded font-mono transition-all',
                            playbackSpeed === spd ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                          )}
                        >
                          {spd}
                        </button>
                      ))}
                    </div>
                    <Maximize2 size={15} className="cursor-pointer hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Information Box */}
            <div className="p-4 rounded-xl bg-[#0d182e] border border-[#1c2a45] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">Now Watching</span>
                  <h4 className="text-base sm:text-lg font-bold text-white">{currentLesson.title}</h4>
                </div>
                <button
                  onClick={handleMarkComplete}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-bold transition-all w-fit shadow-md shadow-emerald-500/10"
                >
                  <Check size={15} className="text-emerald-400" />
                  <span>Mark Lesson Complete</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentLesson.description}
              </p>

              {/* Resource Downloads */}
              <div className="pt-2 flex flex-wrap gap-2 border-t border-[#1c2a45]">
                <button
                  onClick={() => toast.success('Cheatsheet PDF downloaded to device.')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14223d] border border-[#1c2a45] text-slate-300 hover:text-white text-xs font-medium transition-colors"
                >
                  <Download size={13} className="text-blue-400" />
                  <span>Download Lesson Cheatsheet (PDF)</span>
                </button>
                <button
                  onClick={() => toast.success('Python source code notebook downloaded.')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14223d] border border-[#1c2a45] text-slate-300 hover:text-white text-xs font-medium transition-colors"
                >
                  <FileText size={13} className="text-emerald-400" />
                  <span>Exercise Code & Datasets</span>
                </button>
              </div>
            </div>
          </div>

          {/* Curriculum Sidebar */}
          <div className="p-4 sm:p-5 bg-[#091020] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Course Lessons ({lessons.length})
                </h4>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {Math.round(((Object.keys(completedLessons).length) / lessons.length) * 100)}% Complete
                </span>
              </div>

              {/* Lessons List */}
              <div className="space-y-2 max-h-[50vh] lg:max-h-[62vh] overflow-y-auto pr-1">
                {lessons.map((item, idx) => {
                  const isCurrent = idx === activeLessonIndex;
                  const isDone = completedLessons[item.id] || (course.progress >= ((idx + 1) / lessons.length) * 100);

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLessonSelect(idx)}
                      className={cn(
                        'w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between text-xs group',
                        isCurrent
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10'
                          : 'bg-[#0f1c33]/70 border-[#1c2a45] text-slate-300 hover:bg-[#152545] hover:border-slate-600'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {isDone ? (
                          <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                        ) : isCurrent ? (
                          <Play size={14} className="text-blue-400 flex-shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-600 flex-shrink-0 group-hover:border-slate-400" />
                        )}
                        <span className={cn('truncate font-medium', isCurrent ? 'text-white font-bold' : 'text-slate-300')}>
                          {item.title}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 flex-shrink-0">{item.duration}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-4 border-t border-[#1c2a45] space-y-2">
              <button
                onClick={handleNextLesson}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                <span>{activeLessonIndex < lessons.length - 1 ? 'Next Lesson' : 'Complete Course'}</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseLessonModal;
