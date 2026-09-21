import React, { useState } from 'react';
import { Users, TrendingUp, MessageCircle, Heart, Share2, Search, Award, Crown } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { mockCommunityPosts, mockLeaderboard } from '@/lib/mockData';
import { formatTimeAgo, cn } from '@/lib/utils';
import TiltCard from '@/components/ui/TiltCard';

const Community: React.FC = () => {
  const { openAuthModal, isLoggedIn, toggleLikePost, communityPosts } = useAppStore();
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard'>('feed');
  const [postContent, setPostContent] = useState('');

  const handleAction = (action: string) => {
    if (!isLoggedIn) openAuthModal(`${action} — sign in to join the NovaEq community.`);
  };

  const sentimentColor = (s?: string) => s === 'bullish' ? 'text-nova-green' : s === 'bearish' ? 'text-nova-red' : 'text-nova-yellow';

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 nova-badge-blue mb-4"><Users size={14} /><span>Social Investing Network</span></div>
          <h1 className="text-4xl font-display font-black text-nova-text mb-3">Invest <span className="gradient-text">Together</span></h1>
          <p className="text-nova-text-muted">Share ideas, follow experts, and learn from 125,000+ investors on NovaEq.</p>
        </div>

        {/* Stats with 3D Tilt */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[{ value: '125K+', label: 'Active Members' }, { value: '8,400+', label: 'Posts Today' }, { value: '340+', label: 'Expert Advisors' }].map(s => (
            <TiltCard key={s.label} className="p-4 text-center" tiltMaxAngle={8}>
              <p className="text-2xl font-black gradient-text">{s.value}</p>
              <p className="text-xs text-nova-text-muted">{s.label}</p>
            </TiltCard>
          ))}
        </div>

        <div className="flex gap-1 mb-6 bg-nova-surface2 p-1 rounded-xl w-fit">
          {['feed', 'leaderboard'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as typeof activeTab)}
              className={cn('px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all', activeTab === t ? 'bg-nova-primary text-white' : 'text-nova-text-muted hover:text-nova-text')}>
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
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="Share your market insight, analysis, or trade idea..."
                  className="nova-input resize-none h-24 text-sm mb-3"
                  onClick={() => !isLoggedIn && handleAction('Post to the community')}
                  readOnly={!isLoggedIn}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {['#Bullish', '#Bearish', '#TechStocks'].map(tag => (
                      <button key={tag} onClick={() => !isLoggedIn && handleAction('Add hashtags')} className="text-xs text-nova-primary-light nova-glass px-2.5 py-1 rounded-lg hover:bg-nova-primary/10 transition-colors">{tag}</button>
                    ))}
                  </div>
                  <button onClick={() => handleAction('Post your insight')} className="nova-btn-primary text-sm py-2 px-5">Post</button>
                </div>
              </TiltCard>

              {/* Posts with 3D Tilt */}
              {communityPosts.map(post => (
                <TiltCard key={post.id} className="p-5" tiltMaxAngle={7} translateZ={8}>
                  <div className="flex items-start gap-3 mb-3">
                    <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-nova-text">{post.userName}</span>
                        <span className="text-xs capitalize nova-badge-blue">{post.userRole}</span>
                        {post.sentiment && <span className={cn('text-xs font-semibold capitalize', sentimentColor(post.sentiment))}>● {post.sentiment}</span>}
                        <span className="text-xs text-nova-text-subtle ml-auto">{formatTimeAgo(post.createdAt)}</span>
                      </div>
                      {post.symbol && <span className="text-xs text-nova-primary-light mt-0.5 inline-block">${post.symbol}</span>}
                    </div>
                  </div>

                  <p className="text-sm text-nova-text-muted leading-relaxed mb-4">{post.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 border-t border-nova-border pt-3">
                    <button onClick={() => isLoggedIn ? toggleLikePost(post.id) : handleAction('Like posts')}
                      className={cn('flex items-center gap-1.5 text-sm transition-colors', post.isLiked ? 'text-nova-red' : 'text-nova-text-muted hover:text-nova-red')}>
                      <Heart size={16} className={post.isLiked ? 'fill-nova-red' : ''} /> {post.likes}
                    </button>
                    <button onClick={() => handleAction('Comment on posts')} className="flex items-center gap-1.5 text-sm text-nova-text-muted hover:text-nova-primary-light transition-colors">
                      <MessageCircle size={16} /> {post.comments.length}
                    </button>
                    <button onClick={() => handleAction('Share posts')} className="flex items-center gap-1.5 text-sm text-nova-text-muted hover:text-nova-accent transition-colors">
                      <Share2 size={16} /> {post.shares}
                    </button>
                  </div>

                  {/* Top comment */}
                  {post.comments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-nova-border/50">
                      <div className="flex items-start gap-2">
                        <img src={post.comments[0].userAvatar} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                        <div className="flex-1 bg-nova-surface2 rounded-xl px-3 py-2">
                          <span className="text-xs font-semibold text-nova-text">{post.comments[0].userName}: </span>
                          <span className="text-xs text-nova-text-muted">{post.comments[0].content}</span>
                        </div>
                      </div>
                      {post.comments.length > 1 && (
                        <button onClick={() => handleAction('View all comments')} className="text-xs text-nova-primary-light mt-2 ml-9 hover:underline">
                          +{post.comments.length - 1} more comment{post.comments.length > 2 ? 's' : ''}
                        </button>
                      )}
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
                  {mockLeaderboard.slice(0, 5).map(entry => (
                    <div key={entry.userId} className="flex items-center gap-3 cursor-pointer group" onClick={() => handleAction('View investor profiles')}>
                      <span className="text-xs font-bold text-nova-text-subtle w-4">#{entry.rank}</span>
                      <img src={entry.userAvatar} alt={entry.userName} className="w-9 h-9 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-nova-text group-hover:text-nova-primary-light transition-colors truncate">{entry.userName}</p>
                        <p className="text-xs text-nova-text-muted capitalize">{entry.role}</p>
                      </div>
                      <span className="text-xs font-bold text-nova-green">+{entry.returns}%</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('leaderboard')} className="nova-btn-outline w-full text-sm py-2.5 mt-4">
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
              <h2 className="text-sm font-bold text-nova-text">Global Investor Leaderboard — January 2024</h2>
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
              <div key={entry.userId} className={cn('grid grid-cols-7 px-5 py-4 border-t border-nova-border/50 items-center', i < 3 && 'bg-nova-yellow/2')}>
                <div className="flex items-center gap-1">
                  {i === 0 && <Crown size={16} className="text-nova-yellow" />}
                  {i === 1 && <Crown size={14} className="text-nova-text-muted" />}
                  {i === 2 && <Crown size={13} className="text-amber-600" />}
                  <span className={cn('text-sm font-black', i < 3 ? 'text-nova-yellow' : 'text-nova-text-muted')}>#{entry.rank}</span>
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <img src={entry.userAvatar} alt={entry.userName} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-nova-text">{entry.userName}</p>
                    <p className="text-xs text-nova-text-muted capitalize">{entry.role} · {entry.badge}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-nova-green text-right">+{entry.returns}%</p>
                <p className="text-sm text-nova-text text-right">{entry.winRate}%</p>
                <p className="text-sm text-nova-text-muted text-right">${(entry.portfolioValue / 1000).toFixed(0)}K</p>
                <div className="flex justify-end">
                  <button onClick={() => handleAction(`Follow ${entry.userName}`)} className="nova-btn-primary text-xs py-1.5 px-3">
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </TiltCard>
        )}
      </div>
    </div>
  );
};

export default Community;
