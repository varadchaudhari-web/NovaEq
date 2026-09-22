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
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { mockCourses } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';
import { toast } from 'sonner';
import type { Course } from '@/types';

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const categories = ['All', 'Investing', 'Trading', 'Algo Trading', 'Derivatives', 'Wealth Management', 'Crypto'];

const webinars = [
  { title: 'Live: Q1 2024 Market Outlook', host: 'Marcus Chen', date: 'Jan 20, 2024 · 6:00 PM IST', registered: 1240, isLive: true },
  { title: 'Options Strategy Workshop: Iron Condor', host: 'Priya Sharma', date: 'Jan 25, 2024 · 7:00 PM IST', registered: 890, isLive: false },
  { title: 'Understanding RBI Policy & Markets', host: 'Marcus Chen', date: 'Feb 1, 2024 · 6:30 PM IST', registered: 650, isLive: false },
];

const blogs = [
  { title: '10 Lessons from the 2023 Market Rally', author: 'Marcus Chen', date: 'Jan 14, 2024', readTime: '8 min', tag: 'Strategy', views: 12400 },
  { title: 'Why AI is Changing Stock Selection Forever', author: 'Priya Sharma', date: 'Jan 10, 2024', readTime: '6 min', tag: 'AI & Tech', views: 9800 },
  { title: 'Building a Dividend Portfolio from Scratch', author: 'Marcus Chen', date: 'Jan 6, 2024', readTime: '12 min', tag: 'Investing', views: 8200 },
  { title: 'The Complete Guide to SIP Investing', author: 'NovaEq Team', date: 'Jan 2, 2024', readTime: '10 min', tag: 'Beginner', views: 15600 },
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
  const { openAuthModal, isLoggedIn, enrollCourse, courses, updateCourseProgress, addAlert } = useAppStore();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const [category, setCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'courses' | 'webinars' | 'blog'>('courses');

  // Video Modal State
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(145);

  const courseList = courses && courses.length > 0 ? courses : mockCourses;

  const filtered = courseList.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchLevel = level === 'All' || c.level === level.toLowerCase();
    const matchCat = category === 'All' || c.category === category;
    return matchSearch && matchLevel && matchCat;
  });

  const handleCardClick = (course: Course) => {
    if (!isLoggedIn) {
      openAuthModal(`Access "${course.title}" — sign in or create your account.`);
      return;
    }

    if (!course.isEnrolled) {
      enrollCourse(course.id);
      addAlert({
        userId: 'current',
        type: 'portfolio',
        title: 'Enrolled in Course',
        message: `You are now enrolled in "${course.title}". Happy learning!`,
      });
      toast.success(`Successfully enrolled in ${course.title}!`);
    }

    setActiveCourse(course);
    setActiveLessonIndex(0);
    setIsPlaying(true);
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
            60+ expert-led video courses on investing, technical analysis, algorithmic trading, and derivatives.
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
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[#0f1c33] border border-[#1c2a45] p-1.5 rounded-xl w-fit">
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

            {/* My Progress Banner */}
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
              {filtered.map((course) => (
                <TiltCard
                  key={course.id}
                  className="p-0 overflow-hidden flex flex-col cursor-pointer group border border-[#1c2a45] hover:border-blue-500/50 transition-all rounded-2xl bg-[#0a1224]"
                  tiltMaxAngle={8}
                  translateZ={10}
                  onClick={() => handleCardClick(course)}
                >
                  {/* Card Thumbnail */}
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

                    {/* Level Tag */}
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

                    {/* Status badges */}
                    {course.isEnrolled && course.progress === 100 && (
                      <span className="absolute top-3 right-3 bg-emerald-500/90 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                        <CheckCircle2 size={13} /> Completed
                      </span>
                    )}

                    {/* Progress Bar */}
                    {course.isEnrolled && course.progress > 0 && course.progress < 100 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
                        <div className="h-full bg-emerald-400" style={{ width: `${course.progress}%` }} />
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
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

        {activeTab === 'webinars' && (
          <div className="space-y-4 mb-12" id="webinars">
            {webinars.map((w) => (
              <TiltCard
                key={w.title}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer border border-[#1c2a45]"
                tiltMaxAngle={5}
                translateZ={6}
                onClick={() => openAuthModal('Join live webinars — create your free account.')}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      w.isLive ? 'bg-rose-500/15 border border-rose-500/30' : 'bg-blue-500/15 border border-blue-500/30'
                    )}
                  >
                    <Play size={20} className={w.isLive ? 'text-rose-400' : 'text-blue-400'} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm sm:text-base font-bold text-white">{w.title}</p>
                      {w.isLive && (
                        <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {w.host} · {w.date}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openAuthModal('Join live webinars — create your free account.');
                  }}
                  className={cn(
                    'text-xs sm:text-sm py-2 px-5 rounded-xl font-semibold transition-all flex-shrink-0',
                    w.isLive ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-[#142340] hover:bg-[#1a2d52] text-slate-200 border border-[#243960]'
                  )}
                >
                  {w.isLive ? 'Join Live Stream' : 'Register'}
                </button>
              </TiltCard>
            ))}
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="grid md:grid-cols-2 gap-6 mb-12" id="blog">
            {blogs.map((b) => (
              <TiltCard
                key={b.title}
                className="p-6 cursor-pointer group border border-[#1c2a45]"
                tiltMaxAngle={6}
                translateZ={8}
                onClick={() => openAuthModal('Read full market blog posts — create your free account.')}
              >
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-3 inline-block">
                  {b.tag}
                </span>
                <h3 className="text-base font-display font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {b.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-[#1c2a45]">
                  <span>
                    {b.author} · {b.date}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {b.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp size={12} />
                      {(b.views / 1000).toFixed(1)}K views
                    </span>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </div>

      {/* INTERACTIVE COURSE VIDEO PLAYER MODAL */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0a1224] border border-[#243960] rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-[#1c2a45] flex items-center justify-between bg-[#0f1c33]">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Play size={16} className="fill-current" />
                </span>
                <div className="min-w-0 truncate">
                  <h3 className="text-sm sm:text-base font-display font-bold text-white truncate">
                    {activeCourse.title}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    Instructor: {activeCourse.instructor} · Level: {activeCourse.level} · Progress:{' '}
                    <span className="text-emerald-400 font-semibold">{activeCourse.progress}%</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveCourse(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-3"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Main Body */}
            <div className="grid lg:grid-cols-3 flex-1 overflow-y-auto">
              {/* Left 2 Cols: Video Player & Controls */}
              <div className="lg:col-span-2 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-[#1c2a45] flex flex-col justify-between">
                {/* Simulated Video Canvas Frame */}
                <div className="relative aspect-video w-full rounded-xl bg-slate-950 border border-[#1c2a45] overflow-hidden flex flex-col justify-between p-4 shadow-2xl group">
                  {/* Background Video Poster with Visual Animation */}
                  <img
                    src={activeCourse.thumbnail}
                    alt="Lesson preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 filter blur-[1px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* Live Watermark Badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-mono text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      HD 1080p · Interactive Stream
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
                      {Math.floor(playbackTime / 60)}:{String(playbackTime % 60).padStart(2, '0')} / 28:50
                    </span>
                  </div>

                  {/* Center Play Button Overlay */}
                  <div className="relative z-10 flex items-center justify-center my-auto">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all"
                    >
                      {isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-1 fill-current" />}
                    </button>
                  </div>

                  {/* Video Scrubber & Bottom Controls */}
                  <div className="relative z-10 space-y-2">
                    {/* Time Progress Bar */}
                    <div
                      className="w-full h-2 bg-slate-800/80 rounded-full cursor-pointer overflow-hidden"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pct = (e.clientX - rect.left) / rect.width;
                        setPlaybackTime(Math.round(pct * 1730));
                      }}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-150"
                        style={{ width: `${(playbackTime / 1730) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-white">
                          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                        </button>
                        <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white">
                          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                        </button>
                        <button
                          onClick={() => setPlaybackTime(Math.max(0, playbackTime - 10))}
                          className="hover:text-white flex items-center gap-0.5 text-[11px]"
                          title="Rewind 10s"
                        >
                          <RotateCcw size={13} /> 10s
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-slate-400">Speed: 1.0x</span>
                        <Maximize2 size={15} className="cursor-pointer hover:text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lesson Description & Actions */}
                <div className="mt-4 pt-4 border-t border-[#1c2a45]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {(sampleCurriculums[activeCourse.id] || sampleCurriculums.default)[activeLessonIndex]?.title || 'Active Lesson'}
                    </h4>
                    <button
                      onClick={handleCompleteCurrentLesson}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-semibold transition-all w-fit"
                    >
                      <Check size={14} className="text-emerald-400" />
                      <span>Mark Lesson Complete</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {activeCourse.description} Practice with the live charting simulator and complete the review questions below.
                  </p>
                </div>
              </div>

              {/* Right Col: Course Curriculum List */}
              <div className="p-4 sm:p-5 bg-[#091020] flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Course Curriculum ({activeCourse.lessons} Lessons)
                  </h4>
                  <div className="space-y-2">
                    {(sampleCurriculums[activeCourse.id] || sampleCurriculums.default).map((item, idx) => {
                      const isCurrentLesson = idx === activeLessonIndex;
                      return (
                        <button
                          key={item.title}
                          onClick={() => {
                            setActiveLessonIndex(idx);
                            setIsPlaying(true);
                          }}
                          className={cn(
                            'w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between text-xs',
                            isCurrentLesson
                              ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                              : 'bg-[#0f1c33]/70 border-[#1c2a45] text-slate-300 hover:bg-[#152545] hover:border-slate-600'
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {item.completed ? (
                              <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                            ) : (
                              <span className="w-3.5 h-3.5 rounded-full border border-slate-600 flex-shrink-0" />
                            )}
                            <span className="truncate">{item.title}</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 flex-shrink-0">
                            {item.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#1c2a45]">
                  <button
                    onClick={() => {
                      const lessonsList = sampleCurriculums[activeCourse.id] || sampleCurriculums.default;
                      if (activeLessonIndex < lessonsList.length - 1) {
                        setActiveLessonIndex(activeLessonIndex + 1);
                        setIsPlaying(true);
                      } else {
                        toast.success('Course finished! Congratulations!');
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Next Lesson</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learn;
