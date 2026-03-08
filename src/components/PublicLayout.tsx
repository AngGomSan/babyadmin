import { Outlet, Link } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-4 py-3 md:px-6 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <Link to="/intro" className="flex items-center gap-1.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pub-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F25DAA" />
                <stop offset="50%" stopColor="#8A5CF6" />
                <stop offset="100%" stopColor="#4F7DF3" />
              </linearGradient>
            </defs>
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="url(#pub-logo-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="9" y="3" width="6" height="4" rx="1" stroke="url(#pub-logo-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 14l2 2 4-4" stroke="url(#pub-logo-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-lg font-bold text-gradient-primary">BabyAdmin</span>
        </Link>
        <Link
          to="/auth"
          className="text-sm font-medium text-primary hover:underline transition-colors"
        >
          Log in
        </Link>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-5 md:py-8">
        <Outlet />
      </main>

      <footer className="container max-w-2xl mx-auto px-4 pb-8 pt-4">
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
    </div>
  );
}
