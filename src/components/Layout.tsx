import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { Home, CalendarDays, ClipboardList, BookOpen, Settings, Search, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';
import SearchOverlay from '@/components/SearchOverlay';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/timeline', icon: CalendarDays, label: 'Timeline' },
  { to: '/documents', icon: ClipboardList, label: 'Documents' },
  { to: '/glossary', icon: BookOpen, label: 'Glossary' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Desktop top nav */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-1.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(340, 72%, 65%)" />
                <stop offset="50%" stopColor="hsl(278, 52%, 50%)" />
                <stop offset="100%" stopColor="hsl(220, 62%, 55%)" />
              </linearGradient>
            </defs>
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="9" y="3" width="6" height="4" rx="1" stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 14l2 2 4-4" stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-lg font-bold text-gradient-primary">BabyAdmin</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-secondary text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={() => setSearchOpen(true)}
            className="ml-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="container max-w-2xl mx-auto px-4 py-5 md:py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="container max-w-2xl mx-auto px-4 pb-24 md:pb-8 pt-4">
        <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground/60 flex-wrap">
          <Link to="/intro" className="hover:text-muted-foreground transition-colors">About BabyAdmin</Link>
          <span>·</span>
          <Link to="/your-data" className="hover:text-muted-foreground transition-colors">Your data</Link>
          <span>·</span>
          <Link to="/impressum" className="hover:text-muted-foreground transition-colors">Impressum</Link>
          <span>·</span>
          <Link to="/privacy" className="hover:text-muted-foreground transition-colors">Privacy policy</Link>
        </div>
      </footer>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-40 safe-area-bottom">
        <div className="flex items-center justify-around py-2 px-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[3rem]"
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
              </NavLink>
            );
          })}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[3rem]"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">Search</span>
          </button>
        </div>
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
