import React, { useState } from 'react';
import { BookOpen, Play, Star, Clock, Users, Award, ChevronRight, Search, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { mockCourses } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

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

const Learn: React.FC = () => {
  const { openAuthModal, isLoggedIn, enrollCourse } = useAppStore();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const [category, setCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'courses' | 'webinars' | 'blog'>('courses');

  const filtered = mockCourses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchLevel = level === 'All' || c.level === level.toLowerCase();
    const matchCat = category === 'All' || c.category === category;
    return matchSearch && matchLevel && matchCat;
  });

  const handleEnroll = (courseId: string, courseTitle: string) => {
    if (!isLoggedIn) { openAuthModal(`Enroll in "${courseTitle}" — create your free account.`); return; }
    enrollCourse(courseId);
  };

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <div className="bg-nova-surface border-b border-nova-border py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 nova-badge-green mb-4"><BookOpen size={14} /><span>NovaEq Learning Academy</span></div>
          <h1 className="text-4xl font-display font-black text-nova-text mb-3">Master the Markets,<br /><span className="gradient-text">One Course at a Time</span></h1>
          <p className="text-nova-text-muted max-w-xl mx-auto mb-8">60+ expert-led courses on investing, trading, algo strategies, derivatives, and wealth management.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {[{ icon: BookOpen, label: '60+ Courses' }, { icon: Users, label: '45,000+ Students' }, { icon: Award, label: 'Certificates' }, { icon: Play, label: 'Live Webinars' }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-nova-text-muted"><Icon size={16} className="text-nova-accent" />{label}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-nova-surface2 p-1 rounded-xl w-fit">
          {['courses', 'webinars', 'blog'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as typeof activeTab)}
              className={cn('px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all', activeTab === t ? 'bg-nova-primary text-white' : 'text-nova-text-muted hover:text-nova-text')}>
              {t === 'blog' ? 'Market Blog' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'courses' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative flex-1 min-w-48">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-nova-text-muted" />
                <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." className="nova-input pl-9 py-2.5 text-sm" />
              </div>
              <select value={level} onChange={e => setLevel(e.target.value)} className="nova-input py-2.5 text-sm w-36">
                {levels.map(l => <option key={l}>{l}</option>)}
              </select>
              <select value={category} onChange={e => setCategory(e.target.value)} className="nova-input py-2.5 text-sm w-44">
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* My Progress Banner */}
            {isLoggedIn && (
              <TiltCard className="p-4 mb-6 border-nova-accent/20 bg-nova-accent/5" tiltMaxAngle={5}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-nova-text">Your Learning Progress</p>
                    <p className="text-xs text-nova-text-muted">2 courses in progress · 1 completed</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-nova-accent">65%</p>
                      <p className="text-xs text-nova-text-muted">Stock Market Basics</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-nova-primary-light">30%</p>
                      <p className="text-xs text-nova-text-muted">Technical Analysis</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10" id="tutorials">
              {filtered.map(course => (
                <TiltCard
                  key={course.id}
                  className="p-0 overflow-hidden flex flex-col cursor-pointer group"
                  tiltMaxAngle={9}
                  translateZ={12}
                  onClick={() => handleEnroll(course.id, course.title)}
                >
                  <div className="relative">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Play size={20} className="text-white ml-0.5" />
                      </div>
                    </div>
                    <span className={cn('absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-md',
                      course.level === 'beginner' ? 'bg-nova-green/80 text-white' :
                        course.level === 'intermediate' ? 'bg-nova-yellow/80 text-nova-bg' : 'bg-nova-red/80 text-white')}>
                      {course.level}
                    </span>
                    {course.isEnrolled && course.progress === 100 && (
                      <span className="absolute top-3 right-3 nova-badge-green text-xs">✓ Completed</span>
                    )}
                    {course.isEnrolled && course.progress > 0 && course.progress < 100 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-nova-surface2">
                        <div className="h-full bg-nova-accent" style={{ width: `${course.progress}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-xs text-nova-primary-light mb-1">{course.category}</p>
                    <h3 className="text-sm font-bold text-nova-text mb-1 line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-nova-text-muted mb-3 line-clamp-2 flex-1">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-nova-text-muted">
                      <span>{course.instructor}</span>
                      <div className="flex items-center gap-2">
                        <Star size={12} className="text-nova-yellow fill-nova-yellow" />
                        <span>{course.rating}</span>
                        <span>·</span>
                        <Clock size={12} />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-nova-text-muted">{course.enrolled.toLocaleString()} enrolled</span>
                      <button className={cn('text-xs px-3 py-1.5 rounded-lg font-semibold transition-all',
                        course.isEnrolled ? 'bg-nova-accent/10 border border-nova-accent/30 text-nova-accent' : 'nova-btn-primary py-1.5')}>
                        {course.isEnrolled ? (course.progress === 100 ? 'Review' : 'Continue') : 'Enroll Free'}
                      </button>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </>
        )}

        {activeTab === 'webinars' && (
          <div className="space-y-4 mb-10" id="webinars">
            {webinars.map(w => (
              <TiltCard
                key={w.title}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer"
                tiltMaxAngle={6}
                translateZ={8}
                onClick={() => openAuthModal('Join live webinars — create your free account.')}
              >
                <div className="flex items-center gap-4">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', w.isLive ? 'bg-nova-red/10 border border-nova-red/30' : 'bg-nova-primary/10 border border-nova-primary/20')}>
                    <Play size={20} className={w.isLive ? 'text-nova-red' : 'text-nova-primary-light'} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-nova-text">{w.title}</p>
                      {w.isLive && <span className="text-xs bg-nova-red text-white px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>}
                    </div>
                    <p className="text-xs text-nova-text-muted">{w.host} · {w.date}</p>
                    <p className="text-xs text-nova-text-subtle mt-0.5">{w.registered.toLocaleString()} registered</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openAuthModal('Join live webinars — create your free account.');
                  }}
                  className={cn('text-sm py-2 px-5 flex-shrink-0', w.isLive ? 'bg-nova-red/10 border border-nova-red/30 text-nova-red hover:bg-nova-red/20 rounded-lg font-semibold transition-all' : 'nova-btn-outline')}
                >
                  {w.isLive ? 'Join Live' : 'Register'}
                </button>
              </TiltCard>
            ))}
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="grid md:grid-cols-2 gap-5 mb-10" id="blog">
            {blogs.map(b => (
              <TiltCard
                key={b.title}
                className="p-5 cursor-pointer group"
                tiltMaxAngle={8}
                translateZ={10}
                onClick={() => openAuthModal('Read full market blog posts — create your free account.')}
              >
                <span className="nova-badge-blue text-xs mb-3 inline-block">{b.tag}</span>
                <h3 className="text-base font-bold text-nova-text mb-2 group-hover:text-nova-primary-light transition-colors">{b.title}</h3>
                <div className="flex items-center justify-between text-xs text-nova-text-muted">
                  <span>{b.author} · {b.date}</span>
                  <div className="flex items-center gap-2">
                    <Clock size={12} /><span>{b.readTime}</span>
                    <TrendingUp size={12} /><span>{(b.views / 1000).toFixed(1)}K views</span>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;

