import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, CalendarDays, BookOpen, Settings, Search } from 'lucide-react';
import { useState } from 'react';
import SearchOverlay from '@/components/SearchOverlay';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/timeline', icon: CalendarDays, label: 'Timeline' },
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
        <h1 className="text-lg font-bold text-gradient-primary">BabyAdmin</h1>
        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`
              }
            >
              {label}
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
