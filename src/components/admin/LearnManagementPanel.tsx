import React, { useState } from 'react';
import {
  BookOpen,
  Video,
  FileText,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  Clock,
  User,
  Star,
  ExternalLink,
  X,
  Sparkles,
  Eye,
  Radio
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import type { Course, Webinar, MarketBlog } from '@/types';

export const LearnManagementPanel: React.FC = () => {
  const {
    courses,
    webinars,
    marketBlogs,
    addCourse,
    updateCourse,
    deleteCourse,
    addWebinar,
    updateWebinar,
    deleteWebinar,
    addBlog,
    updateBlog,
    deleteBlog,
  } = useAppStore();

  const [activeSection, setActiveSection] = useState<'courses' | 'webinars' | 'blogs'>('courses');
  const [searchTerm, setSearchTerm] = useState('');

  // Course Modal State
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState<Partial<Course>>({
    title: '',
    description: '',
    instructor: 'Priya Sharma',
    duration: '10h 30m',
    level: 'intermediate',
    lessons: 20,
    category: 'Algo Trading',
    rating: 4.8,
    enrolled: 1250,
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=340&fit=crop',
    progress: 0,
    isEnrolled: false,
  });

  // Webinar Modal State
  const [webinarModalOpen, setWebinarModalOpen] = useState(false);
  const [editingWebinar, setEditingWebinar] = useState<Webinar | null>(null);
  const [webinarForm, setWebinarForm] = useState<Partial<Webinar>>({
    title: '',
    host: 'Marcus Chen',
    role: 'Chief Market Strategist',
    date: 'Tomorrow · 6:30 PM IST',
    registered: 500,
    isLive: false,
    category: 'Macro Economics',
    description: '',
  });

  // Blog Modal State
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<MarketBlog | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<MarketBlog>>({
    title: '',
    author: 'Marcus Chen',
    date: 'Jan 20, 2026',
    readTime: '6 min',
    tag: 'AI & Quant',
    views: 1500,
    likes: 85,
    cover: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&h=450&fit=crop',
    content: '',
    keyTakeaways: ['Key institutional factor insight', 'Systematic risk-reward strategy'],
  });

  // Handle Course Submit
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title) return;

    if (editingCourse) {
      updateCourse(editingCourse.id, courseForm);
    } else {
      const newCourse: Course = {
        id: `cr_${Date.now()}`,
        title: courseForm.title || 'Untitled Course',
        description: courseForm.description || '',
        instructor: courseForm.instructor || 'NovaEq Faculty',
        duration: courseForm.duration || '5h 00m',
        level: (courseForm.level as any) || 'beginner',
        enrolled: Number(courseForm.enrolled) || 0,
        rating: Number(courseForm.rating) || 4.5,
        thumbnail: courseForm.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=340&fit=crop',
        progress: 0,
        lessons: Number(courseForm.lessons) || 12,
        category: courseForm.category || 'Trading',
        isEnrolled: false,
      };
      addCourse(newCourse);
    }
    setCourseModalOpen(false);
  };

  // Handle Webinar Submit
  const handleSaveWebinar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webinarForm.title) return;

    if (editingWebinar) {
      updateWebinar(editingWebinar.id, webinarForm);
    } else {
      const newWebinar: Webinar = {
        id: `web_${Date.now()}`,
        title: webinarForm.title || 'Live Trading Masterclass',
        host: webinarForm.host || 'Marcus Chen',
        role: webinarForm.role || 'Market Specialist',
        date: webinarForm.date || 'Today · 7:00 PM IST',
        registered: Number(webinarForm.registered) || 120,
        isLive: Boolean(webinarForm.isLive),
        category: webinarForm.category || 'Trading',
        description: webinarForm.description || '',
      };
      addWebinar(newWebinar);
    }
    setWebinarModalOpen(false);
  };

  // Handle Blog Submit
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title) return;

    if (editingBlog) {
      updateBlog(editingBlog.id, blogForm);
    } else {
      const newBlog: MarketBlog = {
        id: `blog_${Date.now()}`,
        title: blogForm.title || 'Market Intelligence Brief',
        author: blogForm.author || 'NovaEq Editorial',
        date: blogForm.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: blogForm.readTime || '5 min',
        tag: blogForm.tag || 'Strategy',
        views: Number(blogForm.views) || 100,
        likes: Number(blogForm.likes) || 10,
        cover: blogForm.cover || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop',
        content: blogForm.content || 'Content analysis details...',
        keyTakeaways: blogForm.keyTakeaways && blogForm.keyTakeaways.length > 0 ? blogForm.keyTakeaways : ['Key risk insight', 'Long-term compounding'],
      };
      addBlog(newBlog);
    }
    setBlogModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-300 mb-2">
            <Sparkles size={12} className="text-blue-400" />
            <span>Admin Educational CMS</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            Learn Page & Content Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Publish and manage interactive Courses, live Webinars, and Market Blog articles in real-time.
          </p>
        </div>

        {/* Action Button */}
        <div>
          {activeSection === 'courses' && (
            <button
              onClick={() => {
                setEditingCourse(null);
                setCourseForm({
                  title: '',
                  description: '',
                  instructor: 'Priya Sharma',
                  duration: '8h 30m',
                  level: 'intermediate',
                  lessons: 18,
                  category: 'Algo Trading',
                  rating: 4.8,
                  enrolled: 500,
                  thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=340&fit=crop',
                });
                setCourseModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
            >
              <Plus size={16} />
              <span>Add New Course</span>
            </button>
          )}

          {activeSection === 'webinars' && (
            <button
              onClick={() => {
                setEditingWebinar(null);
                setWebinarForm({
                  title: '',
                  host: 'Marcus Chen',
                  role: 'Chief Market Strategist',
                  date: 'Today · 7:30 PM IST',
                  registered: 250,
                  isLive: true,
                  category: 'Options & Derivatives',
                  description: '',
                });
                setWebinarModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Plus size={16} />
              <span>Schedule Webinar</span>
            </button>
          )}

          {activeSection === 'blogs' && (
            <button
              onClick={() => {
                setEditingBlog(null);
                setBlogForm({
                  title: '',
                  author: 'Marcus Chen',
                  date: 'Today',
                  readTime: '7 min',
                  tag: 'AI & Quant',
                  views: 200,
                  likes: 15,
                  cover: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&h=450&fit=crop',
                  content: '',
                  keyTakeaways: ['Deep learning alpha', 'Multi-factor risk bounds'],
                });
                setBlogModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
            >
              <Plus size={16} />
              <span>Write Market Blog</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1c2a45] pb-3 overflow-x-auto">
        {[
          { id: 'courses', label: `Courses (${courses.length})`, icon: BookOpen },
          { id: 'webinars', label: `Webinars (${webinars.length})`, icon: Video },
          { id: 'blogs', label: `Market Blogs (${marketBlogs.length})`, icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-[#0f1c33]/70 text-slate-400 hover:text-white hover:bg-[#142647] border border-[#1c2a45]'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. COURSES CMS TAB                                                        */}
      {/* ========================================================================= */}
      {activeSection === 'courses' && (
        <div className="border border-[#1c2a45] bg-[#0b1428] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0f1c33] text-slate-400 uppercase font-mono text-[10px] border-b border-[#1c2a45]">
                <tr>
                  <th className="p-4">Course Title & Category</th>
                  <th className="p-4">Instructor</th>
                  <th className="p-4">Level & Duration</th>
                  <th className="p-4">Students</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c2a45]/60">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-[#122240]/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-12 h-9 rounded-lg object-cover bg-black flex-shrink-0"
                        />
                        <div>
                          <b className="text-white text-xs block font-semibold">{course.title}</b>
                          <span className="text-[10px] font-mono text-blue-400">{course.category} · {course.lessons} Lessons</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{course.instructor}</td>
                    <td className="p-4">
                      <span className="capitalize font-mono text-slate-300">{course.level}</span>
                      <span className="text-slate-500 block text-[10px]">{course.duration}</span>
                    </td>
                    <td className="p-4 font-mono">{course.enrolled.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-amber-400 font-bold font-mono">
                        <Star size={11} fill="currentColor" /> {course.rating}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCourse(course);
                            setCourseForm(course);
                            setCourseModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#122242] hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                          title="Edit Course"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="p-1.5 rounded-lg bg-[#122242] hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. WEBINARS CMS TAB                                                       */}
      {/* ========================================================================= */}
      {activeSection === 'webinars' && (
        <div className="border border-[#1c2a45] bg-[#0b1428] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0f1c33] text-slate-400 uppercase font-mono text-[10px] border-b border-[#1c2a45]">
                <tr>
                  <th className="p-4">Webinar Title</th>
                  <th className="p-4">Host & Role</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Attendees</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c2a45]/60">
                {webinars.map((web) => (
                  <tr key={web.id} className="hover:bg-[#122240]/40 transition-colors">
                    <td className="p-4 max-w-xs">
                      <b className="text-white block font-semibold">{web.title}</b>
                      <span className="text-[10px] font-mono text-blue-400">{web.category}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-white block font-medium">{web.host}</span>
                      <span className="text-slate-400 text-[10px]">{web.role}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{web.date}</td>
                    <td className="p-4">
                      {web.isLive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 live-dot-pulse" />
                          Live Now
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-500/10 border border-blue-500/30 text-blue-300">
                          Upcoming
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono">{web.registered.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingWebinar(web);
                            setWebinarForm(web);
                            setWebinarModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#122242] hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors"
                          title="Edit Webinar"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => deleteWebinar(web.id)}
                          className="p-1.5 rounded-lg bg-[#122242] hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                          title="Delete Webinar"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MARKET BLOGS CMS TAB                                                   */}
      {/* ========================================================================= */}
      {activeSection === 'blogs' && (
        <div className="border border-[#1c2a45] bg-[#0b1428] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0f1c33] text-slate-400 uppercase font-mono text-[10px] border-b border-[#1c2a45]">
                <tr>
                  <th className="p-4">Article Title & Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Read Time</th>
                  <th className="p-4">Views & Likes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c2a45]/60">
                {marketBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-[#122240]/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={blog.cover}
                          alt={blog.title}
                          className="w-12 h-9 rounded-lg object-cover bg-black flex-shrink-0"
                        />
                        <div className="max-w-sm">
                          <b className="text-white text-xs block font-semibold truncate">{blog.title}</b>
                          <span className="text-[10px] font-mono text-purple-400">{blog.tag} · {blog.date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{blog.author}</td>
                    <td className="p-4 font-mono">{blog.readTime}</td>
                    <td className="p-4 font-mono">
                      <span>{blog.views.toLocaleString()} views · {blog.likes} likes</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingBlog(blog);
                            setBlogForm(blog);
                            setBlogModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#122242] hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                          title="Edit Blog"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => deleteBlog(blog.id)}
                          className="p-1.5 rounded-lg bg-[#122242] hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                          title="Delete Blog"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT COURSE                                                  */}
      {/* ========================================================================= */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0b1428] border border-[#1c2a45] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1c2a45] mb-4">
              <h3 className="font-display font-bold text-lg text-white">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h3>
              <button onClick={() => setCourseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Advanced Options Greeks"
                  className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Instructor</label>
                  <input
                    type="text"
                    value={courseForm.instructor}
                    onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                  >
                    <option>Algo Trading</option>
                    <option>Trading</option>
                    <option>Investing</option>
                    <option>Derivatives</option>
                    <option>Wealth Management</option>
                    <option>Crypto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Level</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Lessons</label>
                  <input
                    type="number"
                    value={courseForm.lessons}
                    onChange={(e) => setCourseForm({ ...courseForm, lessons: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Thumbnail URL</label>
                <input
                  type="text"
                  value={courseForm.thumbnail}
                  onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1c2a45]">
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#1c2a45] text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT WEBINAR                                                 */}
      {/* ========================================================================= */}
      {webinarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0b1428] border border-[#1c2a45] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1c2a45] mb-4">
              <h3 className="font-display font-bold text-lg text-white">
                {editingWebinar ? 'Edit Webinar' : 'Schedule New Webinar'}
              </h3>
              <button onClick={() => setWebinarModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveWebinar} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Webinar Title</label>
                <input
                  type="text"
                  required
                  value={webinarForm.title}
                  onChange={(e) => setWebinarForm({ ...webinarForm, title: e.target.value })}
                  placeholder="e.g. Masterclass on Options"
                  className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Host Name</label>
                  <input
                    type="text"
                    value={webinarForm.host}
                    onChange={(e) => setWebinarForm({ ...webinarForm, host: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Host Role</label>
                  <input
                    type="text"
                    value={webinarForm.role}
                    onChange={(e) => setWebinarForm({ ...webinarForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date & Time</label>
                  <input
                    type="text"
                    value={webinarForm.date}
                    onChange={(e) => setWebinarForm({ ...webinarForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={webinarForm.category}
                    onChange={(e) => setWebinarForm({ ...webinarForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isLiveCheck"
                  checked={webinarForm.isLive}
                  onChange={(e) => setWebinarForm({ ...webinarForm, isLive: e.target.checked })}
                  className="rounded bg-[#091122] border-[#1c2a45]"
                />
                <label htmlFor="isLiveCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Mark as "Live Now" (Broadcasting)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1c2a45]">
                <button
                  type="button"
                  onClick={() => setWebinarModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#1c2a45] text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                >
                  Save Webinar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT BLOG                                                    */}
      {/* ========================================================================= */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0b1428] border border-[#1c2a45] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1c2a45] mb-4">
              <h3 className="font-display font-bold text-lg text-white">
                {editingBlog ? 'Edit Market Blog' : 'Publish Market Article'}
              </h3>
              <button onClick={() => setBlogModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="e.g. Navigating Inflationary Cycles"
                  className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Author</label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category Tag</label>
                  <input
                    type="text"
                    value={blogForm.tag}
                    onChange={(e) => setBlogForm({ ...blogForm, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={blogForm.cover}
                  onChange={(e) => setBlogForm({ ...blogForm, cover: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Content Body</label>
                <textarea
                  rows={3}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#091122] border border-[#1c2a45] text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1c2a45]">
                <button
                  type="button"
                  onClick={() => setBlogModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#1c2a45] text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnManagementPanel;
