import React, { useState } from 'react';
import {
  BookOpen,
  Play,
  Pause,
  Star,
  Clock,
  Users,
  Award,
  Search,
  TrendingUp,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Check,
  ChevronRight,
  Sparkles,
  Radio,
  Send,
  Heart,
  Share2,
  Plus,
  PenTool,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { mockCourses } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';
import { CourseLessonModal } from '@/components/learning/CourseLessonModal';
import { toast } from 'sonner';
import type { Course } from '@/types';

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const categories = ['All', 'Investing', 'Trading', 'Algo Trading', 'Derivatives', 'Wealth Management', 'Crypto'];

interface WebinarItem {
  id: string;
  title: string;
  host: string;
  role: string;
  date: string;
  registered: number;
  isLive: boolean;
  category: string;
  description: string;
}

const initialWebinars: WebinarItem[] = [
  {
    id: 'web001',
    title: 'Live: Q1 2024 Global Market Outlook & Sector Rotation',
    host: 'Marcus Chen',
    role: 'Chief Market Strategist',
    date: 'Today · Live Now',
    registered: 1420,
    isLive: true,
    category: 'Macro Economics',
    description:
      'Deep dive into global interest rates, inflation metrics, sector flow rotations, and top institutional conviction ideas.',
  },
  {
    id: 'web002',
    title: 'Options Masterclass: Mastering the Iron Condor & Volatility Trades',
    host: 'Priya Sharma',
    role: 'Lead Quant Researcher',
    date: 'Tomorrow · 7:00 PM IST',
    registered: 940,
    isLive: false,
    category: 'Options & Derivatives',
    description:
      'Practical setups for range-bound markets, delta-neutral hedging, and real-time risk adjustments during earnings season.',
  },
  {
    id: 'web003',
    title: 'Understanding Central Bank Monetary Policies & Bond Yields',
    host: 'Marcus Chen',
    role: 'Chief Market Strategist',
    date: 'Jan 28, 2024 · 6:30 PM IST',
    registered: 760,
    isLive: false,
    category: 'Monetary Policy',
    description:
      'How rate cut cycles, liquidity shifts, and treasury yield curves impact equity valuations and risk-on assets.',
  },
  {
    id: 'web004',
    title: 'Building Automated Trading Bots with Python & Websockets',
    host: 'Neha Kapoor',
    role: 'CTO & Co-Founder',
    date: 'Feb 2, 2024 · 8:00 PM IST',
    registered: 1850,
    isLive: false,
    category: 'Algo Trading',
    description:
      'From historical backtesting to low-latency automated order routing using NovaEq APIs and websocket data streams.',
  },
  {
    id: 'web005',
    title: 'Risk Management Secrets for High-Frequency Scalpers',
    host: 'Rajan Suri',
    role: 'Chief Risk Officer',
    date: 'Feb 6, 2024 · 5:30 PM IST',
    registered: 1120,
    isLive: false,
    category: 'Risk Control',
    description:
      'Position sizing, VaR models, strict stop-loss discipline, and psychological drawdown mitigation strategies.',
  },
  {
    id: 'web006',
    title: 'High-Growth Small Caps: Uncovering Alpha in Emerging Sectors',
    host: 'Aditya Menon',
    role: 'CEO & Co-Founder',
    date: 'Feb 10, 2024 · 6:00 PM IST',
    registered: 2100,
    isLive: false,
    category: 'Fundamental Analysis',
    description:
      'Screening undervalued high-ROCE small caps with robust balance sheets, strong cash flows, and moat advantages.',
  },
  {
    id: 'web007',
    title: 'Crypto & DeFi Derivatives: Navigating On-Chain Perpetual Protocols',
    host: 'Jordan Liu',
    role: 'Crypto Research Lead',
    date: 'Feb 15, 2024 · 7:30 PM IST',
    registered: 830,
    isLive: false,
    category: 'Crypto',
    description:
      'On-chain funding rates, DEX liquidity pools, cross-margin mechanics, and hedging spot exposure effectively.',
  },
];

interface BlogItem {
  id: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  tag: string;
  views: number;
  likes: number;
  cover: string;
  content: string;
  keyTakeaways: string[];
}

const initialBlogs: BlogItem[] = [
  {
    id: 'blog001',
    title: '10 Lessons from the 2023 Market Rally: What Every Investor Must Know',
    author: 'Marcus Chen',
    date: 'Jan 14, 2024',
    readTime: '8 min',
    tag: 'Strategy',
    views: 12400,
    likes: 412,
    cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop',
    content: `The 2023 market cycle taught us that macroeconomic sentiment can pivot much faster than consensus estimates predict. In this deep dive, we explore how liquidity injections, tech sector earnings resilience, and systematic rebalancing drove an unprecedented breakout.\n\nKey pillars of modern alpha generation involve avoiding market noise, maintaining systematic dollar-cost averaging in quality index components, and leveraging AI models to spot asymmetry before broader earnings revisions hit the tape.`,
    keyTakeaways: [
      'Momentum often persists longer than fundamental multiples suggest during liquidity expansion.',
      'Maintaining systematic rebalancing outperforms attempting to time macro rate cut pivots.',
      'Asymmetrical risk-to-reward setups exist in unloved cyclical sectors during peak pessimism.',
    ],
  },
  {
    id: 'blog002',
    title: 'Why AI is Changing Stock Selection and Quant Modeling Forever',
    author: 'Priya Sharma',
    date: 'Jan 10, 2024',
    readTime: '6 min',
    tag: 'AI & Tech',
    views: 9800,
    likes: 388,
    cover: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&h=450&fit=crop',
    content: `Traditional factor investing relied on static quarterly P/E ratios and historical beta. Today, multi-modal transformer models evaluate 500+ real-time variables per equity: transcript tone analysis, supply chain lead indicators, satellite parking data, and live options order flow.\n\nAt NovaEq, our neural architectures continuously compute signal confidence scores to assist traders in identifying divergence between actual intrinsic cash flows and short-term volatility.`,
    keyTakeaways: [
      'Natural language processing extracts non-linear alpha from conference calls and earnings disclosures.',
      'Combining sentiment indicators with order book imbalance yields superior short-term entry timing.',
      'AI models must be coupled with strict VaR constraints to prevent overfitting during black swan events.',
    ],
  },
  {
    id: 'blog003',
    title: 'Building a Resilient Dividend Portfolio from Scratch in India',
    author: 'Marcus Chen',
    date: 'Jan 6, 2024',
    readTime: '12 min',
    tag: 'Investing',
    views: 8200,
    likes: 295,
    cover: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop',
    content: `Dividend growth investing is one of the most reliable wealth accumulation paths. Rather than chasing high yield traps (companies with unsustainable 12%+ yields on falling revenues), focus on Dividend Aristocrats that consistently increase payouts by 10%+ annually with sub-50% payout ratios.\n\nWe break down how to blend FMCG stalwarts, IT cash generators, and energy infrastructure trusts into a compounding dividend snowball.`,
    keyTakeaways: [
      'Prioritize dividend growth rate over raw starting yield.',
      'Check free cash flow conversion rates to ensure dividend durability through bear markets.',
      'Reinvesting dividends automatically accelerates portfolio compounding by over 40% across a decade.',
    ],
  },
  {
    id: 'blog004',
    title: 'The Complete Step-by-Step Guide to SIP and Rupee Cost Averaging',
    author: 'NovaEq Team',
    date: 'Jan 2, 2024',
    readTime: '10 min',
    tag: 'Beginner',
    views: 15600,
    likes: 540,
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    content: `Systematic Investment Plans (SIP) remain the single most effective tool for retail investors to eliminate emotion and neutralize volatility. By deploying capital on a disciplined monthly schedule, investors buy more units when prices dip and fewer when markets are overheated.\n\nLearn how step-up SIPs (increasing contribution by 10% each year) can double your terminal portfolio value over a 15-year horizon.`,
    keyTakeaways: [
      'Step-up SIPs outperform static SIPs by over 65% in long-term wealth generation.',
      'Never pause SIPs during market corrections—corrections are when the highest future returns are seeded.',
      'Automate execution on salary credit dates to maintain investing discipline.',
    ],
  },
  {
    id: 'blog005',
    title: 'How to Backtest Quantitative Strategies with Python and Pandas',
    author: 'Priya Sharma',
    date: 'Dec 28, 2023',
    readTime: '14 min',
    tag: 'Algo Trading',
    views: 11300,
    likes: 460,
    cover: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=450&fit=crop',
    content: `Developing quantitative trading algorithms requires rigorous backtesting that accounts for slippage, exchange fees, survivorship bias, and lookahead leakage. In this technical walkthrough, we code a mean-reversion RSI strategy with dynamic Bollinger Band triggers using Python vectorbt and backtrader libraries.`,
    keyTakeaways: [
      'Always simulate realistic execution slippage and exchange fees.',
      'Use out-of-sample forward testing and Monte Carlo simulations to verify strategy robustness.',
      'Ensure Sharpe ratio calculation uses risk-free benchmarks appropriate for your market.',
    ],
  },
  {
    id: 'blog006',
    title: 'Options Greeks Explained: Delta, Gamma, Theta, and Vega Simplified',
    author: 'Rajan Suri',
    date: 'Dec 22, 2023',
    readTime: '9 min',
    tag: 'Derivatives',
    views: 14200,
    likes: 610,
    cover: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop',
    content: `Options pricing is not just about directional movement—it is a multi-dimensional pricing model governed by the Greeks. Understanding Theta decay acceleration inside the final 14 days of expiration and Vega sensitivity during earnings announcements gives traders a decisive statistical edge.`,
    keyTakeaways: [
      'Delta measures directional sensitivity; Theta measures time decay decay speed.',
      'Gamma is highest near the money as expiration approaches, causing explosive price swings.',
      'Vega determines option pricing inflation before major corporate or macro announcements.',
    ],
  },
  {
    id: 'blog007',
    title: 'Macroeconomic Regimes: Sector Allocation During Interest Rate Cycles',
    author: 'Marcus Chen',
    date: 'Dec 18, 2023',
    readTime: '11 min',
    tag: 'Macro',
    views: 7900,
    likes: 310,
    cover: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=450&fit=crop',
    content: `Historical equity performance changes dramatically across economic phases: Early Recovery, Mid-Cycle Expansion, Late-Cycle Overheating, and Recession. We map out which sectors (Financials, Tech, Consumer Discretionary, Utilities, and Healthcare) outperform in each regime.`,
    keyTakeaways: [
      'Technology and consumer discretionary thrive in early to mid-cycle recovery periods.',
      'Utilities, healthcare, and FMCG provide defensive downside cushioning in late-cycle slowdowns.',
      'Financials benefit from steepening yield curves and expanding net interest margins.',
    ],
  },
  {
    id: 'blog008',
    title: 'Risk Parity Frameworks: Modern Portfolio Theory in Action',
    author: 'Aditya Menon',
    date: 'Dec 12, 2023',
    readTime: '15 min',
    tag: 'Wealth Management',
    views: 8900,
    likes: 375,
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    content: `Standard 60/40 portfolios allocate 60% of capital to equities, but equities account for over 90% of total portfolio risk. Risk Parity allocates capital based on risk contribution rather than dollar amounts, creating an all-weather portfolio capable of steady compounded gains across inflationary and deflationary climates.`,
    keyTakeaways: [
      'Equate volatility contributions across equities, fixed income, gold, and commodities.',
      'Leveraging lower-volatility asset classes produces higher Sharpe ratios than unleveraged equity concentration.',
      'Periodic rebalancing harvests volatility premiums systematically.',
    ],
  },
];

const sampleCurriculums: Record<string, { title: string; duration: string; completed?: boolean }[]> = {
  cr002: [
    { title: 'Lesson 1: Introduction to Candlestick Anatomy', duration: '18:40', completed: true },
    { title: 'Lesson 2: Identifying Major Support & Resistance Zones', duration: '24:15', completed: true },
    { title: 'Lesson 3: High-Probability Chart Patterns & Breakouts', duration: '32:10', completed: false },
    { title: 'Lesson 4: Momentum Oscillators (RSI, MACD, Stochastics)', duration: '28:50', completed: false },
    { title: 'Lesson 5: Volume Profile & Order Flow Analysis', duration: '35:20', completed: false },
    { title: 'Lesson 6: Risk-to-Reward Calibration & Exit Strategy', duration: '22:15', completed: false },
  ],
  default: [
    { title: 'Lesson 1: Core Fundamentals & Market Terminology', duration: '15:30', completed: true },
    { title: 'Lesson 2: Navigating Financial Statements & Multiples', duration: '22:45', completed: false },
    { title: 'Lesson 3: Quantitative Strategy Construction', duration: '29:10', completed: false },
    { title: 'Lesson 4: Position Sizing & Drawdown Management', duration: '25:00', completed: false },
  ],
};

const Learn: React.FC = () => {
  const { openAuthModal, isLoggedIn, currentUser, enrollCourse, courses, updateCourseProgress, addAlert } =
    useAppStore();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const [category, setCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'courses' | 'webinars' | 'blog'>('courses');

  // Courses Video Modal
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(145);

  // Webinars State
  const [webinarList, setWebinarList] = useState<WebinarItem[]>(initialWebinars);
  const [registeredWebinarIds, setRegisteredWebinarIds] = useState<Record<string, boolean>>({});
  const [activeLiveWebinar, setActiveLiveWebinar] = useState<WebinarItem | null>(null);
  const [liveChatMessages, setLiveChatMessages] = useState<{ user: string; text: string; time: string }[]>([
    { user: 'Siddharth M.', text: 'Excited for this market overview!', time: '6:02 PM' },
    { user: 'Ananya R.', text: 'What is your outlook on tech earnings this quarter?', time: '6:04 PM' },
    { user: 'Vikram K.', text: 'The liquidity chart explained everything so clearly.', time: '6:05 PM' },
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');

  // Market Blog State
  const [blogList, setBlogList] = useState<BlogItem[]>(initialBlogs);
  const [activeBlog, setActiveBlog] = useState<BlogItem | null>(null);
  const [showCreateBlogModal, setShowCreateBlogModal] = useState(false);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogTag, setNewBlogTag] = useState('Strategy');
  const [newBlogReadTime, setNewBlogReadTime] = useState('7 min');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogTakeaways, setNewBlogTakeaways] = useState('');

  const courseList = courses && courses.length > 0 ? courses : mockCourses;

  const filteredCourses = courseList.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchLevel = level === 'All' || c.level === level.toLowerCase();
    const matchCat = category === 'All' || c.category === category;
    return matchSearch && matchLevel && matchCat;
  });

  // Course Handlers
  const handleCardClick = (course: Course) => {
    if (!course.isEnrolled) {
      enrollCourse(course.id);
      if (isLoggedIn && currentUser) {
        addAlert({
          userId: currentUser.id,
          type: 'portfolio',
          title: 'Enrolled in Course',
          message: `You are now enrolled in "${course.title}". Happy learning!`,
        });
      }
      toast.success(`Enrolled in ${course.title}!`);
    }

    setActiveCourse(course);
  };

  const handleEnrollButton = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    handleCardClick(course);
  };

  const handleCompleteCurrentLesson = () => {
    if (!activeCourse) return;
    const lessonsList = sampleCurriculums[activeCourse.id] || sampleCurriculums.default;
    const nextProgress = Math.min(100, Math.round(((activeLessonIndex + 1) / lessonsList.length) * 100));
    updateCourseProgress(activeCourse.id, nextProgress);

    toast.success(`Lesson marked complete! Course progress: ${nextProgress}%`);

    if (activeLessonIndex < lessonsList.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    }
  };

  // Webinar Handlers
  const handleWebinarAction = (webinar: WebinarItem) => {
    if (webinar.isLive) {
      // Open Live Webinar Stream Modal
      setActiveLiveWebinar(webinar);
      toast.success(`Connected to live stream: ${webinar.title}`);
      return;
    }

    // Toggle Registration
    const isAlreadyReg = !!registeredWebinarIds[webinar.id];
    const newRegState = !isAlreadyReg;

    setRegisteredWebinarIds((prev) => ({ ...prev, [webinar.id]: newRegState }));
    setWebinarList((prev) =>
      prev.map((w) =>
        w.id === webinar.id ? { ...w, registered: w.registered + (newRegState ? 1 : -1) } : w
      )
    );

    if (newRegState) {
      if (currentUser) {
        addAlert({
          userId: currentUser.id,
          type: 'news',
          title: 'Webinar Registered',
          message: `You are registered for "${webinar.title}" on ${webinar.date}.`,
        });
      }
      toast.success(`Registered for "${webinar.title}"! Calendar reminder added.`);
    } else {
      toast.info(`Registration cancelled for "${webinar.title}".`);
    }
  };

  const handleSendLiveChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    const newMsg = {
      user: currentUser?.name || 'You',
      text: newChatMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLiveChatMessages((prev) => [...prev, newMsg]);
    setNewChatMessage('');
  };

  // Blog Handlers
  const handleBlogClick = (blog: BlogItem) => {
    setActiveBlog(blog);
  };

  const handleLikeBlog = (e: React.MouseEvent, blogId: string) => {
    e.stopPropagation();
    setBlogList((prev) =>
      prev.map((b) => (b.id === blogId ? { ...b, likes: b.likes + 1 } : b))
    );
    if (activeBlog && activeBlog.id === blogId) {
      setActiveBlog((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
    }
    toast.success('Thank you for liking this article!');
  };

  const handleCreateBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle.trim() || !newBlogContent.trim()) {
      toast.error('Please enter article title and content.');
      return;
    }

    const takeawaysArray = newBlogTakeaways
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    const createdBlog: BlogItem = {
      id: `blog_${Date.now()}`,
      title: newBlogTitle.trim(),
      author: currentUser?.name || 'Verified Author',
      date: 'Just now',
      readTime: newBlogReadTime || '5 min',
      tag: newBlogTag || 'Strategy',
      views: 1,
      likes: 1,
      cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop',
      content: newBlogContent.trim(),
      keyTakeaways: takeawaysArray.length > 0 ? takeawaysArray : ['Analysis powered by NovaEq community research.'],
    };

    setBlogList([createdBlog, ...blogList]);
    setShowCreateBlogModal(false);
    setNewBlogTitle('');
    setNewBlogContent('');
    setNewBlogTakeaways('');
    toast.success('Your market article has been published successfully!');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#070d1a] text-[#f8fafc]">
      {/* Header */}
      <div className="bg-[#0b1428]/60 border-b border-[#1c2a45] py-14 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <BookOpen size={14} />
            <span>NovaEq Learning Academy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-3">
            Master the Markets,
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              One Course at a Time
            </span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            60+ expert-led video courses, live interactive webinars, and research articles for modern investors.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm text-slate-300">
            {[
              { icon: BookOpen, label: '60+ Interactive Courses' },
              { icon: Users, label: '45,000+ Active Students' },
              { icon: Award, label: 'Certified Badges' },
              { icon: Play, label: 'Live Masterclasses' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={16} className="text-emerald-400" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tabs Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-1 bg-[#0f1c33] border border-[#1c2a45] p-1.5 rounded-xl w-fit shadow-inner">
            {['courses', 'webinars', 'blog'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t as typeof activeTab)}
                className={cn(
                  'px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold capitalize transition-all',
                  activeTab === t ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                )}
              >
                {t === 'blog' ? 'Market Blog' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Action button if on blog tab */}
          {activeTab === 'blog' && (
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  openAuthModal('Publish a market article — create your account.');
                  return;
                }
                setShowCreateBlogModal(true);
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto"
            >
              <Plus size={16} />
              <span>Write New Article</span>
            </button>
          )}
        </div>

        {/* TAB 1: COURSES */}
        {activeTab === 'courses' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="relative flex-1 min-w-48">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by course title or instructor..."
                  className="w-full bg-[#0d182e] border border-[#1c2a45] text-white rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="bg-[#0d182e] border border-[#1c2a45] text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm w-36 focus:outline-none focus:border-blue-500"
              >
                {levels.map((l) => (
                  <option key={l} value={l} className="bg-[#0d182e] text-white">
                    {l}
                  </option>
                ))}
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-[#0d182e] border border-[#1c2a45] text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm w-44 focus:outline-none focus:border-blue-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#0d182e] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Progress Banner */}
            {isLoggedIn && (
              <TiltCard className="p-5 mb-8 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 to-blue-950/20" tiltMaxAngle={4}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      <Sparkles size={16} className="text-emerald-400" />
                      <span>Your Learning Progress</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Track your course completions and interactive lessons</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-400 font-mono">65%</p>
                      <p className="text-[11px] text-slate-400">Stock Market Basics</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-400 font-mono">30%</p>
                      <p className="text-[11px] text-slate-400">Technical Analysis</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            )}

            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" id="tutorials">
              {filteredCourses.map((course) => (
                <TiltCard
                  key={course.id}
                  className="p-0 overflow-hidden flex flex-col cursor-pointer group border border-[#1c2a45] hover:border-blue-500/50 transition-all rounded-2xl bg-[#0a1224]"
                  tiltMaxAngle={8}
                  translateZ={10}
                  onClick={() => handleCardClick(course)}
                >
                  <div className="relative h-44 w-full bg-[#0d182e] overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=340&fit=crop';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play size={20} className="ml-0.5" />
                      </div>
                    </div>

                    <span
                      className={cn(
                        'absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider',
                        course.level === 'beginner'
                          ? 'bg-emerald-500/90 text-slate-950'
                          : course.level === 'intermediate'
                          ? 'bg-amber-400/90 text-slate-950'
                          : 'bg-rose-500/90 text-white'
                      )}
                    >
                      {course.level}
                    </span>

                    {course.isEnrolled && course.progress === 100 && (
                      <span className="absolute top-3 right-3 bg-emerald-500/90 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                        <CheckCircle2 size={13} /> Completed
                      </span>
                    )}

                    {course.isEnrolled && course.progress > 0 && course.progress < 100 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                        <div className="h-full bg-emerald-400" style={{ width: `${course.progress}%` }} />
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-blue-400 block mb-1.5">
                        {course.category}
                      </span>
                      <h3 className="text-base font-display font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 pb-3 mb-3 border-b border-[#1c2a45]">
                        <span className="font-medium text-slate-300">{course.instructor}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="flex items-center gap-1 text-amber-400">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            {course.rating}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock size={12} />
                            {course.duration}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {course.enrolled.toLocaleString()} enrolled
                        </span>
                        <button
                          onClick={(e) => handleEnrollButton(e, course)}
                          className={cn(
                            'text-xs px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-1.5',
                            course.isEnrolled
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25'
                          )}
                        >
                          <Play size={12} className="fill-current" />
                          <span>
                            {course.isEnrolled
                              ? course.progress === 100
                                ? 'Review Course'
                                : `Continue (${course.progress}%)`
                              : 'Enroll Free'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </>
        )}

        {/* TAB 2: WEBINARS */}
        {activeTab === 'webinars' && (
          <div className="space-y-4 mb-12" id="webinars">
            {webinarList.map((w) => {
              const isRegistered = !!registeredWebinarIds[w.id];

              return (
                <TiltCard
                  key={w.id}
                  className={cn(
                    'p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer border transition-all',
                    w.isLive ? 'border-rose-500/40 bg-rose-950/10' : 'border-[#1c2a45] hover:border-blue-500/40'
                  )}
                  tiltMaxAngle={4}
                  translateZ={6}
                  onClick={() => handleWebinarAction(w)}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        w.isLive ? 'bg-rose-500/20 border border-rose-500/40' : 'bg-blue-500/15 border border-blue-500/30'
                      )}
                    >
                      {w.isLive ? (
                        <Radio size={22} className="text-rose-400 animate-pulse" />
                      ) : (
                        <Calendar size={20} className="text-blue-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-400">[{w.category}]</span>
                        <h3 className="text-sm sm:text-base font-bold text-white">{w.title}</h3>
                        {w.isLive && (
                          <span className="text-[10px] bg-rose-500 text-white px-2.5 py-0.5 rounded-full font-bold animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE NOW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mb-1 leading-relaxed">{w.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span>
                          Host: <strong className="text-slate-200">{w.host}</strong> ({w.role})
                        </span>
                        <span>·</span>
                        <span>{w.date}</span>
                        <span>·</span>
                        <span className="text-emerald-400 font-mono font-medium">
                          {w.registered.toLocaleString()} registered
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0 pt-2 sm:pt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWebinarAction(w);
                      }}
                      className={cn(
                        'text-xs sm:text-sm py-2.5 px-5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-sm',
                        w.isLive
                          ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 animate-pulse'
                          : isRegistered
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      )}
                    >
                      {w.isLive ? (
                        <>
                          <Play size={14} className="fill-current" />
                          <span>Join Live Stream</span>
                        </>
                      ) : isRegistered ? (
                        <>
                          <CheckCircle2 size={14} className="text-emerald-400" />
                          <span>Registered ✓</span>
                        </>
                      ) : (
                        <span>Register Free</span>
                      )}
                    </button>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        )}

        {/* TAB 3: MARKET BLOG */}
        {activeTab === 'blog' && (
          <div className="grid md:grid-cols-2 gap-6 mb-12" id="blog">
            {blogList.map((b) => (
              <TiltCard
                key={b.id}
                className="p-6 cursor-pointer group border border-[#1c2a45] hover:border-blue-500/40 transition-all rounded-2xl bg-[#0a1224] flex flex-col justify-between"
                tiltMaxAngle={5}
                translateZ={8}
                onClick={() => handleBlogClick(b)}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 inline-block">
                      {b.tag}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{b.readTime} read</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-display font-bold text-white mb-2.5 group-hover:text-blue-300 transition-colors leading-snug">
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-5">{b.content}</p>
                </div>

                <div className="pt-4 border-t border-[#1c2a45] flex items-center justify-between text-xs text-slate-400">
                  <div>
                    <span className="text-slate-200 font-medium block">{b.author}</span>
                    <span className="text-slate-400 text-[11px]">{b.date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-slate-400">
                      <TrendingUp size={13} />
                      <span>{b.views.toLocaleString()}</span>
                    </span>

                    <button
                      onClick={(e) => handleLikeBlog(e, b.id)}
                      className="flex items-center gap-1 text-slate-300 hover:text-rose-400 transition-colors p-1"
                      title="Like article"
                    >
                      <Heart size={14} className="fill-rose-500/20 text-rose-400" />
                      <span>{b.likes}</span>
                    </button>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </div>

      {/* 1. INTERACTIVE COURSE & LESSON VIDEO MODAL */}
      <CourseLessonModal
        isOpen={!!activeCourse}
        onClose={() => setActiveCourse(null)}
        course={activeCourse}
      />

      {/* 2. LIVE WEBINAR STREAM MODAL */}
      {activeLiveWebinar && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0a1224] border border-[#243960] rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-[#1c2a45] flex items-center justify-between bg-[#0f1c33]">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" /> LIVE STREAM
                </span>
                <h3 className="text-sm sm:text-base font-display font-bold text-white truncate">
                  {activeLiveWebinar.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveLiveWebinar(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Video + Live Chat */}
            <div className="grid lg:grid-cols-3 flex-1 overflow-y-auto">
              <div className="lg:col-span-2 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-[#1c2a45] flex flex-col justify-between">
                <div className="relative aspect-video w-full rounded-xl bg-slate-950 border border-[#1c2a45] overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop"
                    alt="Live webinar"
                    className="absolute inset-0 w-full h-full object-cover opacity-35"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-xs font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                      <Users size={13} /> {activeLiveWebinar.registered.toLocaleString()} Watching
                    </span>
                    <span className="text-xs text-slate-300 font-mono bg-black/60 px-2 py-0.5 rounded">
                      1080p 60fps
                    </span>
                  </div>

                  <div className="relative z-10 my-auto text-center">
                    <p className="text-xs font-mono text-slate-300 uppercase tracking-widest mb-1">
                      Broadcasting Live
                    </p>
                    <h4 className="text-lg sm:text-xl font-display font-bold text-white max-w-md mx-auto">
                      {activeLiveWebinar.host} ({activeLiveWebinar.role})
                    </h4>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                    <span>Q&A Session Active</span>
                    <span className="text-emerald-400">Audio & Screen Sync: Optimal</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#1c2a45]">
                  <h4 className="font-bold text-white text-sm mb-1">{activeLiveWebinar.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{activeLiveWebinar.description}</p>
                </div>
              </div>

              {/* Live Chat Sidebar */}
              <div className="p-4 sm:p-5 bg-[#091020] flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1c2a45]">
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-blue-400" /> Live Chat
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Connected</span>
                  </div>

                  <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                    {liveChatMessages.map((msg, idx) => (
                      <div key={idx} className="bg-[#0f1c33]/70 p-2.5 rounded-xl border border-[#1c2a45] text-xs">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <strong className="text-blue-300">{msg.user}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">{msg.time}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendLiveChat} className="pt-3 mt-3 border-t border-[#1c2a45] flex gap-2">
                  <input
                    type="text"
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    placeholder="Ask a question or comment..."
                    className="flex-1 bg-[#0d182e] border border-[#1c2a45] text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-all flex items-center justify-center"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. FULL BLOG ARTICLE READER MODAL */}
      {activeBlog && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0a1224] border border-[#243960] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#1c2a45] flex items-center justify-between bg-[#0f1c33]">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300">
                {activeBlog.tag}
              </span>
              <button
                onClick={() => setActiveBlog(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3 leading-tight">
                  {activeBlog.title}
                </h2>
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pb-4 border-b border-[#1c2a45]">
                  <span>
                    By <strong className="text-slate-200">{activeBlog.author}</strong> · {activeBlog.date}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock size={13} /> {activeBlog.readTime}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <TrendingUp size={13} /> {activeBlog.views.toLocaleString()} views
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden aspect-video max-h-64 w-full bg-slate-950">
                <img src={activeBlog.cover} alt={activeBlog.title} className="w-full h-full object-cover" />
              </div>

              <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {activeBlog.content}
              </div>

              {activeBlog.keyTakeaways && activeBlog.keyTakeaways.length > 0 && (
                <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2.5">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles size={16} className="text-emerald-400" />
                    <span>Key Takeaways for Investors</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    {activeBlog.keyTakeaways.map((k, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-[#1c2a45] flex items-center justify-between">
                <button
                  onClick={(e) => handleLikeBlog(e, activeBlog.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 text-xs font-semibold transition-all"
                >
                  <Heart size={15} className="fill-rose-400 text-rose-400" />
                  <span>Like Article ({activeBlog.likes})</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Article link copied to clipboard!');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#142340] border border-[#243960] text-slate-200 hover:text-white text-xs font-semibold transition-all"
                >
                  <Share2 size={14} />
                  <span>Share Article</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. WRITE & PUBLISH ARTICLE MODAL */}
      {showCreateBlogModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0a1224] border border-[#243960] rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#1c2a45] flex items-center justify-between bg-[#0f1c33]">
              <div className="flex items-center gap-2.5">
                <PenTool size={18} className="text-blue-400" />
                <h3 className="font-display font-bold text-white text-lg">Write Market Article</h3>
              </div>
              <button
                onClick={() => setShowCreateBlogModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBlogSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Article Title *</label>
                <input
                  type="text"
                  value={newBlogTitle}
                  onChange={(e) => setNewBlogTitle(e.target.value)}
                  placeholder="e.g. How to Identify Multi-Baggar Breakouts in Bull Markets"
                  className="w-full bg-[#0d182e] border border-[#1c2a45] text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category Tag</label>
                  <select
                    value={newBlogTag}
                    onChange={(e) => setNewBlogTag(e.target.value)}
                    className="w-full bg-[#0d182e] border border-[#1c2a45] text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c} className="bg-[#0d182e]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Est. Read Time</label>
                  <input
                    type="text"
                    value={newBlogReadTime}
                    onChange={(e) => setNewBlogReadTime(e.target.value)}
                    placeholder="e.g. 6 min"
                    className="w-full bg-[#0d182e] border border-[#1c2a45] text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Article Body *</label>
                <textarea
                  value={newBlogContent}
                  onChange={(e) => setNewBlogContent(e.target.value)}
                  rows={6}
                  placeholder="Write your market insights, analysis, or trading strategy..."
                  className="w-full bg-[#0d182e] border border-[#1c2a45] text-white rounded-xl p-4 text-xs sm:text-sm focus:outline-none focus:border-blue-500 leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Key Takeaways (one per line)
                </label>
                <textarea
                  value={newBlogTakeaways}
                  onChange={(e) => setNewBlogTakeaways(e.target.value)}
                  rows={3}
                  placeholder="Key point 1&#10;Key point 2&#10;Key point 3"
                  className="w-full bg-[#0d182e] border border-[#1c2a45] text-white rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-[#1c2a45] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateBlogModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <PenTool size={14} />
                  <span>Publish Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learn;
