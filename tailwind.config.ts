import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'nova-primary': '#1D4ED8',
        'nova-primary-light': '#3B82F6',
        'nova-secondary': '#0F172A',
        'nova-accent': '#10B981',
        'nova-accent-light': '#34D399',
        'nova-bg': '#070D1A',
        'nova-surface': '#0F172A',
        'nova-surface2': '#1E293B',
        'nova-surface3': '#334155',
        'nova-text': '#F8FAFC',
        'nova-text-muted': '#94A3B8',
        'nova-text-subtle': '#64748B',
        'nova-border': '#1E293B',
        'nova-border-light': '#334155',
        'nova-red': '#EF4444',
        'nova-green': '#10B981',
        'nova-yellow': '#F59E0B',
        'nova-purple': '#8B5CF6',
        'nova-cyan': '#06B6D4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'nova-gradient': 'linear-gradient(135deg, #1D4ED8 0%, #0F172A 100%)',
        'nova-hero': 'linear-gradient(135deg, #070D1A 0%, #0F172A 40%, #1a2744 100%)',
        'nova-card': 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)',
        'nova-accent-gradient': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'nova-blue-gradient': 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
      },
      boxShadow: {
        'nova-card': '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'nova-glow': '0 0 30px rgba(29,78,216,0.3)',
        'nova-accent-glow': '0 0 20px rgba(16,185,129,0.3)',
        'nova-modal': '0 25px 80px rgba(0,0,0,0.8)',
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
