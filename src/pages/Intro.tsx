import { Link, useNavigate } from 'react-router-dom';
import { ClipboardCheck, CalendarDays, BookOpen, Users } from 'lucide-react';

const LogoIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="intro-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(340, 72%, 65%)" />
        <stop offset="50%" stopColor="hsl(278, 52%, 50%)" />
        <stop offset="100%" stopColor="hsl(220, 62%, 55%)" />
      </linearGradient>
    </defs>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="url(#intro-logo-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="9" y="3" width="6" height="4" rx="1" stroke="url(#intro-logo-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 14l2 2 4-4" stroke="url(#intro-logo-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const valueCards = [
  {
    icon: CalendarDays,
    title: 'Know what to do',
    body: 'Follow a clear timeline from pregnancy to the first weeks after birth.',
  },
  {
    icon: ClipboardCheck,
    title: 'Prepare the right documents',
    body: 'Track the documents you need across multiple steps without losing progress.',
  },
  {
    icon: BookOpen,
    title: 'Understand the German terms',
    body: 'Use the glossary to quickly understand German paperwork and official terms.',
  },
  {
    icon: Users,
    title: 'Who it is for',
    body: 'Built for expecting parents in Germany, especially international families.',
  },
];

interface IntroProps {
  onDismiss?: () => void;
}

export default function Intro({ onDismiss }: IntroProps) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    onDismiss?.();
    navigate('/auth');
  };

  const handleExploreTimeline = () => {
    onDismiss?.();
    navigate('/timeline');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pt-20 pb-8 md:pt-28 md:pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-3 leading-tight pb-1">
          BabyAdmin
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl whitespace-nowrap mb-4">
          The German bureaucracy survival guide for expecting parents.
        </p>
        <p className="text-base text-muted-foreground max-w-xl mb-8 leading-relaxed">
          Pregnancy paperwork in Germany can be confusing. BabyAdmin shows you what to do, when to do it and which documents you need before and after birth.
        </p>
        <p className="text-xs text-muted-foreground/85 max-w-lg mb-10 leading-relaxed">
          <span className="text-primary font-medium">BabyAdmin is free</span> and built by a mom who went through the German bureaucracy herself. Your account only saves your progress. We never ask for document uploads.
        </p>
        <div className="flex flex-col items-center">
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-[hsl(340,72%,65%)] via-[hsl(278,52%,50%)] to-[hsl(220,62%,55%)] text-white font-semibold text-sm shadow-md hover:opacity-90 transition-opacity"
          >
            Get started
          </button>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Already have an account? <Link to="/auth" className="text-primary font-medium hover:underline transition-colors">Log in</Link><span className="text-muted-foreground">.</span>
        </p>
      </section>

      {/* Value cards */}
      <section className="px-6 pb-5 md:pb-6">
        <div className="max-w-4xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {valueCards.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card px-6 py-4 shadow-card"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-3">
                <Icon className="w-[22px] h-[22px] text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1.5">{title}</h3>
              <p className="text-sm text-muted-foreground leading-snug">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reassurance */}
      <section className="px-6 pb-10 md:pb-14">
        <div className="max-w-[600px] mx-auto p-[1.5px] rounded-2xl bg-gradient-to-r from-[hsl(340,72%,65%)] via-[hsl(278,52%,50%)] to-[hsl(220,62%,55%)]">
          <div className="rounded-[calc(1rem-1.5px)] bg-[hsl(278,25%,98.5%)] px-8 py-5 text-center">
            <p className="text-sm text-foreground/65 leading-relaxed">
              You do not need to figure everything out at once. BabyAdmin shows you what matters now and what to prepare next.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-8">
        <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground/70 flex-wrap">
          <Link to="/your-data" className="hover:text-muted-foreground transition-colors">How your data is used</Link>
          <span>·</span>
          <Link to="/impressum" className="hover:text-muted-foreground transition-colors">Impressum</Link>
          <span>·</span>
          <Link to="/privacy" className="hover:text-muted-foreground transition-colors">Privacy policy</Link>
        </div>
      </footer>
    </div>
  );
}
