import { Link, useNavigate } from 'react-router-dom';
import { ClipboardCheck, CalendarDays, BookOpen, ArrowRight } from 'lucide-react';

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
    body: 'Follow a clear week-by-week timeline from pregnancy to the early weeks after birth.',
  },
  {
    icon: ClipboardCheck,
    title: 'Prepare the right documents',
    body: 'Track the paperwork you will need across multiple steps, without losing progress.',
  },
  {
    icon: BookOpen,
    title: 'Understand the German terms',
    body: 'Use the glossary to quickly understand official terms, offices and required documents.',
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
      <section className="flex flex-col items-center justify-center px-6 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-3 leading-tight pb-1">
          BabyAdmin
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl whitespace-nowrap mb-4">
          The German bureaucracy survival guide for expecting parents.
        </p>
        <p className="text-base text-muted-foreground/80 max-w-xl mb-4 leading-relaxed">
          Administrative steps around pregnancy and birth in Germany can be confusing. BabyAdmin helps you understand what to do, when to do it and which documents to prepare before and after your baby arrives.
        </p>
        <p className="text-xs text-muted-foreground/60 max-w-md mb-8 leading-relaxed">
          BabyAdmin is free and built by a mom who went through the German bureaucracy herself. Your account simply saves your progress. No documents are uploaded or stored.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[hsl(340,72%,65%)] via-[hsl(278,52%,50%)] to-[hsl(220,62%,55%)] text-white font-semibold text-sm shadow-md hover:opacity-90 transition-opacity"
          >
            Get started
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleExploreTimeline}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground font-medium text-sm hover:bg-muted transition-colors"
          >
            Explore the timeline
          </button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground/60">
          Already using BabyAdmin? <Link to="/auth" className="underline hover:text-muted-foreground transition-colors">Log in</Link>
        </p>
      </section>

      {/* Value cards */}
      <section className="px-6 pb-12 md:pb-16">
        <div className="max-w-3xl mx-auto grid gap-5 sm:grid-cols-3">
          {valueCards.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reassurance */}
      <section className="px-6 pb-10 md:pb-14">
        <div className="max-w-xl mx-auto text-center rounded-2xl bg-gradient-to-r from-[hsl(340,72%,65%/0.06)] via-[hsl(278,52%,50%/0.06)] to-[hsl(220,62%,55%/0.06)] border border-border/50 px-6 py-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            You do not need to figure everything out at once. BabyAdmin shows you what matters now and what to prepare next.
          </p>
        </div>
      </section>

      {/* Who it is for */}
      <section className="px-6 pb-8 md:pb-10">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-lg font-semibold text-foreground mb-3">Who it is for</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Built for expecting parents in Germany, especially international families navigating paperwork in a second language.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-20 md:pb-24">
        <div className="max-w-lg mx-auto text-center">
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[hsl(340,72%,65%)] via-[hsl(278,52%,50%)] to-[hsl(220,62%,55%)] text-white font-semibold text-sm shadow-md hover:opacity-90 transition-opacity"
          >
            Start organizing your pregnancy admin
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-8">
        <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground/60">
          <Link to="/impressum" className="hover:text-muted-foreground transition-colors">Impressum</Link>
          <span>·</span>
          <Link to="/privacy" className="hover:text-muted-foreground transition-colors">Privacy policy</Link>
        </div>
      </footer>
    </div>
  );
}
