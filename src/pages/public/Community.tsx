import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  MessageCircle,
  Heart,
  Share2,
  Search,
  Award,
  Crown,
  X,
  ExternalLink,
  Shield,
  Check,
  Zap,
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { mockCommunityPosts, mockLeaderboard } from '@/lib/mockData';
import { formatTimeAgo, cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

const Community: React.FC = () => {
  const navigate = useNavigate();
  const { openAuthModal, isLoggedIn, toggleLikePost, communityPosts, currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard'>('feed');
  const [postContent, setPostContent] = useState('');

  // Modals
  const [selectedPost, setSelectedPost] = useState<(typeof mockCommunityPosts)[0] | null>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<(typeof mockLeaderboard)[0] | null>(null);

  const handleAction = (action: string) => {
    if (!isLoggedIn) openAuthModal(`${action} — sign in to join the NovaEq community.`);
  };

  const handleLaunchDashboard = (tab?: string) => {
    if (!isLoggedIn) {
      openAuthModal('Connect to NovaEq Social Network — sign in to your dashboard.');
      return;
    }
    const path = currentUser?.role === 'trader' ? '/dashboard/trader' : '/dashboard/investor';
    navigate(path, { state: { activeTab: tab || 'social' } });
  };

  const sentimentColor = (s?: string) =>
    s === 'bullish' ? 'text-nova-green' : s === 'bearish' ? 'text-nova-red' : 'text-nova-yellow';

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 nova-badge-blue mb-4">
            <Users size={14} />
            <span>Social Investing Network</span>
          </div>
          <h1 className="text-4xl font-display font-black text-nova-text mb-3">
            Invest <span className="gradient-text">Together</span>
          </h1>
          <p className="text-nova-text-muted">
            Share ideas, follow experts, and learn from 125,000+ investors on NovaEq.
          </p>
        </div>

        {/* Stats with 3D Tilt */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { value: '125K+', label: 'Active Members' },
            { value: '8,400+', label: 'Posts Today' },
            { value: '340+', label: 'Expert Advisors' },
          ].map((s) => (
            <TiltCard key={s.label} className="p-4 text-center" tiltMaxAngle={8}>
              <p className="text-2xl font-black gradient-text">{s.value}</p>
              <p className="text-xs text-nova-text-muted">{s.label}</p>
            </TiltCard>
          ))}
        </div>

        <div className="flex gap-1 mb-6 bg-nova-surface2 p-1 rounded-xl w-fit">
          {['feed', 'leaderboard'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as typeof activeTab)}
              className={cn(
                'px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all',
                activeTab === t
                  ? 'bg-nova-primary text-white'
                  : 'text-nova-text-muted hover:text-nova-text'
              )}
            >
              {t === 'leaderboard' ? 'Leaderboard' : 'Community Feed'}
            </button>
          ))}
        </div>

        {activeTab === 'feed' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Feed */}
            <div className="lg:col-span-2 space-y-4">
              {/* Post Composer with 3D Tilt */}
              <TiltCard className="p-4" tiltMaxAngle={5} translateZ={6}>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share your market insight, analysis, or trade idea..."
                  className="nova-input resize-none h-24 text-sm mb-3"
                  onClick={() => !isLoggedIn && handleAction('Post to the community')}
                  readOnly={!isLoggedIn}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {['#Bullish', '#Bearish', '#TechStocks'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => !isLoggedIn && handleAction('Add hashtags')}
                        className="text-xs text-nova-primary-light nova-glass px-2.5 py-1 rounded-lg hover:bg-nova-primary/10 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleAction('Post your insight')}
                    className="nova-btn-primary text-sm py-2 px-5"
                  >
                    Post
                  </button>
                </div>
              </TiltCard>

              {/* Posts with 3D Tilt */}
              {communityPosts.map((post) => (
                <TiltCard
                  key={post.id}
                  className="p-5 cursor-pointer hover:border-nova-primary/40 transition-all"
                  tiltMaxAngle={7}
                  translateZ={8}
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={post.userAvatar}
                      alt={post.userName}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-nova-text">{post.userName}</span>
                        <span className="text-xs capitalize nova-badge-blue">{post.userRole}</span>
                        {post.sentiment && (
                          <span
                            className={cn(
                              'text-xs font-semibold capitalize',
                              sentimentColor(post.sentiment)
                            )}
                          >
                            ● {post.sentiment}
                          </span>
                        )}
                        <span className="text-xs text-nova-text-subtle ml-auto">
                          {formatTimeAgo(post.createdAt)}
                        </span>
                      </div>
                      {post.symbol && (
                        <span className="text-xs text-nova-primary-light mt-0.5 inline-block">
                          ${post.symbol}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-nova-text-muted leading-relaxed mb-4">{post.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 border-t border-nova-border pt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        isLoggedIn ? toggleLikePost(post.id) : handleAction('Like posts');
                      }}
                      className={cn(
                        'flex items-center gap-1.5 text-sm transition-colors',
                        post.isLiked ? 'text-nova-red' : 'text-nova-text-muted hover:text-nova-red'
                      )}
                    >
                      <Heart size={16} className={post.isLiked ? 'fill-nova-red' : ''} />{' '}
                      {post.likes}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPost(post);
                      }}
                      className="flex items-center gap-1.5 text-sm text-nova-text-muted hover:text-nova-primary-light transition-colors"
                    >
                      <MessageCircle size={16} /> {post.comments.length}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction('Share posts');
                      }}
                      className="flex items-center gap-1.5 text-sm text-nova-text-muted hover:text-nova-accent transition-colors"
                    >
                      <Share2 size={16} /> {post.shares}
                    </button>
                    <span className="ml-auto text-xs text-blue-400 font-medium">
                      View Discussion &rarr;
                    </span>
                  </div>

                  {/* Top comment */}
                  {post.comments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-nova-border/50">
                      <div className="flex items-start gap-2">
                        <img
                          src={post.comments[0].userAvatar}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 bg-nova-surface2 rounded-xl px-3 py-2">
                          <span className="text-xs font-semibold text-nova-text">
                            {post.comments[0].userName}:{' '}
                          </span>
                          <span className="text-xs text-nova-text-muted">
                            {post.comments[0].content}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </TiltCard>
              ))}
            </div>

            {/* Sidebar — Top Traders with 3D Tilt */}
            <div>
              <TiltCard className="p-5 sticky top-24" tiltMaxAngle={6} translateZ={8}>
                <h3 className="text-sm font-bold text-nova-text mb-4">Top Investors This Month</h3>
                <div className="space-y-3">
                  {mockLeaderboard.slice(0, 5).map((entry) => (
                    <div
                      key={entry.userId}
                      className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-nova-surface2 transition-all"
                      onClick={() => setSelectedInvestor(entry)}
                    >
                      <span className="text-xs font-bold text-nova-text-subtle w-4">
                        #{entry.rank}
                      </span>
                      <img
                        src={entry.userAvatar}
                        alt={entry.userName}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-nova-text group-hover:text-nova-primary-light transition-colors truncate">
                          {entry.userName}
                        </p>
                        <p className="text-xs text-nova-text-muted capitalize">{entry.role}</p>
                      </div>
                      <span className="text-xs font-bold text-nova-green">+{entry.returns}%</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className="nova-btn-outline w-full text-sm py-2.5 mt-4"
                >
                  View Full Leaderboard
                </button>
              </TiltCard>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <TiltCard className="p-0 overflow-hidden" tiltMaxAngle={4} translateZ={6}>
            <div className="bg-nova-surface2 px-5 py-3 flex items-center gap-3 border-b border-nova-border">
              <Award size={18} className="text-nova-yellow" />
              <h2 className="text-sm font-bold text-nova-text">
                Global Investor Leaderboard — January 2024
              </h2>
            </div>
            <div className="grid grid-cols-7 px-5 py-2.5 text-xs font-bold text-nova-text-muted uppercase tracking-wider bg-nova-surface2/50">
              <span>Rank</span>
              <span className="col-span-2">Investor</span>
              <span className="text-right">Returns</span>
              <span className="text-right">Win Rate</span>
              <span className="text-right">Portfolio</span>
              <span className="text-right">Action</span>
            </div>
            {mockLeaderboard.map((entry, i) => (
              <div
                key={entry.userId}
                className={cn(
                  'grid grid-cols-7 px-5 py-4 border-t border-nova-border/50 items-center cursor-pointer hover:bg-nova-surface2/60 transition-colors',
                  i < 3 && 'bg-nova-yellow/2'
                )}
                onClick={() => setSelectedInvestor(entry)}
              >
                <div className="flex items-center gap-1">
                  {i === 0 && <Crown size={16} className="text-nova-yellow" />}
                  {i === 1 && <Crown size={14} className="text-nova-text-muted" />}
                  {i === 2 && <Crown size={13} className="text-amber-600" />}
                  <span
                    className={cn(
                      'text-sm font-black',
                      i < 3 ? 'text-nova-yellow' : 'text-nova-text-muted'
                    )}
                  >
                    #{entry.rank}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <img
                    src={entry.userAvatar}
                    alt={entry.userName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-nova-text">{entry.userName}</p>
                    <p className="text-xs text-nova-text-muted capitalize">
                      {entry.role} · {entry.badge}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-nova-green text-right">+{entry.returns}%</p>
                <p className="text-sm text-nova-text text-right">{entry.winRate}%</p>
                <p className="text-sm text-nova-text-muted text-right">
                  ${(entry.portfolioValue / 1000).toFixed(0)}K
                </p>
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInvestor(entry);
                    }}
                    className="nova-btn-outline text-xs py-1.5 px-2.5"
                  >
                    Profile
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(`Follow ${entry.userName}`);
                    }}
                    className="nova-btn-primary text-xs py-1.5 px-3"
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </TiltCard>
        )}
      </div>

      {/* ========================================================================= */}
      {/* POST DISCUSSION SHOWCASE MODAL                                            */}
      {/* ========================================================================= */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="relative w-full max-w-2xl bg-[#0b1428] border border-[#1c2a45] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-b from-[#12203d] to-[#0b1428] border-b border-[#1c2a45] relative">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1c2a45]/80 hover:bg-[#2a3c61] text-slate-300 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3">
                <img
                  src={selectedPost.userAvatar}
                  alt={selectedPost.userName}
                  className="w-12 h-12 rounded-full object-cover border border-[#1c2a45]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{selectedPost.userName}</h3>
                    <span className="text-xs capitalize nova-badge-blue">
                      {selectedPost.userRole}
                    </span>
                    {selectedPost.sentiment && (
                      <span
                        className={cn(
                          'text-xs font-semibold capitalize',
                          sentimentColor(selectedPost.sentiment)
                        )}
                      >
                        ● {selectedPost.sentiment}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Posted {formatTimeAgo(selectedPost.createdAt)}
                    {selectedPost.symbol && (
                      <span className="text-blue-400 font-semibold ml-2">
                        ${selectedPost.symbol}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              <div className="p-4 rounded-2xl bg-[#0f1c33]/70 border border-[#1c2a45]">
                <p className="text-sm text-slate-200 leading-relaxed">{selectedPost.content}</p>
                <div className="flex items-center gap-5 mt-4 pt-3 border-t border-[#1c2a45] text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Heart size={14} className="text-rose-400" /> {selectedPost.likes} Likes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle size={14} className="text-blue-400" />{' '}
                    {selectedPost.comments.length} Comments
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Share2 size={14} className="text-emerald-400" /> {selectedPost.shares} Shares
                  </span>
                </div>
              </div>

              {/* Comments Thread */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Community Discussion ({selectedPost.comments.length})
                </h4>
                {selectedPost.comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No comments yet. Be the first to reply!</p>
                ) : (
                  <div className="space-y-2.5">
                    {selectedPost.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-3 rounded-xl bg-[#0f1c33] border border-[#1c2a45] flex items-start gap-3"
                      >
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <b className="text-xs text-white">{comment.userName}</b>
                            <span className="text-[10px] text-slate-400">
                              {formatTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-normal">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-[#080e1c] border-t border-[#1c2a45] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 rounded-xl border border-[#1c2a45] text-slate-400 hover:text-white text-xs font-medium"
              >
                Close
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedPost(null);
                    handleAction('Reply to post');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-[#1c2a45]"
                >
                  Write Reply
                </button>
                <button
                  onClick={() => {
                    setSelectedPost(null);
                    handleLaunchDashboard('social');
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                >
                  <span>Open in Dashboard</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INVESTOR PROFILE SHOWCASE MODAL                                           */}
      {/* ========================================================================= */}
      {selectedInvestor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className="relative w-full max-w-lg bg-[#0b1428] border border-[#1c2a45] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-b from-[#12203d] to-[#0b1428] border-b border-[#1c2a45] relative">
              <button
                onClick={() => setSelectedInvestor(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1c2a45]/80 hover:bg-[#2a3c61] text-slate-300 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-4">
                <img
                  src={selectedInvestor.userAvatar}
                  alt={selectedInvestor.userName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      Rank #{selectedInvestor.rank}
                    </span>
                    <span className="text-xs capitalize nova-badge-blue">
                      {selectedInvestor.role}
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white">
                    {selectedInvestor.userName}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedInvestor.badge}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#0f1c33] border border-[#1c2a45] text-center">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">30D Return</span>
                  <b className="font-mono text-sm font-bold text-emerald-400">
                    +{selectedInvestor.returns}%
                  </b>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Win Rate</span>
                  <b className="font-mono text-sm font-bold text-slate-100">
                    {selectedInvestor.winRate}%
                  </b>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">Portfolio</span>
                  <b className="font-mono text-sm font-bold text-blue-400">
                    ${(selectedInvestor.portfolioValue / 1000).toFixed(0)}K
                  </b>
                </div>
              </div>

              {/* Bio & Strategy */}
              <div className="p-3.5 rounded-xl bg-[#0f1c33]/40 border border-[#1c2a45]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Investment Strategy
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Specializes in high-probability momentum breakouts and risk-hedged equity swings. Maintains a strict 1:3 risk-to-reward ratio with active stop-loss monitoring.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/25">
                <Shield size={16} />
                <span>Verified Track Record · Audited NovaEq Trading Ledger</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 bg-[#080e1c] border-t border-[#1c2a45] flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedInvestor(null)}
                className="px-4 py-2 rounded-xl border border-[#1c2a45] text-slate-400 hover:text-white text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedInvestor(null);
                  handleLaunchDashboard('social');
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
              >
                <span>Follow in Dashboard</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
